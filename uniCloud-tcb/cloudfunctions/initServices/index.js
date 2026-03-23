'use strict';

exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

  const db = cloud.database();

  // 示例服务数据
  const sampleServices = [
    { name: '家政保洁', icon: '🧹', description: '日常清洁、开荒保洁' },
    { name: '家电维修', icon: '🔧', description: '空调、洗衣机、热水器维修' },
    { name: '开锁疏通', icon: '🔑', description: '开锁、管道疏通' },
    { name: '搬家货运', icon: '📦', description: '居民搬家、货物运输' },
    { name: '餐饮外卖', icon: '🍜', description: '本地美食配送' },
    { name: '婚庆摄影', icon: '🎥', description: '婚礼摄影、摄像' }
  ];

  // 示例护工数据
  const sampleWorkers = [
    {
      name: '张阿姨',
      experience: 5,
      skill: '老年护理',
      price: '200元/天',
      rating: 4.9,
      avatar: '',
      phone: '138****1234',
      description: '持有护理证书，擅长老年人日常护理、康复训练',
      status: 1
    },
    {
      name: '李大姐',
      experience: 3,
      skill: '康复护理',
      price: '220元/天',
      rating: 4.8,
      avatar: '',
      phone: '139****5678',
      description: '专业康复护理，可提供术后护理服务',
      status: 1
    },
    {
      name: '王大哥',
      experience: 8,
      skill: '全天护理',
      price: '280元/天',
      rating: 5.0,
      avatar: '',
      phone: '137****9012',
      description: '专业护工，24小时陪护，经验丰富',
      status: 1
    },
    {
      name: '刘阿姨',
      experience: 4,
      skill: '母婴护理',
      price: '300元/天',
      rating: 4.9,
      avatar: '',
      phone: '136****3456',
      description: '持证月嫂，专业母婴护理服务',
      status: 1
    }
  ];

  let result = { services: 0, workers: 0 };

  // 检查并添加服务数据
  const existServices = await db.collection('services').count();
  if (existServices.total === 0) {
    for (const service of sampleServices) {
      await db.collection('services').add({ data: service });
      result.services++;
    }
  }

  // 检查并添加护工数据
  const existWorkers = await db.collection('workers').count();
  if (existWorkers.total === 0) {
    for (const worker of sampleWorkers) {
      await db.collection('workers').add({
        data: {
          ...worker,
          createTime: db.serverDate()
        }
      });
      result.workers++;
    }
  }

  return {
    success: true,
    message: '初始化完成',
    ...result
  };
};
