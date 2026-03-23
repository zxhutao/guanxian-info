<template>
  <view class="my-items-page">
    <!-- 顶部 -->
    <view class="header">
      <text class="header-title">我的道具</text>
      <text class="header-subtitle">兑换的优惠券和勋章都在这里</text>
    </view>

    <!-- 分类标签 -->
    <view class="category-tabs">
      <view
        v-for="cat in categories"
        :key="cat.value"
        class="tab-item"
        :class="{ active: currentCategory === cat.value }"
        @click="currentCategory = cat.value"
      >
        {{ cat.label }}
        <text v-if="cat.count > 0" class="tab-badge">{{ cat.count }}</text>
      </view>
    </view>

    <!-- 道具列表 -->
    <view class="items-list">
      <view
        v-for="item in filteredItems"
        :key="item._id"
        class="item-card"
        :class="{ expired: isExpired(item) }"
      >
        <view class="item-icon">{{ item.icon }}</view>
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-desc">{{ getItemDesc(item) }}</text>
          <view class="item-meta">
            <text class="item-time">{{ formatTime(item.createTime) }} 兑换</text>
            <text v-if="item.expireTime" class="item-expire" :class="{ 'near-expire': isNearExpire(item) }">
              {{ isExpired(item) ? '已过期' : '有效期至 ' + formatDate(item.expireTime) }}
            </text>
          </view>
        </view>
        <view class="item-action">
          <view
            v-if="item.status === 'unused' && !isExpired(item)"
            class="use-btn"
            @click="useItem(item)"
          >
            使用
          </view>
          <view v-else-if="item.status === 'used'" class="used-tag">已使用</view>
          <view v-else-if="isExpired(item)" class="expired-tag">已过期</view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="filteredItems.length === 0" class="empty-state">
      <text class="empty-icon">🎁</text>
      <text class="empty-text">暂无{{ currentCategory === 'all' ? '' : categories.find(c => c.value === currentCategory)?.label }}</text>
      <text class="empty-tip">快去积分商城兑换吧！</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentCategory = ref('all')

const categories = [
  { label: '全部', value: 'all', count: 3 },
  { label: '优惠券', value: 'coupon', count: 2 },
  { label: '勋章', value: 'badge', count: 1 }
]

const items = ref([
  {
    _id: '1',
    name: '保洁8折券',
    desc: '冠县本地保洁服务通用',
    icon: '🎫',
    type: 'coupon',
    status: 'unused',
    createTime: Date.now() - 86400000 * 3,
    expireTime: Date.now() + 86400000 * 7
  },
  {
    _id: '2',
    name: '满50减10元券',
    desc: '限冠县合作商家',
    icon: '🎟️',
    type: 'coupon',
    status: 'unused',
    createTime: Date.now() - 86400000 * 10,
    expireTime: Date.now() + 86400000 * 20
  },
  {
    _id: '3',
    name: '连续签到7天勋章',
    desc: '连续签到7天获得',
    icon: '🏆',
    type: 'badge',
    status: 'used',
    createTime: Date.now() - 86400000 * 30,
    expireTime: null
  },
  {
    _id: '4',
    name: '新手礼包券',
    desc: '新用户首日签到奖励',
    icon: '🎁',
    type: 'coupon',
    status: 'expired',
    createTime: Date.now() - 86400000 * 60,
    expireTime: Date.now() - 86400000 * 30
  }
])

const filteredItems = computed(() => {
  let list = items.value
  if (currentCategory.value !== 'all') {
    list = list.filter(item => item.type === currentCategory.value)
  }
  return list
})

const getItemDesc = (item) => {
  return item.desc
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const isExpired = (item) => {
  if (item.status === 'expired') return true
  if (!item.expireTime) return false
  return Date.now() > item.expireTime
}

const isNearExpire = (item) => {
  if (!item.expireTime) return false
  const threeDays = 86400000 * 3
  return Date.now() > item.expireTime - threeDays
}

const useItem = (item) => {
  uni.showToast({ title: '使用成功', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.my-items-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #E63946, #FF6B6B);
  padding: 40rpx 30rpx 60rpx;

  .header-title {
    display: block;
    font-size: 40rpx;
    font-weight: 600;
    color: #fff;
  }

  .header-subtitle {
    display: block;
    font-size: 26rpx;
    color: rgba(255,255,255,0.85);
    margin-top: 10rpx;
  }
}

.category-tabs {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  margin-top: -30rpx;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    background: #fff;
    border-radius: 16rpx;
    font-size: 28rpx;
    color: #666;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

    &.active {
      background: linear-gradient(135deg, #E63946, #FF6B6B);
      color: #fff;
    }

    .tab-badge {
      display: inline-block;
      margin-left: 8rpx;
      padding: 0 10rpx;
      background: #E63946;
      color: #fff;
      font-size: 20rpx;
      border-radius: 20rpx;

      .active & {
        background: #fff;
        color: #E63946;
      }
    }
  }
}

.items-list {
  padding: 0 30rpx;

  .item-card {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

    &.expired {
      opacity: 0.6;
    }

    .item-icon {
      width: 100rpx;
      height: 100rpx;
      background: #FFF5F5;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48rpx;
      margin-right: 20rpx;
    }

    .item-info {
      flex: 1;

      .item-name {
        display: block;
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
      }

      .item-desc {
        display: block;
        font-size: 24rpx;
        color: #999;
        margin-top: 6rpx;
      }

      .item-meta {
        display: flex;
        align-items: center;
        margin-top: 10rpx;
        gap: 16rpx;

        .item-time {
          font-size: 22rpx;
          color: #999;
        }

        .item-expire {
          font-size: 22rpx;
          color: #52c41a;

          &.near-expire {
            color: #faad14;
          }
        }
      }
    }

    .item-action {
      .use-btn {
        background: linear-gradient(135deg, #E63946, #FF6B6B);
        color: #fff;
        font-size: 26rpx;
        padding: 16rpx 28rpx;
        border-radius: 30rpx;
      }

      .used-tag,
      .expired-tag {
        font-size: 24rpx;
        color: #999;
        padding: 16rpx 20rpx;
        background: #f5f5f5;
        border-radius: 30rpx;
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;

  .empty-icon {
    display: block;
    font-size: 100rpx;
    margin-bottom: 20rpx;
  }

  .empty-text {
    display: block;
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
  }

  .empty-tip {
    display: block;
    font-size: 26rpx;
    color: #999;
    margin-top: 10rpx;
  }
}
</style>
