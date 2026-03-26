'use strict';

/**
 * 通用工具函数集合
 */

/**
 * 获取环境变量（判断是否为开发环境）
 * @returns {boolean} 是否为开发环境
 */
function isDevelopment() {
  // 微信云开发环境判断
  return process.env.TCB_ENV === 'test' || 
         process.env.NODE_ENV === 'development' ||
         process.env.NODE_ENV === 'test';
}

/**
 * 安全错误处理 - 生产环境脱敏错误信息
 * @param {Error|string} error 错误对象或错误信息
 * @param {string} defaultMessage 默认错误信息
 * @param {string} devMessage 开发环境错误信息（可选）
 * @returns {Object} 标准错误响应
 */
function handleError(error, defaultMessage = '操作失败', devMessage = null) {
  console.error('云函数错误:', error);
  
  const isDev = isDevelopment();
  let errorMessage = defaultMessage;
  
  if (isDev) {
    // 开发环境显示详细错误
    if (devMessage) {
      errorMessage = devMessage;
    } else if (error && error.message) {
      errorMessage = `${defaultMessage}: ${error.message}`;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
  }
  
  return {
    success: false,
    msg: errorMessage,
    code: -1
  };
}

/**
 * 成功响应
 * @param {any} data 返回数据
 * @param {string} message 成功消息
 * @returns {Object} 标准成功响应
 */
function successResponse(data = null, message = '操作成功') {
  return {
    success: true,
    msg: message,
    data: data,
    code: 0
  };
}

/**
 * 验证手机号格式
 * @param {string} phone 手机号
 * @returns {boolean} 是否有效
 */
function validatePhone(phone) {
  if (!phone) return false;
  return /^1[3-9]\d{9}$/.test(phone.trim());
}

/**
 * 验证数字范围
 * @param {any} value 值
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {boolean} 是否在范围内
 */
function validateNumber(value, min, max) {
  if (value === undefined || value === null) return false;
  const num = parseInt(value);
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * 验证文本长度
 * @param {string} text 文本
 * @param {number} min 最小长度
 * @param {number} max 最大长度
 * @returns {boolean} 长度是否在范围内
 */
function validateTextLength(text, min, max) {
  if (!text) return false;
  const length = text.trim().length;
  return length >= min && length <= max;
}

/**
 * 敏感词检查（简化版）
 * @param {string} text 要检查的文本
 * @returns {boolean} 是否包含敏感词
 */
function hasSensitiveWord(text) {
  if (!text) return false;
  const sensitiveWords = [
    '赌博', '色情', '诈骗', '毒品', '枪械', '管制刀具',
    '假证', '发票', '代考', '黑客', '攻击', '病毒'
  ];
  const lowerText = text.toLowerCase();
  return sensitiveWords.some(word => lowerText.includes(word.toLowerCase()));
}

/**
 * 验证必填字段
 * @param {Object} data 数据对象
 * @param {Array<string>} requiredFields 必填字段数组
 * @returns {string|null} 错误消息或null
 */
function validateRequiredFields(data, requiredFields) {
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === '') {
      return `字段"${field}"不能为空`;
    }
  }
  return null;
}

module.exports = {
  isDevelopment,
  handleError,
  successResponse,
  validatePhone,
  validateNumber,
  validateTextLength,
  hasSensitiveWord,
  validateRequiredFields
};