<template>
  <view class="points-page">
    <!-- 积分概览 -->
    <view class="points-header">
      <view class="points-bg"></view>
      <view class="points-content">
        <view class="points-total">
          <text class="label">我的积分</text>
          <text class="value">{{ totalPoints }}</text>
        </view>
        <view class="points-tips">
          <view class="tip-item">
            <text class="tip-value plus">+{{ monthEarned }}</text>
            <text class="tip-label">本月获取</text>
          </view>
          <view class="tip-divider"></view>
          <view class="tip-item">
            <text class="tip-value minus">-{{ monthUsed }}</text>
            <text class="tip-label">本月使用</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 积分规则 -->
    <view class="rules-card">
      <view class="rules-header">
        <text class="rules-title">积分规则</text>
      </view>
      <view class="rules-list">
        <view class="rule-item">
          <view class="rule-left">
            <text class="rule-name">每日签到</text>
            <text class="rule-desc">连续签到额外奖励</text>
          </view>
          <text class="rule-points plus">+5~15</text>
        </view>
        <view class="rule-item">
          <view class="rule-left">
            <text class="rule-name">完成服务预约</text>
            <text class="rule-desc">服务完成后获得</text>
          </view>
          <text class="rule-points plus">+20~100</text>
        </view>
        <view class="rule-item">
          <view class="rule-left">
            <text class="rule-name">分享小程序</text>
            <text class="rule-desc">每次分享成功</text>
          </view>
          <text class="rule-points plus">+5</text>
        </view>
        <view class="rule-item">
          <view class="rule-left">
            <text class="rule-name">积分兑换服务</text>
            <text class="rule-desc">消耗积分抵用</text>
          </view>
          <text class="rule-points minus">-100起</text>
        </view>
      </view>
    </view>

    <!-- 积分明细 -->
    <view class="records-section">
      <view class="section-header">
        <text class="section-title">积分明细</text>
        <view class="filter-tabs">
          <view 
            v-for="tab in tabs" 
            :key="tab.key"
            class="filter-tab"
            :class="{ active: currentTab === tab.key }"
            @click="currentTab = tab.key"
          >
            {{ tab.name }}
          </view>
        </view>
      </view>

      <view class="records-list">
        <view 
          v-for="record in filteredRecords" 
          :key="record.id"
          class="record-item"
        >
          <view class="record-icon" :class="record.type">
            <u-icon :name="record.icon" size="32rpx" color="#fff" />
          </view>
          <view class="record-info">
            <text class="record-title">{{ record.title }}</text>
            <text class="record-date">{{ record.date }}</text>
          </view>
          <view class="record-points" :class="record.type">
            <text>{{ record.points > 0 ? '+' : '' }}{{ record.points }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="filteredRecords.length === 0">
        <text>暂无记录</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-actions">
      <view class="action-btn sign" @click="dailySign">
        <u-icon name="clock" size="32rpx" color="#fff" />
        <text>{{ signedToday ? '已签到' : '去签到' }}</text>
        <view class="sign-badge" v-if="!signedToday">领积分</view>
      </view>
      <view class="action-btn task" @click="viewTasks">
        <u-icon name="checkbox-marked" size="32rpx" color="#fff" />
        <text>积分任务</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { callCloud } from '@/utils/cloud'

const totalPoints = ref(0)
const monthEarned = ref(0)
const monthUsed = ref(0)
const signedToday = ref(false)
const currentTab = ref('all')
const loading = ref(true)

const tabs = [
  { key: 'all', name: '全部' },
  { key: 'earn', name: '获取' },
  { key: 'use', name: '使用' }
]

const records = ref([])

const filteredRecords = computed(() => {
  if (currentTab.value === 'all') return records.value
  if (currentTab.value === 'earn') return records.value.filter(r => r.type === 'earn')
  return records.value.filter(r => r.type === 'use')
})

// 加载积分数据
const loadPointsData = async () => {
  loading.value = true
  try {
    // 获取积分基本信息
    const res = await callCloud('checkin', { action: 'getPointsInfo' })
    if (res && res.code === 0) {
      const d = res.data
      totalPoints.value = d.points || 0

      // 获取今日签到状态
      const statusRes = await callCloud('checkin', { action: 'getCheckinStatus' })
      if (statusRes && statusRes.code === 0) {
        signedToday.value = statusRes.data.hasCheckinToday || false
      }

      // 处理积分明细
      const logs = d.recentLogs || []
      const now = new Date()
      const thisMonth = now.getMonth() + 1
      const thisYear = now.getFullYear()
      let earned = 0
      let used = 0

      records.value = logs.map((log, idx) => {
        const isEarn = log.points > 0
        const createTime = log.createTime
        let dateStr = ''
        if (createTime) {
          const d2 = new Date(createTime)
          dateStr = `${d2.getFullYear()}-${String(d2.getMonth()+1).padStart(2,'0')}-${String(d2.getDate()).padStart(2,'0')} ${String(d2.getHours()).padStart(2,'0')}:${String(d2.getMinutes()).padStart(2,'0')}`
          // 统计本月
          if (d2.getFullYear() === thisYear && (d2.getMonth()+1) === thisMonth) {
            if (isEarn) earned += log.points
            else used += Math.abs(log.points)
          }
        }
        return {
          id: log._id || idx,
          type: isEarn ? 'earn' : 'use',
          icon: log.type === 'checkin' ? 'clock' : (isEarn ? 'red-packet' : 'coupon'),
          title: log.title || (isEarn ? '积分获取' : '积分使用'),
          date: dateStr,
          points: log.points
        }
      })

      monthEarned.value = earned
      monthUsed.value = used
    }
  } catch (e) {
    console.error('加载积分数据失败', e)
    // 云端失败时尝试读本地缓存
    const local = uni.getStorageSync('checkin_data')
    if (local) {
      totalPoints.value = local.points || 0
    }
  } finally {
    loading.value = false
  }
}

onShow(() => {
  loadPointsData()
})

const dailySign = () => {
  uni.navigateTo({ url: '/pages/checkin/index' })
}

const viewTasks = () => {
  uni.showToast({ title: '积分任务开发中', icon: 'none' })
}
</script>

<style scoped>
.points-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 160rpx;
}

