<template>
  <view class="phonebook-page">
    <!-- 顶部搜索栏 -->
    <view class="search-bar" @click="goToSearch">
      <text class="search-icon">🔍</text>
      <text class="search-placeholder">搜索电话、名称、地址</text>
    </view>

    <!-- 分类标签横向滚动 -->
    <scroll-view class="category-scroll" scroll-x>
      <view class="category-list">
        <view
          v-for="cat in categories"
          :key="cat.id"
          class="category-item"
          :class="{ active: selectedCategory === cat.id }"
          @click="onCategoryChange(cat.id)"
        >
          <text class="category-icon">{{ cat.icon }}</text>
          <text class="category-name">{{ cat.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 当前分类提示 -->
    <view class="section-header">
      <text class="section-title">{{ currentCategoryName }}</text>
      <text class="section-count">共 {{ filteredPhones.length }} 条</text>
    </view>

    <!-- 电话列表 -->
    <scroll-view class="phone-list" scroll-y>
      <view
        v-for="phone in filteredPhones"
        :key="phone.id"
        class="phone-card"
      >
        <!-- 左侧图标 -->
        <view class="phone-icon" :style="{ background: getCategoryColor(phone.category) }">
          <text>{{ getCategoryIcon(phone.category) }}</text>
        </view>

        <!-- 中间信息 -->
        <view class="phone-info">
          <text class="phone-name" :class="{ 'large-font': isLargeFont }">{{ phone.name }}</text>
          <text class="phone-number" :class="{ 'large-font': isLargeFont }">{{ phone.phone }}</text>
          <text class="phone-address" :class="{ 'large-font': isLargeFont }">{{ phone.address }}</text>
          <text class="phone-desc" v-if="phone.description">{{ phone.description }}</text>
        </view>

        <!-- 右侧操作按钮 -->
        <view class="phone-actions">
          <view class="call-btn" @click="makeCall(phone)">
            <text class="call-icon">📞</text>
            <text class="call-text">拨打</text>
          </view>
          <view class="favorite-btn" @click="toggleFavorite(phone.id)">
            <text class="star-icon">{{ isFavorite(phone.id) ? '⭐' : '☆' }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="filteredPhones.length === 0">
        <text class="empty-icon">📞</text>
        <text class="empty-text">暂无该分类电话</text>
      </view>
    </scroll-view>

    <!-- 底部快捷拨号 -->
    <view class="quick-dial-bar">
      <view class="quick-dial-title">常用急救</view>
      <view class="quick-dial-list">
        <view
          v-for="item in quickDialItems"
          :key="item.phone"
          class="quick-dial-item"
          @click="makeCall(item)"
        >
          <text class="quick-icon">{{ item.icon }}</text>
          <text class="quick-name">{{ item.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { phoneCategories, phonebookData, getPhonesByCategory } from '@/data/phonebook.js'

// 分类列表
const categories = phoneCategories

// 当前选中的分类
const selectedCategory = ref('hospital')

// 大字体模式
const isLargeFont = ref(false)

// 当前分类名称
const currentCategoryName = computed(() => {
  const cat = categories.find(c => c.id === selectedCategory.value)
  return cat ? cat.name : ''
})

// 获取分类颜色
const getCategoryColor = (categoryId) => {
  const cat = categories.find(c => c.id === categoryId)
  return cat ? cat.color : '#999'
}

// 获取分类图标
const getCategoryIcon = (categoryId) => {
  const cat = categories.find(c => c.id === categoryId)
  return cat ? cat.icon : '📞'
}

// 分类切换
const onCategoryChange = (categoryId) => {
  selectedCategory.value = categoryId
}

// 根据分类筛选的电话列表
const filteredPhones = computed(() => {
  return getPhonesByCategory(selectedCategory.value)
})

// 收藏状态存储键名
const FAVORITE_KEY = 'phonebook_favorites'

// 获取收藏列表
const getFavorites = () => {
  try {
    return uni.getStorageSync(FAVORITE_KEY) || []
  } catch (e) {
    return []
  }
}

// 判断是否已收藏
const isFavorite = (id) => {
  const favorites = getFavorites()
  return favorites.includes(id)
}

// 切换收藏
const toggleFavorite = (id) => {
  try {
    let favorites = getFavorites()
    const index = favorites.indexOf(id)
    if (index > -1) {
      favorites.splice(index, 1)
      uni.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      favorites.push(id)
      uni.showToast({ title: '已收藏', icon: 'none' })
    }
    uni.setStorageSync(FAVORITE_KEY, favorites)
  } catch (e) {
    console.error('收藏存储失败', e)
  }
}

// 拨打电话
const makeCall = (phone) => {
  uni.makePhoneCall({
    phoneNumber: phone.phone.toString(),
    fail: () => {
      uni.showToast({ title: '拨打失败', icon: 'none' })
    }
  })
}

// 跳转到搜索页
const goToSearch = () => {
  uni.navigateTo({
    url: '/pages/phonebook/search'
  })
}

// 快捷拨号项
const quickDialItems = [
  { name: '急救', phone: '120', icon: '🚑' },
  { name: '报警', phone: '110', icon: '🚔' },
  { name: '火警', phone: '119', icon: '🚒' }
]

// 页面显示时检查设置
onShow(() => {
  try {
    const settings = uni.getStorageSync('app_settings') || {}
    isLargeFont.value = settings.largeFontMode || false
  } catch (e) {
    console.error('读取设置失败', e)
  }
})

onMounted(() => {
  // 默认选中第一个分类
  if (categories.length > 0) {
    selectedCategory.value = categories[0].id
  }
})
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.phonebook-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 180rpx;
}

// 搜索栏
.search-bar {
  display: flex;
  align-items: center;
  margin: $spacing-md;
  padding: $spacing-md $spacing-lg;
  background: #fff;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;

  .search-icon {
    font-size: 32rpx;
    margin-right: $spacing-sm;
  }

  .search-placeholder {
    font-size: $font-size-md;
    color: $text-grey;
  }
}

// 分类横向滚动
.category-scroll {
  white-space: nowrap;
  padding: 0 $spacing-md;

  .category-list {
    display: inline-flex;
    padding: $spacing-sm 0;

    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: $spacing-lg $spacing-md;
      margin-right: $spacing-sm;
      background: #fff;
      border-radius: $radius-md;
      min-width: 160rpx;
      min-height: 120rpx;
      box-shadow: $shadow-sm;

      .category-icon {
        font-size: 48rpx;
        margin-bottom: $spacing-sm;
      }

      .category-name {
        font-size: $font-size-sm;
        color: $text-secondary;
      }

      &.active {
        background: $primary-color;
        
        .category-name {
          color: #fff;
        }
      }
    }
  }
}

// 分类标题
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg $spacing-md;
  
  .section-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-primary;
  }

  .section-count {
    font-size: $font-size-sm;
    color: $text-grey;
  }
}

// 电话列表
.phone-list {
  height: calc(100vh - 500rpx);
  padding: 0 $spacing-md;

  .phone-card {
    display: flex;
    align-items: center;
    padding: $spacing-lg $spacing-md;
    margin-bottom: $spacing-md;
    background: #fff;
    border-radius: $radius-md;
    box-shadow: $shadow-sm;
    min-height: 140rpx;

    .phone-icon {
      width: 100rpx;
      height: 100rpx;
      border-radius: $radius-md;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48rpx;
      flex-shrink: 0;
    }

    .phone-info {
      flex: 1;
      margin-left: $spacing-md;
      overflow: hidden;

      .phone-name {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $text-primary;
        display: block;
        margin-bottom: $spacing-xs;
      }

      .phone-number {
        font-size: $font-size-md;
        color: $primary-color;
        font-weight: 500;
        display: block;
        margin-bottom: $spacing-xs;
      }

      .phone-address {
        font-size: $font-size-xs;
        color: $text-grey;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .phone-desc {
        font-size: $font-size-xs;
        color: $text-grey;
        display: block;
        margin-top: $spacing-xs;
      }
    }

    .phone-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-md;

      .call-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: $spacing-md;
        background: #07C160;
        border-radius: $radius-md;
        min-width: 120rpx;
        min-height: 90rpx;

        .call-icon {
          font-size: 40rpx;
        }

        .call-text {
          font-size: $font-size-sm;
          color: #fff;
          margin-top: $spacing-xs;
        }
      }

      .favorite-btn {
        padding: $spacing-md;
        min-width: 60rpx;
        min-height: 60rpx;

        .star-icon {
          font-size: 44rpx;
        }
      }
    }
  }

  // 空状态
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 0;

    .empty-icon {
      font-size: 80rpx;
      margin-bottom: $spacing-lg;
    }

    .empty-text {
      font-size: $font-size-md;
      color: $text-grey;
    }
  }
}

// 快捷拨号栏
.quick-dial-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: $spacing-md;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  border-radius: $radius-lg $radius-lg 0 0;

  .quick-dial-title {
    font-size: $font-size-sm;
    color: $text-grey;
    margin-bottom: $spacing-sm;
  }

  .quick-dial-list {
    display: flex;
    justify-content: space-around;

    .quick-dial-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: $spacing-md;
      background: #FFF5F5;
      border-radius: $radius-md;
      min-width: 160rpx;

      .quick-icon {
        font-size: 36rpx;
        margin-bottom: $spacing-xs;
      }

      .quick-name {
        font-size: $font-size-xs;
        color: $primary-color;
        font-weight: 500;
      }
    }
  }
}

// 大字体模式
.large-font {
  font-size: 40rpx !important;
}
</style>
