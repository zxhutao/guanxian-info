<template>
  <view class="container">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <text class="nav-icon">‹</text>
        <text class="nav-title">返回</text>
      </view>
      <view class="nav-center">
        <text class="nav-title">个人信息</text>
      </view>
      <view class="nav-right">
        <text class="nav-action" @click="saveProfile">保存</text>
      </view>
    </view>

    <!-- 头像 -->
    <view class="profile-section">
      <view class="avatar-section">
        <text class="section-label">头像</text>
        <view class="avatar-wrapper">
          <image lazy-load class="avatar-large" :src="form.avatar || '/static/images/default-avatar.png'" mode="aspectFill" @click="changeAvatar"></image>
          <text class="change-text">点击更换</text>
        </view>
      </view>

      <!-- 昵称 -->
      <view class="input-item">
        <text class="input-label">昵称</text>
        <input class="input-field" v-model="form.nickname" placeholder="请输入昵称" maxlength="20" />
      </view>

      <!-- 手机号 -->
      <view class="input-item">
        <text class="input-label">手机号</text>
        <view class="phone-wrapper">
          <text class="phone-number">{{ form.phone || '未绑定' }}</text>
          <text class="bind-link" @click="bindPhone">{{ form.phone ? '更换' : '绑定' }}</text>
        </view>
      </view>

      <!-- 用户类型 -->
      <view class="input-item">
        <text class="input-label">用户类型</text>
        <picker class="picker-field" :value="userTypeIndex" :range="userTypeList" @change="changeUserType">
          <view class="picker-value">{{ form.userTypeName || '请选择' }}</view>
        </picker>
      </view>
    </view>

    <!-- 其他信息 -->
    <view class="profile-section">
      <view class="info-item" v-for="item in infoList" :key="item.label">
        <text class="info-label">{{ item.label }}</text>
        <text class="info-value">{{ item.value }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { callCloud } from '@/utils/cloud'

// 表单数据
const form = ref({
  nickname: '',
  avatar: '',
  phone: '',
  userType: 'jobseeker',
  userTypeName: '求职者'
})

// 用户类型列表
const userTypeList = ref(['求职者', '企业', '服务提供者', '护工'])
const userTypeMap = {
  'jobseeker': '求职者',
  'company': '企业', 
  'provider': '服务提供者',
  'nurse': '护工'
}

const userTypeIndex = computed(() => {
  return form.value.userType === 'jobseeker' ? 0 :
         form.value.userType === 'company' ? 1 :
         form.value.userType === 'provider' ? 2 : 3
})

// 其他信息
const infoList = computed(() => [
  { label: '用户ID', value: form.value._id || '-' },
  { label: '注册时间', value: form.value.createdAt ? new Date(form.value.createdAt).toLocaleDateString() : '-' },
  { label: '上次登录', value: form.value.lastLoginTime ? new Date(form.value.lastLoginTime).toLocaleString() : '-' }
])

// 加载用户信息
const loadUserInfo = () => {
  try {
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo) {
      form.value = {
        _id: userInfo._id || '',
        nickname: userInfo.nickname || userInfo.profile?.nickname || '冠帮帮用户',
        avatar: userInfo.avatar || userInfo.profile?.avatar || '',
        phone: userInfo.phone || userInfo.profile?.phone || '',
        userType: userInfo.userType || 'jobseeker',
        userTypeName: userTypeMap[userInfo.userType] || '求职者',
        createdAt: userInfo.createdAt || '',
        lastLoginTime: userInfo.lastLoginTime || ''
      }
    }
  } catch (e) {
    console.log('加载用户信息失败', e)
    uni.showToast({ title: '加载用户信息失败', icon: 'none' })
  }
}

// 更换头像
const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 这里应该上传到云存储
      // 暂时先本地预览
      const tempFilePaths = res.tempFilePaths
      form.value.avatar = tempFilePaths[0]
      uni.showToast({ title: '头像已选择', icon: 'success' })
    }
  })
}

// 绑定/更换手机号
const bindPhone = () => {
  uni.showActionSheet({
    itemList: form.value.phone ? ['更换手机号', '解绑手机号', '取消'] : ['绑定手机号', '取消'],
    success: async (res) => {
      const tapIndex = res.tapIndex
      
      if (form.value.phone) {
        // 已有手机号
        if (tapIndex === 0) {
          // 更换手机号
          changePhoneNumber()
        } else if (tapIndex === 1) {
          // 解绑手机号
          unbindPhone()
        }
      } else {
        // 没有手机号
        if (tapIndex === 0) {
          // 绑定手机号
          showBindPhoneDialog()
        }
      }
    },
    fail: () => {
      // 用户取消
    }
  })
}

