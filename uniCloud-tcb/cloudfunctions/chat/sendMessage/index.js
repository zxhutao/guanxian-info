// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { content, type, toId, conversationId } = event
  
  // 获取发送者信息
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  
  try {
    // 获取用户信息
    const userRes = await db.collection('users').where({
      _openid: openId
    }).get()
    
    const userInfo = userRes.data[0] || {}
    
    // 创建消息
    const message = {
      fromId: openId,
      fromName: userInfo.nickname || '用户',
      fromAvatar: userInfo.avatar || '',
      toId: toId || 'service',
      content: content,
      type: type || 'text',
      conversationId: conversationId || `conv_${openId}_${toId}`,
      isRead: false,
      createTime: Date.now()
    }
    
    // 保存消息
    const msgRes = await db.collection('chat_messages').add({
      data: message
    })
    
    // 更新会话信息
    await updateConversation(message)
    
    return {
      success: true,
      data: {
        _id: msgRes._id,
        ...message
      }
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}

// 更新会话
async function updateConversation(message) {
  const { conversationId, fromId, fromName, fromAvatar, toId, content, type } = message
  
  // 查询是否已存在会话
  const existRes = await db.collection('chat_conversations').where({
    conversationId: conversationId
  }).get()
  
  if (existRes.data.length > 0) {
    // 更新已有会话
    await db.collection('chat_conversations').doc(existRes.data[0]._id).update({
      data: {
        lastMessage: type === 'image' ? '[图片]' : content,
        lastMessageTime: message.createTime,
        unreadCount: db.command.inc(1)
      }
    })
  } else {
    // 创建新会话
    await db.collection('chat_conversations').add({
      data: {
        conversationId: conversationId,
        participants: [fromId, toId],
        name: toId === 'service' ? '在线客服' : fromName,
        avatar: toId === 'service' ? '' : fromAvatar,
        lastMessage: type === 'image' ? '[图片]' : content,
        lastMessageTime: message.createTime,
        unreadCount: 1,
        createTime: Date.now()
      }
    })
  }
}
