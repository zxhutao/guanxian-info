<template>
  <view class="my-appointment-page">
    <!-- 顶部 Tab 切换 -->
    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab-item', { active: currentTab === tab.value }]"
        @click="currentTab = tab.value"
      >
        <text>{{ tab.label }}</text>
        <view v-if="currentTab === tab.value" class="tab-line"></view>
      </view>
    </view>

    <!-- 预约列表 -->
    <view class="appointment-list" v-if="currentAppointments.length > 0">
      <view
        v-for="item in currentAppointments"
        :key="item.id"
        class="appointment-card"
      >
        <view class="appt-header">
          <view class="appt-type-icon">{{ item.typeIcon }}</view>
          <view class="appt-type-info">
            <view class="appt-type">{{ item.typeName }}</view>
            <view class="appt-id">订单号：{{ item.orderId }}</view>
          </view>
          <view :class="['appt-status', item.statusClass]">{{ item.statusText }}</view>
        </view>

        <view class="appt-body" v-if="item.providerName">
          <view class="appt-info-row">
            <text class="label">服务人员</text>
            <text class="value">{{ item.providerName }}</text>
          </view>
          <view class="appt-info-row">
            <text class="label">预约时间</text>
            <text class="value">{{ item.appointmentTime }}</text>
          </view>
          <view class="appt-info-row">
            <text class="label">联系电话</text>
            <text class="value">{{ item.phone }}</text>
          </view>
          <view class="appt-info-row" v-if="item.address">
            <text class="label">服务地址</text>
            <text class="value">{{ item.address }}</text>
          </view>
          <view class="appt-info-row">
            <text class="label">订单金额</text>
            <text class="value price">¥{{ item.amount }}</text>
          </view>
        </view>

        <view class="appt-footer">
          <text class="appt-time">{{ item.createTime }}</text>
          <view class="appt-actions">
            <view class="action-btn cancel" v-if="item.status === 'pending'" @click="cancelAppointment(item)">取消预约</view>
            <view class="action-btn contact" @click="contactProvider(item)">联系</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-icon">📅</text>
      <text class="empty-text">暂无预约记录</text>
      <view class="empty-btn" @click="goBrowse">去预约服务</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const currentTab = ref('all')
const tabs = [
  { label: '全部', value: 'all' },
  { label: '待服务', value: 'pending' },
  { label: '已完成', value: 'done' },
  { label: '已取消', value: 'cancelled' }
]

// 模拟预约数据
const allAppointments = ref([])

const statusMap = {
  pending: { text: '待服务', class: 'status-pending' },
  done: { text: '已完成', class: 'status-done' },
  cancelled: { text: '已取消', class: 'status-cancelled' }
}

const currentAppointments = computed(() => {
  if (currentTab.value === 'all') return allAppointments.value
  return allAppointments.value.filter(item => item.status === currentTab.value)
})

const loadAppointments = () => {
  const stored = uni.getStorageSync('my_appointments') || []
  if (stored.length > 0) {
    allAppointments.value = stored.map(item => {
      const map = statusMap[item.status] || statusMap.pending
      return { ...item, statusText: map.text, statusClass: map.class }
    })
  } else {
    allAppointments.value = []
  }
}

const cancelAppointment = (item) => {
  uni.showModal({
    title: '确认取消',
    content: '确定要取消这个预约吗？',
    success: (res) => {
      if (res.confirm) {
        const updated = allAppointments.value.map(a => {
          if (a.id === item.id) {
            return { ...a, status: 'cancelled', statusText: '已取消', statusClass: 'status-cancelled' }
          }
          return a
        })
        allAppointments.value = updated
        uni.setStorageSync('my_appointments', updated)
        uni.showToast({ title: '已取消', icon: 'success' })
      }
    }
  })
}

const contactProvider = (item) => {
  if (item.phone) {
    uni.makePhoneCall({ phoneNumber: item.phone })
  } else {
    uni.showToast({ title: '暂无联系方式', icon: 'none' })
  }
}

const goBrowse = () => {
  uni.switchTab({ url: '/pages/service/index' })
}

onShow(() => {
  loadAppointments()
})
</script>

<style lang="scss" scoped>
.my-appointment-page {
  min-height: 100vh;
  background: #F5F5F5;
}

.tab-bar {
  display: flex;
  background: #fff;
  padding: 0 20rpx;
  position: sticky;
  top: 0;
  z-index: 10;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 24rpx 0;
    font-size: 28rpx;
    color: #666;
    position: relative;

    &.active {
      color: #E63946;
      font-weight: 500;
    }

    .tab-line {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60rpx;
      height: 4rpx;
      background: #E63946;
      border-radius: 2rpx;
    }
  }
}

.appointment-list {
  padding: 20rpx 30rpx;

  .appointment-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

    .appt-header {
      display: flex;
      align-items: center;
      padding-bottom: 20rpx;
      border-bottom: 1rpx solid #f5f5f5;
      margin-bottom: 20rpx;

      .appt-type-icon {
        width: 80rpx;
        height: 80rpx;
        background: linear-gradient(135deg, #E63946, #C1121F);
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36rpx;
        margin-right: 20rpx;
      }

      .appt-type-info {
        flex: 1;

        .appt-type {
          font-size: 30rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 6rpx;
        }

        .appt-id {
          font-size: 22rpx;
          color: #999;
        }
      }

      .appt-status {
        font-size: 24rpx;
        padding: 6rpx 20rpx;
        border-radius: 20rpx;

        &.status-pending {
          background: #FFF3E0;
          color: #FF9800;
        }

        &.status-done {
          background: #E8F5E9;
          color: #4CAF50;
        }

        &.status-cancelled {
          background: #f5f5f5;
          color: #999;
        }
      }
    }

    .appt-body {
      margin-bottom: 20rpx;

      .appt-info-row {
        display: flex;
        padding: 10rpx 0;

        .label {
          width: 140rpx;
          font-size: 26rpx;
          color: #999;
        }

        .value {
          flex: 1;
          font-size: 26rpx;
          color: #333;

          &.price {
            color: #E63946;
            font-weight: 500;
            font-size: 30rpx;
          }
        }
      }
    }

    .appt-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20rpx;
      border-top: 1rpx solid #f5f5f5;

      .appt-time {
        font-size: 24rpx;
        color: #999;
      }

      .appt-actions {
        display: flex;
        gap: 16rpx;

        .action-btn {
          padding: 10rpx 28rpx;
          border-radius: 30rpx;
          font-size: 24rpx;

          &.cancel {
            background: #fff;
            border: 1rpx solid #ddd;
            color: #666;
          }

          &.contact {
            background: #E63946;
            color: #fff;
          }
        }
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 160rpx;

  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 30rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }

  .empty-btn {
    background: #E63946;
    color: #fff;
    padding: 20rpx 60rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
  }
}
</style>
