<template>
  <view class="app-container">
    <!-- 全局容器 -->
  </view>
</template>

<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

// const userStore = useUserStore()

onLaunch(() => {
  console.log('App Launch')
  // 检查登录状态
  // if (!userStore.isLoggedIn) {
  //   userStore.login()
  // }
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import '@/uni.scss';

// 全局样式
page {
  background-color: #f5f5f5;
  font-size: 28rpx;
  color: #333;
}

.app-container {
  width: 100%;
  min-height: 100vh;
}

// 通用工具类
.text-primary {
  color: #E63946;
}

.text-secondary {
  color: #666;
}

.text-grey {
  color: #999;
}

.bg-primary {
  background-color: #E63946;
  color: #fff;
}
</style>
