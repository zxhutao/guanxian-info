'use strict';

// 输入验证函数
const validatePhone = (phone) => {
  if (!phone) return false;
  return /^1[3-9]\d{9}$/.test(phone.trim());
};

const validateNumber = (value, min, max) => {
  if (value === undefined || value === null) return false;
  const num = parseInt(value);
  return !isNaN(num) && num >= min && num <= max;
};

const validateTextLength = (text, min, max) => {
  if (!text) return false;
  const length = text.trim().length;
  return length >= min && length <= max;
};

// 敏感词检查（简化版，生产环境应使用更完善的过滤）
const hasSensitiveWord = (text) => {
  if (!text) return false;
  const sensitiveWords = ['赌博', '色情', '诈骗', '毒品'];
  const lowerText = text.toLowerCase();
  return sensitiveWords.some(word => lowerText.includes(word.toLowerCase()));
};

exports.main = async (event, context) => {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

  const db = cloud.database();
  const { OPENID } = cloud.getWXContext();

  // 获取参数
  const { type, data } = event;

  // 参数校验
  if (!type || !data) {
    return {
      success: false,
      msg: '缺少必要参数：type 或 data'
    };
  }

  // 验证类型
  const validTypes = ['job', 'service', 'nursing'];
  if (!validTypes.includes(type)) {
    return {
      success: false,
      msg: '无效的类型，仅支持：job、service、nursing'
    };
  }

  // 验证用户登录
  if (!OPENID) {
    return {
      success: false,
      msg: '用户未登录'
    };
  }

  try {
    // 输入数据验证
    let validationError = null;
    
    switch (type) {
      case 'job':
        // 职位发布验证
        if (!validateTextLength(data.title, 2, 100)) {
          validationError = '职位标题长度应在2-100字符之间';
        } else if (!validateTextLength(data.company, 2, 50)) {
          validationError = '公司名称长度应在2-50字符之间';
        } else if (data.phone && !validatePhone(data.phone)) {
          validationError = '手机号格式不正确';
        } else if (data.count && !validateNumber(data.count, 1, 1000)) {
          validationError = '招聘人数应在1-1000之间';
        } else if (hasSensitiveWord(data.title) || hasSensitiveWord(data.description)) {
          validationError = '内容包含敏感词汇，请修改后重新提交';
        }
        break;
        
      case 'service':
        // 服务发布验证
        if (!validateTextLength(data.name, 2, 50)) {
          validationError = '服务名称长度应在2-50字符之间';
        } else if (data.phone && !validatePhone(data.phone)) {
          validationError = '手机号格式不正确';
        } else if (hasSensitiveWord(data.name) || hasSensitiveWord(data.description)) {
          validationError = '内容包含敏感词汇，请修改后重新提交';
        }
        break;
        
      case 'nursing':
        // 护工发布验证
        if (!validateTextLength(data.name, 2, 20)) {
          validationError = '姓名长度应在2-20字符之间';
        } else if (data.age && !validateNumber(data.age, 18, 70)) {
          validationError = '年龄应在18-70岁之间';
        } else if (data.experience && !validateNumber(data.experience, 0, 50)) {
          validationError = '工作经验应在0-50年之间';
        } else if (data.phone && !validatePhone(data.phone)) {
          validationError = '手机号格式不正确';
        } else if (hasSensitiveWord(data.name) || hasSensitiveWord(data.skills) || hasSensitiveWord(data.bio)) {
          validationError = '内容包含敏感词汇，请修改后重新提交';
        }
        break;
    }
    
    if (validationError) {
      return {
        success: false,
        msg: validationError
      };
    }

    // 根据类型确定集合名称和字段映射
    let collectionName = '';
    let recordData = {};

    switch (type) {
      case 'job':
        collectionName = 'jobs';
        recordData = {
          title: data.title || '',
          company: data.company || '',
          salary: data.salary || '',
          location: data.location || '',
          experience: data.experience || '不限',
          education: data.education || '不限',
          count: parseInt(data.count) || 1,
          phone: data.phone || '',
          description: data.description || '',
          category: data.category || '其他'
        };
        break;

      case 'service':
        collectionName = 'services';
        recordData = {
          name: data.name || '',
          provider: data.provider || '',
          price: data.price || '',
          range: data.range || '',
          description: data.description || '',
          phone: data.phone || '',
          category: data.category || '其他'
        };
        break;

      case 'nursing':
        collectionName = 'workers';
        recordData = {
          name: data.name || '',
          gender: data.gender || '女',
          age: parseInt(data.age) || 0,
          experience: parseInt(data.experience) || 0,
          price: data.price || '',
          skills: data.skills || '',
          bio: data.bio || '',
          phone: data.phone || '',
          rating: 5.0, // 默认评分
          orders: 0    // 默认订单数
        };
        break;
    }

    // 添加系统字段
    const finalData = {
      ...recordData,
      _openid: OPENID,
      createTime: db.serverDate(),
      updateTime: db.serverDate(),
      status: 1  // 1=正常，0=下架
    };

    // 写入数据库
    const result = await db.collection(collectionName).add({
      data: finalData
    });

    if (result._id) {
      return {
        success: true,
        msg: '发布成功',
        data: {
          id: result._id,
          type: type
        }
      };
    } else {
      return {
        success: false,
        msg: '发布失败，请重试'
      };
    }

  } catch (error) {
    console.error('发布失败:', error);
    
    // 判断环境，生产环境脱敏错误信息
    const isDev = process.env.TCB_ENV === 'test' || process.env.NODE_ENV === 'development';
    
    return {
      success: false,
      msg: isDev ? `发布失败：${error.message || '未知错误'}` : '发布失败，请稍后重试'
    };
  }
};
