<template>
  <view class="settings-page">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info" @click="editProfile">
        <image lazy-load class="user-avatar"
          :src="userInfo.avatarUrl || '/static/images/default-avatar.png'"
          mode="aspectFill"
        />
        <view class="user-detail">
          <view class="user-name">{{ userInfo.nickName || '未登录' }}</view>
          <view class="user-phone">{{ userInfo.phone || '点击编辑资料' }}</view>
        </view>
        <view class="edit-icon">›</view>
      </view>
    </view>

    <!-- 设置列表 -->
    <view class="settings-group">
      <view class="settings-title">账号设置</view>

      <view class="settings-item" @click="changeAvatar">
        <text class="item-icon">🪪</text>
        <text class="item-text">头像设置</text>
        <view class="item-arrow">›</view>
      </view>

      <view class="settings-item" @click="editProfile">
        <text class="item-icon">📝</text>
        <text class="item-text">个人信息</text>
        <view class="item-arrow">›</view>
      </view>

      <view class="settings-item" @click="changePhone">
        <text class="item-icon">📱</text>
        <text class="item-text">手机号</text>
        <view class="item-value">{{ userInfo.phone || '未绑定' }}</view>
        <view class="item-arrow">›</view>
      </view>

      <view class="settings-item" @click="changePassword">
        <text class="item-icon">🔒</text>
        <text class="item-text">修改密码</text>
        <view class="item-arrow">›</view>
      </view>
    </view>

    <view class="settings-group">
      <view class="settings-title">偏好设置</view>

      <view class="settings-item">
        <text class="item-icon">🔔</text>
        <text class="item-text">消息通知</text>
        <switch :checked="notifyEnabled" @change="toggleNotify" color="#E63946" />
      </view>

      <view class="settings-item">
        <text class="item-icon">📍</text>
        <text class="item-text">位置权限</text>
        <switch :checked="locationEnabled" @change="toggleLocation" color="#E63946" />
      </view>
    </view>

    <view class="settings-group">
      <view class="settings-title">其他</view>

      <view class="settings-item" @click="clearCache">
        <text class="item-icon">🗑️</text>
        <text class="item-text">清理缓存</text>
        <view class="item-value">{{ cacheSize }}</view>
        <view class="item-arrow">›</view>
      </view>

      <view class="settings-item" @click="checkUpdate">
        <text class="item-icon">🔄</text>
        <text class="item-text">检查更新</text>
        <view class="item-value">v1.0.0</view>
        <view class="item-arrow">›</view>
      </view>

      <view class="settings-item" @click="goToAgreement">
        <text class="item-icon">📄</text>
        <text class="item-text">用户服务协议</text>
        <view class="item-arrow">›</view>
      </view>

      <view class="settings-item" @click="goToPrivacy">
        <text class="item-icon">🔒</text>
        <text class="item-text">隐私政策</text>
        <view class="item-arrow">›</view>
      </view>

      <view class="settings-item" @click="aboutApp">
        <text class="item-icon">ℹ️</text>
        <text class="item-text">关于冠帮帮</text>
        <view class="item-arrow">›</view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-btn" @click="logout" v-if="isLoggedIn">
      退出登录
    </view>
    <view class="logout-btn login-btn" @click="goLogin" v-else>
      登录/注册
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()

const notifyEnabled = ref(true)
const locationEnabled = ref(true)
const cacheSize = ref('0 KB')

const userInfo = computed(() => userStore.userInfo || {})
const isLoggedIn = computed(() => userStore.isLoggedIn)

const loadData = () => {
  // 计算缓存大小
  try {
    const info = wx.getStorageInfoSync()
    const sizeKB = info.currentSize
    if (sizeKB > 1024) {
      cacheSize.value = (sizeKB / 1024).toFixed(1) + ' MB'
    } else {
      cacheSize.value = sizeKB + ' KB'
    }
  } catch (e) {
    cacheSize.value = '0 KB'
  }
}

const editProfile = () => {
  uni.navigateTo({ url: '/pages/user/resume' })
}

const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      uni.showToast({ title: '头像上传功能开发中', icon: 'none' })
    }
  })
}

const changePhone = () => {
  uni.showToast({ title: '手机号绑定功能开发中', icon: 'none' })
}

const changePassword = () => {
  uni.showToast({ title: '密码修改功能开发中', icon: 'none' })
}

const toggleNotify = (e) => {
  notifyEnabled.value = e.detail.value
}

const toggleLocation = (e) => {
  locationEnabled.value = e.detail.value
}

const clearCache = () => {
  uni.showModal({
    title: '清理缓存',
    content: '确定要清理所有缓存数据吗？',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        cacheSize.value = '0 KB'
        uni.showToast({ title: '缓存已清理', icon: 'success' })
      }
    }
  })
}

const checkUpdate = () => {
  uni.showToast({ title: '已是最新版本', icon: 'success' })
}

const goToAgreement = () => {
  uni.navigateTo({ url: '/pages/user/agreement' })
}

const goToPrivacy = () => {
  uni.navigateTo({ url: '/pages/user/privacy' })
}

const aboutApp = () => {
  uni.navigateTo({ url: '/pages/user/about' })
}

const logout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
      }
    }
  })
}

const goLogin = () => {
  uni.navigateTo({ url: '/pages/auth/login' })
}

onMounted(() => {
  loadData()
})

onShow(() => {
  // 刷新用户信息
  loadData()
})
</script>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 40rpx;
}

.user-card {
  background: linear-gradient(135deg, #E63946 0%, #C1121F 100%);
  padding: 40rpx 30rpx;

  .user-info {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 16rpx;
    padding: 24rpx;
    backdrop-filter: blur(10px);

    .user-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50rpx;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
      margin-right: 20rpx;
      background: #eee;
    }

    .user-detail {
      flex: 1;

      .user-name {
        font-size: 34rpx;
        font-weight: 500;
        color: #fff;
        margin-bottom: 8rpx;
      }

      .user-phone {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .edit-icon {
      color: rgba(255, 255, 255, 0.8);
      font-size: 36rpx;
    }
  }
}

.settings-group {
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  overflow: hidden;

  .settings-title {
    padding: 20rpx 30rpx 12rpx;
    font-size: 24rpx;
    color: #999;
  }

  .settings-item {
    display: flex;
    align-items: center;
    padding: 28rpx 30rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .item-icon {
      font-size: 32rpx;
      margin-right: 16rpx;
    }

    .item-text {
      flex: 1;
      font-size: 30rpx;
      color: #333;
    }

    .item-value {
      font-size: 26rpx;
      color: #999;
      margin-right: 8rpx;
    }

    .item-arrow {
      color: #ccc;
      font-size: 32rpx;
    }
  }
}

.logout-btn {
  margin: 40rpx 30rpx;
  background: #fff;
  color: #E63946;
  text-align: center;
  padding: 28rpx 0;
  border-radius: 16rpx;
  font-size: 30rpx;
}

.login-btn {
  background: #E63946;
  color: #fff;
}
</style>
