<template>
  <view class="service-page">
    <view class="category-list">
      <view 
        v-for="(item, index) in categories" 
        :key="index"
        class="category-item"
        :class="{ active: currentCategory === index }"
        @click="currentCategory = index"
      >
        <text class="category-icon">{{ item.icon }}</text>
        <text class="category-name">{{ item.name }}</text>
      </view>
    </view>

    <scroll-view scroll-y class="service-list">
      <view 
        v-for="service in services" 
        :key="service.id"
        class="service-card"
        @click="toDetail(service.id)"
      >
        <view class="service-icon">{{ service.icon }}</view>
        <view class="service-info">
          <text class="service-name">{{ service.name }}</text>
          <text class="service-desc">{{ service.desc }}</text>
          <text class="service-price">{{ service.price }}</text>
        </view>
        <view class="service-btn">预约</view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const currentCategory = ref(0)

const categories = ref([
  { icon: '🧹', name: '家政保洁' },
  { icon: '🔧', name: '家电维修' },
  { icon: '🔑', name: '开锁疏通' },
  { icon: '📦', name: '搬家货运' },
  { icon: '🍜', name: '餐饮外卖' },
  { icon: '🎥', name: '婚庆摄影' },
  { icon: '🏠', name: '装修建材' },
  { icon: '🚗', name: '汽车服务' }
])

const services = ref([
  { id: 1, icon: '🧹', name: '日常保洁', desc: '专业家政人员上门服务', price: '50元/小时' },
  { id: 2, icon: '🔧', name: '空调维修', desc: '专业师傅，快速上门', price: '50元起' },
  { id: 3, icon: '🔑', name: '开锁服务', desc: '24小时快速上门', price: '80元起' },
  { id: 4, icon: '📦', name: '搬家服务', desc: '居民搬家，公司搬迁', price: '200元起' },
  { id: 5, icon: '🧹', name: '深度保洁', desc: '新房开荒，深度清洁', price: '200元起' },
  { id: 6, icon: '🔧', name: '水电维修', desc: '水管电路维修安装', price: '60元起' }
])

const toDetail = (id) => {
  uni.navigateTo({ url: `/pages/service/detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
.service-page {
  display: flex;
  height: 100vh;
}

.category-list {
  width: 200rpx;
  background: #fff;
  height: 100%;
  overflow-y: scroll;

  .category-item {
    padding: 30rpx 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &.active {
      background: #f5f5f5;
      border-left: 6rpx solid #E63946;
    }

    .category-icon {
      font-size: 40rpx;
    }

    .category-name {
      font-size: 24rpx;
      color: #333;
    }
  }
}

.service-list {
  flex: 1;
  padding: 20rpx;
  background: #f5f5f5;

  .service-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    gap: 20rpx;

    .service-icon {
      width: 100rpx;
      height: 100rpx;
      background: #f5f5f5;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48rpx;
    }

    .service-info {
      flex: 1;

      .service-name {
        font-size: 30rpx;
        font-weight: bold;
        display: block;
        margin-bottom: 8rpx;
      }

      .service-desc {
        font-size: 24rpx;
        color: #999;
        display: block;
        margin-bottom: 8rpx;
      }

      .service-price {
        font-size: 28rpx;
        color: #E63946;
        font-weight: bold;
      }
    }

    .service-btn {
      padding: 16rpx 30rpx;
      background: #E63946;
      color: #fff;
      border-radius: 30rpx;
      font-size: 26rpx;
    }
  }
}
</style>
