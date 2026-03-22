'use strict';

exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

  const db = cloud.database();
  const wxContext = cloud.getWXContext();
  const OPENID = wxContext.OPENID;

  // 获取职位信息
  const { title, company, salary, location, description, tags, category } = event;

  // 验证必填字段
  if (!title || !company || !salary || !location) {
    return {
      success: false,
      message: '请填写完整的职位信息'
    };
  }

  // 添加到数据库
  const result = await db.collection('jobs').add({
    data: {
      title: title,
      company: company,
      salary: salary,
      location: location,
      description: description || '',
      tags: tags || [],
      category: category || '其他',
      status: 1,
      publisherId: OPENID,
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }
  });

  return {
    success: true,
    message: '发布成功',
    jobId: result._id
  };
};
