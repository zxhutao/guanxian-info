<template>
  <view class="search-page">
    <!-- 搜索头部 -->
    <view class="search-header">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          v-model="keyword"
          placeholder="搜索问题..."
          confirm-type="search"
          @confirm="onSearch"
          focus
        />
        <text class="clear-icon" v-if="keyword" @click="clearKeyword">✕</text>
      </view>
      <text class="cancel-btn" @click="goBack">取消</text>
    </view>

    <!-- 搜索历史 -->
    <view class="history-section" v-if="!keyword && searchHistory.length > 0">
      <view class="section-header">
        <text class="section-title">搜索历史</text>
        <text class="clear-history" @click="clearHistory">清空</text>
      </view>
      <view class="history-tags">
        <view
          v-for="(item, index) in searchHistory"
          :key="index"
          class="history-tag"
          @click="useHistory(item)"
        >
          {{ item }}
        </view>
      </view>
    </view>

    <!-- 热门搜索 -->
    <view class="hot-section" v-if="!keyword">
      <view class="section-header">
        <text class="section-title">热门问题</text>
      </view>
      <view class="hot-list">
        <view
          v-for="(question, index) in hotQuestions"
          :key="question.id"
          class="hot-item"
          @click="goToDetail(question.id)"
        >
          <text class="hot-rank" :class="{ top: index < 3 }">{{ index + 1 }}</text>
          <view class="hot-info">
            <text class="hot-title">{{ question.title }}</text>
            <text class="hot-meta">{{ question.answerCount }}回答 · {{ question.viewCount }}浏览</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <scroll-view class="result-section" scroll-y v-if="keyword && searchResults.length > 0">
      <view class="result-count">
        找到 {{ searchResults.length }} 个相关问题
      </view>
      <view
        v-for="question in searchResults"
        :key="question.id"
        class="result-card"
        @click="goToDetail(question.id)"
      >
        <view class="result-title">
          <text v-for="(part, i) in highlightText(question.title)" :key="i" :class="{ highlight: part.isMatch }">{{ part.text }}</text>
        </view>
        <text class="result-content">{{ question.content }}</text>
        <view class="result-meta">
          <text class="meta-item">{{ getCategoryName(question.category) }}</text>
          <text class="meta-item">💬 {{ question.answerCount }}</text>
          <text class="meta-item">👁️ {{ question.viewCount }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 无结果 -->
    <view class="no-result" v-if="keyword && searchResults.length === 0 && !searching">
      <text class="no-result-icon">🔍</text>
      <text class="no-result-text">未找到相关问题</text>
      <text class="no-result-hint">换个关键词试试吧</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { questionList } from './data.js'

// 搜索关键词
const keyword = ref('')

// 搜索历史
const HISTORY_KEY = 'qa_search_history'
const searchHistory = ref([])

// 搜索结果
const searchResults = ref([])

// 搜索中
const searching = ref(false)

// 热门问题（按浏览量排序）
const hotQuestions = computed(() => {
  return [...questionList].sort((a, b) => b.viewCount - a.viewCount).slice(0, 10)
})

// 分类列表
const categories = [
  { label: '全部', value: 'all' },
  { label: '生活服务', value: 'life' },
  { label: '求职招聘', value: 'job' },
  { label: '房屋租售', value: 'house' },
  { label: '教育培训', value: 'edu' },
  { label: '其他', value: 'other' }
]

// 获取分类名称
const getCategoryName = (category) => {
  const cat = categories.find(c => c.value === category)
  return cat ? cat.label : '其他'
}

// 高亮文本
const highlightText = (text) => {
  if (!keyword.value) return [{ text, isMatch: false }]
  const result = []
  const lowerText = text.toLowerCase()
  const lowerKeyword = keyword.value.toLowerCase()
  const index = lowerText.indexOf(lowerKeyword)

  if (index === -1) {
    result.push({ text, isMatch: false })
  } else {
    if (index > 0) {
      result.push({ text: text.substring(0, index), isMatch: false })
    }
    result.push({ text: text.substring(index, index + keyword.value.length), isMatch: true })
    if (index + keyword.value.length < text.length) {
      result.push({ text: text.substring(index + keyword.value.length), isMatch: false })
    }
  }
  return result
}

// 搜索
const onSearch = () => {
  if (!keyword.value.trim()) return

  searching.value = true
  saveSearchHistory(keyword.value)

  const k = keyword.value.toLowerCase().trim()
  searchResults.value = questionList.filter(q =>
    q.title.toLowerCase().includes(k) ||
    q.content.toLowerCase().includes(k)
  )

  searching.value = false
}

// 保存搜索历史
const saveSearchHistory = (kw) => {
  try {
    let history = uni.getStorageSync(HISTORY_KEY) || []
    history = history.filter(h => h !== kw)
    history.unshift(kw)
    if (history.length > 10) {
      history = history.slice(0, 10)
    }
    uni.setStorageSync(HISTORY_KEY, history)
    searchHistory.value = history
  } catch (e) {
    console.error('保存搜索历史失败', e)
  }
}

// 加载搜索历史
const loadSearchHistory = () => {
  try {
    searchHistory.value = uni.getStorageSync(HISTORY_KEY) || []
  } catch (e) {
    searchHistory.value = []
  }
}

// 清空搜索历史
const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确定清空搜索历史？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync(HISTORY_KEY)
        searchHistory.value = []
      }
    }
  })
}

