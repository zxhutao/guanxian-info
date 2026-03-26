<template>
  <view class="ranking-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <view class="header-bg">
        <text class="header-title">冠县服务好评榜</text>
        <text class="header-subtitle">真实评价 · 冠县人自己的口碑</text>
      </view>
    </view>

    <!-- 榜单说明 -->
    <view class="ranking-info">
      <view class="info-item">
        <text class="info-icon">🏆</text>
        <text class="info-text">基于真实用户评价</text>
      </view>
      <view class="info-item">
        <text class="info-icon">📈</text>
        <text class="info-text">好评商家自动置顶</text>
      </view>
      <view class="info-item">
        <text class="info-icon">🔄</text>
        <text class="info-text">每周更新排名</text>
      </view>
    </view>

    <!-- 分类筛选 -->
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

    <!-- TOP3 领奖台 -->
    <view class="top-three" v-if="topProviders.length >= 3">
      <view class="podium">
        <!-- 第二名 -->
        <view class="podium-item second">
          <view class="rank-badge">2</view>
          <image lazy-load :src="topProviders[1].avatar" mode="aspectFill" class="podium-avatar" />
          <text class="podium-name">{{ topProviders[1].name }}</text>
          <view class="podium-rating">
            <text class="stars">★★★★★</text>
            <text class="score">{{ topProviders[1].rating }}</text>
          </view>
          <text class="podium-count">{{ topProviders[1].reviewCount }}条评价</text>
        </view>

        <!-- 第一名 -->
        <view class="podium-item first">
          <view class="crown">👑</view>
          <view class="rank-badge">1</view>
          <image lazy-load :src="topProviders[0].avatar" mode="aspectFill" class="podium-avatar" />
          <text class="podium-name">{{ topProviders[0].name }}</text>
          <view class="podium-rating">
            <text class="stars">★★★★★</text>
            <text class="score">{{ topProviders[0].rating }}</text>
          </view>
          <text class="podium-count">{{ topProviders[0].reviewCount }}条评价</text>
        </view>

        <!-- 第三名 -->
        <view class="podium-item third">
          <view class="rank-badge">3</view>
          <image lazy-load :src="topProviders[2].avatar" mode="aspectFill" class="podium-avatar" />
          <text class="podium-name">{{ topProviders[2].name }}</text>
          <view class="podium-rating">
            <text class="stars">★★★★★</text>
            <text class="score">{{ topProviders[2].rating }}</text>
          </view>
          <text class="podium-count">{{ topProviders[2].reviewCount }}条评价</text>
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
        <image lazy-load :src="item.avatar" mode="aspectFill" class="item-avatar" />
        <view class="item-info">
          <view class="item-header">
            <text class="item-name">{{ item.name }}</text>
            <view class="verified-tag" v-if="item.isVerified">已认证</view>
          </view>
          <view class="item-tags">
            <text class="tag" v-for="(tag, i) in item.tags" :key="i">{{ tag }}</text>
          </view>
          <view class="item-stats">
            <text class="rating">⭐ {{ item.rating }}</text>
            <text class="reviews">{{ item.reviewCount }}条评价</text>
          </view>
        </view>
        <view class="item-action">
          <text>查看</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const currentCategory = ref('all')

const categories = [
  { label: '全部', value: 'all' },
  { label: '家政保洁', value: 'housekeeping' },
  { label: '家电维修', value: 'appliance' },
  { label: '开锁疏通', value: 'locksmith' },
  { label: '搬家货运', value: 'moving' },
  { label: '婚庆摄影', value: 'photo' },
  { label: '装修建材', value: 'renovation' },
  { label: '汽车服务', value: 'car' }
]

