<template>
  <view class="coupon-page">
    <!-- 顶部 Tab -->
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

    <!-- 优惠券列表 -->
    <view class="coupon-list" v-if="currentCoupons.length > 0">
      <view
        v-for="item in currentCoupons"
        :key="item.id"
        :class="['coupon-card', item.statusClass]"
      >
        <view class="coupon-left">
          <view class="coupon-price">
            <text class="unit">¥</text>
            <text class="amount">{{ item.value }}</text>
          </view>
          <view class="coupon-condition">{{ item.condition }}</view>
        </view>
        <view class="coupon-right">
          <view class="coupon-name">{{ item.name }}</view>
          <view class="coupon-desc">{{ item.description }}</view>
          <view class="coupon-time">有效期至 {{ item.expireTime }}</view>
          <view class="coupon-use" v-if="item.status === 'available'" @click="useCoupon(item)">
            立即使用
          </view>
          <view class="coupon-status-text" v-else>{{ item.statusText }}</view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-icon">🎫</text>
      <text class="empty-text">{{ currentTab === 'available' ? '暂无可用优惠券' : currentTab === 'used' ? '暂无已使用优惠券' : '暂无已过期优惠券' }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentTab = ref('available')
const tabs = [
  { label: '可用', value: 'available' },
  { label: '已使用', value: 'used' },
  { label: '已过期', value: 'expired' }
]

// 模拟优惠券数据
const allCoupons = ref([
  {
    id: 1,
    name: '新人专享券',
    value: '10',
    condition: '满50元可用',
    description: '限家政保洁服务使用',
    expireTime: '2026-03-31',
    status: 'available',
    statusClass: 'coupon-available',
    statusText: ''
  },
  {
    id: 2,
    name: '保洁满减券',
    value: '20',
    condition: '满100元可用',
    description: '限生活服务全品类',
    expireTime: '2026-04-15',
    status: 'available',
    statusClass: 'coupon-available',
    statusText: ''
  },
  {
    id: 3,
    name: '护工服务券',
    value: '30',
    condition: '满200元可用',
    description: '限养老护理服务',
    expireTime: '2026-03-10',
    status: 'used',
    statusClass: 'coupon-used',
    statusText: '已使用'
  },
  {
    id: 4,
    name: '搬家服务券',
    value: '15',
    condition: '无门槛',
    description: '限搬家货运服务',
    expireTime: '2026-02-28',
    status: 'expired',
    statusClass: 'coupon-expired',
    statusText: '已过期'
  }
])

const currentCoupons = computed(() => {
  return allCoupons.value.filter(item => item.status === currentTab.value)
})

const useCoupon = (item) => {
  uni.showToast({ title: '请在结算时使用优惠券', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.coupon-page {
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

.coupon-list {
  padding: 20rpx 30rpx;

  .coupon-card {
    display: flex;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

    &.coupon-available {
      background: linear-gradient(135deg, #E63946 0%, #C1121F 100%);

      .coupon-condition {
        color: rgba(255, 255, 255, 0.8);
      }
    }

    &.coupon-used {
      background: #ccc;
    }

    &.coupon-expired {
      background: #ddd;
    }

    .coupon-left {
      width: 220rpx;
      padding: 30rpx 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-right: 2rpx dashed rgba(255, 255, 255, 0.3);

      .coupon-price {
        display: flex;
        align-items: baseline;
        color: #fff;

        .unit {
          font-size: 28rpx;
          margin-right: 4rpx;
        }

        .amount {
          font-size: 56rpx;
          font-weight: bold;
        }
      }

      .coupon-condition {
        font-size: 22rpx;
        margin-top: 8rpx;
      }
    }

    .coupon-right {
      flex: 1;
      padding: 24rpx;
      background: #fff;

      .coupon-name {
        font-size: 30rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 8rpx;
      }

      .coupon-desc {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 8rpx;
      }

      .coupon-time {
        font-size: 22rpx;
        color: #999;
        margin-bottom: 12rpx;
      }

      .coupon-use {
        display: inline-block;
        background: #E63946;
        color: #fff;
        padding: 8rpx 24rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
      }

      .coupon-status-text {
        font-size: 24rpx;
        color: #999;
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
  }
}
</style>
