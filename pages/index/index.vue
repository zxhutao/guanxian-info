<template>
  <view class="index-page">
    <!-- 顶部搜索栏 -->
    <view class="search-box">
      <view class="search-bar" @click="toSearch">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索职位/服务/护工</text>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="banner-section">
      <swiper
        class="banner-swiper"
        :autoplay="true"
        :circular="true"
        :indicator-dots="true"
        :interval="3000"
        :duration="500"
      >
        <!-- 品牌展示 Banner -->
        <swiper-item>
          <view class="banner-item brand-banner">
            <image class="brand-logo" src="/static/images/logo.png" mode="aspectFit" :lazy-load="true" />
            <view class="brand-info">
              <text class="brand-name">冠帮帮</text>
              <text class="brand-slogan">冠县人必备的生活入口</text>
              <view class="brand-tags">
                <text class="brand-tag">招聘</text>
                <text class="brand-tag-dot">·</text>
                <text class="brand-tag">服务</text>
                <text class="brand-tag-dot">·</text>
                <text class="brand-tag">养老</text>
              </view>
            </view>
          </view>
        </swiper-item>
        <!-- 功能宣传 Banner -->
        <swiper-item>
          <view class="banner-item" style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);">
            <text class="banner-text">找工作</text>
            <text class="banner-sub">本地工厂直招 · 包吃包住</text>
          </view>
        </swiper-item>
        <swiper-item>
          <view class="banner-item" style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);">
            <text class="banner-text">养老护理</text>
            <text class="banner-sub">专业护工 · 放心托付</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-entry">
      <view
        v-for="item in quickEntries"
        :key="item.label"
        class="entry-item"
        @click="navigateTo(item.path)"
      >
        <view class="entry-icon" :style="{ background: item.color }">
          <text class="entry-text">{{ item.icon }}</text>
        </view>
        <text class="entry-label">{{ item.label }}</text>
      </view>
    </view>

    <!-- 热门职位 -->
    <view class="section">
      <view class="section-header">
        <view class="section-title-box">
          <text class="section-title">热门职位</text>
          <text class="section-tag">HOT</text>
        </view>
        <view class="section-more" @click="toJobList">
          <text>更多</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <view class="job-list">
        <view
          v-for="job in hotJobs"
          :key="job.id"
          class="job-card"
          @click="toJobDetail(job.id)"
        >
          <view class="job-header">
            <text class="job-title">{{ job.title }}</text>
            <text class="job-salary">{{ job.salary }}</text>
          </view>
          <view class="job-company">
            <text>🏢 {{ job.company }}</text>
          </view>
          <view class="job-footer">
            <view class="job-tags">
              <text v-for="tag in job.tags" :key="tag" class="tag">{{ tag }}</text>
            </view>
            <view class="job-location">
              <text>📍 {{ job.location }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 推荐服务 -->
    <view class="section">
      <view class="section-header">
        <view class="section-title-box">
          <text class="section-title">生活服务</text>
        </view>
        <view class="section-more" @click="toServiceList">
          <text>更多</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <view class="service-grid">
        <view
          v-for="service in services"
          :key="service.name"
          class="service-item"
          @click="toServiceDetail(service)"
        >
          <view class="service-icon">{{ service.icon }}</view>
          <text class="service-name">{{ service.name }}</text>
        </view>
      </view>
    </view>

    <!-- 护工推荐 -->
    <view class="section">
      <view class="section-header">
        <view class="section-title-box">
          <text class="section-title">金牌护工</text>
        </view>
        <view class="section-more" @click="toNursingList">
          <text>更多</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <view class="caregiver-list">
        <view
          v-for="caregiver in caregivers"
          :key="caregiver.id"
          class="caregiver-card"
          @click="toCaregiverDetail(caregiver.id)"
        >
          <view class="caregiver-avatar">👩</view>
          <view class="caregiver-info">
            <view class="caregiver-name">{{ caregiver.name }}</view>
            <view class="caregiver-tags">
              <text class="caregiver-tag">{{ caregiver.experience }}年经验</text>
              <text class="caregiver-tag">{{ caregiver.skill }}</text>
            </view>
            <view class="caregiver-price">{{ caregiver.price }}</view>
          </view>
          <view class="caregiver-rating">
            <text>⭐ {{ caregiver.rating }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// 使用 shallowRef 减少深层响应式开销，提升性能
// 热门职位 - 静态数据（使用 Object.freeze 冻结）
const hotJobs = shallowRef(Object.freeze([
  { id: 1, title: '普工/操作工', company: '冠县光明玻璃厂', salary: '5000-8000元/月', location: '冠县工业园区', tags: ['包吃', '包住', '五险'] },
  { id: 2, title: '质检员', company: '山东华兴金属', salary: '4500-6000元/月', location: '冠县开发区', tags: ['长白班', '环境好'] },
  { id: 3, title: '叉车司机', company: '冠县顺达物流', salary: '5500-7000元/月', location: '冠县物流园', tags: ['持证上岗', '加班费'] }
]))

// 生活服务 - 冻结数据
const services = shallowRef(Object.freeze([
  { name: '家政保洁', icon: '🧹', category: 'housekeeping' },
  { name: '家电维修', icon: '🔧', category: 'appliance' },
  { name: '开锁疏通', icon: '🔑', category: 'locksmith' },
  { name: '搬家货运', icon: '🚚', category: 'moving' },
  { name: '餐饮外卖', icon: '🍔', category: 'food' },
  { name: '婚庆摄影', icon: '📷', category: 'photo' },
  { name: '装修建材', icon: '🏠', category: 'renovation' },
  { name: '汽车服务', icon: '🚗', category: 'car' }
]))

// 护工推荐 - 静态数据（冻结）
const caregivers = shallowRef(Object.freeze([
  { id: 1, name: '张阿姨', experience: 5, skill: '老年护理', price: '200元/天', rating: 4.9 },
  { id: 2, name: '李大姐', experience: 3, skill: '康复护理', price: '220元/天', rating: 4.8 }
]))

// 快捷入口 - 使用 Object.freeze 冻结
const quickEntries = Object.freeze([
  { icon: '💼', label: '找工作', path: '/pages/job/list', color: '#E63946' },
  { icon: '🔧', label: '生活服务', path: '/pages/service/index', color: '#FF6B35' },
  { icon: '👴', label: '养老护理', path: '/pages/nursing/index', color: '#4CAF50' },
  { icon: '🏠', label: '房屋租售', path: '/pages/house/list', color: '#2196F3' },
  { icon: '🚗', label: '顺风车', path: '/pages/carpool/list', color: '#9C27B0' },
  { icon: '📰', label: '本地资讯', path: '/pages/info/index', color: '#FF9800' }
])

// 跳转搜索
const toSearch = () => {
  uni.navigateTo({ url: '/subpackages/search/index' })
}

// 导航
const navigateTo = (path) => {
  const tabPages = ['/pages/index/index', '/pages/job/list', '/pages/service/index', '/pages/nursing/index', '/pages/user/index']
  if (tabPages.includes(path)) {
    uni.switchTab({ url: path })
  } else {
    uni.navigateTo({ url: path })
  }
}

const toJobList = () => uni.switchTab({ url: '/pages/job/list' })
const toJobDetail = (id) => uni.navigateTo({ url: `/pages/job/detail?id=${id}` })
const toServiceList = () => uni.switchTab({ url: '/pages/service/index' })
const toServiceDetail = (service) => {
  uni.navigateTo({ url: `/pages/service/detail?category=${service.category}` })
}
const toNursingList = () => uni.switchTab({ url: '/pages/nursing/index' })
const toCaregiverDetail = (id) => uni.navigateTo({ url: `/pages/nursing/detail?id=${id}` })
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 20rpx;
}

.search-box {
  background: linear-gradient(135deg, #E63946 0%, #C1121F 100%);
  padding: 20rpx 30rpx 40rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 50rpx;
  padding: 20rpx 30rpx;
  gap: 16rpx;

  .search-icon {
    font-size: 28rpx;
  }

  .search-placeholder {
    color: #999;
    font-size: 28rpx;
  }
}

.banner-section {
  margin: -30rpx 30rpx 20rpx;

  .banner-swiper {
    height: 320rpx;
    border-radius: 16rpx;
    overflow: hidden;
  }

  .banner-item {
    width: 100%;
    height: 320rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
  }

  .banner-text {
    font-size: 48rpx;
    font-weight: bold;
    color: #fff;
  }

  .banner-sub {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
  }

  /* 品牌展示 Banner */
  .brand-banner {
    background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 40rpx;
    padding: 0 40rpx;
  }

  .brand-logo {
    width: 180rpx;
    height: 180rpx;
    border-radius: 30rpx;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
  }

  .brand-info {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
  }

  .brand-name {
    font-size: 56rpx;
    font-weight: bold;
    color: #fff;
    letter-spacing: 4rpx;
  }

  .brand-slogan {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.85);
  }

  .brand-tags {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-top: 8rpx;
  }

  .brand-tag {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.95);
    font-weight: 500;
  }

  .brand-tag-dot {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.5);
  }
}

