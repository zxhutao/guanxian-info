'use strict'

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

/**
 * getUserData 云函数
 * 统一获取用户相关数据：我的职位、我的服务、我的预约、我的收藏
 */
exports.main = async (event, context) => {
  const { action, data = {} } = event
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }

  try {
    switch (action) {
      case 'getMyJobs':
        return await getMyJobs(OPENID, data)
      case 'getMyServices':
        return await getMyServices(OPENID, data)
      case 'getMyBookings':
        return await getMyBookings(OPENID, data)
      case 'getMyFavorites':
        return await getMyFavorites(OPENID, data)
      default:
        return { code: -1, message: '未知操作' }
    }
  } catch (error) {
    console.error('getUserData 错误:', error)
    return { code: -1, message: error.message || '获取数据失败' }
  }
}

/**
 * 获取用户发布的职位列表
 */
async function getMyJobs(openid, data = {}) {
  const { page = 1, pageSize = 20 } = data

  const result = await db.collection('jobs')
    .where({ _openid: openid })
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()

  return {
    code: 0,
    data: result.data,
    total: result.data.length
  }
}

/**
 * 获取用户发布的服务列表
 */
async function getMyServices(openid, data = {}) {
  const { page = 1, pageSize = 20 } = data

  const result = await db.collection('services')
    .where({ _openid: openid })
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()

  return {
    code: 0,
    data: result.data,
    total: result.data.length
  }
}

/**
 * 获取用户的预约记录
 */
async function getMyBookings(openid, data = {}) {
  const { page = 1, pageSize = 20, status = '' } = data

  let where = { _openid: openid }
  if (status) {
    where.status = status
  }

  const result = await db.collection('bookings')
    .where(where)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()

  return {
    code: 0,
    data: result.data,
    total: result.data.length
  }
}

/**
 * 获取用户的收藏列表（支持多种类型：职位/服务/护工）
 */
async function getMyFavorites(openid, data = {}) {
  const { page = 1, pageSize = 20, type = '' } = data

  let where = { _openid: openid }
  if (type) {
    where.type = type
  }

  const result = await db.collection('favorites')
    .where(where)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()

  return {
    code: 0,
    data: result.data,
    total: result.data.length
  }
}