// 模拟数据
const allProviders = ref([
  { _id: '1', name: '冠县保洁公司', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', rating: 4.9, reviewCount: 326, category: 'housekeeping', isVerified: true, tags: ['服务热情', '技术专业', '价格透明'] },
  { _id: '2', name: '冠县家电维修中心', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', rating: 4.8, reviewCount: 256, category: 'appliance', isVerified: true, tags: ['技术专业', '价格透明'] },
  { _id: '3', name: '冠县开锁服务中心', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', rating: 4.9, reviewCount: 456, category: 'locksmith', isVerified: true, tags: ['24小时', '公安备案'] },
  { _id: '4', name: '冠县搬家公司', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', rating: 4.7, reviewCount: 198, category: 'moving', isVerified: true, tags: ['准时', '专业'] },
  { _id: '5', name: '定格影像工作室', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', rating: 4.8, reviewCount: 156, category: 'photo', isVerified: true, tags: ['创意', '精美'] },
  { _id: '6', name: '冠县装饰公司', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', rating: 4.6, reviewCount: 89, category: 'renovation', isVerified: true, tags: ['环保', '质保'] },
  { _id: '7', name: '冠县汽车服务中心', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', rating: 4.7, reviewCount: 234, category: 'car', isVerified: true, tags: ['4S店品质'] },
  { _id: '8', name: '张师傅开锁', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', rating: 4.6, reviewCount: 76, category: 'locksmith', isVerified: false, tags: ['快速上门', '技术专业'] },
  { _id: '9', name: '好运来货运', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', rating: 4.4, reviewCount: 65, category: 'moving', isVerified: false, tags: ['大型搬家', '企业搬迁'] },
  { _id: '10', name: '璧山护工团队', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', rating: 4.9, reviewCount: 54, category: 'worker', isVerified: true, tags: ['专业护理', '有爱心'] }
])

const updateTime = ref('每周一更新')

const topProviders = computed(() => {
  if (currentCategory.value === 'all') {
    return allProviders.value.sort((a, b) => b.rating - a.rating)
  }
  return allProviders.value
    .filter(p => p.category === currentCategory.value)
    .sort((a, b) => b.rating - a.rating)
})

const goToDetail = (item) => {
  uni.navigateTo({
    url: `/pages/service/detail?category=${item.category}`
  })
}
</script>

<style lang="scss" scoped>
.ranking-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40rpx;
}

.page-header {
  .header-bg {
    background: linear-gradient(135deg, #E63946, #FF6B6B);
    padding: 60rpx 40rpx 80rpx;
    text-align: center;
    
    .header-title {
      display: block;
      font-size: 48rpx;
      font-weight: bold;
      color: #fff;
      margin-bottom: 16rpx;
    }
    
    .header-subtitle {
      font-size: 26rpx;
      color: rgba(255,255,255,0.9);
    }
  }
}

.ranking-info {
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding: 30rpx 0;
  margin: -40rpx 30rpx 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
  
  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    
    .info-icon {
      font-size: 36rpx;
    }
    
    .info-text {
      font-size: 22rpx;
      color: #666;
    }
  }
}

.category-tabs {
  background: #fff;
  padding: 20rpx 0;
  
  .tabs-scroll {
    white-space: nowrap;
    
    .tab-item {
      display: inline-block;
      padding: 16rpx 32rpx;
      margin: 0 10rpx;
      font-size: 26rpx;
      color: #666;
      background: #f5f5f5;
      border-radius: 30rpx;
      
      &.active {
        background: linear-gradient(135deg, #E63946, #FF6B6B);
        color: #fff;
      }
    }
  }
}

.top-three {
  padding: 30rpx;
  
  .podium {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 20rpx;
    padding: 30rpx 20rpx 0;
    background: linear-gradient(180deg, #fff 0%, #FFF5F5 100%);
    border-radius: 24rpx;
    
    .podium-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      
      .crown {
        font-size: 40rpx;
        margin-bottom: -10rpx;
      }
      
      .rank-badge {
        width: 44rpx;
        height: 44rpx;
        background: #FFD700;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        font-weight: bold;
        color: #fff;
        position: absolute;
        top: -10rpx;
      }
      
      &.first {
        .rank-badge {
          background: #FFD700;
          width: 52rpx;
          height: 52rpx;
          font-size: 28rpx;
        }
      }
      
      &.second {
        .rank-badge {
          background: #C0C0C0;
        }
      }
      
      &.third {
        .rank-badge {
          background: #CD7F32;
        }
      }
      
      .podium-avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        border: 4rpx solid #fff;
        box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
      }
      
      &.first .podium-avatar {
        width: 120rpx;
        height: 120rpx;
      }
      
      .podium-name {
        font-size: 24rpx;
        color: #333;
        margin-top: 12rpx;
        max-width: 140rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .podium-rating {
        display: flex;
        align-items: center;
        gap: 4rpx;
        margin-top: 6rpx;
        
        .stars {
          font-size: 18rpx;
          color: #FFD700;
        }
        
        .score {
          font-size: 22rpx;
          color: #E63946;
          font-weight: 600;
        }
      }
      
      .podium-count {
        font-size: 20rpx;
        color: #999;
        margin-top: 4rpx;
      }
    }
  }
}

.ranking-list {
  padding: 0 30rpx;
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .list-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
    
    .update-time {
      font-size: 22rpx;
      color: #999;
    }
  }
}

.ranking-item {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
  
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
      background: linear-gradient(135deg, #E63946, #FF6B6B);
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
      gap: 10rpx;
      margin-bottom: 8rpx;
      
      .item-name {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
      }
      
      .verified-tag {
        background: #E63946;
        color: #fff;
        font-size: 18rpx;
        padding: 4rpx 10rpx;
        border-radius: 8rpx;
      }
    }
    
    .item-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8rpx;
      margin-bottom: 8rpx;
      
      .tag {
        font-size: 20rpx;
        color: #666;
        background: #f5f5f5;
        padding: 4rpx 12rpx;
        border-radius: 8rpx;
      }
    }
    
    .item-stats {
      display: flex;
      align-items: center;
      gap: 16rpx;
      
      .rating {
        font-size: 24rpx;
        color: #E63946;
      }
      
      .reviews {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
  
  .item-action {
    padding: 12rpx 24rpx;
    background: #FFF0F0;
    color: #E63946;
    border-radius: 30rpx;
    font-size: 24rpx;
  }
}
</style>
