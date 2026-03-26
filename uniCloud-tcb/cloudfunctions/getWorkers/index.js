'use strict';

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { skill = '', page = 1, pageSize = 10 } = event;

  let where = { status: 1 };

  if (skill) {
    where.skill = skill;
  }

  try {
    // 查询总数
    const countResult = await db.collection('workers').where(where).count();
    const total = countResult.total;

    // 查询列表
    const workers = await db.collection('workers')
      .where(where)
      .orderBy('rating', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();

    return {
      success: true,
      data: workers.data,
      total: total,
      page: page,
      pageSize: pageSize
    };
  } catch (e) {
    console.error('[getWorkers] 查询失败:', e);
    return {
      success: false,
      error: e.message || '查询失败'
    };
  }
};
