<template>
  <view class="init-page">
    <view class="header">
      <text class="title">数据初始化</text>
      <text class="desc">首次使用需要初始化示例数据</text>
    </view>

    <view class="content">
      <view class="step-list">
        <view class="step">
          <view class="step-num">1</view>
          <view class="step-info">
            <text class="step-title">初始化职位数据</text>
            <text class="step-desc">添加示例职位：工厂、物流、纺织等</text>
          </view>
          <view :class="['step-status', { done: jobDone }]">
            {{ jobDone ? '✓' : '' }}
          </view>
        </view>

        <view class="step">
          <view class="step-num">2</view>
          <view class="step-info">
            <text class="step-title">初始化服务数据</text>
            <text class="step-desc">添加示例服务：家政、维修、搬家等</text>
          </view>
          <view :class="['step-status', { done: serviceDone }]">
            {{ serviceDone ? '✓' : '' }}
          </view>
        </view>

        <view class="step">
          <view class="step-num">3</view>
          <view class="step-info">
            <text class="step-title">初始化护工数据</text>
            <text class="step-desc">添加示例护工信息</text>
          </view>
          <view :class="['step-status', { done: workerDone }]">
            {{ workerDone ? '✓' : '' }}
          </view>
        </view>
      </view>

      <view class="btn-area">
        <button class="init-btn" @click="onInit" :disabled="loading">
          <text v-if="loading">初始化中...</text>
          <text v-else-if="allDone">已完成</text>
          <text v-else>开始初始化</text>
        </button>

        <button class="skip-btn" @click="onSkip" v-if="!allDone">
          <text>跳过，稍后手动初始化</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { callCloudFunction, CLOUD_FUNCTIONS } from '../../utils/cloud.js'

const loading = ref(false)
const jobDone = ref(false)
const serviceDone = ref(false)
const workerDone = ref(false)

const allDone = computed(() => jobDone.value && serviceDone.value && workerDone.value)

async function onInit() {
  if (loading.value || allDone.value) return

  loading.value = true
  uni.showLoading({ title: '初始化中...' })

  try {
    // 初始化职位和服务数据
    const res = await callCloudFunction(CLOUD_FUNCTIONS.INIT_DATA)
    if (res.success) {
      jobDone.value = true
    }

    const res2 = await callCloudFunction(CLOUD_FUNCTIONS.INIT_SERVICES)
    if (res2.success) {
      serviceDone.value = true
      workerDone.value = true
    }

    uni.hideLoading()

    if (allDone.value) {
      uni.showToast({ title: '初始化成功！', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  } catch (e) {
    uni.hideLoading()
    console.error('初始化失败:', e)
    uni.showToast({ title: '初始化失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function onSkip() {
  uni.navigateBack()
}
</script>

<script>
import { computed } from 'vue'
export default {
  setup() {
    return { computed }
  }
}
</script>

<style lang="scss" scoped>
.init-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 40rpx 30rpx;
}

.header {
  text-align: center;
  margin-bottom: 60rpx;

  .title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
  }

  .desc {
    font-size: 28rpx;
    color: #999;
  }
}

.content {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
}

.step-list {
  margin-bottom: 60rpx;
}

.step {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .step-num {
    width: 60rpx;
    height: 60rpx;
    background: #E63946;
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 28rpx;
    font-weight: bold;
    margin-right: 24rpx;
  }

  .step-info {
    flex: 1;

    .step-title {
      display: block;
      font-size: 30rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 8rpx;
    }

    .step-desc {
      font-size: 24rpx;
      color: #999;
    }
  }

  .step-status {
    width: 48rpx;
    height: 48rpx;
    border: 2rpx solid #ddd;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    color: #4CAF50;

    &.done {
      background: #E8F5E9;
      border-color: #4CAF50;
    }
  }
}

.btn-area {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.init-btn {
  height: 88rpx;
  background: #E63946;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;

  &[disabled] {
    background: #ccc;
  }
}

.skip-btn {
  background: transparent;
  border: none;
  padding: 0;

  text {
    color: #999;
    font-size: 26rpx;
  }
}
</style>
