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

      // 调用云函数登录
      const result = await uniCloud.callFunction({
        name: 'login',
        data: { code: loginRes.code }
      })

      uni.hideLoading()

      if (result.success && result.result.success) {
        const data = result.result.data

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
        throw new Error(result.result.msg || '登录失败')
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
