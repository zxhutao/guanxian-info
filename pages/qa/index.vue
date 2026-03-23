<template>
  <view class="qa-page">
    <!-- 顶部搜索栏 -->
    <view class="search-bar" @click="goToSearch">
      <text class="search-icon">🔍</text>
      <text class="search-placeholder">搜索问题...</text>
    </view>

    <!-- 分类标签 -->
    <scroll-view class="category-scroll" scroll-x>
      <view class="category-list">
        <view
          v-for="cat in categories"
          :key="cat.value"
          class="category-item"
          :class="{ active: selectedCategory === cat.value }"
          @click="onCategoryChange(cat.value)"
        >
          {{ cat.label }}
        </view>
      </view>
    </scroll-view>

    <!-- Tab切换 -->
    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: currentTab === tab.value }"
        @click="onTabChange(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 问题列表 -->
    <scroll-view class="question-list" scroll-y @scrolltolower="loadMore">
      <view
        v-for="question in filteredQuestions"
        :key="question.id"
        class="question-card"
        @click="goToDetail(question.id)"
      >
        <!-- 标题 -->
        <view class="question-header">
          <text class="question-title">{{ question.title }}</text>
          <view class="reward-tag" v-if="question.reward > 0">
            <text class="reward-icon">💰</text>
            <text class="reward-text">{{ question.reward }}积分</text>
          </view>
        </view>

        <!-- 内容摘要 -->
        <text class="question-content">{{ question.content }}</text>

        <!-- 分类标签 -->
        <view class="question-tags">
          <text class="tag">{{ getCategoryName(question.category) }}</text>
          <text class="status-tag" :class="{ solved: question.status === 'solved' }">
            {{ question.status === 'solved' ? '已解决' : '待解决' }}
          </text>
        </view>

        <!-- 底部信息 -->
        <view class="question-footer">
          <view class="author-info">
            <image class="avatar" :src="question.author.avatar" mode="aspectFill" />
            <text class="nickname">{{ question.author.nickname }}</text>
          </view>
          <view class="meta-info">
            <text class="meta-item">💬 {{ question.answerCount }}</text>
            <text class="meta-item">👁️ {{ question.viewCount }}</text>
            <text class="meta-item">🕐 {{ formatTime(question.createTime) }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="filteredQuestions.length === 0">
        <text class="empty-icon">❓</text>
        <text class="empty-text">暂无相关问题</text>
      </view>
    </scroll-view>

    <!-- 提问按钮 -->
    <view class="ask-btn" @click="goToAsk">
      <text class="ask-icon">✏️</text>
      <text class="ask-text">提问</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { questionList } from './data.js'

// 分类
const categories = [
  { label: '全部', value: 'all' },
  { label: '生活服务', value: 'life' },
  { label: '求职招聘', value: 'job' },
  { label: '房屋租售', value: 'house' },
  { label: '教育培训', value: 'edu' },
  { label: '其他', value: 'other' }
]

// Tab
const tabs = [
  { label: '最新问题', value: 'latest' },
  { label: '热门问题', value: 'hot' },
  { label: '已解决', value: 'solved' }
]

const selectedCategory = ref('all')
const currentTab = ref('latest')

// 切换分类
const onCategoryChange = (value) => {
  selectedCategory.value = value
}

// 切换Tab
const onTabChange = (value) => {
  currentTab.value = value
}

// 获取分类名称
const getCategoryName = (category) => {
  const cat = categories.find(c => c.value === category)
  return cat ? cat.label : '其他'
}

// 格式化时间
const formatTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return new Date(timestamp).toLocaleDateString()
}

// 筛选问题
const filteredQuestions = computed(() => {
  let result = [...questionList]

  // 分类筛选
  if (selectedCategory.value !== 'all') {
    result = result.filter(q => q.category === selectedCategory.value)
  }

  // Tab筛选
  if (currentTab.value === 'solved') {
    result = result.filter(q => q.status === 'solved')
  } else if (currentTab.value === 'hot') {
    result = [...result].sort((a, b) => b.viewCount - a.viewCount)
  } else {
    result = [...result].sort((a, b) => b.createTime - a.createTime)
  }

  return result
})

