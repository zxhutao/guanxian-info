// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { conversationId, messageId } = event
  
  if (!conversationId && !messageId) {
    return {
      success: false,
      error: '缺少会话ID或消息ID'
    }
  }
  
  try {
    if (messageId) {
      // 标记单条消息已读
      await db.collection('chat_messages').doc(messageId).update({
        data: {
          isRead: true
        }
      })
    }
    
    if (conversationId) {
      // 获取当前用户openId
      const wxContext = cloud.getWXContext()
      const openId = wxContext.OPENID
      
      // 标记会话中所有发给当前用户的消息已读
      await db.collection('chat_messages')
        .where({
          conversationId: conversationId,
          isRead: false,
          toId: openId
        })
        .update({
          data: {
            isRead: true
          }
        })
      
      // 重置会话未读数
      await db.collection('chat_conversations').where({
        conversationId: conversationId
      }).update({
        data: {
          unreadCount: 0
        }
      })
    }
    
    return {
      success: true
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
