<template>
  <view class="job-list-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input
        class="search-input"
        placeholder="搜索职位、公司"
        v-model="keyword"
        @confirm="onSearch"
      />
      <button class="search-btn" @click="onSearch">搜索</button>
    </view>

    <!-- 分类标签 -->
    <scroll-view class="category-scroll" scroll-x>
      <view class="category-list">
        <view
          v-for="cat in categories"
          :key="cat.value"
          :class="['category-item', { active: selectedCategory === cat.value }]"
          @click="onCategoryChange(cat.value)"
        >
          {{ cat.label }}
        </view>
      </view>
    </scroll-view>

    <!-- 职位列表 -->
    <scroll-view
      class="job-scroll"
      scroll-y
      @scrolltolower="loadMore"
    >
      <view class="job-list">
        <view
          v-for="job in filteredJobs"
          :key="job.id"
          class="job-card"
          @click="toDetail(job.id)"
        >
          <view class="job-header">
            <text class="job-title">{{ job.title }}</text>
            <text class="job-salary">{{ job.salary }}</text>
          </view>
          <view class="job-company">
            <text>🏢 {{ job.company }}</text>
          </view>
          <view class="job-footer">
            <view class="job-tags">
              <text v-for="tag in job.tags" :key="tag" class="tag">{{ tag }}</text>
            </view>
            <view class="job-location">
              <text>📍 {{ job.location }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="loading-tip" v-if="loading">
        <text>加载中...</text>
      </view>
      <view class="empty-tip" v-else-if="filteredJobs.length === 0">
        <text>暂无职位</text>
      </view>
    </scroll-view>

    <!-- 发布按钮 -->
    <view class="publish-btn" @click="toPublish">
      <text>发布职位</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// 搜索关键词
const keyword = ref('')

// 选中的分类
const selectedCategory = ref('')

// 职位列表 - 静态数据
const allJobs = ref([
  { id: 1, title: '普工/操作工', company: '冠县光明玻璃厂', salary: '5000-8000元/月', location: '冠县工业园区', tags: ['包吃', '包住', '五险', '长白班'], category: '工厂' },
  { id: 2, title: '质检员', company: '山东华兴金属', salary: '4500-6000元/月', location: '冠县开发区', tags: ['长白班', '环境好', '缴纳社保'], category: '质检' },
  { id: 3, title: '叉车司机', company: '冠县顺达物流', salary: '5500-7000元/月', location: '冠县物流园', tags: ['持证上岗', '加班费', '高温补贴'], category: '物流' },
  { id: 4, title: '纺织工', company: '冠县纺织集团', salary: '4000-6500元/月', location: '冠县纺织工业园', tags: ['计件工资', '熟练工优先', '空调车间'], category: '纺织' },
  { id: 5, title: '包装工', company: '冠县食品厂', salary: '3500-5000元/月', location: '冠县城区', tags: ['工作轻松', '女性优先', '节假日福利'], category: '包装' },
  { id: 6, title: '焊工', company: '山东钢铁配件', salary: '6000-9000元/月', location: '冠县工业园区', tags: ['高工资', '有经验优先', '提供住宿'], category: '技工' },
  { id: 7, title: '车床工', company: '冠县机械厂', salary: '5000-7000元/月', location: '冠县开发区', tags: ['技术工种', '缴纳五险', '包住'], category: '技工' },
  { id: 8, title: '仓库管理员', company: '冠县仓储中心', salary: '3500-4500元/月', location: '冠县物流园', tags: ['长白班', '工作稳定', '缴纳社保'], category: '物流' },
  { id: 9, title: '服装缝纫工', company: '冠县服装厂', salary: '4000-6000元/月', location: '冠县城区', tags: ['计件工资', '女性优先', '简单易学'], category: '纺织' },
  { id: 10, title: '打磨工', company: '冠县五金厂', salary: '4500-6500元/月', location: '冠县工业园区', tags: ['包吃住', '高温补贴', '年底奖金'], category: '工厂' }
])

// 加载状态
const loading = ref(false)

// 分类列表
const categories = [
  { label: '全部', value: '' },
  { label: '工厂', value: '工厂' },
  { label: '物流', value: '物流' },
  { label: '纺织', value: '纺织' },
  { label: '技工', value: '技工' },
  { label: '质检', value: '质检' },
  { label: '包装', value: '包装' },
  { label: '其他', value: '其他' }
]

// 过滤后的职位
const filteredJobs = computed(() => {
  let result = allJobs.value

  // 按分类筛选
  if (selectedCategory.value) {
    result = result.filter(job => job.category === selectedCategory.value)
  }

  // 按关键词搜索
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    result = result.filter(job =>
      job.title.toLowerCase().includes(kw) ||
      job.company.toLowerCase().includes(kw)
    )
  }

  return result
})

