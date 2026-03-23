/**
 * 统一请求封装
 */
import { useUserStore } from '../stores/user'

// 开发环境API地址
const BASE_URL = 'https://api.example.com'

// 请求队列（用于401后重试）
let isRefreshing = false
let requestQueue = []

/**
 * 统一请求方法
 * @param {Object} options - 请求配置
 * @param {string} options.url - 请求地址
 * @param {string} [options.method='GET'] - 请求方法
 * @param {Object} [options.data={}] - 请求数据
 * @param {Object} [options.header={}] - 请求头
 * @param {boolean} [options.showLoading=true] - 是否显示loading
 * @param {boolean} [options.showError=true] - 是否显示错误提示
 */
export const request = (options) => {
  const userStore = useUserStore()
  const {
    url,
    method = 'GET',
    data = {},
    header = {},
    showLoading = true,
    showError = true
  } = options

  // 创建Promise
  return new Promise((resolve, reject) => {
    // 显示loading
    if (showLoading) {
      uni.showLoading({
        title: '加载中...',
        mask: true
      })
    }

    // 准备请求头
    const requestHeader = {
      'Content-Type': 'application/json',
      'Authorization': userStore.token ? `Bearer ${userStore.token}` : '',
      ...header
    }

    // 发起请求
    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: requestHeader,
      timeout: 15000,
      success: (res) => {
        // 隐藏loading
        if (showLoading) {
          uni.hideLoading()
        }

        // HTTP 成功
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const responseData = res.data
          
          // 业务成功
          if (responseData.code === 0 || responseData.success) {
            resolve(responseData.data)
          } else {
            // 业务失败
            if (showError) {
              uni.showToast({
                title: responseData.msg || '请求失败',
                icon: 'none'
              })
            }
            reject(responseData)
          }
        }
        // HTTP 401 未授权
        else if (res.statusCode === 401) {
          handleUnauthorized(options, resolve, reject)
        }
        // 其他错误
        else {
          if (showError) {
            uni.showToast({
              title: '网络异常，请稍后重试',
              icon: 'none'
            })
          }
          reject(res.data)
        }
      },
      fail: (err) => {
        // 隐藏loading
        if (showLoading) {
          uni.hideLoading()
        }

        if (showError) {
          uni.showToast({
            title: '网络异常，请检查网络',
            icon: 'none'
          })
        }
        reject(err)
      }
    })
  })
}

/**
 * 处理401未授权
 */
const handleUnauthorized = (options, resolve, reject) => {
  const userStore = useUserStore()
  
  if (!isRefreshing) {
    isRefreshing = true
    
    // 尝试重新登录
    userStore.login().then(() => {
      isRefreshing = false
      
      // 重试队列中的请求
      requestQueue.forEach(({ resolve, reject }) => {
        request(options).then(resolve).catch(reject)
      })
      requestQueue = []
      
      // 重新发起当前请求
      request(options).then(resolve).catch(reject)
    }).catch(() => {
      isRefreshing = false
      requestQueue = []
      reject({ code: 401, msg: '登录失效' })
    })
  } else {
    // 加入队列等待
    requestQueue.push({ resolve, reject })
  }
}

/**
 * GET 请求
 */
export const get = (url, data = {}, options = {}) => {
  return request({ url, method: 'GET', data, ...options })
}

/**
 * POST 请求
 */
export const post = (url, data = {}, options = {}) => {
  return request({ url, method: 'POST', data, ...options })
}

/**
 * PUT 请求
 */
export const put = (url, data = {}, options = {}) => {
  return request({ url, method: 'PUT', data, ...options })
}

/**
 * DELETE 请求
 */
export const del = (url, data = {}, options = {}) => {
  return request({ url, method: 'DELETE', data, ...options })
}

export default request
