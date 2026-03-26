<template>
  <view class="container">
    <view class="header">
      <text class="title">微信云开发连接测试</text>
    </view>
    
    <view class="card">
      <text class="card-title">测试步骤</text>
      <view class="step">
        <text class="step-number">1</text>
        <text class="step-text">重启微信开发者工具</text>
      </view>
      <view class="step">
        <text class="step-number">2</text>
        <text class="step-text">确认AppID：{{ appId }}</text>
      </view>
      <view class="step">
        <text class="step-number">3</text>
        <text class="step-text">点击下方的测试按钮</text>
      </view>
    </view>
    
    <view class="card">
      <text class="card-title">云开发配置检查</text>
      <view class="config-item">
        <text class="config-label">云函数目录：</text>
        <text class="config-value" :class="{ success: config.cloudfunctionRoot === 'uniCloud-tcb/cloudfunctions/' }">
          {{ config.cloudfunctionRoot }}
        </text>
        <text class="config-icon" v-if="config.cloudfunctionRoot === 'uniCloud-tcb/cloudfunctions/'">✅</text>
        <text class="config-icon" v-else>❌</text>
      </view>
      <view class="config-item">
        <text class="config-label">环境ID：</text>
        <text class="config-value">{{ config.envId || '未配置' }}</text>
      </view>
      <view class="config-item">
        <text class="config-label">云开发状态：</text>
        <text class="config-value status" :class="cloudStatusClass">{{ cloudStatus }}</text>
      </view>
    </view>
    
    <view class="actions">
      <button class="btn btn-primary" @tap="testConnection">
        <text class="btn-text">测试云开发连接</text>
      </button>
      <button class="btn btn-secondary" @tap="checkConfig">
        <text class="btn-text">检查配置文件</text>
      </button>
    </view>
    
    <view class="result-card" v-if="testResult">
      <text class="card-title">测试结果</text>
      <view class="result-item" v-for="(item, index) in testResult" :key="index">
        <text class="result-icon">{{ item.success ? '✅' : '❌' }}</text>
        <text class="result-text">{{ item.message }}</text>
      </view>
    </view>
    
    <view class="card troubleshooting">
      <text class="card-title">常见问题排查</text>
      <view class="tip">
        <text class="tip-title">1. 云开发图标灰色/无法点击</text>
        <text class="tip-content">- AppID：{{ appId }} 需要在微信公众平台开通云开发</text>
      </view>
      <view class="tip">
        <text class="tip-title">2. 提示"环境不存在"</text>
        <text class="tip-content">- 确认环境ID：cloudbase-1gkioadld4516142</text>
        <text class="tip-content">- 或重新创建微信云开发环境</text>
      </view>
      <view class="tip">
        <text class="tip-title">3. 获取帮助</text>
        <text class="tip-content">- 查看详细文档：WECHAT_DEVELOPER_TOOL_CLOUD_DEBUG.md</text>
        <text class="tip-content">- 检查控制台错误信息</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const appId = ref('wx9a6299503beaac19')
const config = ref({
  cloudfunctionRoot: '',
  envId: 'cloudbase-1gkioadld4516142'
})
const cloudStatus = ref('未检测')
const cloudStatusClass = ref('status-unknown')
const testResult = ref([])

onMounted(() => {
  // 读取配置信息（实际项目中从project.config.json读取）
  config.value.cloudfunctionRoot = 'uniCloud-tcb/cloudfunctions/'
  
  // 检查微信云开发环境
  checkCloudEnvironment()
})

const checkCloudEnvironment = () => {
  if (typeof wx !== 'undefined' && wx.cloud) {
    cloudStatus.value = '云开发可用'
    cloudStatusClass.value = 'status-success'
  } else {
    cloudStatus.value = '云开发不可用'
    cloudStatusClass.value = 'status-error'
  }
}

const testConnection = () => {
  testResult.value = []
  
  // 测试1：检查wx.cloud对象
  if (typeof wx !== 'undefined' && wx.cloud) {
    testResult.value.push({
      success: true,
      message: 'wx.cloud对象存在'
    })
    
    // 初始化云开发
    try {
      wx.cloud.init({
        env: config.value.envId,
        traceUser: true
      })
      
      testResult.value.push({
        success: true,
        message: '云开发环境初始化成功'
      })
      
      // 测试云函数调用
      wx.cloud.callFunction({
        name: 'getUserInfo',
        data: {},
        success: (res) => {
          testResult.value.push({
            success: true,
            message: '云函数调用成功'
          })
          uni.showToast({ title: '连接测试成功', icon: 'success' })
        },
        fail: (err) => {
          testResult.value.push({
            success: false,
            message: `云函数调用失败: ${err.errCode || '未知错误'}`
          })
          uni.showToast({ title: '函数调用失败', icon: 'none' })
        }
      })
    } catch (error) {
      testResult.value.push({
        success: false,
        message: `初始化异常: ${error.message}`
      })
    }
  } else {
    testResult.value.push({
      success: false,
      message: 'wx.cloud对象不存在'
    })
    uni.showToast({ title: '云开发不可用', icon: 'none' })
  }
}

const checkConfig = () => {
  uni.showModal({
    title: '配置检查结果',
    content: `云函数目录：${config.value.cloudfunctionRoot}\n环境ID：${config.value.envId}\n云开发状态：${cloudStatus.value}`,
    showCancel: false
  })
}
</script>

<style scoped>
.container {
  padding: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  margin-bottom: 40rpx;
  text-align: center;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}

.card {
  background-color: white;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
  display: block;
}

.step {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.step-number {
  width: 48rpx;
  height: 48rpx;
  background-color: #1989fa;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  margin-right: 20rpx;
}

.step-text {
  font-size: 32rpx;
  color: #555;
}

.config-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.config-label {
  font-size: 28rpx;
  color: #666;
  min-width: 200rpx;
}

.config-value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.config-value.success {
  color: #07c160;
  font-weight: 500;
}

.config-icon {
  margin-left: 10rpx;
  font-size: 28rpx;
}

.status {
  font-weight: 500;
}

.status-success {
  color: #07c160;
}

.status-error {
  color: #ee0a24;
}

.status-unknown {
  color: #ff976a;
}

.actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 32rpx;
}

.btn-primary {
  background-color: #1989fa;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
}

.btn-text {
  color: white;
  font-size: 32rpx;
}

.btn-secondary .btn-text {
  color: #333;
}

.result-card {
  background-color: white;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-top: 24rpx;
}

.result-item {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.result-icon {
  margin-right: 12rpx;
  font-size: 28rpx;
}

.result-text {
  font-size: 28rpx;
  color: #333;
}

.troubleshooting .tip {
  margin-bottom: 24rpx;
}

.tip-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.tip-content {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-left: 40rpx;
  margin-bottom: 4rpx;
}
</style>