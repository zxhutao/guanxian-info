<template>
  <view class="info-page">
    <!-- 分类标签 -->
    <view class="category-tabs">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @click="currentTab = index"
      >
        {{ tab }}
      </view>
    </view>

    <!-- 资讯列表 -->
    <scroll-view scroll-y class="info-list" @scrolltolower="loadMore">
      <view 
        v-for="item in infoList" 
        :key="item.id"
        class="info-card"
        @click="toDetail(item.id)"
      >
        <image class="info-img" :src="item.image" mode="aspectFill" />
        <view class="info-content">
          <text class="info-title">{{ item.title }}</text>
          <view class="info-footer">
            <text class="info-source">{{ item.source }}</text>
            <text class="info-time">{{ item.time }}</text>
          </view>
        </view>
      </view>

      <view class="load-more">
        <text v-if="loading">加载中...</text>
        <text v-else>没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const currentTab = ref(0)
const loading = ref(false)
const tabs = ['推荐', '热点', '招聘', '生活', '政策']

const infoList = ref([
  { id: 1, title: '冠县2024年春季大型招聘会成功举办', image: '/static/images/avatar.png', source: '冠县资讯', time: '2小时前' },
  { id: 2, title: '冠县多家企业高薪招聘，月薪过万不是梦', image: '/static/images/avatar.png', source: '就业频道', time: '5小时前' },
  { id: 3, title: '冠县养老服务新政策出台，最高补贴5000元', image: '/static/images/avatar.png', source: '政策解读', time: '昨天' },
  { id: 4, title: '冠县城区新增多条公交线路，出行更方便', image: '/static/images/avatar.png', source: '生活服务', time: '昨天' },
  { id: 5, title: '冠县玻璃厂急招普工，待遇优厚', image: '/static/images/avatar.png', source: '招聘信息', time: '2天前' }
])

const toDetail = (id) => {
  uni.showToast({ title: '点击查看详情', icon: 'none' })
}

const loadMore = () => {
  if (loading.value) return
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}
</script>

<style lang="scss" scoped>
.info-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.category-tabs {
  display: flex;
  background: #fff;
  padding: 20rpx 0;
  overflow-x: scroll;

  .tab-item {
    flex-shrink: 0;
    padding: 16rpx 32rpx;
    font-size: 28rpx;
    color: #666;
    position: relative;

    &.active {
      color: #E63946;
      font-weight: bold;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background: #E63946;
        border-radius: 2rpx;
      }
    }
  }
}

.info-list {
  height: calc(100vh - 100rpx);
  padding: 20rpx;

  .info-card {
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
    display: flex;
    gap: 20rpx;
    padding: 20rpx;

    .info-img {
      width: 200rpx;
      height: 150rpx;
      border-radius: 12rpx;
      background: #eee;
      flex-shrink: 0;
    }

    .info-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .info-title {
        font-size: 30rpx;
        font-weight: 500;
        color: #333;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .info-footer {
        display: flex;
        justify-content: space-between;
        font-size: 22rpx;
        color: #999;
      }
    }
  }

  .load-more {
    text-align: center;
    padding: 30rpx;
    color: #999;
    font-size: 26rpx;
  }
}
</style>
