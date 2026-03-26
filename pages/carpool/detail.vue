<template>
  <view class="detail-page">
    <!-- 司机/乘客信息 -->
    <view class="user-section">
      <image lazy-load class="avatar" :src="detail.avatar" mode="aspectFill" />
      <view class="user-info">
        <view class="user-name">{{ detail.name }}</view>
        <view class="user-meta">
          <text class="star">★★★★★</text>
          <text class="rating">{{ detail.rating }}</text>
          <text class="trips">{{ detail.trips }}次行程</text>
        </view>
      </view>
      <view class="user-badges">
        <text class="badge" v-if="detail.isVerified">已认证</text>
        <text class="badge" v-if="detail.isSuper">超级车主</text>
      </view>
    </view>

    <!-- 行程信息卡片 -->
    <view class="trip-card">
      <view class="route-header">
        <text class="type-tag" :class="detail.type">{{ detail.typeText }}</text>
        <text class="publish-time">发布于 {{ detail.publishTime }}</text>
      </view>

      <!-- 路线 -->
      <view class="route-section">
        <view class="route-point">
          <view class="dot green"></view>
          <view class="route-content">
            <text class="route-label">出发地</text>
            <text class="route-main">{{ detail.from }}</text>
            <text class="route-sub">{{ detail.fromDetail }}</text>
          </view>
        </view>

        <view class="route-line"></view>

        <view class="route-point">
          <view class="dot red"></view>
          <view class="route-content">
            <text class="route-label">目的地</text>
            <text class="route-main">{{ detail.to }}</text>
            <text class="route-sub">{{ detail.toDetail }}</text>
          </view>
        </view>
      </view>

      <!-- 时间和座位 -->
      <view class="trip-detail-row">
        <view class="detail-item">
          <text class="item-icon">📅</text>
          <text class="item-text">{{ detail.date }} {{ detail.time }}</text>
        </view>
        <view class="detail-item">
          <text class="item-icon">💺</text>
          <text class="item-text">剩余 {{ detail.seat }} 个座位</text>
        </view>
      </view>

      <view class="trip-detail-row">
        <view class="detail-item">
          <text class="item-icon">🚗</text>
          <text class="item-text">{{ detail.carType }}</text>
        </view>
        <view class="detail-item">
          <text class="item-icon">📏</text>
          <text class="item-text">约 {{ detail.distance }} 公里</text>
        </view>
      </view>
    </view>

    <!-- 价格 -->
    <view class="price-card">
      <view class="price-label">拼车价格</view>
      <view class="price-row">
        <text class="price">{{ detail.price }}</text>
        <text class="price-unit">元/人</text>
      </view>
      <view class="price-hint">价格已包含过路费，平摊油费</view>
    </view>

    <!-- 备注信息 -->
    <view class="info-card" v-if="detail.notes">
      <view class="card-title">备注</view>
      <view class="notes-text">{{ detail.notes }}</view>
    </view>

    <!-- 安全提醒 -->
    <view class="info-card">
      <view class="card-title safety-title">安全出行提示</view>
      <view class="safety-list">
        <view class="safety-item">
          <text class="safety-icon">✓</text>
          <text class="safety-text">请核实对方身份后再拼车</text>
        </view>
        <view class="safety-item">
          <text class="safety-icon">✓</text>
          <text class="safety-text">上车前确认车牌号与行程一致</text>
        </view>
        <view class="safety-item">
          <text class="safety-icon">✓</text>
          <text class="safety-text">建议将行程分享给家人或朋友</text>
        </view>
        <view class="safety-item">
          <text class="safety-icon">✓</text>
          <text class="safety-text">不要与陌生人私下转账</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-icons">
        <view class="action-icon-item" @click="shareTrip">
          <text class="icon-text">📤</text>
          <text class="icon-label">分享</text>
        </view>
      </view>
      <view class="action-btns">
        <view class="call-btn" @click="makeCall">
          <text class="btn-icon">📞</text>
          <text class="btn-text">拨打电话</text>
        </view>
        <view class="book-btn" @click="bookTrip">
          <text class="btn-text">立即预约</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const detail = ref({
  id: 1,
  type: 'find_car',
  typeText: '车找人',
  name: '张师傅',
  avatar: 'https://picsum.photos/seed/driver1/100/100',
  rating: 4.9,
  trips: 328,
  isVerified: true,
  isSuper: false,
  publishTime: '刚刚发布',
  from: '冠县城区',
  fromDetail: '振兴路附近，上门接人',
  to: '聊城市区',
  toDetail: '聊城汽车总站',
  date: '今天',
  time: '08:00',
  seat: '3',
  carType: '大众帕萨特 · 黑色',
  distance: '80',
  price: '30',
  notes: '车内整洁，禁止吸烟，可带小件行李。顺路的可以提前联系我，方便安排时间。',
  phone: '13812345678'
})

