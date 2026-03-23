const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

// 兑换限制配置
const EXCHANGE_LIMITS = {
  dailyPerUser: 10,      // 单用户每日兑换上限
  dailyPerGoods: 3,      // 单商品每日兑换上限
  defaultUserTotal: 99   // 默认单商品用户累计兑换上限
}

exports.main = async (event, context) => {
  const { action, data } = event
  const { OPENID } = cloud.getWXContext()
  
  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }

  try {
    switch (action) {
      case 'getGoodsList':
        return await getGoodsList(data)
      case 'exchangeGoods':
        return await exchangeGoods(OPENID, data)
      case 'getMyExchanges':
        return await getMyExchanges(OPENID, data)
      case 'getMyItems':
        return await getMyItems(OPENID)
      case 'useTopCard':
        return await useTopCard(OPENID, data)
      case 'cancelExchange':
        return await cancelExchange(OPENID, data)
      default:
        return { code: -1, message: '未知操作' }
    }
  } catch (error) {
    console.error('兑换系统错误:', error)
    return { code: -1, message: error.message || '操作失败' }
  }
}

/**
 * 获取商品列表
 */
async function getGoodsList(data = {}) {
  const { category = '', page = 1, pageSize = 20 } = data
  
  let where = { status: 'on' }
  if (category) {
    where.category = category
  }
  
  const goods = await db.collection('point_goods')
    .where(where)
    .orderBy('sort', 'asc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()
  
  return {
    code: 0,
    data: goods.data,
    pagination: {
      page,
      pageSize,
      total: goods.data.length
    }
  }
}

/**
 * 兑换商品
 */
async function exchangeGoods(openid, data) {
  const { goodsId, quantity = 1 } = data
  
  if (!goodsId) {
    return { code: -1, message: '请选择商品' }
  }
  
  // 获取商品信息
  const goodsRes = await db.collection('point_goods').doc(goodsId).get()
  const goods = goodsRes.data
  
  if (!goods) {
    return { code: -1, message: '商品不存在' }
  }
  
  if (goods.status !== 'on') {
    return { code: -1, message: '商品已下架' }
  }
  
  if (goods.stock !== -1 && goods.stock < quantity) {
    return { code: -1, message: '库存不足' }
  }
  
  // 计算所需积分
  const totalPoints = goods.points * quantity
  
  // 获取用户信息
  const userRes = await db.collection('users').doc(openid).get()
  const user = userRes.data
  
  if (!user || user.points < totalPoints) {
    return { code: -1, message: '积分不足' }
  }
  
  // 检查兑换限制
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = formatDate(today)
  
  // 1. 检查用户今日兑换次数
  const todayExchanges = await db.collection('point_exchanges')
    .where({
      _openid: openid,
      createTime: _.gte(today)
    })
    .count()
  
  if (todayExchanges.total >= EXCHANGE_LIMITS.dailyPerUser) {
    return { code: -1, message: '今日兑换次数已达上限' }
  }
  
  // 2. 检查用户今日该商品兑换次数
  const todayGoodsExchanges = await db.collection('point_exchanges')
    .where({
      _openid: openid,
      goodsId: goodsId,
      createTime: _.gte(today)
    })
    .count()
  
  if (todayGoodsExchanges.total + quantity > EXCHANGE_LIMITS.dailyPerGoods) {
    return { code: -1, message: '该商品今日兑换次数已达上限' }
  }
  
  // 3. 检查用户累计兑换次数
  const totalGoodsExchanges = await db.collection('point_exchanges')
    .where({
      _openid: openid,
      goodsId: goodsId
    })
    .count()
  
  const userTotalLimit = goods.userLimit || EXCHANGE_LIMITS.defaultUserTotal
  if (totalGoodsExchanges.total + quantity > userTotalLimit) {
    return { code: -1, message: '该商品累计兑换次数已达上限' }
  }
  
  // 开始事务
  const transaction = await db.startTransaction()
  
  try {
    const exchangeId = generateId()
    const now = db.serverDate()
    
    // 1. 创建兑换记录
    const exchangeData = {
      _id: exchangeId,
      _openid: openid,
      goodsId: goodsId,
      goodsName: goods.name,
      goodsType: goods.type,
      goodsIcon: goods.icon,
      points: totalPoints,
      quantity: quantity,
      status: 'success',
      createTime: now,
      expireTime: goods.expireDays ? new Date(Date.now() + goods.expireDays * 24 * 60 * 60 * 1000) : null
    }
    
    await transaction.collection('point_exchanges').add({
      data: exchangeData
    })
    
    // 2. 扣除用户积分
    await transaction.collection('users').doc(openid).update({
      data: {
        points: _.inc(-totalPoints),
        updateTime: now
      }
    })
    
    // 3. 减少库存（如果不是无限库存）
    if (goods.stock !== -1) {
      await transaction.collection('point_goods').doc(goodsId).update({
        data: {
          stock: _.inc(-quantity),
          sold: _.inc(quantity),
          updateTime: now
        }
      })
    } else {
      await transaction.collection('point_goods').doc(goodsId).update({
        data: {
          sold: _.inc(quantity),
          updateTime: now
        }
      })
    }
    
    // 4. 根据商品类型处理
    let result = { exchangeId }
    
    if (goods.type === 'top_card') {
      // 置顶卡 - 添加到用户道具
      await transaction.collection('user_items').add({
        data: {
          _openid: openid,
          type: 'top_card',
          name: goods.name,
          icon: goods.icon,
          days: goods.days,
          exchangeId: exchangeId,
          status: 'unused',
          createTime: now,
          expireTime: goods.expireDays ? new Date(Date.now() + goods.expireDays * 24 * 60 * 60 * 1000) : null
        }
      })
      result.itemType = 'top_card'
    } else if (goods.type === 'coupon') {
      // 优惠券 - 生成优惠券
      const couponId = generateId()
      await transaction.collection('coupons').add({
        data: {
          _id: couponId,
          _openid: openid,
          type: goods.couponType,
          name: goods.name,
          value: goods.couponValue,
          minAmount: goods.minAmount || 0,
          exchangeId: exchangeId,
          status: 'unused',
          createTime: now,
          expireTime: goods.expireDays ? new Date(Date.now() + goods.expireDays * 24 * 60 * 60 * 1000) : null
        }
      })
      result.couponId = couponId
    }
    
    // 5. 创建积分流水（负数表示支出）
    await transaction.collection('points_log').add({
      data: {
        _openid: openid,
        type: 'exchange',
        title: `兑换${goods.name}`,
        points: -totalPoints,
        balance: user.points - totalPoints,
        exchangeId: exchangeId,
        createTime: now
      }
    })
    
    await transaction.commit()
    
    return {
      code: 0,
      message: '兑换成功',
      data: result
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

/**
 * 获取我的兑换记录
 */
async function getMyExchanges(openid, data = {}) {
  const { page = 1, pageSize = 20 } = data
  
  const exchanges = await db.collection('point_exchanges')
    .where({ _openid: openid })
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()
  
  return {
    code: 0,
    data: exchanges.data
  }
}

/**
 * 获取我的道具
 */
async function getMyItems(openid) {
  const items = await db.collection('user_items')
    .where({
      _openid: openid,
      status: 'unused'
    })
    .orderBy('createTime', 'desc')
    .get()
  
  return {
    code: 0,
    data: items.data
  }
}

/**
 * 使用置顶卡
 */
async function useTopCard(openid, data) {
  const { itemId, targetId, targetType } = data
  
  if (!itemId || !targetId || !targetType) {
    return { code: -1, message: '参数错误' }
  }
  
  // 获取道具
  const itemRes = await db.collection('user_items').doc(itemId).get()
  const item = itemRes.data
  
  if (!item || item._openid !== openid) {
    return { code: -1, message: '道具不存在' }
  }
  
  if (item.status !== 'unused') {
    return { code: -1, message: '道具已使用' }
  }
  
  if (item.expireTime && new Date(item.expireTime) < new Date()) {
    return { code: -1, message: '道具已过期' }
  }
  
  // 计算置顶结束时间
  const topEndTime = new Date()
  topEndTime.setDate(topEndTime.getDate() + item.days)
  
  // 开始事务
  const transaction = await db.startTransaction()
  
  try {
    const now = db.serverDate()
    
    // 1. 更新道具状态
    await transaction.collection('user_items').doc(itemId).update({
      data: {
        status: 'used',
        targetId: targetId,
        targetType: targetType,
        useTime: now,
        topEndTime: topEndTime
      }
    })
    
    // 2. 更新目标置顶状态（根据targetType）
    let collectionName = ''
    switch (targetType) {
      case 'job':
        collectionName = 'jobs'
        break
      case 'house':
        collectionName = 'houses'
        break
      case 'service':
        collectionName = 'services'
        break
      case 'carpool':
        collectionName = 'carpools'
        break
      default:
        return { code: -1, message: '不支持的目标类型' }
    }
    
    await transaction.collection(collectionName).doc(targetId).update({
      data: {
        isTop: true,
        topEndTime: topEndTime,
        topUpdateTime: now
      }
    })
    
    await transaction.commit()
    
    return {
      code: 0,
      message: '使用成功',
      data: {
        topEndTime: topEndTime
      }
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

/**
 * 取消兑换（仅限未使用的道具）
 */
async function cancelExchange(openid, data) {
  const { exchangeId } = data
  
  if (!exchangeId) {
    return { code: -1, message: '参数错误' }
  }
  
  // 获取兑换记录
  const exchangeRes = await db.collection('point_exchanges').doc(exchangeId).get()
  const exchange = exchangeRes.data
  
  if (!exchange || exchange._openid !== openid) {
    return { code: -1, message: '兑换记录不存在' }
  }
  
  if (exchange.status !== 'success') {
    return { code: -1, message: '该兑换无法取消' }
  }
  
  // 检查是否已使用
  const itemRes = await db.collection('user_items')
    .where({ exchangeId: exchangeId })
    .get()
  
  if (itemRes.data.length > 0 && itemRes.data[0].status === 'used') {
    return { code: -1, message: '道具已使用，无法取消' }
  }
  
  // 开始事务
  const transaction = await db.startTransaction()
  
  try {
    const now = db.serverDate()
    
    // 1. 更新兑换记录状态
    await transaction.collection('point_exchanges').doc(exchangeId).update({
      data: {
        status: 'cancelled',
        cancelTime: now
      }
    })
    
    // 2. 退还积分
    await transaction.collection('users').doc(openid).update({
      data: {
        points: _.inc(exchange.points),
        updateTime: now
      }
    })
    
    // 3. 恢复库存
    await transaction.collection('point_goods').doc(exchange.goodsId).update({
      data: {
        stock: _.inc(exchange.quantity),
        sold: _.inc(-exchange.quantity),
        updateTime: now
      }
    })
    
    // 4. 删除或标记道具为已取消
    if (itemRes.data.length > 0) {
      await transaction.collection('user_items').doc(itemRes.data[0]._id).update({
        data: {
          status: 'cancelled',
          cancelTime: now
        }
      })
    }
    
    // 5. 创建积分流水（退还）
    await transaction.collection('points_log').add({
      data: {
        _openid: openid,
        type: 'refund',
        title: `取消兑换退还`,
        points: exchange.points,
        exchangeId: exchangeId,
        createTime: now
      }
    })
    
    await transaction.commit()
    
    return {
      code: 0,
      message: '取消成功，积分已退还'
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

/**
 * 生成唯一ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

/**
 * 格式化日期
 */
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
