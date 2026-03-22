'use strict';

exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

  const db = cloud.database();

  // 示例职位数据
  const sampleJobs = [
    {
      title: '普工/操作工',
      company: '冠县光明玻璃厂',
      salary: '5000-8000元/月',
      location: '冠县工业园区',
      description: '生产线操作工，工作简单易学，包吃包住',
      tags: ['包吃', '包住', '五险', '长白班'],
      category: '工厂',
      status: 1,
      publisherId: 'system',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      title: '质检员',
      company: '山东华兴金属',
      salary: '4500-6000元/月',
      location: '冠县开发区',
      description: '产品质量检验，工作环境好',
      tags: ['长白班', '环境好', '缴纳社保'],
      category: '质检',
      status: 1,
      publisherId: 'system',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      title: '叉车司机',
      company: '冠县顺达物流',
      salary: '5500-7000元/月',
      location: '冠县物流园',
      description: '仓库叉车操作，需持证上岗',
      tags: ['持证上岗', '加班费', '高温补贴'],
      category: '物流',
      status: 1,
      publisherId: 'system',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      title: '纺织工',
      company: '冠县纺织集团',
      salary: '4000-6500元/月',
      location: '冠县纺织工业园',
      description: '纺织机器操作，计件工资',
      tags: ['计件工资', '熟练工优先', '空调车间'],
      category: '纺织',
      status: 1,
      publisherId: 'system',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      title: '包装工',
      company: '冠县食品厂',
      salary: '3500-5000元/月',
      location: '冠县城区',
      description: '食品包装，工作轻松',
      tags: ['工作轻松', '女性优先', '节假日福利'],
      category: '包装',
      status: 1,
      publisherId: 'system',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    },
    {
      title: '焊工',
      company: '山东钢铁配件',
      salary: '6000-9000元/月',
      location: '冠县工业园区',
      description: '二氧化碳保护焊，有经验优先',
      tags: ['高工资', '有经验优先', '提供住宿'],
      category: '技工',
      status: 1,
      publisherId: 'system',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }
  ];

  // 检查是否已有数据
  const existJobs = await db.collection('jobs').count();

  if (existJobs.total > 0) {
    return {
      success: true,
      message: '数据已存在，无需初始化',
      count: existJobs.total
    };
  }

  // 添加示例数据
  let addedCount = 0;
  for (const job of sampleJobs) {
    await db.collection('jobs').add({
      data: job
    });
    addedCount++;
  }

  return {
    success: true,
    message: '初始化成功',
    count: addedCount
  };
};
