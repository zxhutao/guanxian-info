// chat 主云函数入口 - 路由到各子功能
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const sendMessage = require('./sendMessage/index')
const getConversationList = require('./getConversationList/index')
const getHistory = require('./getHistory/index')
const markAsRead = require('./markAsRead/index')

exports.main = async (event, context) => {
  const { action } = event
  switch (action) {
    case 'sendMessage':
      return sendMessage.main(event, context)
    case 'getConversationList':
      return getConversationList.main(event, context)
    case 'getHistory':
      return getHistory.main(event, context)
    case 'markAsRead':
      return markAsRead.main(event, context)
    default:
      return { success: false, error: `未知 action: ${action}` }
  }
}
