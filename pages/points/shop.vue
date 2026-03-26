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
          @click="switchCategory(cat.value)"
        >
          {{ cat.name }}
        </view>
      </scroll-view>
    </view>

    <!-- 商品列表 -->
    <view class="goods-list">
      <view
        v-for="item in filteredGoods"
        :key="item._id"
        class="goods-item"
        @click="goGoodsDetail(item)"
      >
        <image lazy-load class="goods-image" :src="item.image" mode="aspectFill" />
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
import { onShow } from '@dcloudio/uni-app'
import { callCloud } from '@/utils/cloud'

// 数据
const userPoints = ref(0)
const totalPoints = ref(0)
const currentCategory = ref('all')
const goodsList = ref([])
const loading = ref(false)

const categories = [
  { name: '全部', value: 'all' },
  { name: '优惠券', value: 'coupon' },
  { name: '置顶卡', value: 'top_card' },
  { name: '生活用品', value: 'daily' },
  { name: '数码配件', value: 'digital' },
  { name: '食品生鲜', value: 'food' }
]

// 默认兜底商品（云端无数据时显示）
const defaultGoods = [
  {
    _id: 'd1',
    name: '满50减10元优惠券',
    description: '冠县本地商家通用',
    points: 100,
    image: 'https://img.yzcdn.cn/vant/coupon.png',
    category: 'coupon'
  },
  {
    _id: 'd2',
    name: '保洁服务8折券',
    description: '限冠县本地保洁服务',
    points: 200,
    image: 'https://img.yzcdn.cn/vant/coupon.png',
    category: 'coupon'
  },
  {
    _id: 'd3',
    name: '职位置顶卡（7天）',
    description: '让您的职位排在最前面',
    points: 300,
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    category: 'top_card'
  },
  {
    _id: 'd4',
    name: '冠县特色烧鸡',
    description: '当地知名老字号',
    points: 1000,
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    category: 'food'
  }
]

onShow(() => {
  loadUserPoints()
  loadGoodsList()
})

// 加载用户积分
const loadUserPoints = async () => {
  try {
    const result = await callCloud('getUserInfo', {})
    if (result && result.success && result.data) {
      userPoints.value = result.data.points || 0
      totalPoints.value = result.data.totalPoints || result.data.points || 0
    }
  } catch (err) {
    console.error('获取用户积分失败:', err)
  }
}

// 加载商品列表
const loadGoodsList = async () => {
  loading.value = true
  const category = currentCategory.value === 'all' ? '' : currentCategory.value
  try {
    const result = await callCloud('exchange', {
      action: 'getGoodsList',
      data: { category, page: 1, pageSize: 50 }
    })
    if (result && result.code === 0 && result.data && result.data.length > 0) {
      goodsList.value = result.data
    } else {
      goodsList.value = defaultGoods
    }
  } catch (err) {
    console.error('获取商品列表失败:', err)
    goodsList.value = defaultGoods
  } finally {
    loading.value = false
  }
}

const filteredGoods = computed(() => {
  if (currentCategory.value === 'all') {
    return goodsList.value
  }
  return goodsList.value.filter(item => item.category === currentCategory.value)
})

const switchCategory = (value) => {
  currentCategory.value = value
  loadGoodsList()
}

const goCheckin = () => {
  uni.navigateTo({ url: '/pages/checkin/index' })
}

const goGoodsDetail = (item) => {
  if (userPoints.value < item.points) {
    uni.showToast({ title: '积分不足，去签到获取更多积分吧', icon: 'none' })
    return
  }
  uni.showModal({
    title: '确认兑换',
    content: `确认使用 ${item.points} 积分兑换「${item.name}」？`,
    success: (res) => {
      if (res.confirm) {
        doExchange(item)
      }
    }
  })
}

const doExchange = async (item) => {
  uni.showLoading({ title: '兑换中...' })
  try {
    const result = await callCloud('exchange', {
      action: 'exchangeGoods',
      data: { goodsId: item._id, quantity: 1 }
    })
    if (result && result.code === 0) {
      uni.showToast({ title: '兑换成功！', icon: 'success' })
      loadUserPoints()
    } else {
      uni.showToast({ title: result?.message || '兑换失败', icon: 'none' })
    }
  } catch (err) {
    console.error('兑换失败:', err)
    uni.showToast({ title: '兑换失败，请重试', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
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
