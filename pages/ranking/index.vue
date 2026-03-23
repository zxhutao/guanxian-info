<template>
  <view class="ranking-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <view class="header-bg">
        <text class="header-title">🏆 冠县服务好评�?/text>
        <text class="header-subtitle">真实评价 · 冠县人自己的口碑�?/text>
      </view>
    </view>

    <!-- 榜单说明 -->
    <view class="ranking-info">
      <view class="info-item">
        <text class="info-icon">📊</text>
        <text class="info-text">基于真实用户评价</text>
      </view>
      <view class="info-item">
        <text class="info-icon">⚖️</text>
        <text class="info-text">差评商家自动降权</text>
      </view>
      <view class="info-item">
        <text class="info-icon">🔄</text>
        <text class="info-text">每周更新排名</text>
      </view>
    </view>

    <!-- 分类筛�?-->
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

    <!-- TOP3  podium -->
    <view class="top-three" v-if="topProviders.length >= 3">
      <view class="podium">
        <!-- 第二�?-->
        <view class="podium-item second">
          <view class="rank-badge">2</view>
          <image :src="topProviders[1].avatar" mode="aspectFill" class="podium-avatar" />
          <text class="podium-name">{{ topProviders[1].name }}</text>
          <view class="podium-rating">
            <text class="stars">★★★★�?/text>
            <text class="score">{{ topProviders[1].rating }}</text>
          </view>
          <text class="podium-count">{{ topProviders[1].reviewCount }}条评�?/text>
        </view>

        <!-- 第一�?-->
        <view class="podium-item first">
          <view class="crown">👑</view>
          <view class="rank-badge">1</view>
          <image :src="topProviders[0].avatar" mode="aspectFill" class="podium-avatar" />
          <text class="podium-name">{{ topProviders[0].name }}</text>
          <view class="podium-rating">
            <text class="stars">★★★★�?/text>
            <text class="score">{{ topProviders[0].rating }}</text>
          </view>
          <text class="podium-count">{{ topProviders[0].reviewCount }}条评�?/text>
        </view>

        <!-- 第三�?-->
        <view class="podium-item third">
          <view class="rank-badge">3</view>
          <image :src="topProviders[2].avatar" mode="aspectFill" class="podium-avatar" />
          <text class="podium-name">{{ topProviders[2].name }}</text>
          <view class="podium-rating">
            <text class="stars">★★★★�?/text>
            <text class="score">{{ topProviders[2].rating }}</text>
          </view>
          <text class="podium-count">{{ topProviders[2].reviewCount }}条评�?/text>
        </view>
      </view>
    </view>

    <!-- 完整榜单 -->
    <view class="ranking-list">
      <view class="list-header">
        <text class="list-title">完整榜单 TOP10</text>
        <text class="update-time">{{ updateTime }}</text>
      </view>

      <view
        v-for="(item, index) in topProviders"
        :key="item._id"
        class="ranking-item"
        @click="goToDetail(item)"
      >
        <view class="rank-number" :class="{ top: index < 3 }">
          {{ index + 1 }}
        </view>
        <image :src="item.avatar" mode="aspectFill" class="item-avatar" />
        <view class="item-info">
          <view class="item-header">
            <text class="item-name">{{ item.name }}</text>
            <view class="item-tags" v-if="item.tags?.length">
              <text class="item-tag">{{ item.tags[0] }}</text>
            </view>
          </view>
          <view class="item-rating">
            <text class="stars">�?/text>
            <text class="score">{{ item.rating }}</text>
            <text class="count">{{ item.reviewCount }}条评�?/text>
          </view>
          <view class="item-desc" v-if="item.description">
            <text>{{ item.description.slice(0, 30) }}...</text>
          </view>
        </view>
        <view class="item-action">
          <text class="action-text">查看</text>
          <text class="action-arrow">�?/text>
        </view>
      </view>
    </view>

    <!-- 榜单规则说明 -->
    <view class="rules-section">
      <view class="rules-title">📋 榜单规则</view>
      <view class="rules-content">
        <view class="rule-item">
          <text class="rule-num">1</text>
          <text class="rule-text">基于用户真实评价，采用威尔逊区间算法计算排�?/text>
        </view>
        <view class="rule-item">
          <text class="rule-num">2</text>
          <text class="rule-text">差评率超�?0%的商家将自动降权，超�?0%将大幅降�?/text>
        </view>
        <view class="rule-item">
          <text class="rule-num">3</text>
          <text class="rule-text">至少3条评价才能上榜，确保排名客观公正</text>
        </view>
        <view class="rule-item">
          <text class="rule-num">4</text>
          <text class="rule-text">榜单每周更新，反映最新服务质�?/text>
        </view>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const currentCategory = ref('all')
