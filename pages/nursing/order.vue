<template>
  <view class="order-container">
    <!-- 护工信息 -->
    <view class="worker-info">
      <image class="worker-avatar" :src="workerInfo.avatar || '/static/images/avatar-default.png'" mode="aspectFill" />
      <view class="worker-detail">
        <text class="worker-name">{{ workerInfo.name }}</text>
        <text class="worker-price">¥{{ workerInfo.price }}/天</text>
        <view class="worker-tags">
          <text class="tag">{{ workerInfo.age }}岁</text>
          <text class="tag">{{ workerInfo.experience }}年经验</text>
        </view>
      </view>
    </view>

    <!-- 护理信息 -->
    <view class="section">
      <text class="section-title">护理信息</text>
      
      <view class="form-item">
        <text class="form-label">护理类型</text>
        <view class="type-list">
          <view
            v-for="type in careTypes"
            :key="type.value"
            class="type-item"
            :class="{ active: form.careType === type.value }"
            @click="form.careType = type.value"
          >
            {{ type.label }}
          </view>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">被护理人姓名</text>
        <input 
          class="form-input" 
          v-model="form.patientName" 
          placeholder="请输入被护理人姓名"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">被护理人年龄</text>
        <input 
          class="form-input" 
          v-model="form.patientAge" 
          type="number"
          placeholder="请输入年龄"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">护理天数</text>
        <view class="day-selector">
          <text class="minus" @click="decreaseDays">-</text>
          <text class="days">{{ form.days }}天</text>
          <text class="plus" @click="increaseDays">+</text>
        </view>
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
        <text class="form-label">特殊需求</text>
        <textarea 
          class="form-textarea" 
          v-model="form.requirements" 
          placeholder="请描述被护理人的身体状况、护理要求等"
          maxlength="500"
        />
      </view>
    </view>

    <!-- 温馨提示 -->
    <view class="tips-section">
      <text class="tips-title">💡 温馨提示</text>
      <view class="tips-list">
        <text class="tip-item">• 请提前1天预约，方便护工安排时间</text>
        <text class="tip-item">• 如需取消预约，请提前24小时联系</text>
        <text class="tip-item">• 首次服务建议家属陪同</text>
      </view>
    </view>

    <!-- 积分抵现组件 -->
    <point-deduct
      :order-amount="orderAmount"
      order-type="nursing"
      @change="onPointChange"
    />

    <!-- 金额明细 -->
    <view class="section amount-section">
      <text class="section-title">金额明细</text>
      <view class="amount-list">
        <view class="amount-item">
          <text class="item-label">护理费用（{{ form.days }}天）</text>
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
import { onLoad } from '@dcloudio/uni-app'
import PointDeduct from '../../components/point-deduct/point-deduct.vue'

// 护工信息
const workerInfo = ref({
  name: '',
  price: 0,
  age: 0,
  experience: 0,
  avatar: ''
})

// 接收页面参数
onLoad((options) => {
  if (options.name) workerInfo.value.name = decodeURIComponent(options.name)
  if (options.price) workerInfo.value.price = Number(options.price)
  if (options.avatar) workerInfo.value.avatar = decodeURIComponent(options.avatar)
  // 模拟数据（实际应从云端获取）
  workerInfo.value.age = 50
  workerInfo.value.experience = 8
})

// 护理类型
const careTypes = [
  { label: '居家护理', value: 'home' },
  { label: '医院陪护', value: 'hospital' },
  { label: '康复护理', value: 'rehab' },
  { label: '特殊护理', value: 'special' }
]

// 表单数据
const form = ref({
  careType: 'home',
  patientName: '',
  patientAge: '',
  days: 1,
  address: '',
  phone: '',
  requirements: ''
})

const pointDeduct = ref({
  enabled: false,
  usePoints: 0,
  deductAmount: 0
})

// 订单金额
const orderAmount = computed(() => {
  return workerInfo.value.price * form.value.days
})

// 实付金额
const actualAmount = computed(() => {
  let amount = orderAmount.value
  if (pointDeduct.value.enabled) {
    amount -= pointDeduct.value.deductAmount
  }
  return Math.max(0, amount).toFixed(2)
})

// 减少天数
const decreaseDays = () => {
  if (form.value.days > 1) {
    form.value.days--
  }
}

// 增加天数
const increaseDays = () => {
  if (form.value.days < 30) {
    form.value.days++
  }
}

// 积分抵扣变化
const onPointChange = (data) => {
  pointDeduct.value = data
}

// 提交订单
const submitOrder = async () => {
  // 表单验证
  if (!form.value.patientName) {
    uni.showToast({ title: '请输入被护理人姓名', icon: 'none' })
    return
  }
  if (!form.value.patientAge) {
    uni.showToast({ title: '请输入被护理人年龄', icon: 'none' })
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

  try {
    // 确认积分抵扣
    if (pointDeduct.value.enabled && pointDeduct.value.usePoints > 0) {
      const confirmRes = await uniCloud.callFunction({
        name: 'point-deduct',
        data: {
          action: 'confirmDeduct',
          orderId: 'nursing_' + Date.now(),
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
          pointOrderId: 'nursing_' + Date.now()
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

.worker-info {
  background: #fff;
  padding: 30rpx;
  display: flex;
  margin-bottom: 20rpx;
}

.worker-avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.worker-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.worker-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.worker-price {
  font-size: 32rpx;
  color: #FF6B6B;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.worker-tags {
  display: flex;
  gap: 16rpx;
}

.tag {
  font-size: 24rpx;
  color: #666;
  background: #f5f5f5;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
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

.type-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.type-item {
  padding: 20rpx 40rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #666;
}

.type-item.active {
  border-color: #FF6B6B;
  background: #FFF5F5;
  color: #FF6B6B;
}

.form-input {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  background: #f9f9f9;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.day-selector {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.minus, .plus {
  width: 60rpx;
  height: 60rpx;
  line-height: 56rpx;
  text-align: center;
  background: #f5f5f5;
  border-radius: 50%;
  font-size: 36rpx;
  color: #666;
}

.days {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  min-width: 100rpx;
  text-align: center;
}

.form-textarea {
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.tips-section {
  background: #FFFBE6;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.tips-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.tip-item {
  font-size: 26rpx;
  color: #666;
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