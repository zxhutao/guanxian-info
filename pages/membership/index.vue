<template>
  <view class="membership-page">
    <!-- 会员卡片 -->
    <view class="member-card">
      <view class="card-header">
        <image lazy-load class="avatar" src="/static/images/default-avatar.png" mode="aspectFill" />
        <view class="user-info">
          <text class="username">{{ userInfo.name || '冠帮帮用户' }}</text>
          <view class="member-badge" :class="memberLevel">
            <text>{{ memberLevelText }}</text>
          </view>
        </view>
      </view>
      
      <view class="card-body">
        <view class="stat-item">
          <text class="stat-value">{{ userInfo.points || 0 }}</text>
          <text class="stat-label">我的积分</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ userInfo.balance || 0 }}</text>
          <text class="stat-label">账户余额(元)</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ userInfo.orderCount || 0 }}</text>
          <text class="stat-label">订单数</text>
        </view>
      </view>
    </view>

    <!-- 会员权益入口 -->
    <view class="section">
      <view class="section-title">会员权益</view>
      <view class="benefits-grid">
        <view class="benefit-item" @click="goPage('/pages/membership/benefits')">
          <view class="benefit-icon gold">
            <u-icon name="star-fill" size="40rpx" color="#FFD700" />
          </view>
          <text class="benefit-text">专属优惠</text>
        </view>
        <view class="benefit-item" @click="goPage('/pages/membership/orders')">
          <view class="benefit-icon blue">
            <u-icon name="order" size="40rpx" color="#2196F3" />
          </view>
          <text class="benefit-text">我的订单</text>
        </view>
        <view class="benefit-item" @click="goPage('/pages/membership/points')">
          <view class="benefit-icon green">
            <u-icon name="red-packet" size="40rpx" color="#4CAF50" />
          </view>
          <text class="benefit-text">积分明细</text>
        </view>
        <view class="benefit-item" @click="goPage('/pages/membership/vip')">
          <view class="benefit-icon purple">
            <u-icon name="diamond-fill" size="40rpx" color="#9C27B0" />
          </view>
          <text class="benefit-text">升级VIP</text>
        </view>
      </view>
    </view>

    <!-- 会员等级说明 -->
    <view class="section">
      <view class="section-title">会员等级</view>
      <view class="level-card">
        <view class="level-info">
          <view class="level-badge" :class="memberLevel">
            <text>{{ memberLevelText }}</text>
          </view>
          <view class="level-desc">
            <text class="level-name">{{ currentLevelInfo.name }}</text>
            <text class="level-condition">{{ currentLevelInfo.condition }}</text>
          </view>
        </view>
        <view class="level-progress">
          <view class="progress-text">
            <text>距离 {{ nextLevelInfo.name }} 还差 {{ nextLevelInfo.need }} 积分</text>
          </view>
          <view class="progress-bar">
            <view class="progress-inner" :style="{ width: progressPercent + '%' }"></view>
          </view>
        </view>
        <view class="level-privileges">
          <text class="privilege-title">当前特权：</text>
          <view class="privilege-list">
            <text v-for="(p, i) in currentLevelInfo.privileges" :key="i" class="privilege-tag">{{ p }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 升级VIP按钮 -->
    <view class="upgrade-section" v-if="memberLevel !== 'vip'">
      <view class="upgrade-btn" @click="goPage('/pages/membership/vip')">
        <u-icon name="diamond-fill" size="36rpx" color="#FFD700" />
        <text>升级为VIP会员 享受更多特权</text>
        <u-icon name="arrow-right" size="32rpx" color="#fff" />
      </view>
    </view>

    <!-- 底部安全区 -->
    <view style="height: 40rpx;"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 模拟用户数据
const userInfo = ref({
  name: '张三',
  points: 580,
  balance: 0,
  orderCount: 3
})

// 会员等级：bronze(青铜), silver(白银), gold(黄金), vip(VIP)
const memberLevel = ref('silver')

const memberLevelText = computed(() => {
  const map = {
    bronze: '青铜会员',
    silver: '白银会员',
    gold: '黄金会员',
    vip: 'VIP会员'
  }
  return map[memberLevel.value] || '普通用户'
})

const levelData = {
  bronze: {
    name: '青铜会员',
    condition: '0积分以上',
    needPoints: 0,
    privileges: ['每日3次免费刷新', '基础客服支持']
  },
  silver: {
    name: '白银会员',
    condition: '500积分以上',
    needPoints: 500,
    privileges: ['每日5次免费刷新', '优先客服支持', '9.5折服务优惠']
  },
  gold: {
    name: '黄金会员',
    condition: '2000积分以上',
    needPoints: 2000,
    privileges: ['每日10次免费刷新', '专属客服', '9折服务优惠', '优先推荐']
  },
  vip: {
    name: 'VIP会员',
    condition: '5000积分以上',
    needPoints: 5000,
    privileges: ['无限刷新', '一对一专属客服', '8折服务优惠', '置顶展示', '专属顾问']
  }
}

const nextLevelData = {
  bronze: { name: '白银会员', need: 500 - (userInfo.value.points || 0) },
  silver: { name: '黄金会员', need: 2000 - (userInfo.value.points || 0) },
  gold: { name: 'VIP会员', need: 5000 - (userInfo.value.points || 0) },
  vip: { name: '已是最高级', need: 0 }
}

const currentLevelInfo = computed(() => levelData[memberLevel.value] || levelData.bronze)
const nextLevelInfo = computed(() => {
  const next = memberLevel.value === 'vip' ? 'vip' : 
    (memberLevel.value === 'gold' ? 'vip' : 
    (memberLevel.value === 'silver' ? 'gold' : 'silver'))
  return nextLevelData[memberLevel.value]
})

const progressPercent = computed(() => {
  const points = userInfo.value.points || 0
  const level = memberLevel.value
  if (level === 'vip') return 100
  if (level === 'gold') return Math.min(100, (points / 5000) * 100)
  if (level === 'silver') return Math.min(100, (points / 2000) * 100)
  return Math.min(100, (points / 500) * 100)
})

const goPage = (url) => {
  uni.navigateTo({ url })
}
</script>

<style scoped>
.membership-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

/* 会员卡片 */
.member-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.5);
}