// 使用历史搜索
const useHistory = (kw) => {
  keyword.value = kw
  onSearch()
}

// 清空关键词
const clearKeyword = () => {
  keyword.value = ''
  searchResults.value = []
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 跳转详情
const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/qa/detail?id=${id}`
  })
}

// 监听输入
watch(keyword, (newVal) => {
  if (newVal.trim() === '') {
    searchResults.value = []
  }
})

// 页面加载
onMounted(() => {
  loadSearchHistory()
})
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.search-page {
  min-height: 100vh;
  background: $bg-color;
}

// 搜索头部
.search-header {
  display: flex;
  align-items: center;
  padding: $spacing-md;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;

  .search-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    padding: $spacing-sm $spacing-md;
    background: $bg-color;
    border-radius: $radius-lg;

    .search-icon {
      font-size: 32rpx;
      margin-right: $spacing-sm;
    }

    .search-input {
      flex: 1;
      font-size: $font-size-md;
      height: 64rpx;
    }

    .clear-icon {
      font-size: 28rpx;
      color: $text-grey;
      padding: $spacing-xs;
    }
  }

  .cancel-btn {
    font-size: $font-size-md;
    color: $text-secondary;
    margin-left: $spacing-md;
    padding: $spacing-sm;
  }
}

// 历史记录
.history-section {
  padding: $spacing-lg $spacing-md;
  background: #fff;
  margin-bottom: $spacing-sm;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;

    .section-title {
      font-size: $font-size-md;
      font-weight: 600;
      color: $text-primary;
    }

    .clear-history {
      font-size: $font-size-sm;
      color: $primary-color;
    }
  }

  .history-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;

    .history-tag {
      padding: $spacing-sm $spacing-md;
      background: $bg-color;
      border-radius: $radius-md;
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
}

// 热门问题
.hot-section {
  padding: $spacing-lg $spacing-md;
  background: #fff;

  .section-header {
    margin-bottom: $spacing-md;

    .section-title {
      font-size: $font-size-md;
      font-weight: 600;
      color: $text-primary;
    }
  }

  .hot-list {
    .hot-item {
      display: flex;
      align-items: center;
      padding: $spacing-md 0;
      border-bottom: 1rpx solid $border-color;

      &:last-child {
        border-bottom: none;
      }

      .hot-rank {
        width: 48rpx;
        font-size: $font-size-md;
        color: $text-grey;
        text-align: center;

        &.top {
          color: $primary-color;
          font-weight: 600;
        }
      }

      .hot-info {
        flex: 1;
        margin-left: $spacing-md;

        .hot-title {
          font-size: $font-size-md;
          color: $text-primary;
          display: block;
          margin-bottom: $spacing-xs;
        }

        .hot-meta {
          font-size: $font-size-xs;
          color: $text-grey;
        }
      }
    }
  }
}

// 搜索结果
.result-section {
  height: calc(100vh - 120rpx);
  padding: $spacing-md;

  .result-count {
    font-size: $font-size-sm;
    color: $text-grey;
    margin-bottom: $spacing-md;
  }

  .result-card {
    background: #fff;
    border-radius: $radius-md;
    padding: $spacing-lg;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-sm;

    .result-title {
      font-size: $font-size-md;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: $spacing-sm;
      line-height: 1.4;

      .highlight {
        color: $primary-color;
        background: rgba(230, 57, 70, 0.1);
      }
    }

    .result-content {
      font-size: $font-size-sm;
      color: $text-secondary;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: $spacing-md;
    }

    .result-meta {
      display: flex;
      gap: $spacing-md;

      .meta-item {
        font-size: $font-size-xs;
        color: $text-grey;
      }
    }
  }
}

// 无结果
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;

  .no-result-icon {
    font-size: 100rpx;
    margin-bottom: $spacing-lg;
    opacity: 0.5;
  }

  .no-result-text {
    font-size: $font-size-lg;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
  }

  .no-result-hint {
    font-size: $font-size-sm;
    color: $text-grey;
  }
}
</style>
