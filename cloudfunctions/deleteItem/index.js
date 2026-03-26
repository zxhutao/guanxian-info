const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { type, id } = event
  const { OPENID } = cloud.getWXContext()

  if (!OPENID) {
    return { code: -1, message: '未登录' }
  }

  if (!type || !id) {
    return { code: -1, message: '缺少必要参数' }
  }

  // 根据类型确定集合名称
  const collectionMap = {
    'job': 'jobs',
    'service': 'services',
    'nursing': 'nursing',
    'house': 'houses',
    'carpool': 'carpools',
    'news': 'news'
  }

  const collectionName = collectionMap[type]
  if (!collectionName) {
    return { code: -1, message: '不支持的类型' }
  }

  try {
    // 先查询该记录是否属于当前用户
    const record = await db.collection(collectionName).doc(id).get()
    
    if (!record.data) {
      return { code: -1, message: '记录不存在' }
    }

    // 检查权限（只有发布者或管理员可以删除）
    const isOwner = record.data.openId === OPENID || record.data.userId === OPENID
    
    if (!isOwner) {
      return { code: -1, message: '无权删除该记录' }
    }

    // 执行删除
    await db.collection(collectionName).doc(id).remove()

    return {
      code: 0,
      message: '删除成功'
    }
  } catch (err) {
    console.error('删除失败:', err)
    return {
      code: -1,
      message: err.message || '删除失败'
    }
  }
}