.user-info {
  flex: 1;
}

.username {
  font-size: 36rpx;
  color: #fff;
  font-weight: 600;
  display: block;
  margin-bottom: 8rpx;
}

.member-badge {
  display: inline-block;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #fff;
}

.member-badge.bronze { background: linear-gradient(135deg, #cd7f32, #8b4513); }
.member-badge.silver { background: linear-gradient(135deg, #c0c0c0, #808080); }
.member-badge.gold { background: linear-gradient(135deg, #FFD700, #FFA500); }
.member-badge.vip { background: linear-gradient(135deg, #9C27B0, #E91E63); }

.card-body {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16rpx;
  padding: 24rpx;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 44rpx;
  color: #fff;
  font-weight: 700;
  display: block;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-top: 4rpx;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.3);
}

/* 通用区块 */
.section {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

/* 权益网格 */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.benefit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.benefit-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefit-icon.gold { background: linear-gradient(135deg, #FFF8DC, #FFE4B5); }
.benefit-icon.blue { background: linear-gradient(135deg, #E3F2FD, #BBDEFB); }
.benefit-icon.green { background: linear-gradient(135deg, #E8F5E9, #C8E6C9); }
.benefit-icon.purple { background: linear-gradient(135deg, #F3E5F5, #E1BEE7); }

.benefit-text {
  font-size: 24rpx;
  color: #666;
}

/* 等级卡片 */
.level-card {
  background: #FAFAFA;
  border-radius: 12rpx;
  padding: 20rpx;
}

.level-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.level-badge {
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  color: #fff;
}

.level-desc {
  flex: 1;
}

.level-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  display: block;
}

.level-condition {
  font-size: 22rpx;
  color: #999;
  display: block;
  margin-top: 4rpx;
}

.level-progress {
  margin-bottom: 20rpx;
}

.progress-text {
  font-size: 22rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.progress-bar {
  height: 12rpx;
  background: #E0E0E0;
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 6rpx;
  transition: width 0.3s;
}

.level-privileges {
  border-top: 1rpx solid #eee;
  padding-top: 16rpx;
}

.privilege-title {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 10rpx;
}

.privilege-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.privilege-tag {
  background: #F5F5F5;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #666;
}

/* 升级按钮 */
.upgrade-section {
  margin-top: 20rpx;
}

.upgrade-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #fff;
  padding: 28rpx;
  border-radius: 50rpx;
  font-size: 30rpx;
  font-weight: 600;
  box-shadow: 0 8rpx 20rpx rgba(255, 165, 0, 0.3);
}
</style>
