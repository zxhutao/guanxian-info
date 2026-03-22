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
      const { code } = await uni.login()
      
      // 调用云函数登录
      // const result = await uniCloud.callFunction({
      //   name: 'login',
      //   data: { code }
      // })
      
      // 模拟登录成功
      const mockToken = 'token_' + Date.now()
      token.value = mockToken
      uni.setStorageSync('token', mockToken)
      
      console.log('登录成功')
      return mockToken
    } catch (e) {
      console.error('登录失败:', e)
      uni.showToast({
        title: '登录失败',
        icon: 'none'
      })
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
