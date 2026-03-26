<template>
  <view class="my-service-page">
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

    <!-- 服务列表 -->
    <view class="service-list" v-if="currentServices.length > 0">
      <view
        v-for="item in currentServices"
        :key="item.id"
        class="service-card"
        @click="toDetail(item.id)"
      >
        <view class="service-left">
          <view class="service-icon" :style="{ background: item.iconColor }">
            <text>{{ item.iconEmoji }}</text>
          </view>
        </view>
        <view class="service-right">
          <view class="service-top">
            <view class="service-name">{{ item.name }}</view>
            <view :class="['service-status', item.statusClass]">{{ item.statusText }}</view>
          </view>
          <view class="service-desc">{{ item.description }}</view>
          <view class="service-bottom">
            <text class="service-price">{{ item.priceRange }}</text>
            <text class="service-time">{{ item.updateTime }}</text>
          </view>
        </view>
        <view class="service-actions" @click.stop>
          <view class="action-btn edit" @click="editService(item.id)">编辑</view>
          <view class="action-btn delete" @click="deleteService(item)">删除</view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-icon">🛠️</text>
      <text class="empty-text">暂无发布的服务</text>
      <view class="empty-btn" @click="publishService">去发布</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const currentTab = ref('published')
const tabs = [
  { label: '已发布', value: 'published' },
  { label: '待审核', value: 'pending' },
  { label: '已下架', value: 'offline' }
]

// 模拟我的服务数据
const allServices = ref([])

const currentServices = computed(() => {
  return allServices.value.filter(item => item.status === currentTab.value)
})

const loadServices = () => {
  const stored = uni.getStorageSync('my_services') || []
  if (stored.length > 0) {
    allServices.value = stored
  } else {
    allServices.value = []
  }
}

const toDetail = (id) => {
  uni.navigateTo({ url: `/pages/service/detail?id=${id}` })
}

// 编辑服务
const editService = (id) => {
  uni.navigateTo({
    url: `/subpackages/publish/index?editId=${id}&type=service`
  })
}

const deleteService = (item) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除「${item.name}」吗？`,
    success: (res) => {
      if (res.confirm) {
        allServices.value = allServices.value.filter(s => s.id !== item.id)
        uni.setStorageSync('my_services', allServices.value)
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    }
  })
}

const publishService = () => {
  uni.showToast({ title: '发布功能开发中', icon: 'none' })
}

onShow(() => {
  loadServices()
})
</script>

<style lang="scss" scoped>
.my-service-page {
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

.service-list {
  padding: 20rpx 30rpx;

  .service-card {
    display: flex;
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
    align-items: flex-start;

    .service-left {
      margin-right: 20rpx;

      .service-icon {
        width: 88rpx;
        height: 88rpx;
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40rpx;
      }
    }

    .service-right {
      flex: 1;

      .service-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8rpx;

        .service-name {
          font-size: 30rpx;
          font-weight: 500;
          color: #333;
        }

        .service-status {
          font-size: 22rpx;
          padding: 4rpx 16rpx;
          border-radius: 20rpx;

          &.status-active {
            background: #E8F5E9;
            color: #4CAF50;
          }

          &.status-pending {
            background: #FFF8E1;
            color: #FF9800;
          }

          &.status-offline {
            background: #f5f5f5;
            color: #999;
          }
        }
      }

      .service-desc {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 12rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .service-bottom {
        display: flex;
        justify-content: space-between;

        .service-price {
          font-size: 28rpx;
          color: #E63946;
          font-weight: 500;
        }

        .service-time {
          font-size: 22rpx;
          color: #999;
        }
      }
    }

    .service-actions {
      display: flex;
      flex-direction: column;
      gap: 12rpx;
      margin-left: 16rpx;

      .action-btn {
        padding: 8rpx 20rpx;
        border-radius: 8rpx;
        font-size: 24rpx;

        &.edit {
          background: #FFF3F4;
          color: #E63946;
        }

        &.delete {
          background: #f5f5f5;
          color: #999;
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
