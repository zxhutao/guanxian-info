<template>
  <view class="search-page">
    <!-- 搜索框 -->
    <view class="search-box">
      <u-search 
        v-model="keyword" 
        placeholder="搜索职位/服务/护工" 
        :show-action="true"
        @search="handleSearch"
        @custom="handleSearch"
      />
    </view>
    
    <!-- 搜索类型 -->
    <view class="search-type">
      <view 
        class="type-item" 
        :class="{ active: currentType === index }"
        v-for="(item, index) in searchTypes" 
        :key="index"
        @click="changeType(index)"
      >
        {{ item }}
      </view>
    </view>
    
    <!-- 搜索结果 -->
    <view class="result-list" v-if="keyword && searched">
      <view 
        class="result-item" 
        v-for="(item, index) in results" 
        :key="index" 
        @click="goToDetail(item)"
      >
        <view class="result-header">
          <view class="result-title">{{ item.title }}</view>
          <view class="result-price" v-if="item.price">{{ item.price }}</view>
        </view>
        <view class="result-desc">{{ item.desc }}</view>
        <view class="result-tags" v-if="item.tags">
          <text class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</text>
        </view>
      </view>
      
      <view class="no-result" v-if="results.length === 0">
        <text class="no-result-icon">🔍</text>
        <text>未找到"{{ keyword }}"相关结果</text>
        <text class="no-result-hint">试试其他关键词吧</text>
      </view>
    </view>
    
    <!-- 热门搜索 -->
    <view class="hot-search" v-if="!keyword">
      <view class="section-title">热门搜索</view>
      <view class="hot-tags">
        <view 
          class="hot-tag" 
          v-for="(tag, index) in hotKeywords" 
          :key="index"
          @click="searchHot(tag)"
        >
          <text class="hot-tag-text">{{ tag }}</text>
        </view>
      </view>
    </view>
    
    <!-- 搜索历史 -->
    <view class="history-search" v-if="!keyword && historyList.length > 0">
      <view class="section-header">
        <view class="section-title">搜索历史</view>
        <view class="clear-btn" @click="clearHistory">清除</view>
      </view>
      <view class="history-tags">
        <view 
          class="history-tag" 
          v-for="(item, index) in historyList" 
          :key="index"
          @click="searchHistory(item)"
        >
          <text>{{ item }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const keyword = ref('')
const currentType = ref(0)
const searched = ref(false)
const searchTypes = ['全部', '招聘', '服务', '护工']
const results = ref([])
const historyList = ref([])

// 热门关键词
const hotKeywords = ['工厂直招', '包吃包住', '家政保洁', '开锁疏通', '护工', '临时工']

// 全部数据
const allData = {
  jobs: [
    { id: 1, title: '玻璃厂操作工', desc: '冠县工业园区 · 不限学历 · 招10人', price: '5000-8000元/月', tags: ['包吃包住', '五险一金'], type: 'job' },
    { id: 2, title: '五金厂普工', desc: '冠县清泉街道 · 不限学历 · 招20人', price: '4500-7000元/月', tags: ['加班补助', '年终奖'], type: 'job' },
    { id: 3, title: '纺织车间工人', desc: '冠县烟庄街道 · 不限学历 · 招15人', price: '4000-6000元/月', tags: ['包吃住', '全勤奖'], type: 'job' },
    { id: 4, title: '仓库管理员', desc: '冠县崇文街道 · 高中以上 · 招5人', price: '3500-5000元/月', tags: ['五险', '正常班'], type: 'job' },
    { id: 5, title: '送货司机', desc: '冠县城区 · B2驾照 · 招3人', price: '6000-9000元/月', tags: ['C1驾照'], type: 'job' }
  ],
  services: [
    { id: 1, title: '家政保洁', desc: '专业家政团队，日常保洁/深度清洁', price: '¥99起', tags: ['日常保洁', '深度清洁'], type: 'service' },
    { id: 2, title: '家电维修', desc: '空调/冰箱/洗衣机等各类家电维修', price: '¥50起', tags: ['空调维修', '清洗'], type: 'service' },
    { id: 3, title: '开锁疏通', desc: '24小时开锁、换锁、管道疏通', price: '¥50起', tags: ['24小时', '快速上门'], type: 'service' },
    { id: 4, title: '搬家货运', desc: '居民搬家、公司搬迁、家具拆装', price: '¥200起', tags: ['搬运', '拆装'], type: 'service' }
  ],
  caregivers: [
    { id: 1, title: '张阿姨', desc: '女 · 48岁 · 5年经验', price: '¥200/天', tags: ['日常起居', '康复辅助'], type: 'caregiver' },
    { id: 2, title: '李大姐', desc: '女 · 45岁 · 3年经验', price: '¥220/天', tags: ['失能护理', '卧床护理'], type: 'caregiver' },
    { id: 3, title: '王师傅', desc: '男 · 52岁 · 8年经验', price: '¥250/天', tags: ['康复训练', '男性护理'], type: 'caregiver' }
  ]
}

// 加载搜索历史
onMounted(() => {
  const history = uni.getStorageSync('search_history') || '[]'
  try {
    historyList.value = JSON.parse(history)
  } catch (e) {
    historyList.value = []
  }
})

// 切换类型
const changeType = (index) => {
  currentType.value = index
  if (keyword.value) {
    handleSearch()
  }
}

// 执行搜索
const handleSearch = () => {
  if (!keyword.value.trim()) return
  
  searched.value = true
  saveHistory(keyword.value)
  
  const kw = keyword.value.toLowerCase()
  let data = []
  
  // 根据类型筛选数据
  if (currentType.value === 0) {
    // 全部
    data = [...allData.jobs, ...allData.services, ...allData.caregivers]
  } else if (currentType.value === 1) {
    data = allData.jobs
  } else if (currentType.value === 2) {
    data = allData.services
  } else {
    data = allData.caregivers
  }
  
  // 过滤匹配的结果
  results.value = data.filter(item => {
    return item.title.includes(kw) || item.desc.includes(kw) || item.tags.some(tag => tag.includes(kw))
  })
}

// 保存搜索历史
const saveHistory = (kw) => {
  const list = historyList.value.filter(item => item !== kw)
  list.unshift(kw)
  if (list.length > 10) list.pop()
  historyList.value = list
  uni.setStorageSync('search_history', JSON.stringify(list))
}

// 清除历史
const clearHistory = () => {
  historyList.value = []
  uni.removeStorageSync('search_history')
}

// 点击历史搜索
const searchHistory = (kw) => {
  keyword.value = kw
  handleSearch()
}

// 点击热门搜索
const searchHot = (kw) => {
  keyword.value = kw
  handleSearch()
}

// 跳转到详情页
const goToDetail = (item) => {
  if (item.type === 'job') {
    uni.navigateTo({ url: `/pages/job/detail?id=${item.id}` })
  } else if (item.type === 'service') {
    uni.navigateTo({ url: `/pages/service/detail?id=${item.id}` })
  } else {
    uni.navigateTo({ url: `/pages/nursing/detail?id=${item.id}` })
  }
}
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50rpx;
}

