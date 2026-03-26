<template>
  <view class="container">
    <view class="header">
      <text class="title">我的预约</text>
    </view>

    <!-- 状态筛选 -->
    <view class="filter-tabs">
      <view
        v-for="tab in statusTabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: currentStatus === tab.value }"
        @click="switchStatus(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 加载中 -->
    <view v-if="loading" class="loading-state">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 预约列表 -->
    <view v-else-if="bookingList.length > 0" class="booking-list">
      <view
        v-for="booking in bookingList"
        :key="booking._id"
        class="booking-card"
      >
        <view class="booking-header">
          <text class="booking-title">{{ booking.serviceName || booking.workerName || '预约服务' }}</text>
          <view class="booking-status" :class="getStatusClass(booking.status)">
            {{ getStatusText(booking.status) }}
          </view>
        </view>
        <view class="booking-info">
          <view class="info-row">
            <text class="info-label">预约时间</text>
            <text class="info-value">{{ formatBookingTime(booking.appointmentTime) }}</text>
          </view>
          <view class="info-row" v-if="booking.address">
            <text class="info-label">服务地址</text>
            <text class="info-value">{{ booking.address }}</text>
          </view>
          <view class="info-row" v-if="booking.remark">
            <text class="info-label">备注</text>
            <text class="info-value">{{ booking.remark }}</text>
          </view>
        </view>
        <view class="booking-meta">
          <text class="booking-time">{{ formatTime(booking.createTime) }} 预约</text>
        </view>
        <view class="booking-actions" v-if="booking.status === 'pending'">
          <view class="action-btn cancel-btn" @click="cancelBooking(booking)">取消预约</view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <text class="empty-icon">📅</text>
      <text class="empty-text">暂无预约记录</text>
      <text class="empty-hint">您预约的服务将显示在这里</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { callCloud } from '@/utils/cloud'

const loading = ref(false)
const bookingList = ref([])
const currentStatus = ref('')

const statusTabs = [
  { label: '全部', value: '' },
  { label: '待确认', value: 'pending' },
  { label: '已确认', value: 'confirmed' },
  { label: '已完成', value: 'done' },
  { label: '已取消', value: 'cancelled' }
]

onShow(() => {
  loadMyBookings()
})

const switchStatus = (status) => {
  currentStatus.value = status
  loadMyBookings()
}

const loadMyBookings = async () => {
  loading.value = true
  try {
    const result = await callCloud('getUserData', {
      action: 'getMyBookings',
      data: {
        page: 1,
        pageSize: 50,
        status: currentStatus.value
      }
    })
    if (result && result.code === 0) {
      bookingList.value = result.data || []
    } else {
      uni.showToast({ title: result?.message || '获取失败', icon: 'none' })
    }
  } catch (err) {
    console.error('获取预约记录失败:', err)
    uni.showToast({ title: '获取数据失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  const map = {
    pending: 'status-pending',
    confirmed: 'status-confirmed',
    done: 'status-done',
    cancelled: 'status-cancelled'
  }
  return map[status] || 'status-pending'
}

const getStatusText = (status) => {
  const map = {
    pending: '待确认',
    confirmed: '已确认',
    done: '已完成',
    cancelled: '已取消'
  }
  return map[status] || '处理中'
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

const formatBookingTime = (time) => {
  if (!time) return '待定'
  const date = new Date(typeof time === 'object' ? time.$date || time : time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const cancelBooking = (booking) => {
  uni.showModal({
    title: '取消预约',
    content: '确认取消该预约吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已取消', icon: 'success' })
        booking.status = 'cancelled'
      }
    }
  })
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

.filter-tabs {
  display: flex;
  background: #fff;
  padding: 0 10rpx;
  border-bottom: 1rpx solid #f0f0f0;
  overflow-x: auto;
}

.tab-item {
  flex-shrink: 0;
  padding: 24rpx 24rpx;
  font-size: 26rpx;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #ff6b6b;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background: #ff6b6b;
  border-radius: 2rpx;
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

.booking-list {
  padding: 20rpx;
}

.booking-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.booking-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.booking-status {
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  margin-left: 16rpx;
}

.status-pending {
  background: #fff8e1;
  color: #ff9800;
}

.status-confirmed {
  background: #e3f2fd;
  color: #2196f3;
}

.status-done {
  background: #e8f5e9;
  color: #4caf50;
}

.status-cancelled {
  background: #f5f5f5;
  color: #999;
}

.booking-info {
  margin-bottom: 16rpx;
}

.info-row {
  display: flex;
  margin-bottom: 10rpx;
}

.info-label {
  font-size: 24rpx;
  color: #999;
  width: 140rpx;
  flex-shrink: 0;
}

.info-value {
  font-size: 24rpx;
  color: #333;
  flex: 1;
}

.booking-meta {
  margin-bottom: 16rpx;
}

.booking-time {
  font-size: 22rpx;
  color: #bbb;
}

.booking-actions {
  border-top: 1rpx solid #f0f0f0;
  padding-top: 20rpx;
}

.action-btn {
  text-align: center;
  font-size: 26rpx;
  padding: 16rpx;
  border-radius: 8rpx;
}

.cancel-btn {
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
}
</style>
