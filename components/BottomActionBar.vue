<template>
  <view class="bottom-action-bar" :class="{ 'safe-area': safeArea }">
    <view class="action-content">
      <!-- 左侧操作区 -->
      <view class="left-actions">
        <slot name="left">
          <!-- 收藏按钮 -->
          <view 
            v-if="showFavorite" 
            class="action-item"
            @click="handleFavoriteClick"
          >
            <text 
              class="iconfont"
              :class="isFavorite ? 'icon-favorite-filled active' : 'icon-favorite'"
            ></text>
            <text class="action-text">{{ isFavorite ? '已收藏' : '收藏' }}</text>
          </view>
          
          <!-- 分享按钮 -->
          <view 
            v-if="showShare" 
            class="action-item"
            @click="handleShareClick"
          >
            <text class="iconfont icon-share"></text>
            <text class="action-text">分享</text>
          </view>
          
          <!-- 客服按钮 -->
          <view 
            v-if="showService" 
            class="action-item"
            @click="handleServiceClick"
          >
            <text class="iconfont icon-service"></text>
            <text class="action-text">客服</text>
          </view>
          
          <!-- 首页按钮 -->
          <view 
            v-if="showHome" 
            class="action-item"
            @click="handleHomeClick"
          >
            <text class="iconfont icon-home"></text>
            <text class="action-text">首页</text>
          </view>
          
          <!-- 聊天按钮 -->
          <view 
            v-if="showChat" 
            class="action-item"
            @click="handleChatClick"
          >
            <text class="iconfont icon-chat"></text>
            <text class="action-text">咨询</text>
          </view>
        </slot>
      </view>
      
      <!-- 右侧主操作区 -->
      <view class="right-actions">
        <slot name="right">
          <!-- 主按钮1 -->
          <button
            v-if="primaryButtonText"
            class="primary-btn"
            :class="{ disabled: primaryDisabled, loading: primaryLoading }"
            :disabled="primaryDisabled || primaryLoading"
            @click="handlePrimaryClick"
          >
            <text v-if="primaryLoading" class="loading-icon"></text>
            {{ primaryButtonText }}
          </button>
          
          <!-- 次按钮 -->
          <button
            v-if="secondaryButtonText"
            class="secondary-btn"
            :class="{ disabled: secondaryDisabled, loading: secondaryLoading }"
            :disabled="secondaryDisabled || secondaryLoading"
            @click="handleSecondaryClick"
          >
            <text v-if="secondaryLoading" class="loading-icon"></text>
            {{ secondaryButtonText }}
          </button>
        </slot>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * BottomActionBar 组件 - 底部操作栏
 * 适用于：详情页底部操作栏（职位、服务、房屋、护工等）
 */
const props = defineProps({
  // 是否适配安全区域
  safeArea: {
    type: Boolean,
    default: true
  },
  // 是否显示收藏按钮
  showFavorite: {
    type: Boolean,
    default: false
  },
  // 是否已收藏
  isFavorite: {
    type: Boolean,
    default: false
  },
  // 是否显示分享按钮
  showShare: {
    type: Boolean,
    default: false
  },
  // 是否显示客服按钮
  showService: {
    type: Boolean,
    default: false
  },
  // 是否显示首页按钮
  showHome: {
    type: Boolean,
    default: false
  },
  // 是否显示聊天按钮
  showChat: {
    type: Boolean,
    default: false
  },
  // 主按钮文字
  primaryButtonText: {
    type: String,
    default: ''
  },
  // 主按钮是否禁用
  primaryDisabled: {
    type: Boolean,
    default: false
  },
  // 主按钮是否加载中
  primaryLoading: {
    type: Boolean,
    default: false
  },
  // 次按钮文字
  secondaryButtonText: {
    type: String,
    default: ''
  },
  // 次按钮是否禁用
  secondaryDisabled: {
    type: Boolean,
    default: false
  },
  // 次按钮是否加载中
  secondaryLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'favorite',
  'share',
  'service',
  'home',
  'chat',
  'primary',
  'secondary'
])

// 收藏点击
const handleFavoriteClick = () => {
  emit('favorite')
}

// 分享点击
const handleShareClick = () => {
  emit('share')
}

// 客服点击
const handleServiceClick = () => {
  emit('service')
}

// 首页点击
const handleHomeClick = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

// 聊天点击
const handleChatClick = () => {
  emit('chat')
}

// 主按钮点击
const handlePrimaryClick = () => {
  if (!props.primaryDisabled && !props.primaryLoading) {
    emit('primary')
  }
}

// 次按钮点击
const handleSecondaryClick = () => {
  if (!props.secondaryDisabled && !props.secondaryLoading) {
    emit('secondary')
  }
}
</script>

<style scoped>
.bottom-action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-top: 1rpx solid #eee;
  z-index: 100;
}

.bottom-action-bar.safe-area {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.action-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 30rpx;
  height: 100rpx;
}

.left-actions {
  display: flex;
  align-items: center;
  gap: 40rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60rpx;
}

.action-item .iconfont {
  font-size: 44rpx;
  color: #666;
  margin-bottom: 4rpx;
}

.action-item .iconfont.active {
  color: #ff6b6b;
}

.action-text {
  font-size: 20rpx;
  color: #666;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.primary-btn,
.secondary-btn {
  min-width: 200rpx;
  height: 76rpx;
  line-height: 76rpx;
  font-size: 28rpx;
  font-weight: 500;
  border-radius: 38rpx;
  border: none;
  text-align: center;
}

.primary-btn {
  background: linear-gradient(135deg, #07c160 0%, #05a050 100%);
  color: #fff;
}

.secondary-btn {
  background: #f5f5f5;
  color: #333;
}

.primary-btn.disabled,
.secondary-btn.disabled {
  opacity: 0.5;
}

.primary-btn.loading,
.secondary-btn.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}

.loading-icon {
  width: 28rpx;
  height: 28rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.secondary-btn .loading-icon {
  border-color: rgba(0, 0, 0, 0.1);
  border-top-color: #666;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.primary-btn::after,
.secondary-btn::after {
  border: none;
}

.primary-btn:active:not(.disabled),
.secondary-btn:active:not(.disabled) {
  opacity: 0.9;
}
</style>
