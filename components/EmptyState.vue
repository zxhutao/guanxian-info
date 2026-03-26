<template>
  <view class="empty-state" :style="customStyle">
    <!-- 图标 -->
    <image 
      v-if="imageUrl" 
      :src="imageUrl" 
      class="empty-image"
      mode="aspectFit"
    />
    <view v-else class="empty-icon">
      <text class="iconfont" :class="iconClass"></text>
    </view>
    
    <!-- 标题 -->
    <text v-if="title" class="empty-title">{{ title }}</text>
    
    <!-- 描述 -->
    <text v-if="description" class="empty-desc">{{ description }}</text>
    
    <!-- 操作按钮 -->
    <button 
      v-if="showButton" 
      class="empty-btn"
      :class="buttonType"
      @click="handleButtonClick"
    >
      {{ buttonText }}
    </button>
  </view>
</template>

<script setup>
/**
 * EmptyState 组件 - 空状态统一展示
 * 适用于：列表页无数据、搜索无结果、网络错误等场景
 */
import { computed } from 'vue'

const props = defineProps({
  // 类型：data-无数据、search-搜索无结果、network-网络错误、error-通用错误
  type: {
    type: String,
    default: 'data'
  },
  // 自定义图片URL
  imageUrl: {
    type: String,
    default: ''
  },
  // 自定义图标类名
  icon: {
    type: String,
    default: ''
  },
  // 自定义标题
  title: {
    type: String,
    default: ''
  },
  // 自定义描述
  description: {
    type: String,
    default: ''
  },
  // 是否显示按钮
  showButton: {
    type: Boolean,
    default: false
  },
  // 按钮文字
  buttonText: {
    type: String,
    default: '去逛逛'
  },
  // 按钮类型：primary、default、plain
  buttonType: {
    type: String,
    default: 'primary'
  },
  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['click'])

// 预设配置
const presetConfig = {
  data: {
    icon: 'icon-empty-data',
    title: '暂无数据',
    description: '这里还没有内容哦~'
  },
  search: {
    icon: 'icon-empty-search',
    title: '暂无搜索结果',
    description: '换个关键词试试吧'
  },
  network: {
    icon: 'icon-empty-network',
    title: '网络开小差了',
    description: '请检查网络连接后重试',
    buttonText: '重新加载'
  },
  error: {
    icon: 'icon-empty-error',
    title: '出错了',
    description: '系统繁忙，请稍后重试',
    buttonText: '重新加载'
  },
  favorite: {
    icon: 'icon-empty-favorite',
    title: '暂无收藏',
    description: '您还没有收藏任何内容',
    buttonText: '去逛逛'
  },
  message: {
    icon: 'icon-empty-message',
    title: '暂无消息',
    description: '您还没有收到任何消息'
  },
  order: {
    icon: 'icon-empty-order',
    title: '暂无订单',
    description: '您还没有相关订单',
    buttonText: '去下单'
  },
  coupon: {
    icon: 'icon-empty-coupon',
    title: '暂无优惠券',
    description: '您还没有可用的优惠券'
  },
  notification: {
    icon: 'icon-empty-notice',
    title: '暂无通知',
    description: '您还没有收到任何通知'
  }
}

// 图标类名
const iconClass = computed(() => {
  return props.icon || presetConfig[props.type]?.icon || 'icon-empty-data'
})

// 标题（优先使用props）
const displayTitle = computed(() => {
  return props.title || presetConfig[props.type]?.title || '暂无数据'
})

// 描述（优先使用props）
const displayDescription = computed(() => {
  return props.description || presetConfig[props.type]?.description || ''
})

// 按钮文字
const displayButtonText = computed(() => {
  return props.buttonText || presetConfig[props.type]?.buttonText || '去逛逛'
})

// 按钮点击
const handleButtonClick = () => {
  emit('click')
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-image {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 30rpx;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  background: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.empty-icon .iconfont {
  font-size: 80rpx;
  color: #ccc;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 40rpx;
  line-height: 1.5;
}

.empty-btn {
  min-width: 240rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  border-radius: 40rpx;
  border: none;
}

.empty-btn.primary {
  background: linear-gradient(135deg, #07c160 0%, #05a050 100%);
  color: #fff;
}

.empty-btn.default {
  background: #f5f5f5;
  color: #666;
}

.empty-btn.plain {
  background: transparent;
  color: #07c160;
  border: 2rpx solid #07c160;
}

.empty-btn::after {
  border: none;
}

.empty-btn:active {
  opacity: 0.8;
}
</style>
