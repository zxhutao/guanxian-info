<template>
  <view class="order-container">
    <!-- 服务信息 -->
    <view class="service-info">
      <text class="info-title">招聘置顶服务</text>
      <text class="info-desc">提升职位曝光，快速招到合适人才</text>
    </view>

    <!-- 置顶时长选择 -->
    <view class="section">
      <text class="section-title">选择置顶时长</text>
      <view class="duration-list">
        <view
          v-for="item in durations"
          :key="item.days"
          class="duration-item"
          :class="{ active: selectedDuration === item.days }"
          @click="selectDuration(item)"
        >
          <text class="days">{{ item.days }}天</text>
          <text class="price">¥{{ item.price }}</text>
          <text v-if="item.tag" class="tag">{{ item.tag }}</text>
        </view>
      </view>
    </view>

    <!-- 积分抵现组件 -->
    <point-deduct
      :order-amount="orderAmount"
      order-type="job"
      @change="onPointChange"
    />

    <!-- 优惠券 -->
    <view class="section coupon-section" @click="selectCoupon">
      <text class="section-title">优惠券</text>
      <view class="coupon-value">
        <text v-if="selectedCoupon" class="coupon-text">-¥{{ selectedCoupon.amount }}</text>
        <text v-else class="coupon-placeholder">暂无可用优惠券</text>
        <text class="arrow">></text>
      </view>
    </view>

    <!-- 金额明细 -->
    <view class="section amount-section">
      <text class="section-title">金额明细</text>
      <view class="amount-list">
        <view class="amount-item">
          <text class="item-label">订单金额</text>
          <text class="item-value">¥{{ orderAmount }}</text>
        </view>
        <view class="amount-item" v-if="pointDeduct.deductAmount > 0">
          <text class="item-label">积分抵扣</text>
          <text class="item-value deduct">-¥{{ pointDeduct.deductAmount }}</text>
        </view>
        <view class="amount-item" v-if="selectedCoupon">
          <text class="item-label">优惠券</text>
          <text class="item-value deduct">-¥{{ selectedCoupon.amount }}</text>
        </view>
        <view class="amount-item total">
          <text class="item-label">实付金额</text>
          <text class="item-value total">¥{{ actualAmount }}</text>
        </view>
      </view>
      <view class="save-info" v-if="totalSave > 0">
        <text class="save-text">已省¥{{ totalSave }}</text>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="section">
      <text class="section-title">支付方式</text>
      <view class="pay-methods">
        <view class="pay-method" :class="{ active: payMethod === 'wechat' }" @click="payMethod = 'wechat'">
          <text class="method-icon">💳</text>
          <text class="method-name">微信支付</text>
          <text class="check-icon" v-if="payMethod === 'wechat'">✓</text>
        </view>
      </view>
    </view>

    <!-- 底部支付栏 -->
    <view class="bottom-bar">
      <view class="price-info">
        <text class="pay-label">实付：</text>
        <text class="pay-amount">¥{{ actualAmount }}</text>
      </view>
      <button class="pay-btn" @click="submitOrder">立即支付</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import PointDeduct from '../../components/point-deduct/point-deduct.vue'

// 置顶时长选项
const durations = [
  { days: 3, price: 30, tag: '' },
  { days: 7, price: 60, tag: '热门' },
  { days: 15, price: 100, tag: '超值' },
  { days: 30, price: 180, tag: '推荐' }
]

const selectedDuration = ref(7)
const selectedCoupon = ref(null)
const payMethod = ref('wechat')
const pointDeduct = ref({
  enabled: false,
  usePoints: 0,
  deductAmount: 0
})

// 计算订单金额
const orderAmount = computed(() => {
  const item = durations.find(d => d.days === selectedDuration.value)
  return item ? item.price : 0
})

// 计算实付金额
const actualAmount = computed(() => {
  let amount = orderAmount.value
  if (pointDeduct.value.enabled) {
    amount -= pointDeduct.value.deductAmount
  }
  if (selectedCoupon.value) {
    amount -= selectedCoupon.value.amount
  }
  return Math.max(0, amount).toFixed(2)
})

// 计算节省金额
const totalSave = computed(() => {
  let save = 0
  if (pointDeduct.value.enabled) {
    save += pointDeduct.value.deductAmount
  }
  if (selectedCoupon.value) {
    save += selectedCoupon.value.amount
  }
  return save.toFixed(2)
})

