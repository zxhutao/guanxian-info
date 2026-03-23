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
  const existingCheckin = await db.collection('checkins')
    .where({
      _openid: openid,
      date: todayStr
    })
    .get()
  
  if (existingCheckin.data.length > 0) {
    return { code: -1, message: '今天已经签到过了' }
  }
  
  // 获取用户签到信息
  const userRes = await db.collection('users').doc(openid).get()
  const user = userRes.data
  
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
  
  // 事务：创建签到记录 + 更新用户积分
  const transaction = await db.startTransaction()
  
  try {
    // 1. 创建签到记录
    await transaction.collection('checkins').add({
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
    
    // 2. 更新用户积分和签到信息
    const userUpdate = {
      points: _.inc(points),
      totalPoints: _.inc(points),
      checkinStreak: streak,
      lastCheckinDate: todayStr,
      updateTime: db.serverDate()
    }
    
    // 更新最高连续天数
    if (streak > (user?.maxStreak || 0)) {
      userUpdate.maxStreak = streak
    }
    
    await transaction.collection('users').doc(openid).update({
      data: userUpdate
    })
    
    // 3. 创建积分流水
    await transaction.collection('points_log').add({
      data: {
        _openid: openid,
        type: 'checkin',
        title: `每日签到 +${BASE_POINTS}`,
        points: points,
        bonus: bonus,
        streak: streak,
        balance: _.inc(points),
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
  
  // 获取用户签到信息
  const userRes = await db.collection('users').doc(openid).get().catch(() => ({ data: null }))
  const user = userRes.data || {}
  
  // 检查今天是否已签到
  const todayCheckin = await db.collection('checkins')
    .where({
      _openid: openid,
      date: todayStr
    })
    .get()
  
  const hasCheckinToday = todayCheckin.data.length > 0
  
  // 计算明天可获得的积分
  let tomorrowPoints = BASE_POINTS
  let tomorrowStreak = hasCheckinToday ? (user.checkinStreak || 0) + 1 : 1
  
  if (hasCheckinToday) {
    // 今天已签到，明天是连续+1
    for (const [days, reward] of Object.entries(STREAK_BONUS)) {
      if (tomorrowStreak >= parseInt(days)) {
        tomorrowPoints = BASE_POINTS + reward
      }
    }
  } else {
    // 今天未签到，检查是否是连续
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
      totalPoints: user.totalPoints || 0,
      points: user.points || 0,
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
  const checkins = await db.collection('checkins')
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
  const userRes = await db.collection('users').doc(openid).get().catch(() => ({ data: null }))
  const user = userRes.data || {}
  
  // 获取最近7天积分流水
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
      points: user.points || 0,
      totalPoints: user.totalPoints || 0,
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
