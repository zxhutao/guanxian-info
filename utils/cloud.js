/**
 * 云开发配置
 * 使用微信云开发，无需配置服务器
 */

// 云开发环境ID
export const CLOUD_ENV = 'cloudbase-1gkioadld4516142';

// 云函数名称
export const CLOUD_FUNCTIONS = {
  // 职位相关
  GET_JOBS: 'jobList',           // 获取职位列表
  PUBLISH_JOB: 'publishJob',     // 发布职位
  GET_HOT_JOBS: 'jobList',       // 热门职位（复用列表接口）

  // 用户相关
  GET_USER_INFO: 'getUserInfo',   // 获取用户信息

  // 服务相关
  GET_SERVICES: 'getServices',   // 获取服务列表
  GET_WORKERS: 'getWorkers',     // 获取护工列表

  // 初始化
  INIT_DATA: 'initData',         // 初始化职位数据
  INIT_SERVICES: 'initServices'  // 初始化服务和护工数据
};

/**
 * 调用云函数
 * @param {string} name 云函数名称
 * @param {object} data 参数
 * @returns {Promise}
 */
export function callCloudFunction(name, data = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.init({
      env: CLOUD_ENV
    });

    wx.cloud.callFunction({
      name: name,
      data: data,
      success: (res) => {
        if (res.result && res.result.success) {
          resolve(res.result);
        } else {
          resolve(res.result);
        }
      },
      fail: (err) => {
        console.error('云函数调用失败:', err);
        reject(err);
      }
    });
  });
}

/**
 * 初始化示例数据
 * 首次使用时调用
 */
export async function initSampleData() {
  try {
    await callCloudFunction(CLOUD_FUNCTIONS.INIT_DATA);
    await callCloudFunction(CLOUD_FUNCTIONS.INIT_SERVICES);
    console.log('示例数据初始化成功');
  } catch (e) {
    console.error('初始化失败:', e);
  }
}
