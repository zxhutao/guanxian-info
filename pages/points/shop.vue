<template>
  <view class="points-shop-page">
    <!-- 头部背景 -->
    <view class="header-bg">
      <view class="header-content">
        <text class="header-title">积分商城</text>
        <text class="header-subtitle">积分当钱花，好礼免费领！</text>
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
        <text class="tips-icon">💡</text>
        <text class="tips-text">每日签到可获�?0积分，连续签到奖励更�?/text>
        <text class="tips-arrow">�?/text>
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
          {{ cat.label }}
        </view>
      </scroll-view>
    </view>

    <!-- 商品列表 -->
    <view class="goods-list">
      <view
        v-for="goods in goodsList"
        :key="goods._id"
        class="goods-item"
        @click="showExchangeModal(goods)"
      >
        <view class="goods-icon-wrapper">
          <text class="goods-icon">{{ goods.icon }}</text>
        </view>
        <view class="goods-info">
          <view class="goods-header">
            <text class="goods-name">{{ goods.name }}</text>
            <view class="goods-tags">
              <text v-for="tag in goods.tags" :key="tag" class="goods-tag">{{ tag }}</text>
            </view>
          </view>
          <text class="goods-desc">{{ goods.description }}</text>
          <view class="goods-footer">
            <view class="goods-points">
              <text class="points-num">{{ goods.points }}</text>
              <text class="points-unit">积分</text>
            </view>
            <view class="exchange-btn" :class="{ disabled: userPoints < goods.points }">
              <text>{{ userPoints >= goods.points ? '立即兑换' : '积分不足' }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状�?-->
    <view v-if="goodsList.length === 0 && !loading" class="empty-state">
      <text class="empty-icon">📦</text>
      <text class="empty-text">暂无商品</text>
    </view>

    <!-- 兑换弹窗 -->
    <view v-if="showModal" class="modal-mask" @click="closeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">确认兑换</text>
          <text class="modal-close" @click="closeModal">×</text>
        </view>
        <view class="modal-body" v-if="selectedGoods">
          <view class="selected-goods">
            <text class="goods-icon-large">{{ selectedGoods.icon }}</text>
            <view class="selected-info">
              <text class="selected-name">{{ selectedGoods.name }}</text>
              <text class="selected-desc">{{ selectedGoods.description }}</text>
            </view>
          </view>
          <view class="exchange-info">
            <view class="info-row">
              <text class="info-label">兑换数量</text>
              <view class="quantity-selector">
                <text class="qty-btn" @click="changeQuantity(-1)">-</text>
                <text class="qty-num">{{ exchangeQuantity }}</text>
                <text class="qty-btn" @click="changeQuantity(1)">+</text>
              </view>
            </view>
            <view class="info-row">
              <text class="info-label">消耗积�?/text>
              <text class="info-value points">{{ selectedGoods.points * exchangeQuantity }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">剩余积分</text>
              <text class="info-value">{{ userPoints - selectedGoods.points * exchangeQuantity }}</text>
            </view>
          </view>
          <view v-if="selectedGoods.stock > 0" class="stock-info">
            <text>剩余库存：{{ selectedGoods.stock }}�?/text>
          </view>
        </view>
        <view class="modal-footer">
          <view class="modal-btn cancel" @click="closeModal">取消</view>
          <view 
            class="modal-btn confirm" 
            :class="{ disabled: userPoints < selectedGoods.points * exchangeQuantity }"
            @click="confirmExchange"
          >
            <text v-if="userPoints >= selectedGoods.points * exchangeQuantity">确认兑换</text>
            <text v-else>积分不足</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 兑换成功弹窗 -->
    <view v-if="showSuccessModal" class="modal-mask">
      <view class="success-modal">
        <view class="success-icon">🎉</view>
        <text class="success-title">兑换成功�?/text>
        <text class="success-text">{{ successMessage }}</text>
        <view class="success-btns">
          <view class="success-btn" @click="showSuccessModal = false">继续逛�?/view>
          <view class="success-btn primary" @click="goMyItems">查看我的道具</view>
        </view>
      </view>
    </view>

    <!-- 积分不足弹窗 -->
    <view v-if="showInsufficientModal" class="modal-mask" @click="showInsufficientModal = false">
      <view class="insufficient-modal" @click.stop>
        <view class="insufficient-icon">💡</view>
        <text class="insufficient-title">积分不足</text>
        <text class="insufficient-text">如何获取积分�?/text>
        <view class="insufficient-options">
          <view class="option-item" @click="goCheckin">
            <text class="option-icon">📅</text>
            <view class="option-info">
              <text class="option-title">每日签到</text>
              <text class="option-desc">+10积分/天，连续签到奖励更多</text>
            </view>
            <text class="option-points">+10</text>
          </view>
          <view class="option-item">
            <text class="option-icon">👥</text>
            <view class="option-info">
              <text class="option-title">邀请好�?/text>
              <text class="option-desc">好友注册成功，双方各�?0积分</text>
            </view>
            <text class="option-points">+50</text>
          </view>
          <view class="option-item">
            <text class="option-icon">🛒</text>
            <view class="option-info">
              <text class="option-title">在线下单</text>
              <text class="option-desc">消费1�?1积分，多买多�?/text>
            </view>
            <text class="option-points">+1</text>
          </view>
        </view>
        <view class="insufficient-btn" @click="goCheckin">去签�?/view>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// 数据
const userPoints = ref(580)
const totalPoints = ref(1250)
const currentCategory = ref('all')
const goodsList = ref([])
const loading = ref(false)

// 弹窗控制
const showModal = ref(false)
const showSuccessModal = ref(false)
const showInsufficientModal = ref(false)
const selectedGoods = ref(null)
const exchangeQuantity = ref(1)
const successMessage = ref('')

// 分类
const categories = [
  { label: '全部', value: 'all' },
  { label: '优惠�?, value: 'coupon' },
  { label: '置顶�?, value: 'top_card' },
  { label: '推荐�?, value: 'recommend' }
]

// 模拟商品数据
const mockGoods = [
  {
    _id: '1',
    name: '5元无门槛优惠�?,
    icon: '💰',
    description: '💰 相当�?0积分=1元，超划算！发布信息立减5�?,
    points: 100,
    category: 'coupon',
    type: 'coupon',
    couponType: 'cash',
    couponValue: 5,
    stock: 100,
    tags: ['🔥 热门', '新人专享'],
    sort: 1
  },
  {
    _id: '2',
    name: '10元无门槛优惠�?,
    icon: '💎',
    description: '💰 相当�?8积分=1元，更省钱！发布信息立减10�?,
    points: 180,
    category: 'coupon',
    type: 'coupon',
    couponType: 'cash',
    couponValue: 10,
    stock: 50,
    tags: ['🔥 热门', '超�?],
    sort: 2
  },
  {
    _id: '3',
    name: '信息置顶卡（7天）',
    icon: '📈',
    description: '📈 置顶7天，曝光量提�?-5倍，快速找到合适的�?服务',
    points: 500,
    category: 'top_card',
    type: 'top_card',
    days: 7,
    stock: -1,
    tags: ['🔥 热门', '推荐使用'],
    sort: 3
  },
  {
    _id: '4',
    name: '首页推荐位（7天）',
    icon: '🎯',
    description: '🎯 首页黄金位置，全用户可见，曝光量提升10�?',
    points: 1000,
    category: 'recommend',
    type: 'top_card',
    days: 7,
    stock: 1,
    tags: ['�?限量', '稀缺资�?],
    sort: 4
  }
]

onShow(() => {
  loadGoods()
  loadUserPoints()
})

watch(currentCategory, () => {
  loadGoods()
})

// 加载商品列表
const loadGoods = async () => {
  loading.value = true
  
  try {
    // 实际项目中调用云函数
    // const { result } = await uniCloud.callFunction({
    //   name: 'exchange',
    //   data: {
    //     action: 'getGoodsList',
    //     data: { category: currentCategory.value === 'all' ? '' : currentCategory.value }
    //   }
    // })
    
    // 模拟数据筛�?
    if (currentCategory.value === 'all') {
      goodsList.value = mockGoods
    } else {
      goodsList.value = mockGoods.filter(g => g.category === currentCategory.value)
    }
  } catch (error) {
    console.error('加载商品失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 加载用户积分
const loadUserPoints = async () => {
  try {
    const { result } = await uniCloud.callFunction({
      name: 'checkin',
      data: { action: 'getPointsInfo' }
    })
    
    if (result.code === 0) {
      userPoints.value = result.data.points
      totalPoints.value = result.data.totalPoints
    }
  } catch (error) {
    console.error('加载积分失败:', error)
  }
}

// 显示兑换弹窗
const showExchangeModal = (goods) => {
  if (userPoints.value < goods.points) {
    showInsufficientModal.value = true
    return
  }
  
  selectedGoods.value = goods
  exchangeQuantity.value = 1
  showModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
  selectedGoods.value = null
  exchangeQuantity.value = 1
}

// 修改数量
const changeQuantity = (delta) => {
  const newQty = exchangeQuantity.value + delta
  if (newQty >= 1 && newQty <= 10) {
    exchangeQuantity.value = newQty
  }
}

// 确认兑换
const confirmExchange = async () => {
  if (!selectedGoods.value) return
  
  const totalPoints = selectedGoods.value.points * exchangeQuantity.value
  if (userPoints.value < totalPoints) {
    uni.showToast({ title: '积分不足', icon: 'none' })
    return
  }
  
  uni.showLoading({ title: '兑换�?..' })
  
  try {
    const { result } = await uniCloud.callFunction({
      name: 'exchange',
      data: {
        action: 'exchangeGoods',
        data: {
          goodsId: selectedGoods.value._id,
          quantity: exchangeQuantity.value
        }
      }
    })
    
    if (result.code === 0) {
      // 更新积分
      userPoints.value -= totalPoints
      
      // 显示成功弹窗
      successMessage.value = `成功兑换${selectedGoods.value.name} x${exchangeQuantity.value}`
      closeModal()
      showSuccessModal.value = true
      
      // 刷新商品列表
      loadGoods()
    } else {
      uni.showToast({ title: result.message || '兑换失败', icon: 'none' })
    }
  } catch (error) {
    console.error('兑换失败:', error)
    uni.showToast({ title: '兑换失败，请重试', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

// 跳转到签到页�?
const goCheckin = () => {
  showInsufficientModal.value = false
  uni.navigateTo({ url: '/pages/checkin/index' })
}

// 跳转到我的道�?
const goMyItems = () => {
  showSuccessModal.value = false
  uni.navigateTo({ url: '/pages/points/items' })
}
</script>

<style lang="scss" scoped>
.points-shop-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header-bg {
  background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
  padding: 60rpx 40rpx 100rpx;

  .header-content {
    text-align: center;

    .header-title {
      display: block;
      font-size: 44rpx;
      font-weight: bold;
      color: #fff;
      margin-bottom: 16rpx;
    }

    .header-subtitle {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

.points-card {
  margin: -60rpx 30rpx 30rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);

  .points-info {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 30rpx;

    .points-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;

      .points-label {
        font-size: 26rpx;
        color: #999;
      }

      .points-value {
        font-size: 56rpx;
        font-weight: bold;
        color: #FF9800;

        &.total {
          color: #666;
        }
      }
    }

    .points-divider {
      width: 2rpx;
      height: 80rpx;
      background: #eee;
    }
  }

  .points-tips {
    display: flex;
    align-items: center;
    background: #FFF8E1;
    padding: 20rpx 24rpx;
    border-radius: 12rpx;

    .tips-icon {
      font-size: 32rpx;
      margin-right: 12rpx;
    }

    .tips-text {
      flex: 1;
      font-size: 26rpx;
      color: #FF9800;
    }

    .tips-arrow {
      font-size: 32rpx;
      color: #FF9800;
    }
  }
}

.category-tabs {
  background: #fff;
  padding: 20rpx 0;
  margin-bottom: 20rpx;

  .tabs-scroll {
    white-space: nowrap;
    padding: 0 20rpx;

    .tab-item {
      display: inline-block;
      padding: 16rpx 32rpx;
      margin-right: 16rpx;
      background: #f5f5f5;
      border-radius: 30rpx;
      font-size: 26rpx;
      color: #666;

      &.active {
        background: #FF9800;
        color: #fff;
      }
    }
  }
}

.goods-list {
  padding: 0 30rpx;

  .goods-item {
    display: flex;
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;

    .goods-icon-wrapper {
      width: 120rpx;
      height: 120rpx;
      background: #FFF8E1;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 24rpx;

      .goods-icon {
        font-size: 60rpx;
      }
    }

    .goods-info {
      flex: 1;

      .goods-header {
        display: flex;
        align-items: center;
        gap: 12rpx;
        margin-bottom: 12rpx;

        .goods-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
        }

        .goods-tags {
          display: flex;
          gap: 8rpx;

          .goods-tag {
            padding: 4rpx 12rpx;
            background: #FFF0F0;
            color: #E63946;
            font-size: 20rpx;
            border-radius: 8rpx;
          }
        }
      }

      .goods-desc {
        font-size: 26rpx;
        color: #666;
        margin-bottom: 20rpx;
        display: block;
      }

      .goods-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .goods-points {
          display: flex;
          align-items: baseline;
          gap: 8rpx;

          .points-num {
            font-size: 40rpx;
            font-weight: bold;
            color: #FF9800;
          }

          .points-unit {
            font-size: 24rpx;
            color: #999;
          }
        }

        .exchange-btn {
          padding: 16rpx 32rpx;
          background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
          color: #fff;
          border-radius: 30rpx;
          font-size: 26rpx;

          &.disabled {
            background: #ccc;
          }
        }
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;

  .empty-icon {
    font-size: 80rpx;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 80%;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .modal-title {
      font-size: 34rpx;
      font-weight: 600;
      color: #333;
    }

    .modal-close {
      font-size: 48rpx;
      color: #999;
    }
  }

  .modal-body {
    padding: 30rpx;

    .selected-goods {
      display: flex;
      align-items: center;
      gap: 20rpx;
      margin-bottom: 30rpx;
      padding-bottom: 30rpx;
      border-bottom: 1rpx solid #f5f5f5;

      .goods-icon-large {
        font-size: 80rpx;
      }

      .selected-info {
        flex: 1;

        .selected-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
          display: block;
          margin-bottom: 8rpx;
        }

        .selected-desc {
          font-size: 26rpx;
          color: #666;
        }
      }
    }

    .exchange-info {
      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24rpx;

        .info-label {
          font-size: 28rpx;
          color: #666;
        }

        .info-value {
          font-size: 32rpx;
          color: #333;

          &.points {
            color: #FF9800;
            font-weight: bold;
          }
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 20rpx;

          .qty-btn {
            width: 56rpx;
            height: 56rpx;
            background: #f5f5f5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32rpx;
            color: #666;
          }

          .qty-num {
            font-size: 32rpx;
            color: #333;
            min-width: 60rpx;
            text-align: center;
          }
        }
      }
    }

    .stock-info {
      text-align: center;
      font-size: 24rpx;
      color: #999;
    }
  }

  .modal-footer {
    display: flex;
    padding: 20rpx 30rpx 30rpx;
    gap: 20rpx;

    .modal-btn {
      flex: 1;
      text-align: center;
      padding: 24rpx 0;
      border-radius: 40rpx;
      font-size: 30rpx;

      &.cancel {
        background: #f5f5f5;
        color: #666;
      }

      &.confirm {
        background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
        color: #fff;

        &.disabled {
          background: #ccc;
        }
      }
    }
  }
}

.success-modal {
  width: 70%;
  background: #fff;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  text-align: center;

  .success-icon {
    font-size: 80rpx;
    margin-bottom: 20rpx;
  }

  .success-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 16rpx;
  }

  .success-text {
    font-size: 28rpx;
    color: #666;
    display: block;
    margin-bottom: 40rpx;
  }

  .success-btns {
    display: flex;
    gap: 20rpx;

    .success-btn {
      flex: 1;
      padding: 24rpx 0;
      background: #f5f5f5;
      border-radius: 40rpx;
      font-size: 28rpx;
      color: #666;

      &.primary {
        background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
        color: #fff;
      }
    }
  }
}

.insufficient-modal {
  width: 80%;
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;

  .insufficient-icon {
    font-size: 60rpx;
    text-align: center;
    margin-bottom: 20rpx;
  }

  .insufficient-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
    text-align: center;
    display: block;
    margin-bottom: 16rpx;
  }

  .insufficient-text {
    font-size: 28rpx;
    color: #666;
    display: block;
    margin-bottom: 30rpx;
  }

  .insufficient-options {
    margin-bottom: 30rpx;

    .option-item {
      display: flex;
      align-items: center;
      padding: 24rpx 0;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .option-icon {
        font-size: 40rpx;
        margin-right: 20rpx;
      }

      .option-info {
        flex: 1;

        .option-title {
          font-size: 30rpx;
          color: #333;
          display: block;
          margin-bottom: 8rpx;
        }

        .option-desc {
          font-size: 24rpx;
          color: #999;
        }
      }

      .option-points {
        font-size: 32rpx;
        font-weight: bold;
        color: #FF9800;
      }
    }
  }

  .insufficient-btn {
    text-align: center;
    padding: 24rpx 0;
    background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
    color: #fff;
    border-radius: 40rpx;
    font-size: 30rpx;
  }
}

.bottom-space {
  height: 40rpx;
}
</style>

