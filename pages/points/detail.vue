<template>
  <view class="points-detail-container">
    <!-- 积分头部 -->
    <view class="points-header">
      <view class="points-card">
        <text class="label">我的积分</text>
        <text class="points-value">{{ userPoints.points || 0 }}</text>
        <view class="points-level">
          <text class="level-tag">Lv.{{ userPoints.level || 1 }}</text>
          <text class="level-name">{{ levelName }}</text>
        </view>
      </view>
      
      <!-- 统计 -->
      <view class="points-stats">
        <view class="stat-item">
          <text class="stat-value">{{ userPoints.totalEarned || 0 }}</text>
          <text class="stat-label">累计获得</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ userPoints.totalUsed || 0 }}</text>
          <text class="stat-label">累计使用</text>
        </view>
      </view>
    </view>
    
    <!-- 功能入口 -->
    <view class="feature-grid">
      <view class="feature-item" @click="goToMall">
        <text class="feature-icon">🎁</text>
        <text class="feature-name">积分商城</text>
      </view>
      <view class="feature-item" @click="goToProps">
        <text class="feature-icon">🎫</text>
        <text class="feature-name">我的道具</text>
      </view>
      <view class="feature-item" @click="goToRules">
        <text class="feature-icon">📋</text>
        <text class="feature-name">积分规则</text>
      </view>
      <view class="feature-item" @click="goToCheckin">
        <text class="feature-icon">📅</text>
        <text class="feature-name">每日签到</text>
      </view>
    </view>
    
    <!-- 明细列表 -->
    <view class="detail-section">
      <view class="section-header">
        <text class="section-title">积分明细</text>
        <view class="filter-tabs">
          <text 
            v-for="tab in tabs" 
            :key="tab.value"
            class="tab-item"
            :class="{ active: currentTab === tab.value }"
            @click="switchTab(tab.value)"
          >
            {{ tab.label }}
          </text>
        </view>
      </view>
      
      <view class="detail-list">
        <view 
          v-for="item in detailList" 
          :key="item._id"
          class="detail-item"
        >
          <view class="item-left">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-time">{{ formatTime(item.createTime) }}</text>
          </view>
          <view class="item-right">
            <text class="item-points" :class="{ income: item.type === 'income' }">
              {{ item.type === 'income' ? '+' : '-' }}{{ item.points }}
            </text>
            <text class="item-balance">余额: {{ item.balance }}</text>
          </view>
        </view>
        
        <!-- 空状态 -->
        <view v-if="detailList.length === 0" class="empty-state">
          <text class="empty-icon">📭</text>
          <text class="empty-text">暂无积分记录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 用户积分数据
const userPoints = ref({
  points: 1580,
  level: 2,
  totalEarned: 3580,
  totalUsed: 2000
})

// 等级名称
const levelName = computed(() => {
  const names = ['青铜', '白银', '黄金', '铂金', '钻石']
  return names[(userPoints.value.level || 1) - 1] || '青铜'
})

// 标签页
const tabs = [
  { label: '全部', value: 'all' },
  { label: '收入', value: 'income' },
  { label: '支出', value: 'expense' }
]
const currentTab = ref('all')

// 明细列表
const detailList = ref([
  {
    _id: '1',
    title: '每日签到',
    type: 'income',
    points: 10,
    balance: 1580,
    createTime: Date.now() - 3600000
  },
  {
    _id: '2',
    title: '发布招聘信息',
    type: 'expense',
    points: 500,
    balance: 1570,
    createTime: Date.now() - 86400000
  },
  {
    _id: '3',
    title: '连续签到7天奖励',
    type: 'income',
    points: 50,
    balance: 2070,
    createTime: Date.now() - 172800000
  }
])

// 切换标签
const switchTab = (tab) => {
  currentTab.value = tab
  loadDetailList()
}

// 加载明细列表
const loadDetailList = async () => {
  // 这里调用云函数获取数据
  // const res = await uniCloud.callFunction({
  //   name: 'point-deduct',
  //   data: { action: 'getPointDetail', type: currentTab.value }
  // })
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 页面跳转
const goToMall = () => {
  uni.navigateTo({ url: '/pages/points/mall' })
}

const goToProps = () => {
  uni.navigateTo({ url: '/pages/points/props' })
}

const goToRules = () => {
  uni.navigateTo({ url: '/pages/points/rules' })
}

const goToCheckin = () => {
  uni.navigateTo({ url: '/pages/checkin/index' })
}

onMounted(() => {
  loadDetailList()
})
</script>

<style scoped>
.points-detail-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.points-header {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  padding: 40rpx 30rpx;
  color: #fff;
}

.points-card {
  text-align: center;
  margin-bottom: 40rpx;
}

.label {
  font-size: 28rpx;
  opacity: 0.9;
  display: block;
  margin-bottom: 10rpx;
}

.points-value {
  font-size: 80rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.points-level {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}

.level-tag {
  background: rgba(255,255,255,0.3);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.level-name {
  font-size: 28rpx;
}

.points-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 30rpx;
  border-top: 1rpx solid rgba(255,255,255,0.3);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  opacity: 0.8;
}

.feature-grid {
  display: flex;
  background: #fff;
  padding: 30rpx 0;
  margin-bottom: 20rpx;
}

.feature-item {
  flex: 1;
  text-align: center;
}

.feature-icon {
  font-size: 48rpx;
  display: block;
  margin-bottom: 10rpx;
}

.feature-name {
  font-size: 26rpx;
  color: #333;
}

.detail-section {
  background: #fff;
  min-height: 600rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.filter-tabs {
  display: flex;
  gap: 30rpx;
}

.tab-item {
  font-size: 28rpx;
  color: #999;
  padding: 10rpx 0;
}

.tab-item.active {
  color: #FF6B6B;
  border-bottom: 4rpx solid #FF6B6B;
}

.detail-list {
  padding: 0 30rpx;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.item-left {
  flex: 1;
}

.item-title {
  font-size: 30rpx;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.item-time {
  font-size: 24rpx;
  color: #999;
}

.item-right {
  text-align: right;
}

.item-points {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 6rpx;
}

.item-points.income {
  color: #52C41A;
}

.item-balance {
  font-size: 24rpx;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>