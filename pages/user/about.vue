<template>
  <view class="about-page">
    <!-- Logo和名称 -->
    <view class="app-info">
      <image class="app-logo" src="/static/images/logo.png" mode="aspectFit" />
      <view class="app-name">冠帮帮</view>
      <view class="app-slogan">冠县人必备的生活入口</view>
      <view class="app-version">版本 1.0.0</view>
    </view>

    <!-- 功能介绍 -->
    <view class="section-card">
      <view class="section-title">平台介绍</view>
      <view class="intro-text">
        冠帮帮是专为冠县本地居民打造的综合生活服务平台。无论您是找工作的求职者、需要生活服务的居民，还是为老人寻找合适护工的家属，我们都能为您提供便捷、可靠的服务。
      </view>
      <view class="feature-grid">
        <view class="feature-item">
          <view class="feature-icon" style="background: #FFF0F0;">
            <text>💼</text>
          </view>
          <view class="feature-name">找工作</view>
          <view class="feature-desc">海量本地岗位</view>
        </view>
        <view class="feature-item">
          <view class="feature-icon" style="background: #E3F2FD;">
            <text>🔧</text>
          </view>
          <view class="feature-name">生活服务</view>
          <view class="feature-desc">专业上门服务</view>
        </view>
        <view class="feature-item">
          <view class="feature-icon" style="background: #E8F5E9;">
            <text>👴</text>
          </view>
          <view class="feature-name">养老护理</view>
          <view class="feature-desc">优质护工推荐</view>
        </view>
        <view class="feature-item">
          <view class="feature-icon" style="background: #FFF3E0;">
            <text>📰</text>
          </view>
          <view class="feature-name">本地资讯</view>
          <view class="feature-desc">一手冠县动态</view>
        </view>
      </view>
    </view>

    <!-- 联系我们 -->
    <view class="section-card">
      <view class="section-title">联系我们</view>
      <view class="contact-list">
        <view class="contact-item" @click="callPhone">
          <view class="contact-icon">
            <u-icon name="phone" size="32rpx" color="#E63946" />
          </view>
          <view class="contact-info">
            <view class="contact-label">客服电话</view>
            <view class="contact-value">0635-8888888</view>
          </view>
          <u-icon name="arrow-right" size="28rpx" color="#ccc" />
        </view>
        <view class="contact-item" @click="copyWechat">
          <view class="contact-icon">
            <u-icon name="chat" size="32rpx" color="#4CAF50" />
          </view>
          <view class="contact-info">
            <view class="contact-label">微信号</view>
            <view class="contact-value">guanxian_xinxigang</view>
          </view>
          <view class="copy-btn">复制</view>
        </view>
        <view class="contact-item" @click="copyEmail">
          <view class="contact-icon">
            <u-icon name="email" size="32rpx" color="#2196F3" />
          </view>
          <view class="contact-info">
            <view class="contact-label">联系邮箱</view>
            <view class="contact-value">service@guanxian.com</view>
          </view>
          <view class="copy-btn">复制</view>
        </view>
        <view class="contact-item">
          <view class="contact-icon">
            <u-icon name="map" size="32rpx" color="#FF9800" />
          </view>
          <view class="contact-info">
            <view class="contact-label">办公地址</view>
            <view class="contact-value">山东省聊城市冠县</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 法律信息 -->
    <view class="section-card">
      <view class="section-title">法律信息</view>
      <view class="legal-list">
        <view class="legal-item" @click="viewAgreement('privacy')">
          <text>隐私政策</text>
          <u-icon name="arrow-right" size="24rpx" color="#ccc" />
        </view>
        <view class="legal-item" @click="viewAgreement('terms')">
          <text>用户协议</text>
          <u-icon name="arrow-right" size="24rpx" color="#ccc" />
        </view>
      </view>
    </view>

    <!-- 底部 -->
    <view class="footer">
      <view class="copyright">Copyright 2026 冠帮帮</view>
      <view class="icp">鲁ICP备XXXXXXXX号</view>
    </view>
  </view>
</template>

<script setup>
import { makePhoneCall, copyText } from '@/utils/index'

const callPhone = () => {
  makePhoneCall('06358888888')
}

const copyWechat = () => {
  copyText('guanxian_xinxigang')
}

const copyEmail = () => {
  copyText('service@guanxian.com')
}

const viewAgreement = (type) => {
  const titleMap = { privacy: '隐私政策', terms: '用户协议' }
  uni.showToast({ title: `${titleMap[type]}页面开发中`, icon: 'none' })
}
</script>

<style lang="scss" scoped>
.about-page {
  min-height: 100vh;
  background: #F5F5F5;
}

.app-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 30rpx 40rpx;
  background: #fff;

  .app-logo {
    width: 140rpx;
    height: 140rpx;
    border-radius: 28rpx;
    margin-bottom: 20rpx;
  }

  .app-name {
    font-size: 40rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 10rpx;
  }

  .app-slogan {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 10rpx;
  }

  .app-version {
    font-size: 24rpx;
    color: #ccc;
    padding: 4rpx 20rpx;
    background: #f5f5f5;
    border-radius: 20rpx;
  }
}

.section-card {
  background: #fff;
  padding: 30rpx;
  margin: 20rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 20rpx;
  }
}

.intro-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
  margin-bottom: 24rpx;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;

  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;

    .feature-icon {
      width: 88rpx;
      height: 88rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      text {
        font-size: 40rpx;
      }
    }

    .feature-name {
      font-size: 24rpx;
      color: #333;
      font-weight: 500;
    }

    .feature-desc {
      font-size: 20rpx;
      color: #999;
    }
  }
}

.contact-list {
  .contact-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
    gap: 16rpx;

    &:last-child {
      border-bottom: none;
    }

    .contact-icon {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      background: #F5F5F5;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .contact-info {
      flex: 1;

      .contact-label {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 4rpx;
      }

      .contact-value {
        font-size: 28rpx;
        color: #333;
      }
    }

    .copy-btn {
      padding: 8rpx 24rpx;
      background: #F5F5F5;
      color: #666;
      font-size: 24rpx;
      border-radius: 24rpx;
    }
  }
}

.legal-list {
  .legal-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
    font-size: 28rpx;
    color: #333;

    &:last-child {
      border-bottom: none;
    }
  }
}

.footer {
  text-align: center;
  padding: 40rpx 0 60rpx;

  .copyright {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 8rpx;
  }

  .icp {
    font-size: 22rpx;
    color: #ccc;
  }
}
</style>
