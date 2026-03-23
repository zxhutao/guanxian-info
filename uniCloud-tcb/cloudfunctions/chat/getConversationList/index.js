// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { page = 1, pageSize = 20 } = event
  
  // 获取用户openId
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  
  try {
    // 查询用户参与的所有会话
    const res = await db.collection('chat_conversations')
      .where({
        participants: _.in([openId])
      })
      .orderBy('lastMessageTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    return {
      success: true,
      data: {
        list: res.data,
        page: page,
        pageSize: pageSize,
        total: res.data.length
      }
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
