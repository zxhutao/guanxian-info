<template>
  <view class="elder-care-page">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">老人关怀模式</text>
      <text class="subtitle">简化界面，轻松使用</text>
      <view class="exit-btn" @click="exitElderMode">
        <text class="exit-text">退出关怀模式</text>
      </view>
    </view>

    <!-- 主要功能区 -->
    <view class="main-functions">
      <!-- SOS紧急求助 - 最醒目 -->
      <view class="sos-btn" @click="handleSOS">
        <text class="sos-icon">🆘</text>
        <text class="sos-text">紧急求助</text>
        <text class="sos-hint">点击立即呼叫家人</text>
      </view>

      <!-- 三大功能 -->
      <view class="function-grid">
        <view class="function-item" @click="goPhoneBook">
          <text class="func-icon">📞</text>
          <text class="func-label">打电话</text>
        </view>
        <view class="function-item" @click="goServices">
          <text class="func-icon">🔧</text>
          <text class="func-label">找服务</text>
        </view>
        <view class="function-item" @click="goNews">
          <text class="func-icon">📰</text>
          <text class="func-label">看新闻</text>
        </view>
      </view>
    </view>

    <!-- 常用电话快捷拨打 -->
    <view class="quick-call">
      <text class="section-title">常用电话</text>
      <view class="call-list">
        <view class="call-item" v-for="phone in quickPhones" :key="phone.name" @click="makeCall(phone.number)">
          <text class="call-name">{{ phone.name }}</text>
          <view class="call-btn">
            <text class="call-icon">📱</text>
            <text class="call-text">拨打</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="footer-tip">
      <text class="tip-text">如需帮助，请联系家人</text>
    </view>
  </view>
</template>

<script setup>
// 常用电话列表
const quickPhones = [
  { name: '急救中心', number: '120' },
  { name: '报警电话', number: '110' },
  { name: '消防救援', number: '119' },
  { name: '冠帮帮客服', number: '4008888888' }
]

// 退出关怀模式
const exitElderMode = () => {
  uni.showModal({
    title: '退出关怀模式',
    content: '确定要退出老人关怀模式吗？',
    confirmText: '退出',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack()
      }
    }
  })
}

// SOS紧急求助
const handleSOS = () => {
  uni.showModal({
    title: '🆘 紧急求助',
    content: '确定要拨打紧急联系人吗？',
    confirmText: '立即拨打',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 这里可以设置为家人的电话号码
        uni.makePhoneCall({
          phoneNumber: '120'
        })
      }
    }
  })
}

// 打电话
const goPhoneBook = () => {
  uni.navigateTo({
    url: '/pages/phonebook/index'
  })
}

// 找服务
const goServices = () => {
  uni.switchTab({
    url: '/pages/service/index'
  })
}

// 看新闻
const goNews = () => {
  uni.navigateTo({
    url: '/pages/info/index'
  })
}

// 拨打电话
const makeCall = (phoneNumber) => {
  uni.makePhoneCall({
    phoneNumber: phoneNumber
  })
}
</script>

<style lang="scss" scoped>
.elder-care-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1E3A5F 0%, #2C5282 100%);
  padding-bottom: 40rpx;
}

.header {
  padding: 60rpx 40rpx 40rpx;
  text-align: center;

  .title {
    display: block;
    font-size: 56rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 16rpx;
  }

  .subtitle {
    display: block;
    font-size: 32rpx;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 30rpx;
  }

  .exit-btn {
    display: inline-block;
    padding: 16rpx 32rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 40rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.5);

    .exit-text {
      font-size: 28rpx;
      color: #fff;
    }
  }
}

.main-functions {
  padding: 0 30rpx;
  margin-top: 20rpx;
}

// SOS按钮 - 醒目大图标
.sos-btn {
  background: linear-gradient(135deg, #E63946 0%, #C1121F 100%);
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
  box-shadow: 0 12rpx 40rpx rgba(230, 57, 70, 0.5);

  .sos-icon {
    font-size: 100rpx;
    margin-bottom: 20rpx;
  }

  .sos-text {
    font-size: 48rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 12rpx;
  }

  .sos-hint {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

// 功能网格
.function-grid {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;

  .function-item {
    flex: 1;
    background: #fff;
    border-radius: 24rpx;
    padding: 50rpx 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);

    .func-icon {
      font-size: 80rpx;
      margin-bottom: 20rpx;
    }

    .func-label {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
    }
  }
}

// 快捷拨打
.quick-call {
  margin: 50rpx 30rpx 0;
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;

  .section-title {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
    padding-left: 10rpx;
  }

  .call-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;

    .call-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx 24rpx;
      background: #F8F8F8;
      border-radius: 16rpx;

      .call-name {
        font-size: 36rpx;
        color: #333;
        font-weight: 500;
      }

      .call-btn {
        display: flex;
        align-items: center;
        gap: 10rpx;
        background: #4CAF50;
        padding: 20rpx 32rpx;
        border-radius: 50rpx;

        .call-icon {
          font-size: 32rpx;
        }

        .call-text {
          font-size: 32rpx;
          color: #fff;
          font-weight: 500;
        }
      }
    }
  }
}

// 底部提示
.footer-tip {
  text-align: center;
  margin-top: 40rpx;
  padding: 20rpx;

  .tip-text {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
