'use strict';

exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

  const db = cloud.database();
  const _ = db.command;
  const wxContext = cloud.getWXContext();

  const openid = wxContext.OPENID;
  const { action = 'checkin', date = '' } = event;

  // 获取今天的日期字符串
  const getTodayStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const todayStr = date || getTodayStr();

  try {
    if (action === 'checkin') {
      // 查询今天是否已签到
      const checkinRes = await db.collection('checkins').where({
        _openid: openid,
        date: todayStr
      }).get();

      if (checkinRes.data && checkinRes.data.length > 0) {
        return {
          success: false,
          msg: '今日已签到',
          data: { alreadyChecked: true }
        };
      }

      // 查询用户信息
      const userRes = await db.collection('users').where({ _openid: openid }).get();
      const user = userRes.data && userRes.data[0];

      // 计算连续签到天数
      let streak = 1;
      if (user && user.lastCheckinDate) {
        const lastDate = user.lastCheckinDate;
        const lastDateObj = new Date(lastDate);
        const todayDateObj = new Date(todayStr);
        const diffDays = Math.floor((todayDateObj - lastDateObj) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // 连续签到
          streak = (user.checkinStreak || 0) + 1;
        }
      }

      // 计算积分
      let points = 10;
      if (streak >= 7) points = 20;
      else if (streak >= 3) points = 15;

      // 添加签到记录
      await db.collection('checkins').add({
        data: {
          _openid: openid,
          date: todayStr,
          createTime: db.serverDate(),
          streak: streak,
          points: points
        }
      });

      // 更新用户积分和签到信息
      const updateData = {
        lastCheckinDate: todayStr,
        checkinStreak: streak,
        totalPoints: _.inc(points),
        checkinCount: _.inc(1)
      };

      await db.collection('users').where({ _openid: openid }).update({
        data: updateData
      });

      return {
        success: true,
        msg: '签到成功',
        data: {
          points: points,
          streak: streak,
          bonus: streak >= 7 ? '连续7天奖励' : (streak >= 3 ? '连续3天奖励' : '')
        }
      };
    }

    if (action === 'getStatus') {
      // 获取签到状态
      const userRes = await db.collection('users').where({ _openid: openid }).get();
      const user = userRes.data && userRes.data[0];

      const todayCheckin = await db.collection('checkins').where({
        _openid: openid,
        date: todayStr
      }).get();

      return {
        success: true,
        data: {
          checkedIn: todayCheckin.data && todayCheckin.data.length > 0,
          streak: user?.checkinStreak || 0,
          totalPoints: user?.totalPoints || 0,
          checkinCount: user?.checkinCount || 0
        }
      };
    }

    if (action === 'history') {
      // 获取签到历史
      const res = await db.collection('checkins')
        .where({ _openid: openid })
        .orderBy('date', 'desc')
        .limit(30)
        .get();

      return {
        success: true,
        data: res.data
      };
    }

    return {
      success: false,
      msg: '未知操作'
    };

  } catch (err) {
    console.error('签到失败:', err);
    return {
      success: false,
      msg: '签到失败，请重试',
      error: err.message
    };
  }
};
