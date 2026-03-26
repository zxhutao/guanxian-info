'use strict';

exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

  const db = cloud.database();
  const _ = db.command;

  const { skill = '', page = 1, pageSize = 10 } = event;

  let where = { status: 1 };

  if (skill) {
    where.skill = skill;
  }

  const workers = await db.collection('workers')
    .where(where)
    .orderBy('rating', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();

  return {
    success: true,
    data: workers.data
  };
};
