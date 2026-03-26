const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

// 签到基础积分
const BASE_POINTS = 10

// 连续签到奖励配置
const STREAK_BONUS = {
  3: 5,   // 连续3天 +5
  7: 15,  // 连续7天 +15
  14: 30, // 连续14天 +30
  30: 60  // 连续30天 +60
}

exports.main = async (event, context) => {
  const { action, data } = event
  const { OPENID } = cloud.getWXContext()
  
  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }

  try {
    switch (action) {
      case 'doCheckin':
        return await doCheckin(OPENID)
      case 'getCheckinStatus':
        return await getCheckinStatus(OPENID)
      case 'getCheckinCalendar':
        return await getCheckinCalendar(OPENID, data)
      case 'getPointsInfo':
        return await getPointsInfo(OPENID)
      default:
        return { code: -1, message: '未知操作' }
    }
  } catch (error) {
    console.error('签到系统错误:', error)
    return { code: -1, message: error.message || '操作失败' }
  }
}

/**
 * 执行签到
 */
async function doCheckin(openid) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = formatDate(today)
  
  // 检查今天是否已签到
  const existingCheckin = await db.collection('checkin_records')
    .where({
      _openid: openid,
      date: todayStr
    })
    .get()
  
  if (existingCheckin.data.length > 0) {
    return { code: -1, message: '今天已经签到过了' }
  }
  
  // 获取用户签到信息（用户不存在时自动创建）
  let user = {}
  try {
    const userRes = await db.collection('users').doc(openid).get()
    user = userRes.data || {}
  } catch (e) {
    // 用户记录不存在，先创建初始记录
    await db.collection('users').doc(openid).set({
      data: {
        _openid: openid,
        points: 0,
        totalPoints: 0,
        checkinStreak: 0,
        maxStreak: 0,
        lastCheckinDate: null,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
    user = { points: 0, totalPoints: 0, checkinStreak: 0, maxStreak: 0, lastCheckinDate: null }
  }
  
  // 计算连续签到天数
  let streak = 1
  let lastCheckin = user?.lastCheckinDate
  
  if (lastCheckin) {
    const lastDate = new Date(lastCheckin)
    lastDate.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      // 昨天签到，连续天数+1
      streak = (user.checkinStreak || 0) + 1
    } else if (diffDays === 0) {
      // 今天已签到（前面已检查，这里保险）
      return { code: -1, message: '今天已经签到过了' }
    }
    // diffDays > 1 断签，streak保持1
  }
  
  // 计算积分
  let points = BASE_POINTS
  let bonus = 0
  
  // 连续签到奖励
  for (const [days, reward] of Object.entries(STREAK_BONUS)) {
    if (streak >= parseInt(days)) {
      bonus = reward
    }
  }
  points += bonus
  
  // 事务外预检查：确保 user_points 文档存在且 _id 为 openid
  // 注意：必须用 _openid 字段查找，因为 _id 可能不是 openid
  let userPointsDoc = null
  try {
    const ptRes = await db.collection('user_points').where({ _openid: openid }).get()
    if (ptRes.data && ptRes.data.length > 0) {
      userPointsDoc = ptRes.data[0]
      console.log(`[签到调试] 找到已有 user_points 文档: _id=${userPointsDoc._id}`)
    }
  } catch (e) { /* 文档不存在 */ }

  if (!userPointsDoc) {
    // 先删除旧文档（如果有的话，_id 不是 openid 的情况）
    try {
      await db.collection('user_points').where({ _openid: openid }).remove()
      console.log(`[签到调试] 删除旧 user_points 文档`)
    } catch (e) { /* 删除失败没关系 */ }
    
    // 用 set 创建新文档，确保 _id 为 openid
    // 注意：不能用 add，因为 add 会生成随机 _id
    await db.collection('user_points').doc(openid).set({
      data: {
        _openid: openid,
        points: 0,
        totalEarned: 0,
        totalUsed: 0,
        level: 1,
        updatedAt: db.serverDate()
      }
    })
    console.log(`[签到调试] 创建新的 user_points 文档，_id=${openid}`)
  } else if (userPointsDoc._id !== openid) {
    // 如果找到文档但 _id 不对，需要重建
    console.log(`[签到调试] _id 不匹配，需要重建: ${userPointsDoc._id} -> ${openid}`)
    try {
      await db.collection('user_points').where({ _openid: openid }).remove()
    } catch (e) { /* 删除失败 */ }
    await db.collection('user_points').doc(openid).set({
      data: {
        _openid: openid,
        points: userPointsDoc.points || 0,
        totalEarned: userPointsDoc.totalEarned || 0,
        totalUsed: userPointsDoc.totalUsed || 0,
        level: userPointsDoc.level || 1,
        updatedAt: db.serverDate()
      }
    })
  }

  // 事务：创建签到记录 + 更新用户积分
  const transaction = await db.startTransaction()
  
  try {
    // 1. 创建签到记录
    await transaction.collection('checkin_records').add({
      data: {
        _openid: openid,
        date: todayStr,
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        streak: streak,
        points: points,
        bonus: bonus,
        createTime: db.serverDate()
      }
    })
    
    // 2. 更新 users 集合（签到状态/连续天数）
    const userUpdate = {
      checkinStreak: streak,
      lastCheckinDate: todayStr,
      updateTime: db.serverDate()
    }
    if (streak > (user?.maxStreak || 0)) {
      userUpdate.maxStreak = streak
    }
    await transaction.collection('users').doc(openid).update({
      data: userUpdate
    })

    // 3. 更新 user_points 集合（文档已在事务外确保存在，此处只做 update）
    console.log(`[签到调试] 更新 user_points: openid=${openid}, points=${points}`)
    const updateResult = await transaction.collection('user_points').doc(openid).update({
      data: {
        points: _.inc(points),
        totalEarned: _.inc(points),
        updatedAt: db.serverDate()
      }
    })
    console.log(`[签到调试] user_points 更新结果:`, JSON.stringify(updateResult))

    // 4. 创建积分流水（userId 字段统一，同时保留 _openid）
    await transaction.collection('points_log').add({
      data: {
        _openid: openid,
        userId: openid,
        type: 'checkin',
        title: `每日签到 +${BASE_POINTS}`,
        points: points,
        bonus: bonus,
        streak: streak,
        createTime: db.serverDate()
      }
    })
    
    await transaction.commit()
    
    return {
      code: 0,
      message: '签到成功',
      data: {
        points: points,
        bonus: bonus,
        streak: streak,
        isDouble: bonus > 0
      }
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

/**
 * 获取签到状态
 */
async function getCheckinStatus(openid) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = formatDate(today)
  
  // 从 users 集合读签到状态
  let user = {}
  try {
    const userRes = await db.collection('users').doc(openid).get()
    user = userRes.data || {}
  } catch (e) {
    user = {}
  }

  // 从 user_points 集合读积分余额（与 point-deduct 保持一致）
  let pointsData = { points: 0, totalEarned: 0 }
  try {
    const ptRes = await db.collection('user_points').doc(openid).get()
    if (ptRes.data) pointsData = ptRes.data
  } catch (e) { /* 未初始化，保持默认0 */ }
  
  // 检查今天是否已签到
  const todayCheckin = await db.collection('checkin_records')
    .where({ _openid: openid, date: todayStr })
    .get()
  const hasCheckinToday = todayCheckin.data.length > 0
  
  // 计算明天可获得的积分
  let tomorrowPoints = BASE_POINTS
  let tomorrowStreak = hasCheckinToday ? (user.checkinStreak || 0) + 1 : 1
  
  if (hasCheckinToday) {
    for (const [days, reward] of Object.entries(STREAK_BONUS)) {
      if (tomorrowStreak >= parseInt(days)) {
        tomorrowPoints = BASE_POINTS + reward
      }
    }
  } else {
    const lastDate = user.lastCheckinDate ? new Date(user.lastCheckinDate) : null
    if (lastDate) {
      lastDate.setHours(0, 0, 0, 0)
      const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        tomorrowStreak = (user.checkinStreak || 0) + 1
        for (const [days, reward] of Object.entries(STREAK_BONUS)) {
          if (tomorrowStreak >= parseInt(days)) {
            tomorrowPoints = BASE_POINTS + reward
          }
        }
      }
    }
  }
  
  return {
    code: 0,
    data: {
      hasCheckinToday,
      streak: user.checkinStreak || 0,
      maxStreak: user.maxStreak || 0,
      totalPoints: pointsData.totalEarned || 0,
      points: pointsData.points || 0,
      lastCheckinDate: user.lastCheckinDate || null,
      tomorrowPoints,
      tomorrowStreak,
      basePoints: BASE_POINTS,
      streakBonus: STREAK_BONUS
    }
  }
}

/**
 * 获取签到日历
 */
async function getCheckinCalendar(openid, data = {}) {
  const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = data
  
  // 获取当月签到记录
  const checkins = await db.collection('checkin_records')
    .where({
      _openid: openid,
      year: year,
      month: month
    })
    .orderBy('day', 'asc')
    .get()
  
  // 构建日历数据
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDay = new Date(year, month - 1, 1).getDay()
  
  const calendar = []
  const checkinMap = {}
  
  checkins.data.forEach(item => {
    checkinMap[item.day] = item
  })
  
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month - 1, i)
    const dateStr = formatDate(date)
    const isToday = dateStr === formatDate(new Date())
    const isFuture = date > new Date()
    
    calendar.push({
      day: i,
      date: dateStr,
      isToday,
      isFuture,
      hasCheckin: !!checkinMap[i],
      points: checkinMap[i]?.points || 0,
      streak: checkinMap[i]?.streak || 0
    })
  }
  
  return {
    code: 0,
    data: {
      year,
      month,
      firstDay,
      days: calendar,
      totalDays: checkins.data.length
    }
  }
}

