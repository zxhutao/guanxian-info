<template>
  <view class="settlement-container">
    <!-- 结算概览 -->
    <view class="settlement-header">
      <view class="overview-card">
        <view class="overview-item">
          <text class="overview-label">待结算金额</text>
          <text class="overview-value">¥{{ summary.pendingAmount || '0.00' }}</text>
        </view>
        <view class="divider"></view>
        <view class="overview-item">
          <text class="overview-label">累计结算</text>
          <text class="overview-value">¥{{ summary.totalSettled || '0.00' }}</text>
        </view>
      </view>
      
      <view class="stats-row">
        <view class="stat-box">
          <text class="stat-num">{{ summary.pointOrderCount || 0 }}</text>
          <text class="stat-label">积分抵扣订单</text>
        </view>
        <view class="stat-box">
          <text class="stat-num">¥{{ summary.platformSubsidy || '0.00' }}</text>
          <text class="stat-label">平台补贴</text>
        </view>
      </view>
    </view>

    <!-- 结算列表 -->
    <view class="settlement-section">
      <view class="section-header">
        <text class="section-title">结算明细</text>
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
      
      <view class="settlement-list">
        <view 
          v-for="item in settlementList" 
          :key="item._id"
          class="settlement-item"
        >
          <view class="item-header">
            <text class="order-no">订单号：{{ item.orderId }}</text>
            <text class="status-tag" :class="item.status">{{ item.statusText }}</text>
          </view>
          
          <view class="item-body">
            <view class="amount-row">
              <text class="label">订单金额</text>
              <text class="value">¥{{ item.orderAmount }}</text>
            </view>
            <view class="amount-row deduct">
              <text class="label">积分抵扣</text>
              <text class="value">-¥{{ item.deductAmount }}</text>
            </view>
            <view class="amount-row cost">
              <text class="label">商家承担（40%）</text>
              <text class="value">-¥{{ item.merchantCost }}</text>
            </view>
            <view class="amount-row income">
              <text class="label">商家实收</text>
              <text class="value">¥{{ item.settleAmount }}</text>
            </view>
          </view>
          
          <view class="item-footer">
            <text class="time">{{ formatTime(item.createdAt) }}</text>
            <text class="subsidy" v-if="item.platformCost > 0">
              平台补贴 ¥{{ item.platformCost }}
            </text>
          </view>
        </view>
        
        <!-- 空状态 -->
        <view v-if="settlementList.length === 0" class="empty-state">
          <text class="empty-icon">📭</text>
          <text class="empty-text">暂无结算记录</text>
        </view>
      </view>
    </view>

    <!-- 提现按钮 -->
    <view class="withdraw-section" v-if="summary.pendingAmount > 0">
      <button class="withdraw-btn" @click="withdraw">
        立即提现 ¥{{ summary.pendingAmount }}
      </button>
      <text class="withdraw-tip">最小提现金额：100元 | 提现手续费：免费</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 结算概览
const summary = ref({
  pendingAmount: 4680.00,
  totalSettled: 12580.00,
  pointOrderCount: 156,
  platformSubsidy: 936.00
})

// 标签页
const tabs = [
  { label: '全部', value: 'all' },
  { label: '待结算', value: 'pending' },
  { label: '已结算', value: 'settled' }
]
const currentTab = ref('all')

// 结算列表
const settlementList = ref([
  {
    _id: '1',
    orderId: '2026032212345',
    orderAmount: '100.00',
    deductAmount: '15.00',
    merchantCost: '6.00',
    platformCost: '9.00',
    settleAmount: '85.00',
    status: 'pending',
    statusText: '待结算',
    createdAt: Date.now() - 3600000
  },
  {
    _id: '2',
    orderId: '2026032112344',
    orderAmount: '200.00',
    deductAmount: '20.00',
    merchantCost: '8.00',
    platformCost: '12.00',
    settleAmount: '172.00',
    status: 'settled',
    statusText: '已结算',
    createdAt: Date.now() - 86400000
  }
])

// 切换标签
const switchTab = (tab) => {
  currentTab.value = tab
  loadSettlementList()
}

// 加载结算列表
const loadSettlementList = async () => {
  // 调用云函数获取数据
  // const res = await uniCloud.callFunction({
  //   name: 'point-deduct',
  //   data: { 
  //     action: 'getMerchantSettlementList',
  //     status: currentTab.value === 'all' ? undefined : currentTab.value
  //   }
  // })
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 提现
const withdraw = () => {
  uni.showModal({
    title: '确认提现',
    content: `提现金额：¥${summary.value.pendingAmount}`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '提现申请已提交',
          icon: 'success'
        })
      }
    }
  })
}

onMounted(() => {
  loadSettlementList()
})
</script>

<style scoped>
.settlement-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 160rpx;
}

.settlement-header {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  padding: 40rpx 30rpx;
}

.overview-card {
  display: flex;
  background: rgba(255,255,255,0.2);
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.overview-item {
  flex: 1;
  text-align: center;
}

.divider {
  width: 1rpx;
  background: rgba(255,255,255,0.3);
}

.overview-label {
  font-size: 26rpx;
  color: rgba(255,255,255,0.8);
  display: block;
  margin-bottom: 10rpx;
}

.overview-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
}

.stats-row {
  display: flex;
  justify-content: space-around;
}

.stat-box {
  text-align: center;
}

.stat-num {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255,255,255,0.8);
}

.settlement-section {
  background: #fff;
  margin-top: 20rpx;
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

.settlement-list {
  padding: 0 30rpx;
}

.settlement-item {
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.order-no {
  font-size: 26rpx;
  color: #999;
}

.status-tag {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.status-tag.pending {
  background: #FFF5F5;
  color: #FF6B6B;
}

.status-tag.settled {
  background: #F6FFED;
  color: #52C41A;
}

.item-body {
  background: #f9f9f9;
  padding: 20rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.amount-row:last-child {
  margin-bottom: 0;
  padding-top: 10rpx;
  border-top: 1rpx dashed #ddd;
  margin-top: 10rpx;
}

.amount-row .label {
  font-size: 26rpx;
  color: #666;
}

.amount-row .value {
  font-size: 26rpx;
  color: #333;
}

.amount-row.deduct .value,
.amount-row.cost .value {
  color: #FF6B6B;
}

.amount-row.income .value {
  color: #52C41A;
  font-weight: bold;
  font-size: 30rpx;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time {
  font-size: 24rpx;
  color: #999;
}

.subsidy {
  font-size: 24rpx;
  color: #52C41A;
  background: #F6FFED;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
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

.withdraw-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 30rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.1);
}

.withdraw-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  color: #fff;
  font-size: 32rpx;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 45rpx;
  border: none;
}

.withdraw-tip {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 20rpx;
}
</style>