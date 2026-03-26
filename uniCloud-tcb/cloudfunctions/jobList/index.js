'use strict';

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
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

  try {
    // 查询总数
    const countResult = await db.collection('jobs').where(where).count();
    const total = countResult.total;

    // 查询列表
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
  } catch (e) {
    console.error('[jobList] 查询失败:', e);
    return {
      success: false,
      error: e.message || '查询失败'
    };
  }
};
