<template>
  <view class="container">
    <view class="header">
      <text class="title">我的收藏</text>
    </view>
    
    <view class="empty-state">
      <text class="empty-icon">⭐</text>
      <text class="empty-text">暂无收藏</text>
      <text class="empty-hint">您收藏的内容将显示在这里</text>
    </view>
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'

onShow(() => {
  // 页面显示时的逻辑
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  padding: 40rpx 30rpx;
  text-align: center;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 16rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: #999;
}
</style>