/**
 * 获取积分信息
 */
async function getPointsInfo(openid) {
  console.log(`[积分调试] getPointsInfo called, openid=${openid}`)
  
  // 从 users 集合读签到状态
  let user = {}
  try {
    const userRes = await db.collection('users').doc(openid).get()
    user = userRes.data || {}
    console.log(`[积分调试] users 文档:`, JSON.stringify(user))
  } catch (e) {
    user = {}
    console.log(`[积分调试] users 查询失败:`, e.message)
  }

  // 从 user_points 集合读积分余额（用 _openid 字段查询，因为 _id 可能不是 openid）
  let pointsData = { points: 0, totalEarned: 0 }
  try {
    const ptRes = await db.collection('user_points').where({ _openid: openid }).get()
    console.log(`[积分调试] user_points 原始查询:`, JSON.stringify(ptRes))
    if (ptRes.data && ptRes.data.length > 0) {
      pointsData = ptRes.data[0]
    }
  } catch (e) {
    console.log(`[积分调试] user_points 查询失败:`, e.message)
  }
  
  // 获取最近20条积分流水（userId 或 _openid 均可匹配）
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const logs = await db.collection('points_log')
    .where({
      _openid: openid,
      createTime: _.gte(sevenDaysAgo)
    })
    .orderBy('createTime', 'desc')
    .limit(20)
    .get()
  
  return {
    code: 0,
    data: {
      points: pointsData.points || 0,
      totalPoints: pointsData.totalEarned || 0,
      checkinStreak: user.checkinStreak || 0,
      maxStreak: user.maxStreak || 0,
      recentLogs: logs.data
    }
  }
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
