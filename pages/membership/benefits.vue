<template>
  <view class="benefits-page">
    <!-- 当前会员等级 -->
    <view class="current-level">
      <view class="level-tag" :class="memberLevel">
        <u-icon name="star-fill" size="28rpx" color="#FFD700" />
        <text>{{ levelName }}</text>
      </view>
      <text class="level-hint">您当前享有的特权</text>
    </view>

    <!-- 会员等级列表 -->
    <view class="level-list">
      <view 
        v-for="level in levels" 
        :key="level.key"
        class="level-card"
        :class="{ active: level.key === memberLevel, locked: isLocked(level.key) }"
      >
        <view class="level-header">
          <view class="level-title">
            <view class="level-icon" :class="level.key">
              <text>{{ level.emoji }}</text>
            </view>
            <view class="level-info">
              <text class="name">{{ level.name }}</text>
              <text class="points">{{ level.points }}积分</text>
            </view>
          </view>
          <view class="level-status">
            <text v-if="level.key === memberLevel" class="current">当前</text>
            <text v-else-if="isLocked(level.key)" class="locked">
              <u-icon name="lock" size="24rpx" color="#999" />
              未解锁
            </text>
            <text v-else class="unlocked">已解锁</text>
          </view>
        </view>
        
        <view class="level-privileges">
          <text class="privilege-title">特权服务</text>
          <view class="privilege-grid">
            <view 
              v-for="(p, i) in level.privileges" 
              :key="i"
              class="privilege-item"
              :class="{ locked: isLocked(level.key) }"
            >
              <u-icon :name="p.icon" size="32rpx" :color="isLocked(level.key) ? '#ccc' : '#667eea'" />
              <text>{{ p.text }}</text>
            </view>
          </view>
        </view>
        
        <view class="level-action" v-if="level.key !== 'vip'">
          <view v-if="isLocked(level.key)" class="upgrade-hint">
            <text>再获得 {{ level.points - currentPoints }} 积分即可升级</text>
          </view>
          <view v-else class="upgrade-btn" @click="upgradeTo(level.key)">
            立即升级
          </view>
        </view>
      </view>
    </view>

    <!-- 底部说明 -->
    <view class="footer-tip">
      <text>积分获取：完成订单、每日签到、分享小程序等均可获得积分</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const memberLevel = ref('silver')
const currentPoints = ref(580)

const levelName = computed(() => {
  const map = { bronze: '青铜会员', silver: '白银会员', gold: '黄金会员', vip: 'VIP会员' }
  return map[memberLevel.value]
})

const levels = [
  {
    key: 'bronze',
    name: '青铜会员',
    emoji: '🥉',
    points: 0,
    privileges: [
      { icon: 'refresh', text: '每日3次刷新' },
      { icon: 'phone', text: '基础客服' },
      { icon: 'volume', text: '普通曝光' }
    ]
  },
  {
    key: 'silver',
    name: '白银会员',
    emoji: '🥈',
    points: 500,
    privileges: [
      { icon: 'refresh', text: '每日5次刷新' },
      { icon: 'phone', text: '优先客服' },
      { icon: 'volume', text: '普通曝光' },
      { icon: 'coupon', text: '9.5折优惠' }
    ]
  },
  {
    key: 'gold',
    name: '黄金会员',
    emoji: '🥇',
    points: 2000,
    privileges: [
      { icon: 'refresh', text: '每日10次刷新' },
      { icon: 'phone', text: '专属客服' },
      { icon: 'volume', text: '高级曝光' },
      { icon: 'coupon', text: '9折优惠' },
      { icon: 'top-s-fill', text: '优先推荐' }
    ]
  },
  {
    key: 'vip',
    name: 'VIP会员',
    emoji: '👑',
    points: 5000,
    privileges: [
      { icon: 'refresh', text: '无限刷新' },
      { icon: 'account-fill', text: '一对一顾问' },
      { icon: 'volume', text: '置顶曝光' },
      { icon: 'coupon', text: '8折优惠' },
      { icon: 'star-fill', text: '专属标识' },
      { icon: 'heart-fill', text: '生日礼包' }
    ]
  }
]

const levelOrder = ['bronze', 'silver', 'gold', 'vip']
const isLocked = (key) => {
  const currentIndex = levelOrder.indexOf(memberLevel.value)
  const targetIndex = levelOrder.indexOf(key)
  return targetIndex > currentIndex
}

const upgradeTo = (level) => {
  uni.showModal({
    title: '升级提示',
    content: `升级为${level}需要${levels.find(l => l.key === level).points}积分，当前有${currentPoints.value}积分，是否前往充值？`,
    confirmText: '立即充值',
    cancelText: '稍后再说',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '充值功能开发中', icon: 'none' })
      }
    }
  })
}
</script>

<style scoped>
.benefits-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.current-level {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  text-align: center;
  margin-bottom: 20rpx;
}

.level-tag {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  padding: 12rpx 30rpx;
  border-radius: 30rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 10rpx;
}

.level-hint {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
}

.level-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.level-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  border: 2rpx solid transparent;
}

.level-card.active {
  border-color: #667eea;
  box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.2);
}

.level-card.locked {
  opacity: 0.7;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.level-title {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.level-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}

.level-icon.bronze { background: linear-gradient(135deg, #cd7f32, #8b4513); }
.level-icon.silver { background: linear-gradient(135deg, #c0c0c0, #808080); }
.level-icon.gold { background: linear-gradient(135deg, #FFD700, #FFA500); }
.level-icon.vip { background: linear-gradient(135deg, #9C27B0, #E91E63); }

.level-info .name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  display: block;
}

.level-info .points {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-top: 4rpx;
}

.level-status text {
  font-size: 24rpx;
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.level-status .current { color: #667eea; font-weight: 600; }
.level-status .locked { color: #999; }
.level-status .unlocked { color: #4CAF50; }

.privilege-title {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 12rpx;
}

.privilege-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.privilege-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 8rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
}

.privilege-item text {
  font-size: 22rpx;
  color: #666;
  text-align: center;
}

.privilege-item.locked text {
  color: #ccc;
}

.level-action {
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f0f0f0;
}

.upgrade-hint {
  text-align: center;
  font-size: 24rpx;
  color: #E63946;
}

.upgrade-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  text-align: center;
  padding: 20rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.footer-tip {
  margin-top: 30rpx;
  text-align: center;
  font-size: 24rpx;
  color: #999;
  padding: 20rpx;
}
</style>
