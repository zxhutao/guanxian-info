// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { conversationId, page = 1, pageSize = 20 } = event
  
  if (!conversationId) {
    return {
      success: false,
      error: '缺少会话ID'
    }
  }
  
  try {
    // 获取消息总数
    const countRes = await db.collection('chat_messages')
      .where({
        conversationId: conversationId
      })
      .count()
    
    const total = countRes.total
    
    // 获取消息列表
    const res = await db.collection('chat_messages')
      .where({
        conversationId: conversationId
      })
      .orderBy('createTime', 'asc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    return {
      success: true,
      data: {
        list: res.data,
        page: page,
        pageSize: pageSize,
        total: total
      }
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