.search-box {
  padding: 20rpx 30rpx;
  background: #fff;
}

.search-type {
  display: flex;
  background: #fff;
  padding: 0 30rpx 20rpx;
  gap: 20rpx;
  
  .type-item {
    padding: 12rpx 28rpx;
    background: #f5f5f5;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #666;
    
    &.active {
      background: #E63946;
      color: #fff;
    }
  }
}

.result-list {
  padding: 20rpx;
  
  .result-item {
    background: #fff;
    padding: 28rpx;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    
    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12rpx;
      
      .result-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }
      
      .result-price {
        font-size: 30rpx;
        color: #E63946;
        font-weight: bold;
      }
    }
    
    .result-desc {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 16rpx;
    }
    
    .result-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 12rpx;
      
      .tag {
        padding: 6rpx 16rpx;
        background: #FFF0F0;
        color: #E63946;
        font-size: 22rpx;
        border-radius: 8rpx;
      }
    }
  }
  
  .no-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 0;
    color: #999;
    
    .no-result-icon {
      font-size: 80rpx;
      margin-bottom: 20rpx;
    }
    
    .no-result-hint {
      font-size: 26rpx;
      margin-top: 12rpx;
    }
  }
}

.hot-search, .history-search {
  padding: 30rpx;
  background: #fff;
  margin-top: 20rpx;
  
  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .clear-btn {
      font-size: 26rpx;
      color: #999;
    }
  }
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  
  .hot-tag {
    padding: 16rpx 28rpx;
    background: #f5f5f5;
    border-radius: 30rpx;
    
    .hot-tag-text {
      font-size: 26rpx;
      color: #333;
    }
  }
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  
  .history-tag {
    padding: 12rpx 24rpx;
    background: #f5f5f5;
    border-radius: 8rpx;
    font-size: 26rpx;
    color: #666;
  }
}
</style>
