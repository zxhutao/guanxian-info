<template>
  <view class="vip-page">
    <!-- VIP介绍 -->
    <view class="vip-hero">
      <view class="hero-bg"></view>
      <view class="hero-content">
        <view class="vip-badge">
          <text class="crown">👑</text>
          <text class="vip-text">VIP会员</text>
        </view>
        <text class="hero-slogan">尊享特权 · 专属服务</text>
        <text class="hero-desc">开通VIP会员，享受冠帮帮全部专属特权</text>
      </view>
    </view>

    <!-- 会员特权 -->
    <view class="section">
      <view class="section-title">VIP专属特权</view>
      <view class="privileges-grid">
        <view class="privilege-card" v-for="p in vipPrivileges" :key="p.title">
          <view class="privilege-icon" :style="{ background: p.bg }">
            <u-icon :name="p.icon" size="40rpx" :color="p.color" />
          </view>
          <text class="privilege-title">{{ p.title }}</text>
          <text class="privilege-desc">{{ p.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 套餐选择 -->
    <view class="section">
      <view class="section-title">选择套餐</view>
      <view class="packages">
        <view 
          v-for="pkg in packages" 
          :key="pkg.months"
          class="package-card"
          :class="{ selected: selectedPkg === pkg.months, popular: pkg.popular }"
          @click="selectedPkg = pkg.months"
        >
          <view class="popular-tag" v-if="pkg.popular">推荐</view>
          <view class="package-header">
            <text class="package-months">{{ pkg.months }}个月</text>
            <text class="package-discount" v-if="pkg.discount">{{ pkg.discount }}折</text>
          </view>
          <view class="package-price">
            <text class="price-symbol">¥</text>
            <text class="price-value">{{ pkg.price }}</text>
          </view>
          <view class="package-original" v-if="pkg.original">
            原价 ¥{{ pkg.original }}
          </view>
          <view class="package-save" v-if="pkg.save">
            节省 ¥{{ pkg.save }}
          </view>
        </view>
      </view>
    </view>

    <!-- 权益对比 -->
    <view class="section comparison">
      <view class="section-title">权益对比</view>
      <view class="comparison-table">
        <view class="table-header">
          <view class="col-service">服务项目</view>
          <view class="col-normal">普通用户</view>
          <view class="col-vip">VIP会员</view>
        </view>
        <view class="table-row" v-for="item in comparisonData" :key="item.service">
          <view class="col-service">{{ item.service }}</view>
          <view class="col-normal">
            <u-icon v-if="item.normal" name="checkmark-circle" size="32rpx" color="#999" />
            <text v-else class="no">-</text>
          </view>
          <view class="col-vip">
            <u-icon v-if="item.vip" name="checkmark-circle-fill" size="32rpx" color="#FFD700" />
            <text v-else class="no">-</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 立即开通 -->
    <view class="bottom-bar">
      <view class="price-info">
        <text class="total-label">合计：</text>
        <text class="total-price">¥{{ currentPrice }}</text>
      </view>
      <view class="buy-btn" @click="handleBuy">
        立即开通
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedPkg = ref(12)

const packages = [
  { months: 1, price: 29, popular: false },
  { months: 3, price: 79, original: 87, save: 8, popular: false },
  { months: 12, price: 299, original: 348, save: 49, popular: true }
]

const currentPrice = computed(() => {
  const pkg = packages.find(p => p.months === selectedPkg.value)
  return pkg ? pkg.price : 0
})

const vipPrivileges = [
  { icon: 'star-fill', title: '专属标识', desc: '头像金色边框', bg: 'linear-gradient(135deg, #FFF8DC, #FFE4B5)', color: '#FFA500' },
  { icon: 'top-s-fill', title: '置顶曝光', desc: '信息优先展示', bg: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', color: '#2196F3' },
  { icon: 'coupon', title: '8折优惠', desc: '全部服务折扣', bg: 'linear-gradient(135deg, #FCE4EC, #F8BBD9)', color: '#E91E63' },
  { icon: 'account-fill', title: '专属顾问', desc: '一对一服务', bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', color: '#4CAF50' },
  { icon: 'clock', title: '无限刷新', desc: '不限次数', bg: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', color: '#9C27B0' },
  { icon: 'heart-fill', title: '生日礼包', desc: '专属福利', bg: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', color: '#FF9800' }
]

const comparisonData = [
  { service: '服务刷新次数', normal: false, vip: true },
  { service: '信息曝光', normal: false, vip: true },
  { service: '专属客服', normal: false, vip: true },
  { service: '服务折扣', normal: false, vip: true },
  { service: '置顶展示', normal: false, vip: true },
  { service: '专属顾问', normal: false, vip: true }
]

const handleBuy = () => {
  uni.showModal({
    title: '开通VIP会员',
    content: `确认开通 ${selectedPkg.value} 个月 VIP会员，支付 ¥${currentPrice.value}？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '支付功能开发中', icon: 'none' })
      }
    }
  })
}
</script>

<style scoped>
.vip-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 140rpx;
}

.vip-hero {
  position: relative;
  padding: 60rpx 30rpx 80rpx;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, #9C27B0 0%, #E91E63 50%, #FF9800 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.vip-badge {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  background: rgba(255, 255, 255, 0.2);
  padding: 16rpx 40rpx;
  border-radius: 40rpx;
  margin-bottom: 20rpx;
}

.crown {
  font-size: 36rpx;
}

.vip-text {
  font-size: 36rpx;
  color: #FFD700;
  font-weight: 700;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.hero-slogan {
  display: block;
  font-size: 40rpx;
  color: #fff;
  font-weight: 600;
  margin-bottom: 10rpx;
}

.hero-desc {
  display: block;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.section {
  margin: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.privileges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.privilege-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20rpx 10rpx;
}

.privilege-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.privilege-title {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 4rpx;
}

.privilege-desc {
  font-size: 22rpx;
  color: #999;
  display: block;
}

.packages {
  display: flex;
  gap: 16rpx;
}

.package-card {
  flex: 1;
  background: #FAFAFA;
  border: 2rpx solid transparent;
  border-radius: 16rpx;
  padding: 24rpx 16rpx;
  text-align: center;
  position: relative;
}

.package-card.selected {
  border-color: #9C27B0;
  background: #F3E5F5;
}

.package-card.popular {
  border-color: #E91E63;
}

.popular-tag {
  position: absolute;
  top: -12rpx;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #E91E63, #FF5722);
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.package-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-bottom: 10rpx;
}

.package-months {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.package-discount {
  background: #E91E63;
  color: #fff;
  font-size: 20rpx;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
}

.package-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.price-symbol {
  font-size: 24rpx;
  color: #E91E63;
}

.price-value {
  font-size: 48rpx;
  color: #E91E63;
  font-weight: 700;
}

.package-original {
  font-size: 22rpx;
  color: #999;
  text-decoration: line-through;
  margin-top: 4rpx;
}

.package-save {
  font-size: 22rpx;
  color: #4CAF50;
  margin-top: 4rpx;
}

.comparison-table {
  border: 1rpx solid #eee;
  border-radius: 12rpx;
  overflow: hidden;
}

.table-header, .table-row {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.table-header {
  background: #FAFAFA;
  font-weight: 600;
}

.table-row:last-child {
  border-bottom: none;
}

.col-service {
  flex: 2;
  padding-left: 20rpx;
  font-size: 26rpx;
  color: #333;
}

.col-normal, .col-vip {
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.col-normal .no, .col-vip .no {
  color: #ddd;
  font-size: 28rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.price-info {
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 28rpx;
  color: #666;
}

.total-price {
  font-size: 48rpx;
  color: #E91E63;
  font-weight: 700;
}

.buy-btn {
  background: linear-gradient(135deg, #9C27B0, #E91E63);
  color: #fff;
  padding: 24rpx 60rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 8rpx 20rpx rgba(156, 39, 176, 0.3);
}
</style>
