/**
 * 常用工具函数
 */

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm') => {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 相对时间显示
 * @param {string|Date} date - 日期
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return formatDate(date, 'MM-DD')
}

/**
 * 手机号脱敏
 * @param {string} phone - 手机号
 */
export const maskPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 金额格式化
 * @param {number} amount - 金额
 */
export const formatMoney = (amount) => {
  if (amount === undefined || amount === null) return '¥0.00'
  return `¥${Number(amount).toFixed(2)}`
}

/**
 * 数字格式化（千分位）
 * @param {number} num - 数字
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0'
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 拨打电话
 * @param {string} phone - 电话号码
 */
export const makePhoneCall = (phone) => {
  if (!phone) return
  uni.makePhoneCall({
    phoneNumber: phone,
    fail: () => {
      uni.showToast({ title: '拨打失败', icon: 'none' })
    }
  })
}

/**
 * 复制文本
 * @param {string} text - 文本
 */
export const copyText = (text) => {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({ title: '复制成功', icon: 'success' })
    }
  })
}

/**
 * 显示确认框
 * @param {string} title - 标题
 * @param {string} content - 内容
 */
export const showConfirm = (title = '提示', content = '') => {
  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

/**
 * 跳转页面
 * @param {string} url - 页面路径
 * @param {object} params - 参数
 */
export const navigateTo = (url, params = {}) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  const fullUrl = query ? `${url}?${query}` : url
  uni.navigateTo({ url: fullUrl })
}

/**
 * 跳转Tab页面
 * @param {string} url - 页面路径
 */
export const switchTab = (url) => {
  uni.switchTab({ url })
}

/**
 * 返回上一页
 * @param {number} delta - 返回页数
 */
export const navigateBack = (delta = 1) => {
  uni.navigateBack({ delta })
}

export default {
  formatDate,
  formatRelativeTime,
  maskPhone,
  formatMoney,
  formatNumber,
  makePhoneCall,
  copyText,
  showConfirm,
  navigateTo,
  switchTab,
  navigateBack
}
