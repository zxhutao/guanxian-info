<template>
  <view class="container">
    <view class="header">
      <text class="title">我的职位</text>
    </view>

    <!-- 加载中 -->
    <view v-if="loading" class="loading-state">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 职位列表 -->
    <view v-else-if="jobList.length > 0" class="job-list">
      <view
        v-for="job in jobList"
        :key="job._id"
        class="job-card"
        @click="goJobDetail(job)"
      >
        <view class="job-header">
          <text class="job-title">{{ job.title }}</text>
          <view class="job-status" :class="getStatusClass(job.status)">
            {{ getStatusText(job.status) }}
          </view>
        </view>
        <view class="job-info">
          <text class="job-salary">{{ job.salary || '面议' }}</text>
          <text class="job-company">{{ job.company || '暂无公司' }}</text>
        </view>
        <view class="job-meta">
          <text class="job-location">{{ job.location || '冠县' }}</text>
          <text class="job-time">{{ formatTime(job.createTime) }}</text>
        </view>
        <view class="job-actions">
          <view class="action-btn edit-btn" @click.stop="editJob(job)">编辑</view>
          <view class="action-btn delete-btn" @click.stop="deleteJob(job)">删除</view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <text class="empty-icon">💼</text>
      <text class="empty-text">暂无职位记录</text>
      <text class="empty-hint">您发布的职位将显示在这里</text>
      <view class="publish-btn" @click="goPublish">去发布职位</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { callCloud } from '@/utils/cloud'

const loading = ref(false)
const jobList = ref([])

onShow(() => {
  loadMyJobs()
})

const loadMyJobs = async () => {
  loading.value = true
  try {
    const result = await callCloud('getUserData', {
      action: 'getMyJobs',
      data: { page: 1, pageSize: 50 }
    })
    if (result && result.code === 0) {
      jobList.value = result.data || []
    } else {
      uni.showToast({ title: result?.message || '获取失败', icon: 'none' })
    }
  } catch (err) {
    console.error('获取我的职位失败:', err)
    uni.showToast({ title: '获取数据失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  const map = { 1: 'status-active', 0: 'status-inactive', 2: 'status-expired' }
  return map[status] || 'status-inactive'
}

const getStatusText = (status) => {
  const map = { 1: '招聘中', 0: '已下架', 2: '已过期' }
  return map[status] || '审核中'
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(typeof time === 'object' ? time.$date || time : time)
  const now = new Date()
  const diff = now - date
  if (diff < 86400000) return '今天'
  if (diff < 86400000 * 7) return `${Math.floor(diff / 86400000)}天前`
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const goJobDetail = (job) => {
  uni.navigateTo({ url: `/pages/job/detail?id=${job._id}` })
}

const editJob = (job) => {
  // 跳转到发布页面，携带职位ID进行编辑
  uni.navigateTo({
    url: `/subpackages/publish/index?editId=${job._id}&type=job`
  })
}

const deleteJob = async (job) => {
  uni.showModal({
    title: '确认删除',
    content: '删除后无法恢复，确认删除该职位？',
    success: async (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '删除中...' })
        try {
          // 使用云函数删除记录
          const result = await wx.cloud.callFunction({
            name: 'deleteItem',
            data: {
              type: 'jobs',
              id: job._id
            }
          })
          
          if (result.result && result.result.code === 0) {
            uni.showToast({ title: '删除成功', icon: 'success' })
            jobList.value = jobList.value.filter(item => item._id !== job._id)
          } else {
            throw new Error(result.result?.message || '删除失败')
          }
        } catch (err) {
          console.error('删除职位失败:', err)
          uni.showToast({ title: err.message || '删除失败', icon: 'none' })
        } finally {
          uni.hideLoading()
        }
      }
    }
  })
}

const goPublish = () => {
  uni.navigateTo({ url: '/subpackages/publish/index' })
}
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

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.job-list {
  padding: 20rpx;
}

.job-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.job-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.job-status {
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  margin-left: 16rpx;
}

.status-active {
  background: #e8f5e9;
  color: #4caf50;
}

.status-inactive {
  background: #f5f5f5;
  color: #999;
}

.status-expired {
  background: #fff3e0;
  color: #ff9800;
}

.job-info {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.job-salary {
  font-size: 28rpx;
  color: #ff6b6b;
  font-weight: bold;
  margin-right: 20rpx;
}

.job-company {
  font-size: 26rpx;
  color: #666;
}

.job-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.job-location,
.job-time {
  font-size: 24rpx;
  color: #999;
}

.job-actions {
  display: flex;
  gap: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  padding-top: 20rpx;
}

.action-btn {
  flex: 1;
  text-align: center;
  font-size: 26rpx;
  padding: 16rpx;
  border-radius: 8rpx;
}

.edit-btn {
  background: #fff8e1;
  color: #ff9800;
}

.delete-btn {
  background: #fce4e4;
  color: #f44336;
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
  margin-bottom: 40rpx;
}

.publish-btn {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: #fff;
  font-size: 28rpx;
  padding: 20rpx 60rpx;
  border-radius: 40rpx;
}
</style>
