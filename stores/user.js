/**
 * 用户状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // ========== 状态 ==========
  const token = ref(uni.getStorageSync('token') || '')
  const userInfo = ref(uni.getStorageSync('userInfo') || null)
  const userProfile = ref(null)
  const userType = ref('jobseeker') // jobseeker | employer | worker | provider

  // ========== 计算属性 ==========
  const isLoggedIn = computed(() => !!token.value)
  const isEmployer = computed(() => userType.value === 'employer')
  const isWorker = computed(() => userType.value === 'worker')

  // ========== 方法 ==========
  
  // 微信登录
  const login = async () => {
    try {
      // 显示登录中状态
      uni.showLoading({ title: '登录中...', mask: true })

      // 获取微信登录 code
      const loginRes = await uni.login()

      if (!loginRes.code) {
        throw new Error('获取登录凭证失败')
      }

      // 调用微信云函数登录
      console.log('开始调用云函数，code:', loginRes.code)
      let callRes
      try {
        callRes = await wx.cloud.callFunction({
          name: 'login',
          data: { code: loginRes.code }
        })
      } catch (cloudErr) {
        console.error('云函数调用失败:', cloudErr)
        throw new Error('云函数调用失败: ' + (cloudErr.message || JSON.stringify(cloudErr)))
      }
      
      console.log('云函数返回:', JSON.stringify(callRes))
      
      const result = callRes.result
      
      if (!result) {
        console.error('云函数返回结果为空')
        throw new Error('云函数返回结果为空')
      }
      
      console.log('云函数result:', JSON.stringify(result))

      uni.hideLoading()

      if (result.success) {
        const data = result.data
        
        if (!data || !data.token) {
          console.error('返回数据缺少token:', data)
          throw new Error('登录返回数据不完整')
        }

        // 保存 token
        token.value = data.token
        uni.setStorageSync('token', data.token)

        // 保存用户信息
        userInfo.value = data.userInfo
        uni.setStorageSync('userInfo', data.userInfo)

        // 保存用户类型
        if (data.userInfo && data.userInfo.userType) {
          userType.value = data.userInfo.userType
          uni.setStorageSync('userType', data.userInfo.userType)
        }

        console.log('登录成功', data)
        return data
      } else {
        console.error('云函数返回失败:', result)
        throw new Error(result.msg || result.errMsg || '登录失败')
      }
    } catch (e) {
      uni.hideLoading()
      console.error('登录失败:', e)
      uni.showToast({
        title: e.message || '登录失败，请重试',
        icon: 'none'
      })
      throw e
    }
  }

  // 获取用户信息（需要用户授权）
  const getUserProfile = async () => {
    try {
      const res = await uni.getUserProfile({
        desc: '完善个人信息'
      })
      
      userInfo.value = res.userInfo
      uni.setStorageSync('userInfo', res.userInfo)
      
      // TODO: 上传用户信息到服务器
      return res.userInfo
    } catch (e) {
      console.log('用户拒绝授权')
    }
  }

  // 退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = null
    userProfile.value = null
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    
    uni.showToast({
      title: '已退出登录',
      icon: 'success'
    })
  }

  // 检查登录状态
  const checkLogin = () => {
    const storedToken = uni.getStorageSync('token')
    if (storedToken) {
      token.value = storedToken
      return true
    }
    return false
  }

  // 更新用户类型
  const setUserType = (type) => {
    userType.value = type
    uni.setStorageSync('userType', type)
  }

  // 从存储恢复状态
  const restoreState = () => {
    const storedUserType = uni.getStorageSync('userType')
    if (storedUserType) {
      userType.value = storedUserType
    }
  }

  // 初始化恢复
  restoreState()

  return {
    // 状态
    token,
    userInfo,
    userProfile,
    userType,
    // 计算属性
    isLoggedIn,
    isEmployer,
    isWorker,
    // 方法
    login,
    getUserProfile,
    logout,
    checkLogin,
    setUserType,
    restoreState
  }
})
