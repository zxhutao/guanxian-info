<template>
  <view class="my-items-page">
    <!-- 头部 -->
    <view class="header">
      <text class="header-title">我的道具</text>
      <text class="header-subtitle">兑换的优惠券和置顶卡都在这里</text>
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
              {{ isExpired(item) ? '已过�? : `有效期至 ${formatDate(item.expireTime)}` }}
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
          <view v-else-if="item.status === 'used'" class="used-tag">已使�?/view>
          <view v-else-if="isExpired(item)" class="expired-tag">已过�?/view>
        </view>
      </view>
    </view>

    <!-- 空状�?-->
    <view v-if="filteredItems.length === 0" class="empty-state">
      <text class="empty-icon">📦</text>
      <text class="empty-text">暂无{{ currentCategory === 'all' ? '' : categories.find(c => c.value === currentCategory)?.label }}</text>
      <text class="empty-tip">快去积分商城兑换吧！</text>
      <view class="empty-btn" @click="goShop">去兑�?/view>
    </view>

    <!-- 使用弹窗 -->
    <view v-if="showUseModal" class="modal-mask" @click="closeUseModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">使用道具</text>
          <text class="modal-close" @click="closeUseModal">×</text>
        </view>
        <view class="modal-body" v-if="selectedItem">
          <view class="selected-item">
            <text class="item-icon-large">{{ selectedItem.icon }}</text>
            <view class="selected-info">
              <text class="selected-name">{{ selectedItem.name }}</text>
              <text class="selected-desc">{{ getItemDesc(selectedItem) }}</text>
            </view>
          </view>
          
          <view v-if="selectedItem.type === 'top_card'" class="use-form">
            <text class="form-label">选择要置顶的信息</text>
            <view class="target-list">
              <view
                v-for="target in myTargets"
                :key="target._id"
                class="target-item"
                :class="{ selected: selectedTarget === target._id }"
                @click="selectedTarget = target._id"
              >
                <view class="target-type">{{ getTypeLabel(target.type) }}</view>
                <view class="target-title">{{ target.title }}</view>
                <view v-if="target.isTop" class="target-top">已置�?/view>
              </view>
            </view>
            <view v-if="myTargets.length === 0" class="no-target">
              <text>暂无可用信息，请先发�?/text>
              <view class="publish-btn" @click="goPublish">去发�?/view>
            </view>
          </view>
          
          <view v-else-if="selectedItem.type === 'coupon'" class="use-form">
            <text class="form-label">优惠券信�?/text>
            <view class="coupon-info">
              <view class="coupon-row">
                <text class="coupon-label">优惠券名�?/text>
                <text class="coupon-value">{{ selectedItem.name }}</text>
              </view>
              <view class="coupon-row">
                <text class="coupon-label">优惠金额</text>
                <text class="coupon-value highlight">{{ selectedItem.value }}�?/text>
              </view>
              <view class="coupon-row">
                <text class="coupon-label">使用门槛</text>
                <text class="coupon-value">满{{ selectedItem.minAmount || 0 }}元可�?/text>
              </view>
              <view class="coupon-row">
                <text class="coupon-label">有效期至</text>
                <text class="coupon-value">{{ formatDate(selectedItem.expireTime) }}</text>
              </view>
            </view>
            <text class="use-tip">下单时自动使用，无需手动操作</text>
          </view>
        </view>
        <view class="modal-footer">
          <view class="modal-btn cancel" @click="closeUseModal">取消</view>
          <view
            v-if="selectedItem.type === 'top_card'"
            class="modal-btn confirm"
            :class="{ disabled: !selectedTarget }"
            @click="confirmUseTopCard"
          >
            确认使用
          </view>
          <view v-else class="modal-btn confirm" @click="closeUseModal">
            我知道了
          </view>
        </view>
      </view>
    </view>

    <!-- 使用成功弹窗 -->
    <view v-if="showSuccessModal" class="modal-mask">
      <view class="success-modal">
        <view class="success-icon">🎉</view>
        <text class="success-title">使用成功�?/text>
        <text class="success-text">{{ successMessage }}</text>
        <view class="success-btn" @click="showSuccessModal = false">知道�?/view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// 数据
const currentCategory = ref('all')
const items = ref([])
const myTargets = ref([])
const selectedItem = ref(null)
const selectedTarget = ref('')
const showUseModal = ref(false)
const showSuccessModal = ref(false)
const successMessage = ref('')

// 分类
const categories = [
  { label: '全部', value: 'all', count: 0 },
  { label: '置顶�?, value: 'top_card', count: 0 },
  { label: '优惠�?, value: 'coupon', count: 0 }
]

// 筛选后的道�?
const filteredItems = computed(() => {
  if (currentCategory.value === 'all') {
    return items.value
  }
  return items.value.filter(item => item.type === currentCategory.value)
})

onShow(() => {
  loadItems()
})

// 加载道具列表
const loadItems = async () => {
  try {
    const { result } = await uniCloud.callFunction({
      name: 'exchange',
      data: { action: 'getMyItems' }
    })
    
    if (result.code === 0) {
      items.value = result.data
      
      // 更新分类计数
      categories[0].count = items.value.length
      categories[1].count = items.value.filter(i => i.type === 'top_card').length
      categories[2].count = items.value.filter(i => i.type === 'coupon').length
    }
  } catch (error) {
    console.error('加载道具失败:', error)
    // 使用模拟数据
    items.value = [
      {
        _id: '1',
        type: 'top_card',
        name: '信息置顶卡（7天）',
        icon: '📈',
        days: 7,
        status: 'unused',
        createTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        expireTime: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
      },
      {
        _id: '2',
        type: 'coupon',
        name: '5元无门槛优惠�?,
        icon: '💰',
        value: 5,
        minAmount: 0,
        status: 'unused',
        createTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expireTime: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
      }
    ]
  }
}

// 加载我的发布信息
const loadMyTargets = async () => {
  try {
    // 这里应该调用云函数获取用户的发布信息
    // 模拟数据
    myTargets.value = [
      { _id: '1', type: 'job', title: '招聘保洁阿姨，月�?000', isTop: false },
      { _id: '2', type: 'house', title: '冠县中心小区3�?厅出�?, isTop: true },
      { _id: '3', type: 'service', title: '专业家电维修，随叫随�?, isTop: false }
    ]
  } catch (error) {
    console.error('加载发布信息失败:', error)
  }
}

// 使用道具
const useItem = (item) => {
  selectedItem.value = item
  selectedTarget.value = ''
  
  if (item.type === 'top_card') {
    loadMyTargets()
  }
  
  showUseModal.value = true
}

// 关闭使用弹窗
const closeUseModal = () => {
  showUseModal.value = false
  selectedItem.value = null
  selectedTarget.value = ''
}

// 确认使用置顶�?
const confirmUseTopCard = async () => {
  if (!selectedTarget.value) return
  
  uni.showLoading({ title: '使用�?..' })
  
  try {
    const { result } = await uniCloud.callFunction({
      name: 'exchange',
      data: {
        action: 'useTopCard',
        data: {
          itemId: selectedItem.value._id,
          targetId: selectedTarget.value,
          targetType: myTargets.value.find(t => t._id === selectedTarget.value)?.type
        }
      }
    })
    
    if (result.code === 0) {
      closeUseModal()
      successMessage.value = `置顶成功！信息将在首页置顶展�?{selectedItem.value.days}天`
      showSuccessModal.value = true
      loadItems()
    } else {
      uni.showToast({ title: result.message || '使用失败', icon: 'none' })
    }
  } catch (error) {
    console.error('使用失败:', error)
    uni.showToast({ title: '使用失败，请重试', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

// 获取道具描述
const getItemDesc = (item) => {
  if (item.type === 'top_card') {
    return `置顶${item.days}天，提升曝光量`
  } else if (item.type === 'coupon') {
    return item.minAmount > 0 ? `�?{item.minAmount}元减${item.value}元` : `无门槛减${item.value}元`
  }
  return ''
}

// 获取类型标签
const getTypeLabel = (type) => {
  const labels = {
    job: '招聘',
    house: '房屋',
    service: '服务',
    carpool: '顺风�?
  }
  return labels[type] || type
}

// 判断是否过期
const isExpired = (item) => {
  if (!item.expireTime) return false
  return new Date(item.expireTime) < new Date()
}

// 判断是否即将过期�?天内�?
const isNearExpire = (item) => {
  if (!item.expireTime || isExpired(item)) return false
  const daysLeft = Math.ceil((new Date(item.expireTime) - new Date()) / (1000 * 60 * 60 * 24))
  return daysLeft <= 7
}

// 格式化时�?
const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getMonth() + 1}�?{d.getDate()}日`
}

// 格式化日�?
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 跳转到积分商�?
const goShop = () => {
  uni.navigateTo({ url: '/pages/points/shop' })
}

// 跳转到发布页�?
const goPublish = () => {
  uni.navigateTo({ url: '/subpackages/publish/index' })
}
</script>

<style lang="scss" scoped>
.my-items-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #E91E63 0%, #F48FB1 100%);
  padding: 60rpx 40rpx;
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

.category-tabs {
  display: flex;
  background: #fff;
  padding: 20rpx 30rpx;
  gap: 30rpx;

  .tab-item {
    padding: 16rpx 32rpx;
    background: #f5f5f5;
    border-radius: 30rpx;
    font-size: 28rpx;
    color: #666;
    position: relative;

    &.active {
      background: #E91E63;
      color: #fff;
    }

    .tab-badge {
      position: absolute;
      top: -8rpx;
      right: -8rpx;
      min-width: 32rpx;
      height: 32rpx;
      background: #E63946;
      color: #fff;
      font-size: 20rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8rpx;
    }
  }
}

.items-list {
  padding: 20rpx 30rpx;

  .item-card {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;

    &.expired {
      opacity: 0.6;
    }

    .item-icon {
      width: 100rpx;
      height: 100rpx;
      background: #FFF8E1;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 50rpx;
      margin-right: 24rpx;
    }

    .item-info {
      flex: 1;

      .item-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        display: block;
        margin-bottom: 8rpx;
      }

      .item-desc {
        font-size: 26rpx;
        color: #666;
        display: block;
        margin-bottom: 12rpx;
      }

      .item-meta {
        display: flex;
        flex-direction: column;
        gap: 4rpx;

        .item-time {
          font-size: 22rpx;
          color: #999;
        }

        .item-expire {
          font-size: 22rpx;
          color: #999;

          &.near-expire {
            color: #FF9800;
          }
        }
      }
    }

    .item-action {
      .use-btn {
        padding: 16rpx 32rpx;
        background: linear-gradient(135deg, #E91E63 0%, #F48FB1 100%);
        color: #fff;
        border-radius: 30rpx;
        font-size: 26rpx;
      }

      .used-tag, .expired-tag {
        padding: 16rpx 32rpx;
        background: #f5f5f5;
        color: #999;
        border-radius: 30rpx;
        font-size: 26rpx;
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
    font-size: 32rpx;
    color: #333;
    margin-bottom: 12rpx;
  }

  .empty-tip {
    font-size: 26rpx;
    color: #999;
    margin-bottom: 30rpx;
  }

  .empty-btn {
    padding: 24rpx 60rpx;
    background: linear-gradient(135deg, #E91E63 0%, #F48FB1 100%);
    color: #fff;
    border-radius: 40rpx;
    font-size: 30rpx;
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
  width: 85%;
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
    max-height: 600rpx;
    overflow-y: auto;

    .selected-item {
      display: flex;
      align-items: center;
      gap: 20rpx;
      margin-bottom: 30rpx;
      padding-bottom: 30rpx;
      border-bottom: 1rpx solid #f5f5f5;

      .item-icon-large {
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

    .use-form {
      .form-label {
        font-size: 28rpx;
        color: #333;
        font-weight: 600;
        display: block;
        margin-bottom: 20rpx;
      }

      .target-list {
        .target-item {
          display: flex;
          align-items: center;
          padding: 24rpx;
          background: #f8f8f8;
          border-radius: 12rpx;
          margin-bottom: 16rpx;
          border: 2rpx solid transparent;

          &.selected {
            border-color: #E91E63;
            background: #FCE4EC;
          }

          .target-type {
            padding: 4rpx 16rpx;
            background: #E91E63;
            color: #fff;
            font-size: 22rpx;
            border-radius: 8rpx;
            margin-right: 16rpx;
          }

          .target-title {
            flex: 1;
            font-size: 28rpx;
            color: #333;
          }

          .target-top {
            padding: 4rpx 12rpx;
            background: #4CAF50;
            color: #fff;
            font-size: 20rpx;
            border-radius: 8rpx;
          }
        }
      }

      .no-target {
        text-align: center;
        padding: 40rpx;

        text {
          font-size: 28rpx;
          color: #999;
          display: block;
          margin-bottom: 20rpx;
        }

        .publish-btn {
          display: inline-block;
          padding: 16rpx 40rpx;
          background: #E91E63;
          color: #fff;
          border-radius: 30rpx;
          font-size: 28rpx;
        }
      }

      .coupon-info {
        background: #f8f8f8;
        border-radius: 12rpx;
        padding: 24rpx;

        .coupon-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16rpx;

          &:last-child {
            margin-bottom: 0;
          }

          .coupon-label {
            font-size: 26rpx;
            color: #666;
          }

          .coupon-value {
            font-size: 26rpx;
            color: #333;

            &.highlight {
              color: #E91E63;
              font-weight: bold;
            }
          }
        }
      }

      .use-tip {
        font-size: 24rpx;
        color: #999;
        text-align: center;
        margin-top: 20rpx;
        display: block;
      }
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
        background: linear-gradient(135deg, #E91E63 0%, #F48FB1 100%);
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

  .success-btn {
    padding: 24rpx 60rpx;
    background: linear-gradient(135deg, #E91E63 0%, #F48FB1 100%);
    color: #fff;
    border-radius: 40rpx;
    font-size: 30rpx;
    display: inline-block;
  }
}
</style>

