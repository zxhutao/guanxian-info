<template>
  <view class="search-page">
    <!-- 搜索头部 -->
    <view class="search-header">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          v-model="keyword"
          placeholder="搜索电话、名称、地址"
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
        <text class="section-title">热门搜索</text>
      </view>
      <view class="hot-tags">
        <view
          v-for="(item, index) in hotSearches"
          :key="index"
          class="hot-tag"
          @click="useHistory(item)"
        >
          <text class="hot-rank">{{ index + 1 }}</text>
          <text class="hot-text">{{ item }}</text>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="result-section" v-if="keyword && searchResults.length > 0">
      <view class="result-count">
        找到 {{ searchResults.length }} 条结果
      </view>
      <view
        v-for="phone in searchResults"
        :key="phone.id"
        class="result-card"
      >
        <view class="result-icon" :style="{ background: getCategoryColor(phone.category) }">
          <text>{{ getCategoryIcon(phone.category) }}</text>
        </view>
        <view class="result-info">
          <!-- 名称高亮 -->
          <view class="result-name">
            <text v-for="(part, i) in highlightText(phone.name)" :key="i" :class="{ highlight: part.isMatch }">{{ part.text }}</text>
          </view>
          <text class="result-number">{{ phone.phone }}</text>
          <text class="result-address">{{ phone.address }}</text>
        </view>
        <view class="result-action">
          <view class="call-btn" @click="makeCall(phone)">
            <text>📞</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 无结果 -->
    <view class="no-result" v-if="keyword && searchResults.length === 0 && !searching">
      <text class="no-result-icon">🔍</text>
      <text class="no-result-text">未找到相关电话</text>
      <text class="no-result-hint">换个关键词试试吧</text>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { phoneCategories, phonebookData, searchPhones } from '@/data/phonebook.js'

// 搜索关键词
const keyword = ref('')

// 搜索历史
const HISTORY_KEY = 'phonebook_search_history'
const searchHistory = ref([])

// 热门搜索
const hotSearches = [
  '急救中心', '冠县人民医院', '供电公司', '自来水公司',
  '公安局', '人社局', '中国银行', '农业银行'
]

// 搜索结果
const searchResults = ref([])

// 搜索中状态
const searching = ref(false)

// 分类列表
const categories = phoneCategories

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

// 高亮文本处理
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
  
  // 保存搜索历史
  saveSearchHistory(keyword.value)
  
  // 执行搜索
  searchResults.value = searchPhones(keyword.value)
  
  searching.value = false
}

// 保存搜索历史
const saveSearchHistory = (kw) => {
  try {
    let history = uni.getStorageSync(HISTORY_KEY) || []
    // 去重
    history = history.filter(h => h !== kw)
    // 添加到开头
    history.unshift(kw)
    // 最多保存10条
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

// 返回上一页
const goBack = () => {
  uni.navigateBack()
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

// 历史记录和热门搜索
.history-section,
.hot-section {
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
}

// 历史标签
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

// 热门搜索
.hot-tags {
  .hot-tag {
    display: flex;
    align-items: center;
    padding: $spacing-sm 0;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .hot-rank {
      width: 48rpx;
      font-size: $font-size-sm;
      color: $text-grey;
    }

    .hot-text {
      flex: 1;
      font-size: $font-size-md;
      color: $text-primary;
    }
  }
}

// 搜索结果
.result-section {
  padding: $spacing-md;

  .result-count {
    font-size: $font-size-sm;
    color: $text-grey;
    margin-bottom: $spacing-md;
  }

  .result-card {
    display: flex;
    align-items: center;
    padding: $spacing-lg;
    background: #fff;
    border-radius: $radius-md;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-sm;

    .result-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: $radius-md;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
      flex-shrink: 0;
    }

    .result-info {
      flex: 1;
      margin-left: $spacing-md;
      overflow: hidden;

      .result-name {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: $spacing-xs;
        
        .highlight {
          color: $primary-color;
          background: rgba(230, 57, 70, 0.1);
        }
      }

      .result-number {
        font-size: $font-size-md;
        color: $primary-color;
        display: block;
        margin-bottom: $spacing-xs;
      }

      .result-address {
        font-size: $font-size-xs;
        color: $text-grey;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .result-action {
      .call-btn {
        width: 80rpx;
        height: 80rpx;
        background: #07C160;
        border-radius: $radius-circle;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36rpx;
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
