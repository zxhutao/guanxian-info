<template>
  <view class="container">
    <!-- 用户信息 -->
    <view class="user-header">
      <view class="user-info" @click="goLogin">
        <image lazy-load class="avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
        <view class="user-meta">
          <text class="nickname">{{ userInfo.nickname || '点击登录' }}</text>
          <view class="user-level" v-if="isLogin">
            <text class="level-tag">{{ levelName }}</text>
            <text class="points">{{ userPoints }} 积分</text>
          </view>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 快捷功能 -->
    <view class="quick-menu">
      <view class="menu-item" @click="goToPage('/pages/user/my-jobs')">
        <text class="menu-icon">💼</text>
        <text class="menu-text">我的职位</text>
      </view>
      <view class="menu-item" @click="goToPage('/pages/user/my-services')">
        <text class="menu-icon">🔧</text>
        <text class="menu-text">我的服务</text>
      </view>
      <view class="menu-item" @click="goToPage('/pages/user/my-bookings')">
        <text class="menu-icon">📅</text>
        <text class="menu-text">我的预约</text>
      </view>
      <view class="menu-item" @click="goToPage('/pages/user/favorites')">
        <text class="menu-icon">⭐</text>
        <text class="menu-text">我的收藏</text>
      </view>
    </view>
    
    <!-- 积分入口 -->
    <view class="points-section" v-if="isLogin">
      <view class="points-card" @click="goToPage('/pages/points/detail')">
        <view class="points-info">
          <text class="points-label">我的积分</text>
          <text class="points-value">{{ userPoints }}</text>
        </view>
        <view class="points-actions">
          <view class="action-btn" @click.stop="goToPage('/pages/checkin/index')">
            <text class="action-icon">📅</text>
            <text class="action-text">签到</text>
          </view>
          <view class="action-btn" @click.stop="goToPage('/pages/points/shop')">
            <text class="action-icon">🛒</text>
            <text class="action-text">商城</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 常用功能 -->
    <view class="function-list">
      <view class="section-title">常用功能</view>
      
      <view class="function-item" @click="goToPage('/pages/user/resume')">
        <view class="item-left">
          <text class="item-icon">📝</text>
          <text class="item-text">我的简历</text>
        </view>
        <text class="item-arrow">›</text>
      </view>
      
      <view class="function-item" @click="goToPage('/pages/points/items')">
        <view class="item-left">
          <text class="item-icon">🎁</text>
          <text class="item-text">我的优惠券和道具</text>
        </view>
        <text class="item-arrow">›</text>
      </view>
      
      <view class="function-item" @click="goToPage('/pages/ranking/index')">
        <view class="item-left">
          <text class="item-icon">🏆</text>
          <text class="item-text">冠县好评榜</text>
        </view>
        <text class="item-arrow">›</text>
      </view>
      
      <view class="function-item" @click="goToPage('/pages/merchant/settlement')">
        <view class="item-left">
          <text class="item-icon">💰</text>
          <text class="item-text">结算中心</text>
        </view>
        <text class="item-arrow">›</text>
      </view>
    </view>
    
    <!-- 其他功能 -->
    <view class="function-list">
      <view class="section-title">其他</view>
      
      <view class="function-item" @click="goToPage('/pages/user/message')">
        <view class="item-left">
          <text class="item-icon">🔔</text>
          <text class="item-text">消息通知</text>
        </view>
        <view class="item-right">
          <text class="badge" v-if="unreadCount > 0">{{ unreadCount }}</text>
          <text class="item-arrow">›</text>
        </view>
      </view>
      
      <view class="function-item" @click="contactService">
        <view class="item-left">
          <text class="item-icon">💬</text>
          <text class="item-text">联系客服</text>
        </view>
        <text class="item-arrow">›</text>
      </view>
      
      <view class="function-item" @click="goToPage('/pages/user/settings')">
        <view class="item-left">
          <text class="item-icon">⚙️</text>
          <text class="item-text">设置</text>
        </view>
        <text class="item-arrow">›</text>
      </view>
      
      <view class="function-item" @click="goToPage('/pages/user/about')">
        <view class="item-left">
          <text class="item-icon">ℹ️</text>
          <text class="item-text">关于我们</text>
        </view>
        <text class="item-arrow">›</text>
      </view>
      
      <view class="function-item" @click="goToPage('/pages/elder-care/index')">
        <view class="item-left">
          <text class="item-icon">👴</text>
          <text class="item-text">老人关怀模式</text>
        </view>
        <text class="item-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { callCloud } from '@/utils/cloud'

