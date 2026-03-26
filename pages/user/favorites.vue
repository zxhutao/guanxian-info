<template>
  <view class="container">
    <view class="header">
      <text class="title">我的收藏</text>
    </view>

    <!-- 分类标签 -->
    <view class="filter-tabs">
      <view
        v-for="tab in typeTabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: currentType === tab.value }"
        @click="switchType(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 加载中 -->
    <view v-if="loading" class="loading-state">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 收藏列表 -->
    <view v-else-if="favoriteList.length > 0" class="favorite-list">
      <view
        v-for="item in favoriteList"
        :key="item._id"
        class="favorite-card"
        @click="goDetail(item)"
      >
        <view class="card-left">
          <view class="card-type-badge" :class="getTypeClass(item.type)">
            {{ getTypeText(item.type) }}
          </view>
        </view>
        <view class="card-content">
          <text class="card-title">{{ item.targetTitle || item.title || '暂无标题' }}</text>
          <text class="card-desc">{{ item.targetDesc || item.description || '' }}</text>
          <view class="card-meta">
            <text class="card-time">{{ formatTime(item.createTime) }} 收藏</text>
          </view>
        </view>
        <view class="card-action" @click.stop="removeFavorite(item)">
          <text class="remove-icon">⭐</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <text class="empty-icon">⭐</text>
      <text class="empty-text">暂无收藏</text>
      <text class="empty-hint">您收藏的内容将显示在这里</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { callCloud } from '@/utils/cloud'

const loading = ref(false)
const favoriteList = ref([])
const currentType = ref('')

const typeTabs = [
  { label: '全部', value: '' },
  { label: '职位', value: 'job' },
  { label: '服务', value: 'service' },
  { label: '护工', value: 'worker' }
]

onShow(() => {
  loadMyFavorites()
})

const switchType = (type) => {
  currentType.value = type
  loadMyFavorites()
}

const loadMyFavorites = async () => {
  loading.value = true
  try {
    const result = await callCloud('getUserData', {
      action: 'getMyFavorites',
      data: {
        page: 1,
        pageSize: 50,
        type: currentType.value
      }
    })
    if (result && result.code === 0) {
      favoriteList.value = result.data || []
    } else {
      uni.showToast({ title: result?.message || '获取失败', icon: 'none' })
    }
  } catch (err) {
    console.error('获取收藏失败:', err)
    uni.showToast({ title: '获取数据失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const getTypeClass = (type) => {
  const map = { job: 'type-job', service: 'type-service', worker: 'type-worker' }
  return map[type] || 'type-job'
}

const getTypeText = (type) => {
  const map = { job: '职位', service: '服务', worker: '护工' }
  return map[type] || '其他'
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

const goDetail = (item) => {
  const routeMap = {
    job: `/pages/job/detail?id=${item.targetId}`,
    service: `/pages/service/detail?id=${item.targetId}`,
    worker: `/pages/nursing/detail?id=${item.targetId}`
  }
  const url = routeMap[item.type]
  if (url) {
    uni.navigateTo({ url })
  }
}

const removeFavorite = (item) => {
  uni.showModal({
    title: '取消收藏',
    content: '确认取消该收藏吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已取消收藏', icon: 'success' })
        favoriteList.value = favoriteList.value.filter(f => f._id !== item._id)
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
  padding: 0 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
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

.favorite-list {
  padding: 20rpx;
}

.favorite-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.card-left {
  margin-right: 20rpx;
  flex-shrink: 0;
}

.card-type-badge {
  font-size: 20rpx;
  padding: 6rpx 14rpx;
  border-radius: 20rpx;
}

.type-job {
  background: #e8f5e9;
  color: #4caf50;
}

.type-service {
  background: #e3f2fd;
  color: #2196f3;
}

.type-worker {
  background: #fff3e0;
  color: #ff9800;
}

.card-content {
  flex: 1;
  overflow: hidden;
}

.card-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8rpx;
}

.card-desc {
  display: block;
  font-size: 24rpx;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10rpx;
}

.card-meta {
  display: flex;
}

.card-time {
  font-size: 22rpx;
  color: #bbb;
}

.card-action {
  flex-shrink: 0;
  padding: 10rpx 20rpx;
}

.remove-icon {
  font-size: 40rpx;
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