// 页面显示时
onShow(() => {
  // 重置状态
  keyword.value = ''
  selectedCategory.value = ''
})

// 搜索
function onSearch() {
  // 搜索功能由 computed 自动处理
}

// 分类切换
function onCategoryChange(cat) {
  selectedCategory.value = cat
}

// 加载更多
function loadMore() {
  // 静态数据不需要加载更多
}

// 跳转详情
const toDetail = (id) => {
  uni.navigateTo({ url: `/pages/job/detail?id=${id}` })
}

// 跳转发布
const toPublish = () => {
  uni.navigateTo({ url: '/pages/job/publish' })
}
</script>

<style lang="scss" scoped>
.job-list-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.search-bar {
  display: flex;
  padding: 20rpx 30rpx;
  background: #fff;
  gap: 20rpx;

  .search-input {
    flex: 1;
    height: 72rpx;
    background: #f5f5f5;
    border-radius: 36rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
  }

  .search-btn {
    width: 120rpx;
    height: 72rpx;
    background: linear-gradient(135deg, #E63946 0%, #C1121F 100%);
    color: #fff;
    border-radius: 36rpx;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
  }
}

.category-scroll {
  background: #fff;
  white-space: nowrap;
  padding: 20rpx 0;

  .category-list {
    display: inline-flex;
    padding: 0 20rpx;
    gap: 20rpx;

    .category-item {
      display: inline-block;
      padding: 12rpx 32rpx;
      background: #f5f5f5;
      border-radius: 30rpx;
      font-size: 26rpx;
      color: #666;
      white-space: nowrap;

      &.active {
        background: linear-gradient(135deg, #E63946 0%, #C1121F 100%);
        color: #fff;
      }
    }
  }
}

.job-scroll {
  flex: 1;
  padding: 20rpx 30rpx;
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .job-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;

      .job-title {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
      }

      .job-salary {
        font-size: 32rpx;
        color: #E63946;
        font-weight: 500;
      }
    }

    .job-company {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 20rpx;
    }

    .job-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .job-tags {
        display: flex;
        gap: 12rpx;
        flex-wrap: wrap;

        .tag {
          padding: 6rpx 16rpx;
          background: #FFF0F0;
          color: #E63946;
          font-size: 22rpx;
          border-radius: 8rpx;
        }
      }

      .job-location {
        font-size: 24rpx;
        color: #999;
        flex-shrink: 0;
      }
    }
  }
}

.loading-tip {
  text-align: center;
  padding: 40rpx;
  color: #999;
  font-size: 28rpx;
}

.empty-tip {
  text-align: center;
  padding: 100rpx;
  color: #999;
  font-size: 28rpx;
}

.publish-btn {
  position: fixed;
  right: 30rpx;
  bottom: 200rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #E63946 0%, #C1121F 100%);
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(230, 57, 70, 0.4);

  text {
    color: #fff;
    font-size: 24rpx;
    text-align: center;
    line-height: 1.3;
  }
}
</style>