// 跳转到详情
const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/qa/detail?id=${id}`
  })
}

// 跳转到搜索
const goToSearch = () => {
  uni.navigateTo({
    url: '/pages/qa/search'
  })
}

// 跳转到提问
const goToAsk = () => {
  uni.navigateTo({
    url: '/pages/qa/ask'
  })
}

// 加载更多
const loadMore = () => {
  // TODO: 实现分页加载
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.qa-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 120rpx;
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
    padding: $spacing-xs 0;

    .category-item {
      padding: $spacing-sm $spacing-lg;
      margin-right: $spacing-sm;
      background: #fff;
      border-radius: 30rpx;
      font-size: $font-size-sm;
      color: $text-secondary;
      white-space: nowrap;

      &.active {
        background: $primary-color;
        color: #fff;
      }
    }
  }
}

// Tab栏
.tab-bar {
  display: flex;
  background: #fff;
  padding: $spacing-sm $spacing-md;
  border-bottom: 1rpx solid $border-color;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: $spacing-md 0;
    font-size: $font-size-md;
    color: $text-secondary;
    position: relative;

    &.active {
      color: $primary-color;
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60rpx;
        height: 4rpx;
        background: $primary-color;
        border-radius: 2rpx;
      }
    }
  }
}

// 问题列表
.question-list {
  height: calc(100vh - 380rpx);
  padding: $spacing-md;

  .question-card {
    background: #fff;
    border-radius: $radius-md;
    padding: $spacing-lg;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-sm;

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: $spacing-sm;

      .question-title {
        flex: 1;
        font-size: $font-size-lg;
        font-weight: 600;
        color: $text-primary;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .reward-tag {
        display: flex;
        align-items: center;
        padding: $spacing-xs $spacing-sm;
        background: rgba(230, 57, 70, 0.1);
        border-radius: 20rpx;
        margin-left: $spacing-sm;
        flex-shrink: 0;

        .reward-icon {
          font-size: 24rpx;
        }

        .reward-text {
          font-size: $font-size-xs;
          color: $primary-color;
          font-weight: 500;
        }
      }
    }

    .question-content {
      font-size: $font-size-sm;
      color: $text-secondary;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: $spacing-sm;
    }

    .question-tags {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-md;

      .tag {
        padding: $spacing-xs $spacing-sm;
        background: $bg-color;
        border-radius: $radius-sm;
        font-size: $font-size-xs;
        color: $text-secondary;
      }

      .status-tag {
        padding: $spacing-xs $spacing-sm;
        background: rgba($warning-color, 0.1);
        border-radius: $radius-sm;
        font-size: $font-size-xs;
        color: $warning-color;

        &.solved {
          background: rgba($success-color, 0.1);
          color: $success-color;
        }
      }
    }

    .question-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: $spacing-md;
      border-top: 1rpx solid $border-color;

      .author-info {
        display: flex;
        align-items: center;

        .avatar {
          width: 48rpx;
          height: 48rpx;
          border-radius: 50%;
          margin-right: $spacing-sm;
        }

        .nickname {
          font-size: $font-size-sm;
          color: $text-secondary;
        }
      }

      .meta-info {
        display: flex;
        align-items: center;
        gap: $spacing-md;

        .meta-item {
          font-size: $font-size-xs;
          color: $text-grey;
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
      margin-bottom: $spacing-lg;
    }

    .empty-text {
      font-size: $font-size-md;
      color: $text-grey;
    }
  }
}

// 提问按钮
.ask-btn {
  position: fixed;
  right: $spacing-lg;
  bottom: 150rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-md $spacing-lg;
  background: $primary-color;
  border-radius: 50rpx;
  box-shadow: 0 4rpx 20rpx rgba(230, 57, 70, 0.4);

  .ask-icon {
    font-size: 40rpx;
  }

  .ask-text {
    font-size: $font-size-xs;
    color: #fff;
    margin-top: $spacing-xs;
  }
}
</style>
