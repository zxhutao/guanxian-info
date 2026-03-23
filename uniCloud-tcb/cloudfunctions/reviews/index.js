const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

// 评价标签配置
const REVIEW_TAGS = {
  positive: ['服务热情', '技术专业', '准时到达', '价格合理', '态度好', '效率高', '细心耐心', '推荐'],
  negative: ['服务态度差', '技术不行', '迟到', '乱收费', '不专业', '敷衍了事', '不满意']
}

exports.main = async (event, context) => {
  const { action, data } = event
  
  try {
    switch (action) {
      case 'submitReview':
        return await submitReview(data)
      case 'getReviews':
        return await getReviews(data)
      case 'getProviderRating':
        return await getProviderRating(data)
      case 'getTopRatedProviders':
        return await getTopRatedProviders(data)
      case 'getMyReviews':
        return await getMyReviews(data, context)
      default:
        return { code: -1, message: '未知操作' }
    }
  } catch (error) {
    console.error('云函数错误:', error)
    return { code: -1, message: error.message }
  }
}

// 提交评价
async function submitReview(data) {
  const { providerId, providerType, orderId, rating, content, tags, images = [] } = data
  const { OPENID } = cloud.getWXContext()
  
  if (!OPENID) {
    return { code: -1, message: '请先登录' }
  }
  
  if (!providerId || !rating || rating < 1 || rating > 5) {
    return { code: -1, message: '评分参数错误' }
  }
  
  // 检查是否已评价
  const existingReview = await db.collection('reviews').where({
    providerId,
    userId: OPENID,
    orderId: orderId || _.exists(false)
  }).get()
  
  if (existingReview.data.length > 0) {
    return { code: -1, message: '您已评价过该服务' }
  }
  
  // 创建评价
  const reviewData = {
    providerId,
    providerType: providerType || 'service',
    orderId: orderId || '',
    userId: OPENID,
    rating,
    content: content || '',
    tags: tags || [],
    images,
    isVisible: true,
    createTime: db.serverDate(),
    updateTime: db.serverDate(),
    likeCount: 0,
    reply: null
  }
  
  const result = await db.collection('reviews').add({
    data: reviewData
  })
  
  // 更新服务商评分统计
  await updateProviderRating(providerId, providerType)
  
  return { 
    code: 0, 
    message: '评价成功',
    data: { reviewId: result._id }
  }
}

// 获取评价列表
async function getReviews(data) {
  const { providerId, page = 1, pageSize = 10, rating } = data
  
  let whereCondition = { providerId, isVisible: true }
  if (rating) {
    whereCondition.rating = rating
  }
  
  const reviews = await db.collection('reviews')
    .where(whereCondition)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()
  
  // 获取用户信息
  const userIds = [...new Set(reviews.data.map(r => r.userId))]
  const users = await db.collection('users')
    .where({ _openid: _.in(userIds) })
    .get()
  
  const userMap = {}
  users.data.forEach(u => {
    userMap[u._openid] = u
  })
  
  const list = reviews.data.map(r => ({
    ...r,
    userName: userMap[r.userId]?.nickName || '匿名用户',
    userAvatar: userMap[r.userId]?.avatarUrl || ''
  }))
  
  // 获取统计
  const stats = await getRatingStats(providerId)
  
  return {
    code: 0,
    data: {
      list,
      stats,
      hasMore: reviews.data.length === pageSize
    }
  }
}

// 获取评分统计
async function getRatingStats(providerId) {
  const stats = await db.collection('reviews')
    .where({ providerId, isVisible: true })
    .field({ rating: true })
    .get()
  
  const ratings = stats.data.map(s => s.rating)
  const total = ratings.length
  
  if (total === 0) {
    return {
      total: 0,
      average: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  }
  
  const sum = ratings.reduce((a, b) => a + b, 0)
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  ratings.forEach(r => {
    distribution[r] = (distribution[r] || 0) + 1
  })
  
  return {
    total,
    average: (sum / total).toFixed(1),
    distribution
  }
}

// 更新服务商评分
async function updateProviderRating(providerId, providerType) {
  const stats = await getRatingStats(providerId)
  
  const collectionName = providerType === 'worker' ? 'workers' : 'services'
  
  await db.collection(collectionName).doc(providerId).update({
    data: {
      rating: parseFloat(stats.average),
      reviewCount: stats.total,
      ratingDistribution: stats.distribution,
      updateTime: db.serverDate()
    }
  })
}

// 获取服务商评分
async function getProviderRating(data) {
  const { providerId } = data
  const stats = await getRatingStats(providerId)
  return { code: 0, data: stats }
}

// 获取好评榜TOP10（带降权算法）
async function getTopRatedProviders(data) {
  const { category, type = 'service', limit = 10 } = data
  
  const collectionName = type === 'worker' ? 'workers' : 'services'
  
  let whereCondition = { reviewCount: _.gte(3) } // 至少3条评价才上榜
  if (category) {
    whereCondition.category = category
  }
  
  // 获取所有符合条件的商家
  const providers = await db.collection(collectionName)
    .where(whereCondition)
    .get()
  
  // 计算加权评分（好评榜算法）
  const scoredProviders = providers.data.map(p => {
    const baseScore = p.rating || 0
    const reviewCount = p.reviewCount || 0
    
    // 获取该商家的差评数（1-2星）
    const badReviews = (p.ratingDistribution?.[1] || 0) + (p.ratingDistribution?.[2] || 0)
    const badReviewRate = reviewCount > 0 ? badReviews / reviewCount : 0
    
    // 差评降权系数：差评率超过20%开始降权，超过50%大幅降权
    let penaltyFactor = 1
    if (badReviewRate > 0.5) {
      penaltyFactor = 0.5 // 差评率超过50%，评分打5折
    } else if (badReviewRate > 0.3) {
      penaltyFactor = 0.7 // 差评率超过30%，评分打7折
    } else if (badReviewRate > 0.2) {
      penaltyFactor = 0.85 // 差评率超过20%，评分打85折
    }
    
    // 威尔逊区间算法：平衡评分和评论数量
    // 防止少量好评就排第一的情况
    const z = 1.96 // 95%置信区间
    const n = reviewCount
    const p_hat = baseScore / 5 // 归一化到0-1
    
    const wilsonScore = (
      (p_hat + z * z / (2 * n) - z * Math.sqrt((p_hat * (1 - p_hat) + z * z / (4 * n)) / n)) /
      (1 + z * z / n)
    ) * 5 * penaltyFactor
    
    return {
      ...p,
      weightedScore: wilsonScore,
      penaltyFactor,
      badReviewRate: (badReviewRate * 100).toFixed(1)
    }
  })
  
  // 按加权评分排序
  scoredProviders.sort((a, b) => b.weightedScore - a.weightedScore)
  
  return {
    code: 0,
    data: scoredProviders.slice(0, limit)
  }
}

// 获取我的评价
async function getMyReviews(data, context) {
  const { OPENID } = cloud.getWXContext()
  const { page = 1, pageSize = 10 } = data
  
  if (!OPENID) {
    return { code: -1, message: '请先登录' }
  }
  
  const reviews = await db.collection('reviews')
    .where({ userId: OPENID })
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()
  
  return {
    code: 0,
    data: {
      list: reviews.data,
      hasMore: reviews.data.length === pageSize
    }
  }
}
