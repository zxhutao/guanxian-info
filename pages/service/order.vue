<template>
  <view class="order-container">
    <!-- 服务信息 -->
    <view class="service-info">
      <image class="service-image" src="/static/images/service-default.png" mode="aspectFill" />
      <view class="service-detail">
        <text class="service-name">{{ serviceInfo.name }}</text>
        <text class="service-price">¥{{ serviceInfo.price }}/次</text>
      </view>
    </view>

    <!-- 预约信息 -->
    <view class="section">
      <text class="section-title">预约信息</text>
      
      <view class="form-item">
        <text class="form-label">预约日期</text>
        <picker mode="date" :value="form.date" :start="today" @change="onDateChange">
          <view class="picker-value">
            <text :class="{ placeholder: !form.date }">{{ form.date || '请选择日期' }}</text>
            <text class="arrow">></text>
          </view>
        </picker>
      </view>
      
      <view class="form-item">
        <text class="form-label">预约时间</text>
        <picker mode="time" :value="form.time" @change="onTimeChange">
          <view class="picker-value">
            <text :class="{ placeholder: !form.time }">{{ form.time || '请选择时间' }}</text>
            <text class="arrow">></text>
          </view>
        </picker>
      </view>
      
      <view class="form-item">
        <text class="form-label">服务地址</text>
        <input 
          class="form-input" 
          v-model="form.address" 
          placeholder="请输入详细地址"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">联系电话</text>
        <input 
          class="form-input" 
          v-model="form.phone" 
          type="number"
          placeholder="请输入联系电话"
          maxlength="11"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">备注需求</text>
        <textarea 
          class="form-textarea" 
          v-model="form.remark" 
          placeholder="请输入其他需求（选填）"
          maxlength="200"
        />
      </view>
    </view>

    <!-- 积分抵现组件 -->
    <point-deduct
      :order-amount="orderAmount"
      order-type="service"
      @change="onPointChange"
    />

    <!-- 金额明细 -->
    <view class="section amount-section">
      <text class="section-title">金额明细</text>
      <view class="amount-list">
        <view class="amount-item">
          <text class="item-label">服务费用</text>
          <text class="item-value">¥{{ orderAmount }}</text>
        </view>
        <view class="amount-item" v-if="pointDeduct.deductAmount > 0">
          <text class="item-label">积分抵扣</text>
          <text class="item-value deduct">-¥{{ pointDeduct.deductAmount }}</text>
        </view>
        <view class="amount-item total">
          <text class="item-label">实付金额</text>
          <text class="item-value total">¥{{ actualAmount }}</text>
        </view>
      </view>
    </view>

    <!-- 服务协议 -->
    <view class="agreement">
      <checkbox :checked="agreed" @click="agreed = !agreed" color="#FF6B6B" />
      <text class="agreement-text">
        我已阅读并同意
        <text class="link" @click="showAgreement">《服务协议》</text>
      </text>
    </view>

    <!-- 底部支付栏 -->
    <view class="bottom-bar">
      <view class="price-info">
        <text class="pay-label">实付：</text>
        <text class="pay-amount">¥{{ actualAmount }}</text>
      </view>
      <button class="pay-btn" @click="submitOrder">确认预约</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import PointDeduct from '@/components/point-deduct/point-deduct.vue'

// 服务信息
const serviceInfo = ref({
  name: '家庭保洁服务',
  price: 150
})

// 表单数据
const form = ref({
  date: '',
  time: '',
  address: '',
  phone: '',
  remark: ''
})

const agreed = ref(false)
const pointDeduct = ref({
  enabled: false,
  usePoints: 0,
  deductAmount: 0
})

// 今天日期
const today = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
})

// 订单金额
const orderAmount = computed(() => serviceInfo.value.price)

// 实付金额
const actualAmount = computed(() => {
  let amount = orderAmount.value
  if (pointDeduct.value.enabled) {
    amount -= pointDeduct.value.deductAmount
  }
  return Math.max(0, amount).toFixed(2)
})

// 日期选择
const onDateChange = (e) => {
  form.value.date = e.detail.value
}

// 时间选择
const onTimeChange = (e) => {
  form.value.time = e.detail.value
}

// 积分抵扣变化
const onPointChange = (data) => {
  pointDeduct.value = data
}

// 显示协议
const showAgreement = () => {
  uni.navigateTo({
    url: '/pages/agreement/service'
  })
}

// 提交订单
const submitOrder = async () => {
  // 表单验证
  if (!form.value.date) {
    uni.showToast({ title: '请选择预约日期', icon: 'none' })
    return
  }
  if (!form.value.time) {
    uni.showToast({ title: '请选择预约时间', icon: 'none' })
    return
  }
  if (!form.value.address) {
    uni.showToast({ title: '请输入服务地址', icon: 'none' })
    return
  }
  if (!form.value.phone || form.value.phone.length !== 11) {
    uni.showToast({ title: '请输入正确的联系电话', icon: 'none' })
    return
  }
  if (!agreed.value) {
    uni.showToast({ title: '请同意服务协议', icon: 'none' })
    return
  }

  try {
    // 确认积分抵扣
    if (pointDeduct.value.enabled && pointDeduct.value.usePoints > 0) {
      const confirmRes = await uniCloud.callFunction({
        name: 'point-deduct',
        data: {
          action: 'confirmDeduct',
          orderId: 'service_' + Date.now(),
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

    // 提交预约
    uni.showLoading({ title: '提交中...' })
    
    // 模拟提交成功
    setTimeout(() => {
      uni.hideLoading()
      uni.showToast({
        title: '预约成功',
        icon: 'success'
      })
      
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }, 1500)
  } catch (e) {
    console.error('预约失败', e)
    
    // 回滚积分
    if (pointDeduct.value.enabled && pointDeduct.value.usePoints > 0) {
      await uniCloud.callFunction({
        name: 'point-deduct',
        data: {
          action: 'cancelDeduct',
          pointOrderId: 'service_' + Date.now()
        }
      })
    }
    
    uni.showToast({
      title: '预约失败，请重试',
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
  padding: 30rpx;
  display: flex;
  margin-bottom: 20rpx;
}

.service-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.service-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.service-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.service-price {
  font-size: 36rpx;
  color: #FF6B6B;
  font-weight: bold;
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

.form-item {
  margin-bottom: 30rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
}

.picker-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  background: #f9f9f9;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
}

.picker-value .placeholder {
  color: #999;
}

.arrow {
  color: #ccc;
  font-size: 28rpx;
}

.form-input {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  background: #f9f9f9;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.form-textarea {
  width: 100%;
  height: 160rpx;
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
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

.agreement {
  display: flex;
  align-items: center;
  padding: 30rpx;
  margin-bottom: 140rpx;
}

.agreement-text {
  font-size: 26rpx;
  color: #666;
  margin-left: 10rpx;
}

.link {
  color: #FF6B6B;
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