.quick-entry {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 20rpx;
  background: #fff;
  margin: 0 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

  .entry-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;

    .entry-icon {
      width: 88rpx;
      height: 88rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .entry-text {
        font-size: 40rpx;
      }
    }

    .entry-label {
      font-size: 24rpx;
      color: #333;
    }
  }
}

.section {
  margin: 30rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title-box {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .section-tag {
        font-size: 20rpx;
        color: #fff;
        background: #E63946;
        padding: 4rpx 12rpx;
        border-radius: 8rpx;
      }
    }

    .section-more {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 24rpx;
      color: #999;

      .arrow {
        font-size: 32rpx;
      }
    }
  }
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .job-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;

      .job-title {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
      }

      .job-salary {
        font-size: 32rpx;
        color: #E63946;
        font-weight: 500;
      }
    }

    .job-company {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 16rpx;
    }

    .job-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .job-tags {
        display: flex;
        gap: 12rpx;

        .tag {
          padding: 6rpx 16rpx;
          background: #FFF0F0;
          color: #E63946;
          font-size: 22rpx;
          border-radius: 8rpx;
        }
      }

      .job-location {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  background: #fff;
  padding: 24rpx;
  border-radius: 16rpx;

  .service-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;

    .service-icon {
      width: 80rpx;
      height: 80rpx;
      background: #F5F5F5;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
    }

    .service-name {
      font-size: 22rpx;
      color: #333;
      text-align: center;
    }
  }
}

.caregiver-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .caregiver-card {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    gap: 20rpx;

    .caregiver-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      background: #F0F0F0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 60rpx;
    }

    .caregiver-info {
      flex: 1;

      .caregiver-name {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 8rpx;
      }

      .caregiver-tags {
        display: flex;
        gap: 12rpx;
        margin-bottom: 8rpx;

        .caregiver-tag {
          padding: 4rpx 12rpx;
          background: #F0F0F0;
          color: #666;
          font-size: 22rpx;
          border-radius: 6rpx;
        }
      }

      .caregiver-price {
        font-size: 28rpx;
        color: #E63946;
        font-weight: 500;
      }
    }

    .caregiver-rating {
      font-size: 26rpx;
      color: #FFB800;
    }
  }
}

.bottom-space {
  height: 100rpx;
}
</style>
