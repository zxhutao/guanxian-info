<template>
  <view class="point-deduct-container">
    <!-- 积分抵现开关 -->
    <view class="point-header" @click="toggleExpand">
      <view class="point-title">
        <text class="icon">💎</text>
        <text class="title">积分抵现</text>
        <text class="subtitle">可用 {{ userPoints }} 积分</text>
      </view>
      <switch :checked="enabled" @change="onSwitchChange" color="#FF6B6B" />
    </view>
    
    <!-- 展开内容 -->
    <view class="point-content" v-if="expanded && enabled">
      <!-- 可抵扣金额提示 -->
      <view class="deduct-info">
        <text class="info-text">最高可抵 ¥{{ maxDeductAmount }}（订单金额的{{ rules.maxDeductPercent }}%）</text>
      </view>
      
      <!-- 积分滑动条 -->
      <view class="slider-section">
        <text class="section-label">使用积分数</text>
        <slider 
          :value="usePoints" 
          :min="0" 
          :max="maxPoints" 
          :step="100"
          activeColor="#FF6B6B"
          block-color="#FF6B6B"
          @change="onSliderChange"
        />
        <view class="slider-value">
          <text>{{ usePoints }} 积分</text>
          <text class="deduct-amount">抵扣 ¥{{ deductAmount }}</text>
        </view>
      </view>
      
      <!-- 快捷选择 -->
      <view class="quick-select">
        <text class="quick-label">快捷选择</text>
        <view class="quick-buttons">
          <button 
            v-for="item in quickOptions" 
            :key="item"
            class="quick-btn"
            :class="{ active: usePoints === item }"
            @click="selectPoints(item)"
          >
            {{ item }}积分
          </button>
        </view>
      </view>
      
      <!-- 使用规则 -->
      <view class="rules-section" @click="showRules">
        <text class="rules-text">💡 100积分=1元，最高抵{{ rules.maxDeductPercent }}%，单笔最高¥{{ rules.maxDeductPerOrder }}</text>
        <text class="arrow">></text>
      </view>
    </view>
    
    <!-- 抵扣金额展示（收起状态） -->
    <view class="deduct-summary" v-if="!expanded && enabled && usePoints > 0">
      <text class="summary-text">已使用 {{ usePoints }} 积分，抵扣 ¥{{ deductAmount }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  orderAmount: {
    type: Number,
    default: 0
  },
  orderType: {
    type: String,
    default: 'job'
  }
})

const emit = defineEmits(['change'])

// 状态
const expanded = ref(true)
const enabled = ref(false)
const usePoints = ref(0)
const userPoints = ref(1500) // 从接口获取
const rules = ref({
  pointsToYuan: 100,
  maxDeductPercent: 20,
  maxDeductPerOrder: 50,
  minOrderAmount: 10
})

// 快捷选项
const quickOptions = [500, 1000, 2000]

// 计算属性
const maxPoints = computed(() => {
  const percentLimit = Math.floor(props.orderAmount * rules.value.maxDeductPercent / 100 * rules.value.pointsToYuan)
  const amountLimit = rules.value.maxDeductPerOrder * rules.value.pointsToYuan
  const maxByRules = Math.min(percentLimit, amountLimit)
  return Math.min(maxByRules, userPoints.value)
})

const maxDeductAmount = computed(() => {
  return (maxPoints.value / rules.value.pointsToYuan).toFixed(2)
})

const deductAmount = computed(() => {
  return (usePoints.value / rules.value.pointsToYuan).toFixed(2)
})

// 方法
const toggleExpand = () => {
  expanded.value = !expanded.value
}

const onSwitchChange = (e) => {
  enabled.value = e.detail.value
  if (!enabled.value) {
    usePoints.value = 0
  }
  emitChange()
}

const onSliderChange = (e) => {
  usePoints.value = e.detail.value
  emitChange()
}

const selectPoints = (points) => {
  usePoints.value = Math.min(points, maxPoints.value)
  emitChange()
}

const showRules = () => {
  uni.navigateTo({
    url: '/pages/points/rules'
  })
}

const emitChange = () => {
  emit('change', {
    enabled: enabled.value,
    usePoints: usePoints.value,
    deductAmount: parseFloat(deductAmount.value)
  })
}

// 监听订单金额变化
watch(() => props.orderAmount, (newVal) => {
  if (newVal < rules.value.minOrderAmount) {
    enabled.value = false
    usePoints.value = 0
  }
  // 重新计算最大可用积分
  if (usePoints.value > maxPoints.value) {
    usePoints.value = maxPoints.value
  }
})

// 获取用户积分和规则
const initData = async () => {
  try {
    // 获取积分规则
    const rulesRes = await uniCloud.callFunction({
      name: 'point-deduct',
      data: { action: 'getPointRules' }
    })
    if (rulesRes.result.code === 0) {
      rules.value = rulesRes.result.data
    }
    
    // 获取用户积分
    const pointsRes = await uniCloud.callFunction({
      name: 'point-deduct',
      data: { action: 'getUserPoints' }
    })
    if (pointsRes.result.code === 0) {
      userPoints.value = pointsRes.result.data.points
    }
  } catch (e) {
    console.error('获取积分数据失败', e)
  }
}

initData()
</script>

<style scoped>
.point-deduct-container {
  background: #fff;
  border-radius: 12rpx;
  margin: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.1);
}

.point-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.point-title {
  display: flex;
  align-items: center;
}

.icon {
  font-size: 36rpx;
  margin-right: 10rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 16rpx;
}

.subtitle {
  font-size: 24rpx;
  color: #999;
}

.point-content {
  margin-top: 30rpx;
  padding-top: 30rpx;
  border-top: 1rpx solid #f5f5f5;
}

.deduct-info {
  background: #FFF5F5;
  padding: 20rpx;
  border-radius: 8rpx;
  margin-bottom: 30rpx;
}

.info-text {
  font-size: 26rpx;
  color: #FF6B6B;
}

.slider-section {
  margin-bottom: 30rpx;
}

.section-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.slider-value {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
  font-size: 28rpx;
  color: #333;
}

.deduct-amount {
  color: #FF6B6B;
  font-weight: bold;
}

.quick-select {
  margin-bottom: 30rpx;
}

.quick-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.quick-buttons {
  display: flex;
  gap: 20rpx;
}

.quick-btn {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
  border: none;
}

.quick-btn.active {
  background: #FF6B6B;
  color: #fff;
}

.rules-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-top: 1rpx solid #f5f5f5;
}

.rules-text {
  font-size: 24rpx;
  color: #999;
}

.arrow {
  font-size: 28rpx;
  color: #ccc;
}

.deduct-summary {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f5f5f5;
}

.summary-text {
  font-size: 28rpx;
  color: #FF6B6B;
}
</style>