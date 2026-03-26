'use strict';

exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

  const db = cloud.database();
  const wxContext = cloud.getWXContext();

  // 获取微信登录 code
  const { code } = event;

  console.log('收到登录请求, code:', code);
  console.log('wxContext:', JSON.stringify(wxContext));

  if (!code) {
    return {
      success: false,
      msg: '缺少code参数'
    };
  }

  try {
    // 调用微信登录凭证校验接口获取openid
    // 这里使用云开发自动获取的openid，更安全
    let openid = wxContext.OPENID;
    let appid = wxContext.APPID;

    console.log('获取到的openid:', openid);
    console.log('获取到的appid:', appid);

    // OPENID 为空时直接拒绝（生产环境不允许模拟身份）
    if (!openid) {
      console.error('OPENID为空，请求被拒绝');
      return {
        success: false,
        msg: '获取用户身份失败，请重新登录'
      };
    }

    // 查询用户是否已存在
    let userRes = { data: [] };
    try {
      userRes = await db.collection('users').where({
        _openid: openid
      }).get();
    } catch (err) {
      if (err.errCode === -502005) {
        console.error('users 集合不存在，请在云开发控制台手动创建');
        return {
          success: false,
          msg: '数据库集合未创建，请在云开发控制台创建 users 集合'
        };
      }
      console.error('查询用户失败:', err);
    }

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

    // 生成安全的token（包含过期时间和HMAC签名）
    const tokenData = {
      openid: openid,
      userId: userInfo._id,
      timestamp: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天过期
      version: '1.0'
    }
    
    // 使用HMAC签名防篡改（实际生产环境应使用更安全的密钥管理）
    const tokenString = JSON.stringify(tokenData)
    const crypto = require('crypto')
    // 注意：生产环境应该使用环境变量存储密钥
    const secretKey = process.env.TOKEN_SECRET || 'guanbangbang-super-secret-key-2026'
    const signature = crypto.createHmac('sha256', secretKey)
      .update(tokenString)
      .digest('hex')
    
    // 组合token：base64(data).signature
    const token = Buffer.from(tokenString).toString('base64') + '.' + signature

    return {
      success: true,
      data: {
        token: token,
        userInfo: {
          _id: userInfo._id,
          _openid: openid,
          userType: userInfo.userType,
          nickname: userInfo.profile?.nickname || '冠帮帮用户',
          avatar: userInfo.profile?.avatar || '',
          phone: userInfo.profile?.phone || '',
          createdAt: userInfo.createdAt,
          lastLoginTime: userInfo.lastLoginTime
        },
        isNewUser: userRes.data && userRes.data.length === 0
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
