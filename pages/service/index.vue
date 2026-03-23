<template>
  <view class="service-page">
    <!-- 分类横向滚动 -->
    <scroll-view scroll-x class="category-scroll">
      <view class="category-list">
        <view 
          v-for="(item, index) in categories" 
          :key="index"
          class="category-item"
          :class="{ active: currentCategory === index }"
          @click="switchCategory(index)"
        >
          <text class="category-icon">{{ item.icon }}</text>
          <text class="category-name">{{ item.name }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 筛选和排序栏 -->
    <view class="filter-bar">
      <view class="filter-left">
        <text class="current-category">{{ categories[currentCategory].name }}</text>
      </view>
      <view class="filter-right">
        <view class="filter-btn" @click="toggleFilter">
          <text class="filter-icon">🔍</text>
          <text>筛选</text>
          <text class="filter-indicator" v-if="hasActiveFilter">●</text>
        </view>
        <view class="sort-btn" @click="toggleSort">
          <text>{{ sortOptions[currentSort].label }}</text>
          <text class="sort-arrow" :class="{ active: showSort }">▼</text>
        </view>
      </view>
    </view>

    <!-- 筛选弹窗 -->
    <view class="filter-popup" v-if="showFilter" @click.self="closeFilter">
      <view class="filter-content">
        <view class="filter-header">
          <text class="filter-title">筛选条件</text>
          <text class="filter-reset" @click="resetFilter">重置</text>
        </view>
        
        <!-- 排序方式 -->
        <view class="filter-section">
          <text class="filter-section-title">排序方式</text>
          <view class="filter-tags">
            <view 
              v-for="(option, index) in sortOptions" 
              :key="index"
              class="filter-tag"
              :class="{ active: filterSort === index }"
              @click="filterSort = index"
            >
              {{ option.label }}
            </view>
          </view>
        </view>
        
        <!-- 认证筛选 -->
        <view class="filter-section">
          <text class="filter-section-title">服务商筛选</text>
          <view class="filter-tags">
            <view 
              class="filter-tag"
              :class="{ active: filterVerified === null }"
              @click="filterVerified = null"
            >
              全部
            </view>
            <view 
              class="filter-tag"
              :class="{ active: filterVerified === true }"
              @click="filterVerified = true"
            >
              已认证
            </view>
          </view>
        </view>
        
        <!-- 价格区间 -->
        <view class="filter-section">
          <text class="filter-section-title">价格区间</text>
          <view class="filter-tags">
            <view 
              class="filter-tag"
              :class="{ active: filterPrice === 'all' }"
              @click="filterPrice = 'all'"
            >
              全部
            </view>
            <view 
              class="filter-tag"
              :class="{ active: filterPrice === 'low' }"
              @click="filterPrice = 'low'"
            >
              100元以下
            </view>
            <view 
              class="filter-tag"
              :class="{ active: filterPrice === 'mid' }"
              @click="filterPrice = 'mid'"
            >
              100-500元
            </view>
            <view 
              class="filter-tag"
              :class="{ active: filterPrice === 'high' }"
              @click="filterPrice = 'high'"
            >
              500元以上
            </view>
          </view>
        </view>
        
        <!-- 确认按钮 -->
        <view class="filter-footer">
          <view class="filter-cancel" @click="closeFilter">取消</view>
          <view class="filter-confirm" @click="applyFilter">确定</view>
        </view>
      </view>
    </view>

    <!-- 服务列表 -->
    <scroll-view scroll-y class="service-list" @scrolltolower="loadMore">
      <view class="list-header">
        <text class="list-title">{{ categories[currentCategory].name }}</text>
        <text class="list-count">共 {{ filteredServices.length }} 个服务商</text>
      </view>

      <view 
        v-for="service in filteredServices" 
        :key="service.id"
        class="service-card"
        @click="toDetail(service)"
      >
        <view class="service-left">
          <image :src="service.image" mode="aspectFill" class="service-image" />
          <view class="service-badge" v-if="service.isVerified">已认证</view>
        </view>
        <view class="service-right">
          <view class="service-header">
            <text class="service-name">{{ service.name }}</text>
            <view class="service-rating">
              <text class="star">★★★★★</text>
              <text class="score">{{ service.rating }}</text>
            </view>
          </view>
          <text class="service-desc">{{ service.desc }}</text>
          <view class="service-tags">
            <text class="tag" v-for="(tag, i) in service.tags" :key="i">{{ tag }}</text>
          </view>
          <view class="service-footer">
            <text class="service-price">{{ service.price }}</text>
            <text class="service-order">{{ service.orderCount }}人已预约</text>
          </view>
        </view>
      </view>

      <view class="load-more" v-if="filteredServices.length > 0">
        <text>上滑加载更多</text>
      </view>

      <view class="empty-state" v-if="filteredServices.length === 0">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无{{ categories[currentCategory].name }}服务商</text>
        <text class="empty-hint">稍后再来看看吧</text>
      </view>
    </scroll-view>

    <!-- 排序弹窗 -->
    <view class="sort-popup" v-if="showSort" @click.self="showSort = false">
      <view class="sort-content">
        <view 
          v-for="(option, index) in sortOptions" 
          :key="index"
          class="sort-item"
          :class="{ active: currentSort === index }"
          @click="selectSort(index)"
        >
          <text>{{ option.label }}</text>
          <text class="check-icon" v-if="currentSort === index">✓</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const currentCategory = ref(0)

// 排序选项
const sortOptions = [
  { label: '默认排序', value: 'default' },
  { label: '好评优先', value: 'rating' },
  { label: '订单最多', value: 'orders' },
  { label: '价格最低', value: 'price_low' },
  { label: '价格最高', value: 'price_high' }
]

const currentSort = ref(0)

// 筛选状态
const showFilter = ref(false)
const showSort = ref(false)
const filterSort = ref(0)
const filterVerified = ref(null)
const filterPrice = ref('all')

// 是否有激活的筛选条件
const hasActiveFilter = computed(() => {
  return filterSort.value !== 0 || filterVerified.value !== null || filterPrice.value !== 'all'
})

// 切换筛选弹窗
const toggleFilter = () => {
  showFilter.value = !showFilter.value
  showSort.value = false
}

const closeFilter = () => {
  showFilter.value = false
}

// 重置筛选条件
const resetFilter = () => {
  filterSort.value = 0
  filterVerified.value = null
  filterPrice.value = 'all'
}

// 应用筛选
const applyFilter = () => {
  currentSort.value = filterSort.value
  showFilter.value = false
}

// 切换排序弹窗
const toggleSort = () => {
  showSort.value = !showSort.value
  showFilter.value = false
  if (showSort.value) {
    filterSort.value = currentSort.value
  }
}

// 选择排序方式
const selectSort = (index) => {
  currentSort.value = index
  showSort.value = false
}

const categories = [
  { icon: '🧹', name: '家政保洁', type: 'housekeeping' },
  { icon: '🔧', name: '家电维修', type: 'appliance' },
  { icon: '🔑', name: '开锁疏通', type: 'locksmith' },
  { icon: '🚚', name: '搬家货运', type: 'moving' },
  { icon: '🍔', name: '餐饮外卖', type: 'food' },
  { icon: '📷', name: '婚庆摄影', type: 'photo' },
  { icon: '🏠', name: '装修建材', type: 'renovation' },
  { icon: '🚗', name: '汽车服务', type: 'car' }
]

// 服务商数据
const allServices = ref([])

// 模拟数据
onMounted(() => {
  allServices.value = [
    // 家政保洁
    { id: 1, category: 'housekeeping', name: '冠县保洁公司', desc: '专业家政保洁、深度清洁、新房开荒', price: '50元/小时', rating: 4.8, orderCount: 856, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['专业', '准时', '好评'] },
    { id: 2, category: 'housekeeping', name: '洁到家服务', desc: '日常保洁、家电清洗、收纳整理', price: '60元/小时', rating: 4.6, orderCount: 523, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['细心', '耐心'] },
    // 家电维修
    { id: 3, category: 'appliance', name: '冠县家电维修中心', desc: '空调、冰箱、洗衣机维修安装', price: '上门费30元', rating: 4.9, orderCount: 1203, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['大品牌', '售后保障'] },
    { id: 4, category: 'appliance', name: '张师傅维修铺', desc: '电视、热水器、抽油烟机维修', price: '40元起', rating: 4.7, orderCount: 678, isVerified: false, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['便宜', '快速'] },
    { id: 5, category: 'appliance', name: '冠县制冷设备维修', desc: '中央空调、商用冷柜、冷库安装', price: '100元起', rating: 4.8, orderCount: 342, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['专业'] },
    // 开锁疏通
    { id: 6, category: 'locksmith', name: '冠县开锁服务中心', desc: '24小时上门开锁、换锁芯、配钥匙', price: '80元起', rating: 4.9, orderCount: 2105, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['24小时', '公安备案'] },
    { id: 7, category: 'locksmith', name: '速通管道疏通', desc: '下水道、马桶、浴缸疏通', price: '60元起', rating: 4.5, orderCount: 456, isVerified: false, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['快速'] },
    // 搬家货运
    { id: 8, category: 'moving', name: '冠县搬家公司', desc: '居民搬家、公司搬迁、钢琴搬运', price: '200元起', rating: 4.7, orderCount: 892, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['准时', '专业'] },
    { id: 9, category: 'moving', name: '好运来货运', desc: '货物运输、面包车出租、大件运输', price: '80元/次', rating: 4.6, orderCount: 567, isVerified: false, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['便宜'] },
    // 餐饮外卖
    { id: 10, category: 'food', name: '冠县家常菜馆', desc: '地方特色菜、家常炒菜、团体订餐', price: '15元起', rating: 4.5, orderCount: 2341, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['美味', '实惠'] },
    { id: 11, category: 'food', name: '冠县烧烤外卖', desc: '烤串、烤鱼、海鲜烧烤', price: '30元起', rating: 4.8, orderCount: 1567, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['新鲜', '现烤'] },
    // 婚庆摄影
    { id: 12, category: 'photo', name: '冠县婚庆礼仪公司', desc: '婚礼策划、婚车租赁、主持摄像', price: '999元起', rating: 4.9, orderCount: 456, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['专业', '全程服务'] },
    { id: 13, category: 'photo', name: '定格影像工作室', desc: '婚纱摄影、孕妇照、宝宝照、商业拍摄', price: '299元起', rating: 4.7, orderCount: 789, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['创意', '精美'] },
    // 装修建材
    { id: 14, category: 'renovation', name: '冠县装饰公司', desc: '新房装修、旧房翻新、全屋定制', price: '面议', rating: 4.8, orderCount: 345, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['环保', '质保'] },
    { id: 15, category: 'renovation', name: '建材超市', desc: '瓷砖、地板、卫浴、灯具、五金', price: '批发价', rating: 4.6, orderCount: 1234, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['品种全'] },
    // 汽车服务
    { id: 16, category: 'car', name: '冠县汽车服务中心', desc: '保养、维修、洗车、保险理赔', price: '项目定价', rating: 4.7, orderCount: 2156, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['4S店品质'] },
    { id: 17, category: 'car', name: '车博士快修', desc: '换机油、轮胎、补胎、电瓶更换', price: '30元起', rating: 4.5, orderCount: 876, isVerified: false, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['快速'] },
    { id: 18, category: 'car', name: '冠县驾校报名点', desc: '驾照报名、学车陪练、科目考试', price: '2680元', rating: 4.8, orderCount: 456, isVerified: true, image: 'https://img.yzcdn.cn/vant/cat.jpeg', tags: ['通过率高'] }
  ]
})

const filteredServices = computed(() => {
  const type = categories[currentCategory.value].type
  let result = allServices.value.filter(s => s.category === type)
  
  // 认证筛选
  if (filterVerified.value !== null) {
    result = result.filter(s => s.isVerified === filterVerified.value)
  }
  
  // 价格筛选
  if (filterPrice.value !== 'all') {
    result = result.filter(s => {
      const priceMatch = s.price.match(/(\d+)/)
      if (!priceMatch) return false
      const price = parseInt(priceMatch[1])
      if (filterPrice.value === 'low') return price < 100
      if (filterPrice.value === 'mid') return price >= 100 && price <= 500
      if (filterPrice.value === 'high') return price > 500
      return true
    })
  }
  
  // 排序
  const sortType = sortOptions[currentSort.value].value
  switch (sortType) {
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'orders':
      result.sort((a, b) => b.orderCount - a.orderCount)
      break
    case 'price_low':
      result.sort((a, b) => {
        const priceA = parseInt(a.price.match(/\d+/)?.[0] || '999999')
        const priceB = parseInt(b.price.match(/\d+/)?.[0] || '999999')
        return priceA - priceB
      })
      break
    case 'price_high':
      result.sort((a, b) => {
        const priceA = parseInt(a.price.match(/\d+/)?.[0] || '0')
        const priceB = parseInt(b.price.match(/\d+/)?.[0] || '0')
        return priceB - priceA
      })
      break
  }
  
  return result
})

const switchCategory = (index) => {
  currentCategory.value = index
}

const toDetail = (service) => {
  uni.navigateTo({ 
    url: `/pages/service/detail?id=${service.id}&category=${service.category}` 
  })
}

const loadMore = () => {
  uni.showToast({ title: '没有更多了', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.service-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.category-scroll {
  background: #fff;
  white-space: nowrap;
  
  .category-list {
    display: flex;
    padding: 20rpx 0;
    
    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;
      padding: 16rpx 28rpx;
      margin: 0 10rpx;
      border-radius: 16rpx;
      background: #f5f5f5;
      transition: all 0.3s;
      
      &.active {
        background: linear-gradient(135deg, #E63946, #FF6B6B);
        color: #fff;
        
        .category-name {
          color: #fff;
        }
      }
      
      .category-icon {
        font-size: 40rpx;
      }
      
      .category-name {
        font-size: 24rpx;
        color: #333;
        white-space: nowrap;
      }
    }
  }
}

.service-list {
  flex: 1;
  padding: 20rpx;
  
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
    
    .list-count {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.service-card {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
  
  .service-left {
    position: relative;
    margin-right: 20rpx;
    
    .service-image {
      width: 180rpx;
      height: 180rpx;
      border-radius: 12rpx;
    }
    
    .service-badge {
      position: absolute;
      top: 8rpx;
      left: 8rpx;
      background: #E63946;
      color: #fff;
      font-size: 18rpx;
      padding: 4rpx 10rpx;
      border-radius: 8rpx;
    }
  }
  
  .service-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .service-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10rpx;
      
      .service-name {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
      }
      
      .service-rating {
        .star {
          color: #FFD700;
          font-size: 20rpx;
        }
        .score {
          font-size: 22rpx;
          color: #E63946;
          margin-left: 4rpx;
        }
      }
    }
    
    .service-desc {
      font-size: 24rpx;
      color: #666;
      line-height: 1.5;
      margin-bottom: 12rpx;
    }
    
    .service-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10rpx;
      margin-bottom: 12rpx;
      
      .tag {
        font-size: 20rpx;
        color: #666;
        background: #f5f5f5;
        padding: 4rpx 12rpx;
        border-radius: 8rpx;
      }
    }
    
    .service-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      
      .service-price {
        font-size: 32rpx;
        font-weight: 600;
        color: #E63946;
      }
      
      .service-order {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
}

.load-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 24rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
  
  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 20rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 10rpx;
  }
  
  .empty-hint {
    font-size: 24rpx;
    color: #999;
  }
}

// 筛选栏
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 24rpx;
  background: #fff;
  border-bottom: 1rpx solid #eee;

  .filter-left {
    .current-category {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .filter-right {
    display: flex;
    align-items: center;
    gap: 24rpx;

    .filter-btn {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 8rpx 20rpx;
      background: #f5f5f5;
      border-radius: 30rpx;
      font-size: 24rpx;
      color: #666;
      position: relative;

      .filter-icon {
        font-size: 24rpx;
      }

      .filter-indicator {
        position: absolute;
        top: 4rpx;
        right: 4rpx;
        color: #E63946;
        font-size: 16rpx;
      }
    }

    .sort-btn {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 8rpx 20rpx;
      background: #f5f5f5;
      border-radius: 30rpx;
      font-size: 24rpx;
      color: #666;

      .sort-arrow {
        font-size: 18rpx;
        transition: transform 0.3s;

        &.active {
          transform: rotate(180deg);
        }
      }
    }
  }
}

// 筛选弹窗
.filter-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  .filter-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;
    padding: 24rpx;
    max-height: 70vh;
    overflow-y: auto;

    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24rpx;

      .filter-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }

      .filter-reset {
        font-size: 26rpx;
        color: #E63946;
      }
    }

    .filter-section {
      margin-bottom: 32rpx;

      .filter-section-title {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 16rpx;
        font-weight: 500;
      }

      .filter-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 16rpx;

        .filter-tag {
          padding: 12rpx 28rpx;
          background: #f5f5f5;
          border-radius: 30rpx;
          font-size: 26rpx;
          color: #666;
          border: 2rpx solid transparent;
          transition: all 0.2s;

          &.active {
            background: rgba(230, 57, 70, 0.1);
            color: #E63946;
            border-color: #E63946;
          }
        }
      }
    }

    .filter-footer {
      display: flex;
      gap: 24rpx;
      margin-top: 32rpx;
      padding-top: 24rpx;
      border-top: 1rpx solid #eee;

      .filter-cancel,
      .filter-confirm {
        flex: 1;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        border-radius: 44rpx;
        font-size: 30rpx;
      }

      .filter-cancel {
        background: #f5f5f5;
        color: #666;
      }

      .filter-confirm {
        background: linear-gradient(135deg, #E63946, #FF6B6B);
        color: #fff;
      }
    }
  }
}

// 排序弹窗
.sort-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  .sort-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 16rpx;
    width: 400rpx;
    overflow: hidden;

    .sort-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 28rpx 32rpx;
      font-size: 28rpx;
      color: #333;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      &.active {
        color: #E63946;
        background: rgba(230, 57, 70, 0.05);
      }

      .check-icon {
        color: #E63946;
        font-size: 28rpx;
      }
    }
  }
}
</style>
