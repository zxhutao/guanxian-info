'use strict';

exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

  const db = cloud.database();
  const wxContext = cloud.getWXContext();

  // 获取微信登录 code
  const { code } = event;

  if (!code) {
    return {
      success: false,
      msg: '缺少code参数'
    };
  }

  try {
    // 调用微信登录凭证校验接口获取openid
    // 这里使用云开发自动获取的openid，更安全
    const openid = wxContext.OPENID;
    const appid = wxContext.APPID;

    if (!openid) {
      return {
        success: false,
        msg: '获取用户信息失败'
      };
    }

    // 查询用户是否已存在
    const userRes = await db.collection('users').where({
      _openid: openid
    }).get();

    let userInfo = null;

    if (userRes.data && userRes.data.length > 0) {
      // 用户已存在，更新登录时间
      userInfo = userRes.data[0];
      await db.collection('users').doc(userInfo._id).update({
        data: {
          lastLoginTime: db.serverDate()
        }
      });
    } else {
      // 新用户，创建用户记录
      const newUser = {
        _openid: openid,
        userType: 'jobseeker', // 求职者
        createdAt: db.serverDate(),
        lastLoginTime: db.serverDate(),
        profile: {
          nickname: '',
          avatar: '',
          phone: ''
        }
      };

      const addRes = await db.collection('users').add({
        data: newUser
      });

      userInfo = {
        _id: addRes._id,
        ...newUser
      };
    }

    // 生成自定义登录token（实际项目中可使用jwt）
    const token = Buffer.from(JSON.stringify({
      openid: openid,
      userId: userInfo._id,
      timestamp: Date.now()
    })).toString('base64');

    return {
      success: true,
      data: {
        token: token,
        userInfo: {
          _id: userInfo._id,
          userType: userInfo.userType,
          profile: userInfo.profile
        },
        isNewUser: !(userRes.data && userRes.data.length > 0)
      }
    };

  } catch (err) {
    console.error('登录失败:', err);
    return {
      success: false,
      msg: '登录失败，请重试'
    };
  }
};