const userInfo = ref({})
const userPoints = ref(0)
const unreadCount = ref(0)

const isLogin = computed(() => {
  return !!userInfo.value._id
})

const levelName = computed(() => {
  const level = userInfo.value.level || 1
  const names = ['青铜', '白银', '黄金', '铂金', '钻石']
  return names[level - 1] || '青铜'
})

// 获取用户信息
const getUserInfo = async () => {
  try {
    // 检查登录状态 - 优先从本地存储读取
    const loginRes = uni.getStorageSync('userInfo')
    console.log('读取到的用户信息:', loginRes)
    
    // 兼容多种数据格式
    if (loginRes && (loginRes._id || loginRes._openid)) {
      userInfo.value = {
        _id: loginRes._id || '',
        _openid: loginRes._openid || '',
        userType: loginRes.userType || 'jobseeker',
        nickname: loginRes.nickname || loginRes.profile?.nickname || '冠帮帮用户',
        avatar: loginRes.avatar || loginRes.profile?.avatar || '',
        phone: loginRes.phone || loginRes.profile?.phone || ''
      }
      // 获取积分
      getUserPoints()
    } else {
      console.log('未登录或用户信息格式不对')
    }
  } catch (e) {
    console.log('读取用户信息失败', e)
  }
}

// 获取用户积分
const getUserPoints = async () => {
  try {
    const result = await callCloud('checkin', { action: 'getPointsInfo' })
    console.log('【积分调试】getPointsInfo 返回:', JSON.stringify(result))
    if (result && result.code === 0) {
      userPoints.value = result.data?.points || 0
      console.log('【积分调试】设置用户积分:', userPoints.value, '原始数据:', result.data)
    }
  } catch (e) {
    console.log('获取积分失败，使用默认积分', e)
    userPoints.value = 0
  }
}

// 页面跳转
const goToPage = (url) => {
  if (!isLogin.value && url !== '/pages/user/about') {
    uni.navigateTo({ url: '/pages/auth/login' })
    return
  }
  uni.navigateTo({ url })
}

// 登录
const goLogin = () => {
  if (!isLogin.value) {
    // 未登录 -> 跳转到登录页
    uni.navigateTo({ url: '/pages/auth/login' })
  } else {
    // 已登录 -> 跳转到个人信息编辑页
    uni.navigateTo({ url: '/pages/user/profile' })
  }
}

// 联系客服
const contactService = () => {
  uni.showModal({
    title: '联系客服',
    content: '客服热线：400-888-8888',
    confirmText: '拨打',
    success: (res) => {
      if (res.confirm) {
        uni.makePhoneCall({
          phoneNumber: '400-888-8888'
        })
      }
    }
  })
}

onShow(() => {
  getUserInfo()
})

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40rpx;
}

.user-header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  padding: 60rpx 30rpx 100rpx;
}

.user-info {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 24rpx;
}

.user-meta {
  flex: 1;
}

.nickname {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.user-level {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.level-tag {
  font-size: 22rpx;
  color: #fff;
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.points {
  font-size: 24rpx;
  color: #ff6b6b;
}

.arrow {
  font-size: 32rpx;
  color: #ccc;
}

.quick-menu {
  display: flex;
  justify-content: space-around;
  background: #fff;
  margin: -40rpx 20rpx 20rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.menu-text {
  font-size: 26rpx;
  color: #666;
}

.points-section {
  margin: 0 20rpx 20rpx;
}

.points-card {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2rpx solid #ff6b6b;
}

.points-info {
  display: flex;
  flex-direction: column;
}

.points-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.points-value {
  font-size: 56rpx;
  font-weight: bold;
  color: #ff6b6b;
}

.points-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 16rpx 30rpx;
  border-radius: 12rpx;
}

.action-icon {
  font-size: 36rpx;
  margin-bottom: 6rpx;
}

.action-text {
  font-size: 24rpx;
  color: #666;
}

.function-list {
  background: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.section-title {
  font-size: 28rpx;
  color: #999;
  padding: 24rpx 30rpx;
  background: #f8f8f8;
}

.function-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.function-item:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  align-items: center;
}

.item-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.item-text {
  font-size: 30rpx;
  color: #333;
}

.item-right {
  display: flex;
  align-items: center;
}

.badge {
  background: #ff6b6b;
  color: #fff;
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  margin-right: 12rpx;
}

.item-arrow {
  font-size: 28rpx;
  color: #ccc;
}
</style>
