/**
 * 云开发工具函数
 * 统一封装微信云函数调用，解决 Vue3 script setup 中 wx 全局变量问题
 */

// 云开发环境ID
export const CLOUD_ENV = 'cloudbase-1gkioadld4516142'

// 云函数名称常量
export const CLOUD_FUNCTIONS = {
  GET_JOBS: 'jobList',
  PUBLISH_JOB: 'publishJob',
  GET_HOT_JOBS: 'jobList',
  GET_USER_INFO: 'getUserInfo',
  GET_SERVICES: 'getServices',
  GET_WORKERS: 'getWorkers',
  INIT_DATA: 'initData',
  INIT_SERVICES: 'initServices'
}

/**
 * 调用云函数（统一入口，兼容 Vue3 script setup）
 * @param {string} name  云函数名称
 * @param {object} data  参数
 * @returns {Promise<any>}  resolve res.result
 */
export function callCloud(name, data = {}) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    if (!wx || !wx.cloud) {
      reject(new Error('wx.cloud 未初始化，请确认微信基础库版本 >= 2.2.3'))
      return
    }
    wx.cloud.callFunction({
      name,
      data,
      success: (res) => resolve(res.result),
      fail: (err) => {
        console.error(`[cloud] ${name} 调用失败:`, err)
        reject(err)
      }
    })
    // #endif

    // #ifndef MP-WEIXIN
    // 非微信小程序环境（H5 调试等）直接 resolve 空数据，避免崩溃
    console.warn(`[cloud] 非微信环境，跳过云函数调用: ${name}`)
    resolve(null)
    // #endif
  })
}

// 保留旧名称兼容（防止其他地方已 import callCloudFunction）
export const callCloudFunction = callCloud

/**
 * 初始化示例数据（首次使用时调用）
 */
export async function initSampleData() {
  try {
    await callCloud(CLOUD_FUNCTIONS.INIT_DATA)
    await callCloud(CLOUD_FUNCTIONS.INIT_SERVICES)
    console.log('示例数据初始化成功')
  } catch (e) {
    console.error('初始化失败:', e)
  }
}