// 显示绑定手机号对话框
const showBindPhoneDialog = () => {
  // 直接进入更换手机号流程（绑定和更换流程相同）
  changePhoneNumber()
}

// 解绑手机号
const unbindPhone = async () => {
  uni.showModal({
    title: '解绑手机号',
    content: '确定要解绑手机号吗？解绑后将无法使用部分功能。',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '处理中...' })
          
          const result = await callCloud('bindPhone', {
            action: 'unbind',
            userId: form.value._id
          })
          
          uni.hideLoading()
          
          if (result && result.success) {
            // 更新本地数据
            form.value.phone = ''
            
            // 更新本地存储
            const currentUser = uni.getStorageSync('userInfo') || {}
            currentUser.phone = ''
            uni.setStorageSync('userInfo', currentUser)
            
            uni.showToast({ 
              title: '手机号已解绑', 
              icon: 'success' 
            })
          } else {
            uni.showToast({ 
              title: result?.message || '解绑失败，请重试', 
              icon: 'none' 
            })
          }
        } catch (error) {
          uni.hideLoading()
          console.error('解绑手机异常:', error)
          uni.showToast({ 
            title: '操作失败，请检查网络', 
            icon: 'none' 
          })
        }
      }
    }
  })
}

// 更换手机号流程
const changePhoneNumber = async () => {
  // 第一步：输入新手机号
  const phoneResult = await getUserInput('请输入新手机号', '11位手机号')
  if (!phoneResult || !phoneResult.trim()) return
  
  const newPhone = phoneResult.trim()
  
  // 验证手机号格式
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(newPhone)) {
    uni.showToast({ 
      title: '手机号格式不正确', 
      icon: 'none' 
    })
    return
  }
  
  // 检查是否是自己当前的手机号
  if (form.value.phone === newPhone) {
    uni.showToast({ 
      title: '新手机号不能与当前手机号相同', 
      icon: 'none' 
    })
    return
  }
  
  // 第二步：发送验证码
  try {
    uni.showLoading({ title: '发送验证码...' })
    
    const sendResult = await callCloud('bindPhone', {
      action: 'send',
      userId: form.value._id,
      phone: newPhone
    })
    
    uni.hideLoading()
    
    if (sendResult && sendResult.success) {
      // 第三步：输入验证码（开发模式下验证码会显示在标题中）
      showVerificationCodeDialog(
        newPhone, 
        sendResult.phone, // 隐藏后的手机号
        sendResult.devCode // 开发测试验证码
      )
    } else {
      uni.showToast({ 
        title: sendResult?.message || '验证码发送失败', 
        icon: 'none' 
      })
    }
  } catch (error) {
    uni.hideLoading()
    console.error('发送验证码异常:', error)
    uni.showToast({ 
      title: '操作失败，请检查网络', 
      icon: 'none' 
    })
  }
}

// 显示验证码输入对话框
const showVerificationCodeDialog = (phone, maskedPhone, devCode) => {
  let timer = null
  let countdown = 60
  
  // 开发模式标题显示验证码
  const title = devCode 
    ? `【开发测试】验证码: ${devCode}`
    : `验证手机号 (${maskedPhone})`
  
  uni.showModal({
    title: title,
    content: devCode ? '请输入上方显示的验证码' : '请输入6位验证码',
    editable: true,
    placeholderText: '请输入验证码',
    confirmText: '验证',
    cancelText: '重新发送',
    success: async (res) => {
      if (res.confirm) {
        // 验证验证码
        const code = res.content.trim()
        
        if (!code || code.length !== 6) {
          uni.showToast({ 
            title: '请输入6位验证码', 
            icon: 'none' 
          })
          return
        }
        
        try {
          uni.showLoading({ title: '验证中...' })
          
          const verifyResult = await callCloud('bindPhone', {
            action: 'verify',
            userId: form.value._id,
            phone: phone,
            code: code
          })
          
          uni.hideLoading()
          
          if (verifyResult && verifyResult.success) {
            // 更新本地数据
            form.value.phone = phone
            
            // 更新本地存储
            const currentUser = uni.getStorageSync('userInfo') || {}
            currentUser.phone = phone
            uni.setStorageSync('userInfo', currentUser)
            
            uni.showToast({ 
              title: '手机号绑定成功', 
              icon: 'success' 
            })
          } else {
            uni.showToast({ 
              title: verifyResult?.message || '验证码错误', 
              icon: 'none' 
            })
          }
        } catch (error) {
          uni.hideLoading()
          console.error('验证码验证异常:', error)
          uni.showToast({ 
            title: '验证失败，请检查网络', 
            icon: 'none' 
          })
        }
      } else {
        // 重新发送验证码
        try {
          uni.showLoading({ title: '重新发送...' })
          
          const sendResult = await callCloud('bindPhone', {
            action: 'send',
            userId: form.value._id,
            phone: phone
          })
          
          uni.hideLoading()
          
          if (sendResult && sendResult.success) {
            uni.showToast({ 
              title: '验证码已重新发送', 
              icon: 'success' 
            })
            
            // 重新显示输入框
            setTimeout(() => {
              showVerificationCodeDialog(phone, maskedPhone)
            }, 500)
          } else {
            uni.showToast({ 
              title: sendResult?.message || '发送失败', 
              icon: 'none' 
            })
          }
        } catch (error) {
          uni.hideLoading()
          console.error('重新发送异常:', error)
        }
      }
    }
  })
}

