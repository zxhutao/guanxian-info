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

  // 查询用户积分（从 user_points 集合，用 _openid 字段查找）
  let points = 0
  let totalPoints = 0
  try {
    const pointsResult = await db.collection('user_points').where({
      _openid: OPENID
    }).get()
    if (pointsResult.data && pointsResult.data.length > 0) {
      points = pointsResult.data[0].points || 0
      totalPoints = pointsResult.data[0].totalEarned || 0
    }
  } catch (e) {
    console.log('查询积分失败:', e.message)
  }

  if (userResult.data.length > 0) {
    // 用户已存在，返回用户信息（包含积分）
    return {
      success: true,
      data: {
        ...userResult.data[0],
        points: points,
        totalPoints: totalPoints
      },
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
        nickname: '冠县用户',
        points: points,
        totalPoints: totalPoints
      },
      isNew: true
    };
  }
};