.points-header {
  position: relative;
  padding: 40rpx 30rpx 60rpx;
}

.points-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 0 40rpx 40rpx;
}

.points-content {
  position: relative;
  z-index: 1;
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
}

.points-total {
  text-align: center;
  margin-bottom: 30rpx;
}

.points-total .label {
  font-size: 28rpx;
  color: #999;
  display: block;
  margin-bottom: 10rpx;
}

.points-total .value {
  font-size: 72rpx;
  font-weight: 700;
  color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.points-tips {
  display: flex;
  justify-content: center;
  gap: 60rpx;
}

.tip-item {
  text-align: center;
}

.tip-value {
  font-size: 36rpx;
  font-weight: 600;
  display: block;
}

.tip-value.plus { color: #4CAF50; }
.tip-value.minus { color: #E63946; }

.tip-label {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-top: 4rpx;
}

.tip-divider {
  width: 2rpx;
  height: 60rpx;
  background: #eee;
}

.rules-card {
  margin: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.rules-header {
  margin-bottom: 20rpx;
}

.rules-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.rule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rule-left {
  flex: 1;
}

.rule-name {
  font-size: 28rpx;
  color: #333;
  display: block;
}

.rule-desc {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-top: 4rpx;
}

.rule-points {
  font-size: 28rpx;
  font-weight: 600;
}

.rule-points.plus { color: #4CAF50; }
.rule-points.minus { color: #E63946; }

.records-section {
  margin: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.filter-tabs {
  display: flex;
  gap: 10rpx;
}

.filter-tab {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #666;
  background: #f5f5f5;
}

.filter-tab.active {
  background: #667eea;
  color: #fff;
}

.records-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.record-item:last-child {
  border-bottom: none;
}

.record-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.record-icon.earn { background: linear-gradient(135deg, #4CAF50, #81C784); }
.record-icon.use { background: linear-gradient(135deg, #FF9800, #FFB74D); }

.record-info {
  flex: 1;
  margin-left: 16rpx;
}

.record-title {
  font-size: 28rpx;
  color: #333;
  display: block;
}

.record-date {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-top: 4rpx;
}

.record-points {
  font-size: 32rpx;
  font-weight: 600;
}

.record-points.earn { color: #4CAF50; }
.record-points.use { color: #E63946; }

.empty-state {
  text-align: center;
  padding: 60rpx;
  color: #999;
  font-size: 28rpx;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 24rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  color: #fff;
  position: relative;
}

.action-btn.sign {
  background: linear-gradient(135deg, #4CAF50, #81C784);
}

.action-btn.task {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.sign-badge {
  position: absolute;
  top: -10rpx;
  right: 30rpx;
  background: #E63946;
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}
</style>
