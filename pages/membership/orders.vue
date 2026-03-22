<template>
  <view class="orders-page">
    <!-- 状态筛选 -->
    <view class="tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.key"
        class="tab-item"
        :class="{ active: currentTab === tab.key }"
        @click="currentTab = tab.key"
      >
        <text>{{ tab.name }}</text>
        <view class="tab-line" v-if="currentTab === tab.key"></view>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list" v-if="filteredOrders.length > 0">
      <view 
        v-for="order in filteredOrders" 
        :key="order.id"
        class="order-card"
        @click="viewDetail(order)"
      >
        <view class="order-header">
          <view class="order-type" :class="order.type">
            <u-icon :name="order.type === 'service' ? 'server-man' : 'account-fill'" size="28rpx" color="#fff" />
            <text>{{ order.typeName }}</text>
          </view>
          <view class="order-status" :class="order.status">
            <text>{{ order.statusText }}</text>
          </view>
        </view>
        
        <view class="order-body">
          <view class="order-title">{{ order.title }}</view>
          <view class="order-info">
            <text class="order-time">{{ order.date }}</text>
            <text class="order-price">¥{{ order.price }}</text>
          </view>
        </view>
        
        <view class="order-footer">
          <view class="order-actions" v-if="order.status === 'pending'">
            <view class="action-btn cancel" @click.stop="cancelOrder(order)">取消订单</view>
            <view class="action-btn confirm" @click.stop="confirmOrder(order)">确认完成</view>
          </view>
          <view class="order-actions" v-else-if="order.status === 'completed'">
            <view class="action-btn rate" @click.stop="rateOrder(order)">去评价</view>
          </view>
          <view class="order-hint" v-else>
            {{ order.status === 'cancelled' ? '订单已取消' : '订单已完成' }}
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <u-icon name="file-text" size="120rpx" color="#ddd" />
      <text class="empty-text">暂无订单</text>
      <text class="empty-hint">快去预约服务吧</text>
      <view class="empty-btn" @click="goService">去看看服务</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentTab = ref('all')

const tabs = [
  { key: 'all', name: '全部' },
  { key: 'pending', name: '待完成' },
  { key: 'completed', name: '已完成' },
  { key: 'cancelled', name: '已取消' }
]

// 模拟订单数据
const orders = ref([
  {
    id: '1001',
    type: 'service',
    typeName: '生活服务',
    title: '专业保洁服务 - 三室一厅',
    date: '2026-03-20 14:30',
    price: 198,
    status: 'completed',
    statusText: '已完成',
    provider: '李师傅'
  },
  {
    id: '1002',
    type: 'nursing',
    typeName: '养老护工',
    title: '全天陪护 - 医院陪护',
    date: '2026-03-18 08:00',
    price: 280,
    status: 'completed',
    statusText: '已完成',
    provider: '王阿姨'
  },
  {
    id: '1003',
    type: 'service',
    typeName: '生活服务',
    title: '家电维修 - 空调清洗',
    date: '2026-03-22 10:00',
    price: 120,
    status: 'pending',
    statusText: '待完成',
    provider: '张师傅'
  }
])

const filteredOrders = computed(() => {
  if (currentTab.value === 'all') return orders.value
  return orders.value.filter(o => o.status === currentTab.value)
})

const viewDetail = (order) => {
  uni.showModal({
    title: '订单详情',
    content: `订单号：${order.id}\n服务类型：${order.typeName}\n服务人员：${order.provider}\n预约时间：${order.date}\n订单金额：¥${order.price}\n状态：${order.statusText}`,
    showCancel: false
  })
}

const cancelOrder = (order) => {
  uni.showModal({
    title: '取消订单',
    content: '确定要取消这个订单吗？',
    success: (res) => {
      if (res.confirm) {
        order.status = 'cancelled'
        order.statusText = '已取消'
        uni.showToast({ title: '订单已取消', icon: 'success' })
      }
    }
  })
}

const confirmOrder = (order) => {
  uni.showModal({
    title: '确认完成',
    content: '确认服务已完成吗？',
    success: (res) => {
      if (res.confirm) {
        order.status = 'completed'
        order.statusText = '已完成'
        uni.showToast({ title: '已确认完成', icon: 'success' })
      }
    }
  })
}

const rateOrder = (order) => {
  uni.showToast({ title: '评价功能开发中', icon: 'none' })
}

const goService = () => {
  uni.switchTab({ url: '/pages/service/list' })
}
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.tabs {
  display: flex;
  background: #fff;
  padding: 0 20rpx;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  position: relative;
  font-size: 28rpx;
  color: #666;
}

.tab-item.active {
  color: #667eea;
  font-weight: 600;
}

.tab-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background: #667eea;
  border-radius: 3rpx;
}

.order-list {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.order-type {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.order-type.service { background: #E3F2FD; color: #2196F3; }
.order-type.nursing { background: #FCE4EC; color: #E91E63; }

.order-status {
  font-size: 26rpx;
  font-weight: 500;
}

.order-status.pending { color: #FF9800; }
.order-status.completed { color: #4CAF50; }
.order-status.cancelled { color: #999; }

.order-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 12rpx;
}

.order-info {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #999;
}

.order-price {
  color: #E63946;
  font-weight: 600;
}

.order-footer {
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f5f5f5;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}

.action-btn {
  padding: 12rpx 28rpx;
  border-radius: 30rpx;
  font-size: 26rpx;
}

.action-btn.cancel {
  border: 1rpx solid #ddd;
  color: #666;
}

.action-btn.confirm {
  background: #667eea;
  color: #fff;
}

.action-btn.rate {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #fff;
}

.order-hint {
  text-align: right;
  font-size: 24rpx;
  color: #999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 32rpx;
  color: #666;
  margin-top: 20rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: #999;
  margin-top: 10rpx;
}

.empty-btn {
  margin-top: 30rpx;
  padding: 20rpx 50rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
}
</style>
