<template>
  <view class="detail-page">
    <!-- 图片轮播 -->
    <swiper class="image-swiper" circular indicator-dots>
      <swiper-item v-for="(img, idx) in detail.images" :key="idx">
        <image class="house-image" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 价格和标签 -->
    <view class="price-section">
      <view class="price-row">
        <text class="price">{{ detail.price }}</text>
        <text class="price-unit">{{ detail.priceUnit }}</text>
      </view>
      <view class="tag-row">
        <text class="tag" :class="detail.type">{{ detail.typeText }}</text>
        <text class="tag verification">认证房源</text>
      </view>
    </view>

    <!-- 基本信息 -->
    <view class="info-card">
      <view class="card-title">基本信息</view>
      <view class="info-grid">
        <view class="info-item">
          <text class="info-label">面积</text>
          <text class="info-value">{{ detail.area }}㎡</text>
        </view>
        <view class="info-item">
          <text class="info-label">户型</text>
          <text class="info-value">{{ detail.layout }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">楼层</text>
          <text class="info-value">{{ detail.floor }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">朝向</text>
          <text class="info-value">{{ detail.direction }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">装修</text>
          <text class="info-value">{{ detail.decoration }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">类型</text>
          <text class="info-value">{{ detail.propertyType }}</text>
        </view>
      </view>
    </view>

    <!-- 房源描述 -->
    <view class="info-card">
      <view class="card-title">房源描述</view>
      <view class="description">
        {{ detail.description }}
      </view>
    </view>

    <!-- 配套设施 -->
    <view class="info-card">
      <view class="card-title">配套设施</view>
      <view class="facility-grid">
        <view
          v-for="item in detail.facilities"
          :key="item.name"
          class="facility-item"
          :class="{ active: item.available }"
        >
          <text class="facility-icon">{{ item.icon }}</text>
          <text class="facility-name">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 位置信息 -->
    <view class="info-card">
      <view class="card-title">位置信息</view>
      <view class="location-row">
        <text class="location-icon">📍</text>
        <text class="location-text">{{ detail.location }}</text>
      </view>
      <view class="map-placeholder">
        <text class="map-text">地图位置</text>
        <text class="map-hint">点击查看完整地图</text>
      </view>
    </view>

    <!-- 发布时间 -->
    <view class="info-card">
      <view class="time-row">
        <text class="time-icon">🕐</text>
        <text class="time-text">发布于 {{ detail.publishTime }}</text>
      </view>
      <view class="time-row">
        <text class="time-icon">👁</text>
        <text class="time-text">浏览 {{ detail.views }} 次</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-icons">
        <view class="action-icon-item" @click="toggleCollect">
          <text class="icon-text">{{ isCollected ? '❤️' : '🤍' }}</text>
          <text class="icon-label">{{ isCollected ? '已收藏' : '收藏' }}</text>
        </view>
        <view class="action-icon-item" @click="shareHouse">
          <text class="icon-text">📤</text>
          <text class="icon-label">分享</text>
        </view>
      </view>
      <view class="contact-btn" @click="contactOwner">
        <text class="btn-text">联系房东</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 模拟详情数据
const detail = ref({
  id: 1,
  type: 'rent',
  typeText: '出租',
  title: '冠县城区精装两室 拎包入住',
  price: '1500',
  priceUnit: '元/月',
  area: '85',
  layout: '2室1厅1卫',
  floor: '中高层/共18层',
  direction: '南北通透',
  decoration: '精装修',
  propertyType: '普通住宅',
  description: '房屋位于冠县城区核心位置，周边配套齐全，交通便利。小区环境优美，物业管理规范。屋内精装修，家具家电齐全，拎包即可入住。采光充足，通风良好。适合家庭租住或合租。',
  location: '冠县城区 振兴路与建设路交汇处',
  publishTime: '3天前',
  views: 256,
  images: [
    'https://picsum.photos/seed/house1a/750/500',
    'https://picsum.photos/seed/house1b/750/500',
    'https://picsum.photos/seed/house1c/750/500'
  ],
  facilities: [
    { name: '空调', icon: '❄️', available: true },
    { name: '热水器', icon: '🚿', available: true },
    { name: '洗衣机', icon: '👕', available: true },
    { name: '冰箱', icon: '🧊', available: true },
    { name: '电视', icon: '📺', available: true },
    { name: '沙发', icon: '🛋️', available: true },
    { name: '床', icon: '🛏️', available: true },
    { name: '衣柜', icon: '👔', available: true },
    { name: '燃气', icon: '🔥', available: true },
    { name: '宽带', icon: '📶', available: true },
    { name: '电梯', icon: '🏢', available: true },
    { name: '停车位', icon: '🚗', available: false }
  ]
})

const isCollected = ref(false)

// 页面加载时获取房源ID
onLoad((options) => {
  if (options.id) {
    // 实际项目中这里根据ID请求数据
    // loadDetail(options.id)
  }
})

const toggleCollect = () => {
  isCollected.value = !isCollected.value
  uni.showToast({
    title: isCollected.value ? '收藏成功' : '已取消收藏',
    icon: 'none'
  })
}

const shareHouse = () => {
  try { uni.showShareMenu({ withShareTicket: true }) } catch (e) {}
}

const contactOwner = () => {
  uni.makePhoneCall({
    phoneNumber: '13812345678',
    fail: () => {
      uni.showToast({ title: '拨打失败', icon: 'none' })
    }
  })
}

// 分享给朋友
onShareAppMessage(() => {
  return {
    title: detail.value.title,
    path: `/pages/house/detail?id=${detail.value.id}`,
    imageUrl: detail.value.images[0]
  }
})
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

.image-swiper {
  width: 100%;
  height: 500rpx;

  .house-image {
    width: 100%;
    height: 100%;
    background: #eee;
  }
}

.price-section {
  background: #fff;
  padding: 24rpx 30rpx;
  margin-bottom: 20rpx;

  .price-row {
    display: flex;
    align-items: baseline;
    margin-bottom: 16rpx;
  }

  .price {
    font-size: 48rpx;
    font-weight: bold;
    color: #E63946;
  }

  .price-unit {
    font-size: 28rpx;
    color: #999;
    margin-left: 8rpx;
  }

  .tag-row {
    display: flex;
    gap: 12rpx;
  }

  .tag {
    padding: 6rpx 16rpx;
    border-radius: 8rpx;
    font-size: 22rpx;
    color: #fff;

    &.rent { background: #E63946; }
    &.sell { background: #4CAF50; }
    &.share { background: #2196F3; }
    &.want_rent { background: #FF9800; }
    &.verification { background: #4CAF50; }
  }
}

.info-card {
  background: #fff;
  padding: 24rpx 30rpx;
  margin-bottom: 20rpx;

  .card-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;

  .info-item {
    width: 30%;
    display: flex;
    flex-direction: column;
    gap: 8rpx;

    .info-label {
      font-size: 24rpx;
      color: #999;
    }

    .info-value {
      font-size: 26rpx;
      color: #333;
    }
  }
}

.description {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.facility-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;

  .facility-item {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;

    .facility-icon {
      font-size: 40rpx;
      opacity: 0.3;
    }

    .facility-name {
      font-size: 22rpx;
      color: #999;
    }

    &.active {
      .facility-icon { opacity: 1; }
      .facility-name { color: #333; }
    }
  }
}

.location-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 20rpx;

  .location-icon { font-size: 28rpx; }
  .location-text { font-size: 28rpx; color: #333; }
}

.map-placeholder {
  height: 300rpx;
  background: #f0f0f0;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;

  .map-text { font-size: 28rpx; color: #999; }
  .map-hint { font-size: 24rpx; color: #ccc; }
}

.time-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 12rpx;

  &:last-child { margin-bottom: 0; }

  .time-icon { font-size: 26rpx; }
  .time-text { font-size: 24rpx; color: #999; }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 16rpx 30rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);

  .action-icons {
    display: flex;
    gap: 30rpx;
  }

  .action-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rpx;

    .icon-text { font-size: 40rpx; }
    .icon-label { font-size: 20rpx; color: #999; }
  }

  .contact-btn {
    flex: 1;
    background: #E63946;
    color: #fff;
    text-align: center;
    padding: 24rpx 0;
    border-radius: 50rpx;
    font-size: 30rpx;
  }
}
</style>
