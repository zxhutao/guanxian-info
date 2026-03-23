'use strict';

exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

  const db = cloud.database();
  const _ = db.command;
  const wxContext = cloud.getWXContext();

  const openid = wxContext.OPENID;
  const { action = 'send', toOpenid = '', content = '', type = 'text' } = event;

  try {
    if (action === 'send') {
      if (!toOpenid || !content) {
        return {
          success: false,
          msg: '缺少参数'
        };
      }

      // 添加消息记录
      const message = {
        fromOpenid: openid,
        toOpenid: toOpenid,
        content: content,
        type: type,
        read: false,
        createTime: db.serverDate()
      };

      const res = await db.collection('messages').add({
        data: message
      });

      return {
        success: true,
        msg: '发送成功',
        data: {
          _id: res._id,
          ...message
        }
      };
    }

    if (action === 'list') {
      // 获取与某个用户的聊天记录
      const res = await db.collection('messages')
        .where(
          _.or([
            { fromOpenid: openid, toOpenid: toOpenid },
            { fromOpenid: toOpenid, toOpenid: openid }
          ])
        )
        .orderBy('createTime', 'desc')
        .limit(50)
        .get();

      // 标记消息为已读
      await db.collection('messages')
        .where({
          fromOpenid: toOpenid,
          toOpenid: openid,
          read: false
        })
        .update({
          data: { read: true }
        });

      return {
        success: true,
        data: res.data.reverse()
      };
    }

    if (action === 'conversations') {
      // 获取会话列表
      const messages = await db.collection('messages')
        .where(
          _.or([
            { fromOpenid: openid },
            { toOpenid: openid }
          ])
        )
        .orderBy('createTime', 'desc')
        .limit(100)
        .get();

      // 整理会话列表
      const convMap = new Map();
      messages.data.forEach(msg => {
        const otherId = msg.fromOpenid === openid ? msg.toOpenid : msg.fromOpenid;
        if (!convMap.has(otherId)) {
          convMap.set(otherId, {
            openid: otherId,
            lastMessage: msg.content,
            lastTime: msg.createTime,
            unread: 0
          });
        }
        if (msg.toOpenid === openid && !msg.read) {
          convMap.get(otherId).unread++;
        }
      });

      return {
        success: true,
        data: Array.from(convMap.values())
      };
    }

    return {
      success: false,
      msg: '未知操作'
    };

  } catch (err) {
    console.error('聊天操作失败:', err);
    return {
      success: false,
      msg: '操作失败，请重试',
      error: err.message
    };
  }
};
