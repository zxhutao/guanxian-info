'use strict';

exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

  const db = cloud.database();

  // 获取服务列表
  const services = await db.collection('services').get();

  return {
    success: true,
    data: services.data
  };
};