// 辅助函数：获取用户输入
const getUserInput = (title, placeholder) => {
  return new Promise((resolve) => {
    uni.showModal({
      title: title,
      content: '',
      editable: true,
      placeholderText: placeholder,
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          resolve(res.content)
        } else {
          resolve(null)
        }
      }
    })
  })
}

// 切换用户类型
const changeUserType = (e) => {
  const index = e.detail.value
  const typeMap = {
    0: { type: 'jobseeker', name: '求职者' },
    1: { type: 'company', name: '企业' },
    2: { type: 'provider', name: '服务提供者' },
    3: { type: 'nurse', name: '护工' }
  }
  const selected = typeMap[index]
  if (selected) {
    form.value.userType = selected.type
    form.value.userTypeName = selected.name
  }
}

// 保存个人信息
const saveProfile = async () => {
  if (!form.value.nickname.trim()) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }

  try {
    uni.showLoading({ title: '保存中...' })
    
    // 调用云函数更新用户信息
    const result = await callCloud('updateProfile', {
      userId: form.value._id,
      profile: {
        nickname: form.value.nickname,
        avatar: form.value.avatar,
        phone: form.value.phone,
        userType: form.value.userType
      }
    })

    uni.hideLoading()

    if (result && result.success) {
      // 更新本地存储
      const currentUser = uni.getStorageSync('userInfo') || {}
      currentUser.nickname = form.value.nickname
      currentUser.avatar = form.value.avatar
      currentUser.phone = form.value.phone
      currentUser.userType = form.value.userType
      uni.setStorageSync('userInfo', currentUser)
      
      uni.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      console.log('保存失败:', result)
      uni.showToast({ 
        title: result?.message || '保存失败，请重试', 
        icon: 'none' 
      })
    }
  } catch (e) {
    uni.hideLoading()
    console.log('保存异常:', e)
    uni.showToast({ title: '保存异常，请检查网络', icon: 'none' })
  }
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

onMounted(() => {
  loadUserInfo()
})

onShow(() => {
  loadUserInfo()
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
}

/* 导航栏 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 90rpx;
  padding: 0 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-center {
  flex: 1;
  text-align: center;
}

.nav-icon {
  font-size: 36rpx;
  margin-right: 10rpx;
  color: #333;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
}

.nav-right {
  display: flex;
  align-items: center;
}

.nav-action {
  font-size: 30rpx;
  color: #2d8cf0;
}

/* 个人信息区域 */
.profile-section {
  margin-top: 20rpx;
  padding: 30rpx;
  background-color: #fff;
}

.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.section-label {
  font-size: 32rpx;
  color: #333;
  flex: 1;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-large {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: #f8f8f8;
}

.change-text {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

/* 输入项 */
.input-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.input-item:last-child {
  border-bottom: none;
}

.input-label {
  font-size: 32rpx;
  color: #333;
  flex: 1;
}

.input-field {
  flex: 2;
  font-size: 32rpx;
  color: #333;
  text-align: right;
  padding: 0 20rpx;
}

.phone-wrapper {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.phone-number {
  font-size: 32rpx;
  color: #666;
}

.bind-link {
  font-size: 28rpx;
  color: #2d8cf0;
}

.picker-field {
  flex: 2;
}

.picker-value {
  font-size: 32rpx;
  color: #333;
  text-align: right;
  padding: 20rpx 0;
}

/* 信息列表 */
.info-item {
  display: flex;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 30rpx;
  color: #666;
  flex: 1;
}

.info-value {
  font-size: 30rpx;
  color: #333;
  flex: 2;
  text-align: right;
}
</style>