const shareTrip = () => {
  enableShareMenu()
}

const enableShareMenu = () => {
  // #ifdef MP-WEIXIN
  uni.showShareMenu({ withShareTicket: true }).catch(() => {
    // 分享菜单已禁用或出错，静默处理
  })
  // #endif
}

const makeCall = () => {
  uni.makePhoneCall({
    phoneNumber: detail.value.phone,
    fail: () => {
      uni.showToast({ title: '拨打失败', icon: 'none' })
    }
  })
}

const bookTrip = () => {
  uni.showModal({
    title: '预约确认',
    content: `确认预约 ${detail.value.from} → ${detail.value.to}？\n出发时间：${detail.value.date} ${detail.value.time}\n价格：${detail.value.price}元/人`,
    confirmText: '确认预约',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '预约成功，请等待车主联系', icon: 'none' })
      }
    }
  })
}

onShareAppMessage(() => {
  return {
    title: `${detail.value.from} → ${detail.value.to} 顺风车`,
    path: `/pages/carpool/detail?id=${detail.value.id}`,
    imageUrl: detail.value.avatar
  }
})
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 140rpx;
}

.user-section {
  background: #fff;
  padding: 30rpx;
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: #eee;
  }

  .user-info {
    flex: 1;
    margin-left: 20rpx;

    .user-name {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 8rpx;
    }

    .user-meta {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .star {
        color: #FF9800;
        font-size: 22rpx;
      }

      .rating {
        font-size: 24rpx;
        color: #FF9800;
        font-weight: bold;
      }

      .trips {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .user-badges {
    display: flex;
    flex-direction: column;
    gap: 8rpx;

    .badge {
      padding: 4rpx 12rpx;
      border-radius: 6rpx;
      font-size: 20rpx;
      background: #4CAF50;
      color: #fff;
    }
  }
}

.trip-card {
  background: #fff;
  padding: 24rpx 30rpx;
  margin-bottom: 20rpx;

  .route-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;

    .type-tag {
      padding: 6rpx 16rpx;
      border-radius: 8rpx;
      font-size: 24rpx;
      color: #fff;

      &.find_car { background: #9C27B0; }
      &.find_person { background: #2196F3; }
    }

    .publish-time {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.route-section {
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;

  .route-point {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;

    .dot {
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      margin-top: 8rpx;
      flex-shrink: 0;

      &.green { background: #4CAF50; }
      &.red { background: #E63946; }
    }

    .route-content {
      display: flex;
      flex-direction: column;
      gap: 4rpx;
    }

    .route-label {
      font-size: 22rpx;
      color: #999;
    }

    .route-main {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }

    .route-sub {
      font-size: 24rpx;
      color: #666;
    }
  }

  .route-line {
    width: 2rpx;
    height: 30rpx;
    background: #ddd;
    margin: 10rpx 0 10rpx 9rpx;
  }
}

.trip-detail-row {
  display: flex;
  gap: 40rpx;
  margin-bottom: 16rpx;

  &:last-child { margin-bottom: 0; }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 8rpx;

    .item-icon { font-size: 28rpx; }
    .item-text { font-size: 28rpx; color: #333; }
  }
}

.price-card {
  background: #fff;
  padding: 24rpx 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  gap: 30rpx;

  .price-label {
    font-size: 26rpx;
    color: #999;
  }

  .price-row {
    display: flex;
    align-items: baseline;
    gap: 4rpx;
  }

  .price {
    font-size: 48rpx;
    font-weight: bold;
    color: #9C27B0;
  }

  .price-unit {
    font-size: 26rpx;
    color: #999;
  }

  .price-hint {
    font-size: 22rpx;
    color: #ccc;
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
    margin-bottom: 16rpx;
  }

  .safety-title {
    color: #FF9800;
  }
}

.notes-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.safety-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  .safety-item {
    display: flex;
    align-items: center;
    gap: 12rpx;

    .safety-icon {
      width: 36rpx;
      height: 36rpx;
      background: #E8F5E9;
      color: #4CAF50;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      font-weight: bold;
    }

    .safety-text {
      font-size: 26rpx;
      color: #666;
    }
  }
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

  .action-btns {
    flex: 1;
    display: flex;
    gap: 16rpx;
  }

  .call-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    background: #fff;
    border: 2rpx solid #9C27B0;
    color: #9C27B0;
    padding: 20rpx 24rpx;
    border-radius: 50rpx;
    font-size: 28rpx;

    .btn-icon { font-size: 32rpx; }
  }

  .book-btn {
    flex: 1;
    background: #9C27B0;
    color: #fff;
    text-align: center;
    padding: 24rpx 0;
    border-radius: 50rpx;
    font-size: 30rpx;
  }
}
</style>
