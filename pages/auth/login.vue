<template>
  <view class="login-page">
    <view class="logo-section">
      <image lazy-load class="logo-img" src="/static/images/logo.png" mode="aspectFit" />
      <text class="app-name">冠帮帮</text>
      <text class="slogan">冠县人必备的生活入口</text>
    </view>

    <view class="login-section">
      <button class="login-btn wechat" @click="handleWechatLogin">
        <text class="btn-icon">💬</text>
        <text class="btn-text">微信授权登录</text>
      </button>

      <button class="login-btn phone" @click="handlePhoneLogin">
        <text class="btn-icon">📱</text>
        <text class="btn-text">手机号登录</text>
      </button>
    </view>

    <view class="agreement">
      <text>登录即表示同意</text>
      <text class="link">《用户协议》</text>
      <text>和</text>
      <text class="link">《隐私政策》</text>
    </view>

    <!-- 手机号登录弹窗 -->
    <view class="phone-mask" v-if="showPhoneLogin" @click="showPhoneLogin = false">
      <view class="phone-popup" @click.stop>
        <view class="popup-title">手机号登录</view>
        <input class="phone-input" placeholder="请输入手机号" type="number" />
        <input class="code-input" placeholder="请输入验证码" type="number" />
        <button class="login-btn-submit">登录</button>
        <view class="popup-close" @click="showPhoneLogin = false">×</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const showPhoneLogin = ref(false)

// 微信登录
const handleWechatLogin = async () => {
  try {
    await userStore.login()

    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    // 延迟返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    // 登录失败已由 store 处理
    console.error('登录失败:', e)
  }
}

// 手机号登录（暂未实现）
const handlePhoneLogin = () => {
  uni.showToast({
    title: '手机号登录暂未开放',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #E63946 0%, #f5f5f5 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150rpx;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100rpx;

  .logo-img {
    width: 160rpx;
    height: 160rpx;
    border-radius: 30rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.15);
  }

  .logo {
    width: 180rpx;
    height: 180rpx;
    background: #fff;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);
  }

  .app-name {
    font-size: 48rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 16rpx;
  }

  .slogan {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.login-section {
  width: 600rpx;
  display: flex;
  flex-direction: column;
  gap: 30rpx;

  .login-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20rpx;
    padding: 30rpx;
    border-radius: 50rpx;
    font-size: 32rpx;
    border: none;

    &.wechat {
      background: #07C160;
      color: #fff;
    }

    &.phone {
      background: #fff;
      color: #333;
    }

    .btn-icon {
      font-size: 40rpx;
    }
  }
}

.agreement {
  margin-top: 60rpx;
  font-size: 24rpx;
  color: #fff;

  .link {
    color: #fff;
    text-decoration: underline;
  }
}

.phone-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.phone-popup {
  width: 600rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 50rpx;
  position: relative;

  .popup-title {
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
    margin-bottom: 50rpx;
  }

  .phone-input, .code-input {
    width: 100%;
    padding: 24rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    margin-bottom: 30rpx;
    font-size: 30rpx;
  }

  .login-btn-submit {
    width: 100%;
    padding: 24rpx;
    background: #E63946;
    color: #fff;
    border-radius: 50rpx;
    font-size: 32rpx;
    border: none;
  }

  .popup-close {
    position: absolute;
    top: 20rpx;
    right: 30rpx;
    font-size: 50rpx;
    color: #999;
  }
}
</style>
