<template>
  <view class="points-shop-page">
    <!-- 顶部背景 -->
    <view class="header-bg">
      <view class="header-content">
        <text class="header-title">积分商城</text>
        <text class="header-subtitle">积分当钱花，好礼免费拿！</text>
      </view>
    </view>

    <!-- 积分卡片 -->
    <view class="points-card">
      <view class="points-info">
        <view class="points-item">
          <text class="points-label">我的积分</text>
          <text class="points-value">{{ userPoints }}</text>
        </view>
        <view class="points-divider"></view>
        <view class="points-item">
          <text class="points-label">累计获得</text>
          <text class="points-value total">{{ totalPoints }}</text>
        </view>
      </view>
      <view class="points-tips" @click="goCheckin">
        <text class="tips-icon">🎁</text>
        <text class="tips-text">每日签到可获10积分，连续签到奖励更大</text>
        <text class="tips-arrow">›</text>
      </view>
    </view>

    <!-- 分类标签 -->
    <view class="category-tabs">
      <scroll-view scroll-x class="tabs-scroll">
        <view
          v-for="cat in categories"
          :key="cat.value"
          class="tab-item"
          :class="{ active: currentCategory === cat.value }"
          @click="currentCategory = cat.value"
        >
          {{ cat.name }}
        </view>
      </scroll-view>
    </view>

    <!-- 商品列表 -->
    <view class="goods-list">
      <view
        v-for="item in filteredGoods"
        :key="item.id"
        class="goods-item"
        @click="goGoodsDetail(item)"
      >
        <image class="goods-image" :src="item.image" mode="aspectFill" />
        <view class="goods-info">
          <text class="goods-name">{{ item.name }}</text>
          <text class="goods-desc">{{ item.description }}</text>
          <view class="goods-bottom">
            <view class="goods-price">
              <text class="price-icon">💰</text>
              <text class="price-value">{{ item.points }}</text>
              <text class="price-unit">积分</text>
            </view>
            <view class="exchange-btn">立即兑换</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 数据
const userPoints = ref(520)
const totalPoints = ref(1680)
const currentCategory = ref('all')

const categories = [
  { name: '全部', value: 'all' },
  { name: '优惠券', value: 'coupon' },
  { name: '生活用品', value: 'daily' },
  { name: '数码配件', value: 'digital' },
  { name: '食品生鲜', value: 'food' }
]

const goodsList = [
  {
    id: '1',
    name: '满50减10元优惠券',
    description: '冠县本地商家通用',
    points: 100,
    image: 'https://img.yzcdn.cn/vant/coupon.png',
    category: 'coupon'
  },
  {
    id: '2',
    name: '保洁服务8折券',
    description: '限冠县本地保洁服务',
    points: 200,
    image: 'https://img.yzcdn.cn/vant/coupon.png',
    category: 'coupon'
  },
  {
    id: '3',
    name: '抽纸一提（3包）',
    description: '原生竹纤维，柔软亲肤',
    points: 300,
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    category: 'daily'
  },
  {
    id: '4',
    name: '洗衣液2kg装',
    description: '深层清洁，护色留香',
    points: 500,
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    category: 'daily'
  },
  {
    id: '5',
    name: '手机数据线',
    description: '快充线，1米长',
    points: 150,
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    category: 'digital'
  },
  {
    id: '6',
    name: '充电宝10000mAh',
    description: '小巧便携，双USB输出',
    points: 800,
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    category: 'digital'
  },
  {
    id: '7',
    name: '新鲜鸡蛋30枚',
    description: '农家散养土鸡蛋',
    points: 400,
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    category: 'food'
  },
  {
    id: '8',
    name: '冠县特色烧鸡',
    description: '当地知名老字号',
    points: 1000,
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    category: 'food'
  }
]

const filteredGoods = computed(() => {
  if (currentCategory.value === 'all') {
    return goodsList
  }
  return goodsList.filter(item => item.category === currentCategory.value)
})

const goCheckin = () => {
  uni.navigateTo({ url: '/pages/checkin/index' })
}

const goGoodsDetail = (item) => {
  uni.showToast({ title: '商品详情开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.points-shop-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: env(safe-area-inset-bottom);
}

.header-bg {
  background: linear-gradient(135deg, #E63946, #FF6B6B);
  padding: 40rpx 30rpx 100rpx;

  .header-content {
    text-align: center;

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
}

.points-card {
  margin: -60rpx 30rpx 30rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);

  .points-info {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .points-item {
      text-align: center;

      .points-label {
        display: block;
        font-size: 24rpx;
        color: #999;
        margin-bottom: 8rpx;
      }

      .points-value {
        display: block;
        font-size: 48rpx;
        font-weight: 700;
        color: #E63946;

        &.total {
          color: #333;
        }
      }
    }

    .points-divider {
      width: 1rpx;
      height: 60rpx;
      background: #eee;
    }
  }

  .points-tips {
    display: flex;
    align-items: center;
    background: #FFF5F5;
    padding: 20rpx;
    border-radius: 12rpx;
    margin-top: 24rpx;

    .tips-icon {
      font-size: 32rpx;
      margin-right: 12rpx;
    }

    .tips-text {
      flex: 1;
      font-size: 24rpx;
      color: #666;
    }

    .tips-arrow {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.category-tabs {
  padding: 0 30rpx;
  margin-bottom: 20rpx;

  .tabs-scroll {
    white-space: nowrap;

    .tab-item {
      display: inline-block;
      padding: 16rpx 32rpx;
      font-size: 28rpx;
      color: #666;
      position: relative;

      &.active {
        color: #E63946;
        font-weight: 600;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 6rpx;
          background: #E63946;
          border-radius: 3rpx;
        }
      }
    }
  }
}

.goods-list {
  padding: 0 30rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;

  .goods-item {
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;

    .goods-image {
      width: 100%;
      height: 300rpx;
      background: #f0f0f0;
    }

    .goods-info {
      padding: 20rpx;

      .goods-name {
        display: block;
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
overflow: hidden;
        line-height: 1.4;
        min-height: 78rpx;
      }

      .goods-desc {
        display: block;
        font-size: 22rpx;
        color: #999;
        margin-top: 8rpx;
      }

      .goods-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16rpx;

        .goods-price {
          display: flex;
          align-items: baseline;

          .price-icon {
            font-size: 24rpx;
          }

          .price-value {
            font-size: 36rpx;
            font-weight: 700;
            color: #E63946;
            margin-left: 4rpx;
          }

          .price-unit {
            font-size: 22rpx;
            color: #999;
            margin-left: 4rpx;
          }
        }

        .exchange-btn {
          background: linear-gradient(135deg, #E63946, #FF6B6B);
          color: #fff;
          font-size: 24rpx;
          padding: 12rpx 20rpx;
          border-radius: 30rpx;
        }
      }
    }
  }
}

.bottom-space {
  height: 120rpx;
}
</style>
