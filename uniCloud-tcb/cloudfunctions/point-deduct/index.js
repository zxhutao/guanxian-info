const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const dbCmd = db.command

exports.main = async (event, context) => {
  const { action, ...params } = event
  const wxContext = cloud.getWXContext()
  const OPENID = wxContext.OPENID

  if (!OPENID) {
    return { code: -1, message: '未登录，无法操作积分' }
  }
  
  try {
    switch (action) {
      case 'getUserPoints':
        return await getUserPoints(OPENID)
      case 'getPointRules':
        return await getPointRules()
      case 'calculateDeduct':
        return await calculateDeduct(OPENID, params)
      case 'confirmDeduct':
        return await confirmDeduct(OPENID, params)
      case 'cancelDeduct':
        return await cancelDeduct(OPENID, params)
      case 'getMerchantSettlementList':
        return await getMerchantSettlementList(OPENID, params)
      case 'getMerchantSummary':
        return await getMerchantSummary(OPENID)
      default:
        return { code: -1, message: '未知操作' }
    }
  } catch (e) {
    console.error('积分操作失败:', e)
    return { code: -1, message: e.message || '积分操作失败' }
  }
}

// 获取用户积分
async function getUserPoints(openid) {
  const userPoints = await db.collection('user_points').doc(openid).get()
  
  if (!userPoints.data || userPoints.data.length === 0) {
    // 初始化用户积分账户
    const initData = {
      _id: openid,
      points: 0,
      totalEarned: 0,
      totalUsed: 0,
      level: 1,
      updatedAt: new Date()
    }
    await db.collection('user_points').add(initData)
    return { code: 0, data: initData, message: '获取积分成功' }
  }
  
  return { code: 0, data: userPoints.data[0], message: '获取积分成功' }
}

// 获取积分规则
async function getPointRules() {
  const rulesRes = await db.collection('point_rules').limit(1).get()
  
  if (!rulesRes.data || rulesRes.data.length === 0) {
    // 默认规则
    const defaultRules = {
      pointsToYuan: 100,
      maxDeductPercent: 20,
      maxDeductPerOrder: 50,
      minOrderAmount: 10,
      enabledOrderTypes: ['job', 'service', 'nursing']
    }
    return { code: 0, data: defaultRules }
  }
  
  const rules = rulesRes.data[0].rules || []
  const ruleMap = {}
  rules.forEach(r => {
    ruleMap[r.key] = r.value
  })
  
  return { code: 0, data: ruleMap }
}

// 计算可抵扣积分
async function calculateDeduct(openid, params) {
  const { orderId, orderAmount, orderType } = params
  
  // 获取积分规则
  const rulesRes = await getPointRules()
  const rules = rulesRes.data
  
  // 检查订单类型是否支持
  if (!rules.enabledOrderTypes.includes(orderType)) {
    return { 
      code: -1, 
      message: '该类型订单不支持积分抵现',
      data: { canDeduct: false }
    }
  }
  
  // 检查最低订单金额
  if (orderAmount < rules.minOrderAmount) {
    return { 
      code: -1, 
      message: `订单满${rules.minOrderAmount}元可用积分`,
      data: { canDeduct: false }
    }
  }
  
  // 获取用户积分
  const userRes = await getUserPoints(openid)
  const userPoints = userRes.data.points
  
  if (userPoints <= 0) {
    return { 
      code: -1, 
      message: '积分不足',
      data: { canDeduct: false }
    }
  }
  
  // 计算最大可抵扣金额
  const maxDeductByPercent = orderAmount * (rules.maxDeductPercent / 100)
  const maxDeductAmount = Math.min(maxDeductByPercent, rules.maxDeductPerOrder)
  
  // 计算最大可抵扣积分
  const maxPoints = Math.min(
    Math.floor(maxDeductAmount * rules.pointsToYuan),
    userPoints
  )
  
  // 建议使用的积分（默认使用最大可抵扣）
  const suggestedPoints = Math.floor(maxPoints / 100) * 100
  
  return {
    code: 0,
    data: {
      canDeduct: true,
      maxPoints,
      maxDeductAmount: maxDeductAmount.toFixed(2),
      suggestedPoints,
      userPoints,
      tips: `使用${suggestedPoints}积分可抵扣${(suggestedPoints / rules.pointsToYuan).toFixed(2)}元`
    }
  }
}