const topProviders = ref([])
const updateTime = ref('')

const categories = [
  { label: '全部', value: 'all' },
  { label: '家政保洁', value: 'housekeeping' },
  { label: '家电维修', value: 'appliance' },
  { label: '开锁疏�?, value: 'locksmith' },
  { label: '搬家货运', value: 'moving' },
  { label: '养老护�?, value: 'worker' }
]

// 模拟数据
const mockData = [
  {
    _id: '1',
    name: '冠县金牌保洁',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 4.9,
    reviewCount: 328,
    category: 'housekeeping',
    tags: ['服务热情', '专业细致'],
    description: '专业家政保洁，服务冠县十年，好评如潮'
  },
  {
    _id: '2',
    name: '顺达家电维修',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 4.8,
    reviewCount: 256,
    category: 'appliance',
    tags: ['技术专�?, '价格透明'],
    description: '持证上岗，原厂配件，保修三个�?
  },
  {
    _id: '3',
    name: '安心开锁服�?,
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 4.7,
    reviewCount: 189,
    category: 'locksmith',
    tags: ['24小时', '公安备案'],
    description: '24小时服务，公安备案，安全可靠'
  },
  {
    _id: '4',
    name: '快捷搬家公司',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 4.6,
    reviewCount: 145,
    category: 'moving',
    tags: ['准时到达', '收费合理'],
    description: '专业搬家团队，价格透明，损坏包�?
  },
  {
    _id: '5',
    name: '张阿姨家�?,
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 4.8,
    reviewCount: 112,
    category: 'housekeeping',
    tags: ['细心耐心', '回头客多'],
    description: '张阿姨亲自带队，服务贴心周到'
  },
  {
    _id: '6',
    name: '李师傅维�?,
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 4.5,
    reviewCount: 98,
    category: 'appliance',
    tags: ['经验丰富', '随叫随到'],
    description: '20年维修经验，疑难杂症都能�?
  },
  {
    _id: '7',
    name: '王大姐保�?,
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 4.7,
    reviewCount: 87,
    category: 'housekeeping',
    tags: ['深度清洁', '工具齐全'],
    description: '专业深度清洁，新房开荒首�?
  },
  {
    _id: '8',
    name: '刘师傅开�?,
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 4.6,
    reviewCount: 76,
    category: 'locksmith',
    tags: ['快速响�?, '技术精�?],
    description: '15分钟快速上门，技术过�?
  },
  {
    _id: '9',
    name: '福运搬家',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 4.4,
    reviewCount: 65,
    category: 'moving',
    tags: ['大型搬家', '企业搬迁'],
    description: '承接大型搬家、企业搬迁，专业团队'
  },
  {
    _id: '10',
    name: '赵阿姨护�?,
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    rating: 4.9,
    reviewCount: 54,
    category: 'worker',
    tags: ['专业护理', '有爱�?],
    description: '持证护工�?年护理经验，深受好评'
  }
]

onShow(() => {
  loadRanking()
})

watch(currentCategory, () => {
  loadRanking()
})

const loadRanking = async () => {
  // 显示加载�?
  uni.showLoading({ title: '加载�?..' })
  
  try {
    // 实际项目中调用云函数
    // const { result } = await uniCloud.callFunction({
    //   name: 'reviews',
    //   data: {
    //     action: 'getTopRatedProviders',
    //     data: {
    //       category: currentCategory.value === 'all' ? '' : currentCategory.value,
    //       type: currentCategory.value === 'worker' ? 'worker' : 'service',
    //       limit: 10
    //     }
    //   }
    // })
    
    // 模拟数据筛�?
    let filtered = mockData
    if (currentCategory.value !== 'all') {
      filtered = mockData.filter(item => item.category === currentCategory.value)
    }
    
    // 按评分和评论数排�?
    filtered.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating
      return b.reviewCount - a.reviewCount
    })
    
    topProviders.value = filtered.slice(0, 10)
    
    // 更新时间
    const now = new Date()
    updateTime.value = `${now.getMonth() + 1}�?{now.getDate()}日更新`
  } catch (error) {
    console.error('加载榜单失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
  }
}

const goToDetail = (item) => {
  const path = item.category === 'worker' 
    ? `/pages/nursing/detail?id=${item._id}`
    : `/pages/service/detail?category=${item.category}`
  
  uni.navigateTo({ url: path })
}
</script>

<style lang="scss" scoped>
.ranking-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  .header-bg {
    background: linear-gradient(135deg, #E63946 0%, #FF6B6B 100%);
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
}

.ranking-info {
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding: 30rpx 20rpx;
  margin-bottom: 20rpx;

  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;

    .info-icon {
      font-size: 36rpx;
    }

    .info-text {
      font-size: 24rpx;
      color: #666;
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
        background: #E63946;
        color: #fff;
      }
    }
  }
}

.top-three {
  background: #fff;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;

  .podium {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 30rpx;

    .podium-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      &.first {
        order: 2;
        transform: translateY(-20rpx);

        .crown {
          font-size: 48rpx;
          margin-bottom: 10rpx;
        }

        .rank-badge {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          width: 56rpx;
          height: 56rpx;
          font-size: 28rpx;
        }

        .podium-avatar {
          width: 140rpx;
          height: 140rpx;
          border: 4rpx solid #FFD700;
        }
      }

      &.second {
        order: 1;

        .rank-badge {
          background: linear-gradient(135deg, #C0C0C0, #A0A0A0);
        }
      }

      &.third {
        order: 3;

        .rank-badge {
          background: linear-gradient(135deg, #CD7F32, #B87333);
        }
      }

      .rank-badge {
        width: 48rpx;
        height: 48rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: bold;
        font-size: 24rpx;
        margin-bottom: 16rpx;
      }

      .podium-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        margin-bottom: 16rpx;
      }

      .podium-name {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
        max-width: 180rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .podium-rating {
        display: flex;
        align-items: center;
        gap: 8rpx;
        margin-bottom: 8rpx;

        .stars {
          color: #FFD700;
          font-size: 22rpx;
        }

        .score {
          color: #E63946;
          font-size: 26rpx;
          font-weight: 600;
        }
      }

      .podium-count {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
}

.ranking-list {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .list-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .update-time {
      font-size: 24rpx;
      color: #999;
    }
  }

  .ranking-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .rank-number {
      width: 48rpx;
      height: 48rpx;
      background: #f5f5f5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26rpx;
      font-weight: 600;
      color: #666;
      margin-right: 20rpx;

      &.top {
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #fff;
      }
    }

    .item-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 12rpx;
      margin-right: 20rpx;
    }

    .item-info {
      flex: 1;

      .item-header {
        display: flex;
        align-items: center;
        gap: 12rpx;
        margin-bottom: 8rpx;

        .item-name {
          font-size: 30rpx;
          font-weight: 600;
          color: #333;
        }

        .item-tag {
          padding: 4rpx 12rpx;
          background: #FFF5F5;
          color: #E63946;
          font-size: 20rpx;
          border-radius: 8rpx;
        }
      }

      .item-rating {
        display: flex;
        align-items: center;
        gap: 8rpx;
        margin-bottom: 8rpx;

        .stars {
          color: #FFD700;
          font-size: 22rpx;
        }

        .score {
          color: #E63946;
          font-size: 26rpx;
          font-weight: 600;
        }

        .count {
          font-size: 24rpx;
          color: #999;
        }
      }

      .item-desc {
        font-size: 24rpx;
        color: #666;
      }
    }

    .item-action {
      display: flex;
      align-items: center;
      color: #E63946;

      .action-text {
        font-size: 26rpx;
      }

      .action-arrow {
        font-size: 32rpx;
      }
    }
  }
}

.rules-section {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .rules-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
  }

  .rules-content {
    .rule-item {
      display: flex;
      align-items: flex-start;
      gap: 16rpx;
      margin-bottom: 20rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .rule-num {
        width: 36rpx;
        height: 36rpx;
        background: #E63946;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22rpx;
        flex-shrink: 0;
      }

      .rule-text {
        font-size: 26rpx;
        color: #666;
        line-height: 1.6;
        flex: 1;
      }
    }
  }
}

.bottom-space {
  height: 40rpx;
}
</style>

