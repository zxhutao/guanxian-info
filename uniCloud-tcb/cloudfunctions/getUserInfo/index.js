'use strict';

exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

  const db = cloud.database();
  const wxContext = cloud.getWXContext();
  const OPENID = wxContext.OPENID;

  // 查询用户信息
  const userResult = await db.collection('users').where({
    _openid: OPENID
  }).get();

  if (userResult.data.length > 0) {
    // 用户已存在，返回用户信息
    return {
      success: true,
      data: userResult.data[0],
      isNew: false
    };
  } else {
    // 新用户，创建用户记录
    const result = await db.collection('users').add({
      data: {
        _openid: OPENID,
        nickname: '冠县用户',
        avatarUrl: '',
        phone: '',
        createTime: db.serverDate()
      }
    });

    return {
      success: true,
      data: {
        _id: result._id,
        _openid: OPENID,
        nickname: '冠县用户'
      },
      isNew: true
    };
  }
};