// 确认积分抵扣
async function confirmDeduct(openid, params) {
  const { orderId, usePoints, orderAmount } = params
  
  // 参数校验
  if (!orderId || !usePoints || usePoints <= 0) {
    return { code: -1, message: '参数错误' }
  }
  
  // 获取规则
  const rulesRes = await getPointRules()
  const rules = rulesRes.data
  
  // 计算抵扣金额
  const deductAmount = usePoints / rules.pointsToYuan
  const actualAmount = orderAmount - deductAmount
  
  // 开启事务
  const transaction = await db.startTransaction()
  
  try {
    // 1. 扣除用户积分
    const userPointsRes = await transaction.collection('user_points').doc(openid).get()
    if (!userPointsRes.data || userPointsRes.data.length === 0) {
      throw new Error('用户积分账户不存在')
    }
    
    const currentPoints = userPointsRes.data[0].points
    if (currentPoints < usePoints) {
      throw new Error('积分不足')
    }
    
    await transaction.collection('user_points').doc(openid).update({
      points: dbCmd.inc(-usePoints),
      totalUsed: dbCmd.inc(usePoints),
      updatedAt: new Date()
    })
    
    // 2. 创建积分订单记录
    const pointOrderId = `PO${Date.now()}${Math.random().toString(36).substr(2, 4)}`
    await transaction.collection('point_orders').add({
      _id: pointOrderId,
      orderId,
      userId: openid,
      merchantId: '', // 需要从原订单获取
      orderAmount,
      deductPoints: usePoints,
      deductAmount,
      actualAmount,
      status: 1, // 已确认
      createdAt: new Date(),
      confirmAt: new Date()
    })
    
    // 3. 记录积分流水
    await transaction.collection('points_log').add({
      userId: openid,
      type: 'use',
      title: '积分抵现',
      points: usePoints,
      balance: currentPoints - usePoints,
      remark: `订单${orderId}抵扣`,
      createdAt: new Date()
    })
    
    await transaction.commit()
    
    return {
      code: 0,
      data: {
        pointOrderId,
        deductPoints: usePoints,
        deductAmount: deductAmount.toFixed(2),
        actualAmount: actualAmount.toFixed(2),
        userPointsLeft: currentPoints - usePoints
      }
    }
  } catch (e) {
    await transaction.rollback()
    return { code: -1, message: e.message || '抵扣失败' }
  }
}

// 取消抵扣/退款
async function cancelDeduct(openid, params) {
  const { pointOrderId } = params
  
  const transaction = await db.startTransaction()
  
  try {
    // 1. 查询积分订单
    const orderRes = await transaction.collection('point_orders').doc(pointOrderId).get()
    if (!orderRes.data || orderRes.data.length === 0) {
      throw new Error('订单不存在')
    }
    
    const order = orderRes.data[0]
    if (order.userId !== openid) {
      throw new Error('无权操作')
    }
    
    if (order.status !== 1) {
      throw new Error('订单状态不允许退款')
    }
    
    // 2. 返还积分
    await transaction.collection('user_points').doc(openid).update({
      points: dbCmd.inc(order.deductPoints),
      updatedAt: new Date()
    })
    
    // 3. 更新订单状态
    await transaction.collection('point_orders').doc(pointOrderId).update({
      status: 3, // 已退款
      updatedAt: new Date()
    })
    
    // 4. 记录积分流水
    const userRes = await transaction.collection('user_points').doc(openid).get()
    const currentPoints = userRes.data[0].points
    
    await transaction.collection('points_log').add({
      userId: openid,
      type: 'income',
      title: '积分返还',
      points: order.deductPoints,
      balance: currentPoints + order.deductPoints,
      remark: `订单${order.orderId}取消返还`,
      createdAt: new Date()
    })
    
    await transaction.commit()
    
    return {
      code: 0,
      data: {
        returnedPoints: order.deductPoints,
        userPointsLeft: currentPoints + order.deductPoints
      }
    }
  } catch (e) {
    await transaction.rollback()
    return { code: -1, message: e.message || '取消失败' }
  }
}

// 获取商家结算列表
async function getMerchantSettlementList(openid, params) {
  const { status, page = 1, pageSize = 20 } = params
  
  // TODO: 需要获取商家ID，这里简化处理
  const merchantId = openid
  
  let where = { merchantId }
  if (status !== undefined) {
    where.status = status
  }
  
  const listRes = await db.collection('merchant_settlements')
    .where(where)
    .orderBy('createdAt', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()
  
  return {
    code: 0,
    data: {
      list: listRes.data || [],
      total: listRes.data ? listRes.data.length : 0,
      page,
      pageSize
    }
  }
}

// 获取商家结算概览
async function getMerchantSummary(openid) {
  // TODO: 需要获取商家ID
  const merchantId = openid
  
  // 待结算金额
  const pendingRes = await db.collection('merchant_settlements')
    .where({
      merchantId,
      status: 0
    })
    .get()
  
  const pendingAmount = pendingRes.data.reduce((sum, item) => sum + item.settleAmount, 0)
  
  // 已结算金额
  const settledRes = await db.collection('merchant_settlements')
    .where({
      merchantId,
      status: dbCmd.in([1, 2])
    })
    .get()
  
  const totalSettled = settledRes.data.reduce((sum, item) => sum + item.settleAmount, 0)
  const platformSubsidy = settledRes.data.reduce((sum, item) => sum + item.platformCost, 0)
  
  return {
    code: 0,
    data: {
      pendingAmount: pendingAmount.toFixed(2),
      totalSettled: totalSettled.toFixed(2),
      orderCount: pendingRes.data.length + settledRes.data.length,
      platformSubsidy: platformSubsidy.toFixed(2)
    }
  }
}