// 选择时长
const selectDuration = (item) => {
  selectedDuration.value = item.days
}

// 积分抵扣变化
const onPointChange = (data) => {
  pointDeduct.value = data
}

// 选择优惠券
const selectCoupon = () => {
  uni.showToast({
    title: '暂无可用优惠券',
    icon: 'none'
  })
}

// 提交订单
const submitOrder = async () => {
  try {
    // 1. 确认积分抵扣
    if (pointDeduct.value.enabled && pointDeduct.value.usePoints > 0) {
      const confirmRes = await uniCloud.callFunction({
        name: 'point-deduct',
        data: {
          action: 'confirmDeduct',
          orderId: 'job_' + Date.now(),
          usePoints: pointDeduct.value.usePoints,
          orderAmount: orderAmount.value
        }
      })
      
      if (confirmRes.result.code !== 0) {
        uni.showToast({
          title: confirmRes.result.message || '积分抵扣失败',
          icon: 'none'
        })
        return
      }
    }

    // 2. 调用微信支付
    if (actualAmount.value > 0) {
      // 调用微信支付接口
      uni.showLoading({ title: '支付中...' })
      
      // 模拟支付成功
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '支付成功',
          icon: 'success'
        })
        
        // 跳转到成功页面
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 1500)
    } else {
      // 纯积分支付
      uni.showToast({
        title: '支付成功',
        icon: 'success'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  } catch (e) {
    console.error('支付失败', e)
    
    // 支付失败，回滚积分
    if (pointDeduct.value.enabled && pointDeduct.value.usePoints > 0) {
      await uniCloud.callFunction({
        name: 'point-deduct',
        data: {
          action: 'cancelDeduct',
          pointOrderId: 'job_' + Date.now()
        }
      })
    }
    
    uni.showToast({
      title: '支付失败，请重试',
      icon: 'none'
    })
  }
}
</script>

<style scoped>
.order-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 140rpx;
}

.service-info {
  background: #fff;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;
}

.info-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.info-desc {
  font-size: 28rpx;
  color: #999;
}

.section {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.duration-list {
  display: flex;
  gap: 20rpx;
}

.duration-item {
  flex: 1;
  border: 2rpx solid #e5e5e5;
  border-radius: 12rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  position: relative;
}

.duration-item.active {
  border-color: #FF6B6B;
  background: #FFF5F5;
}

.days {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.price {
  font-size: 28rpx;
  color: #FF6B6B;
  display: block;
}

.tag {
  position: absolute;
  top: -2rpx;
  right: -2rpx;
  background: #FF6B6B;
  color: #fff;
  font-size: 20rpx;
  padding: 6rpx 12rpx;
  border-radius: 0 12rpx 0 12rpx;
}

.coupon-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coupon-value {
  display: flex;
  align-items: center;
}

.coupon-text {
  font-size: 28rpx;
  color: #FF6B6B;
  margin-right: 10rpx;
}

.coupon-placeholder {
  font-size: 28rpx;
  color: #999;
  margin-right: 10rpx;
}

.arrow {
  font-size: 28rpx;
  color: #ccc;
}

.amount-list {
  padding: 0 10rpx;
}

.amount-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.amount-item.total {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #f5f5f5;
}

.item-label {
  font-size: 28rpx;
  color: #666;
}

.item-value {
  font-size: 28rpx;
  color: #333;
}

.item-value.deduct {
  color: #52C41A;
}

.item-value.total {
  font-size: 36rpx;
  font-weight: bold;
  color: #FF6B6B;
}

.save-info {
  text-align: right;
  margin-top: 20rpx;
}

.save-text {
  font-size: 24rpx;
  color: #FF6B6B;
  background: #FFF5F5;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
}

.pay-methods {
  display: flex;
  gap: 20rpx;
}

.pay-method {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 30rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 12rpx;
}

.pay-method.active {
  border-color: #FF6B6B;
  background: #FFF5F5;
}

.method-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.method-name {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.check-icon {
  color: #FF6B6B;
  font-size: 32rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.1);
}

.price-info {
  display: flex;
  align-items: baseline;
}

.pay-label {
  font-size: 28rpx;
  color: #666;
}

.pay-amount {
  font-size: 48rpx;
  font-weight: bold;
  color: #FF6B6B;
}

.pay-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  color: #fff;
  font-size: 32rpx;
  padding: 0 60rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  border: none;
}
</style>