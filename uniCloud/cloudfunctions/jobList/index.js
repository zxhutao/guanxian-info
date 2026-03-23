'use strict';

exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

  const db = cloud.database();
  const _ = db.command;

  // 获取参数
  const { page = 1, pageSize = 10, category = '', keyword = '' } = event;

  // 构建查询条件
  let where = {
    status: 1 // 已发布的职位
  };

  if (category) {
    where.category = category;
  }

  if (keyword) {
    where.title = db.RegExp({
      regexp: keyword,
      options: 'i'
    });
  }

  // 查询数据库
  const countResult = await db.collection('jobs').where(where).count();
  const total = countResult.total;

  const list = await db.collection('jobs')
    .where(where)
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .field({
      title: true,
      company: true,
      salary: true,
      location: true,
      tags: true,
      createTime: true
    })
    .get();

  return {
    success: true,
    data: list.data,
    total: total,
    page: page,
    pageSize: pageSize
  };
};
