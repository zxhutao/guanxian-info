<template>
  <view class="house-page">
    <!-- 顶部Tab -->
    <view class="filter-tabs">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: currentTab === tab.value }"
        @click="currentTab = tab.value"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item" @click="showAreaPicker = true">
        <text>{{ selectedArea || '区域' }}</text>
        <text class="arrow">▼</text>
      </view>
      <view class="filter-item" @click="showPricePicker = true">
        <text>{{ selectedPrice || '租金' }}</text>
        <text class="arrow">▼</text>
      </view>
      <view class="filter-item" @click="showTypePicker = true">
        <text>{{ selectedType || '类型' }}</text>
        <text class="arrow">▼</text>
      </view>
      <view class="filter-item more" @click="showFilterModal = true">
        <text>筛选</text>
        <text class="arrow">▼</text>
      </view>
    </view>

    <!-- 房源列表 -->
    <scroll-view scroll-y class="house-list" @scrolltolower="loadMore">
      <view
        v-for="item in filteredList"
        :key="item.id"
        class="house-card"
        @click="toDetail(item.id)"
      >
        <image lazy-load class="house-img" :src="item.images[0]" mode="aspectFill" />
        <view class="house-tag" :class="item.type">{{ item.typeText }}</view>
        <view class="house-info">
          <view class="house-title">{{ item.title }}</view>
          <view class="house-detail">
            <text class="house-area-text">{{ item.area }}㎡</text>
            <text class="dot">·</text>
            <text>{{ item.floor }}</text>
            <text class="dot">·</text>
            <text>{{ item.direction }}</text>
          </view>
          <view class="house-location">
            <text>📍</text>
            <text>{{ item.location }}</text>
          </view>
          <view class="house-footer">
            <text class="house-price">{{ item.price }}</text>
            <text class="house-unit">{{ item.priceUnit }}</text>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-more">
        <text>加载中...</text>
      </view>
      <view v-else-if="filteredList.length === 0" class="empty-state">
        <text class="empty-icon">🏠</text>
        <text class="empty-text">暂无此类房源</text>
      </view>
      <view v-else class="no-more">
        <text>— 没有更多了 —</text>
      </view>
    </scroll-view>

    <!-- 发布按钮 -->
    <view class="publish-btn" @click="goPublish">
      <text>发布房源</text>
    </view>

    <!-- 区域选择弹窗 -->
    <view class="mask" v-if="showAreaPicker" @click="showAreaPicker = false">
      <view class="picker-modal" @click.stop>
        <view class="picker-title">选择区域</view>
        <view class="picker-grid">
          <view
            v-for="area in areas"
            :key="area"
            class="picker-item"
            :class="{ selected: selectedArea === area }"
            @click="selectArea(area)"
          >
            {{ area }}
          </view>
        </view>
      </view>
    </view>

    <!-- 租金选择弹窗 -->
    <view class="mask" v-if="showPricePicker" @click="showPricePicker = false">
      <view class="picker-modal" @click.stop>
        <view class="picker-title">租金范围</view>
        <view class="picker-grid">
          <view
            v-for="price in prices"
            :key="price.label"
            class="picker-item"
            :class="{ selected: selectedPrice === price.label }"
            @click="selectPrice(price.label)"
          >
            {{ price.label }}
          </view>
        </view>
      </view>
    </view>

    <!-- 类型选择弹窗 -->
    <view class="mask" v-if="showTypePicker" @click="showTypePicker = false">
      <view class="picker-modal" @click.stop>
        <view class="picker-title">房屋类型</view>
        <view class="picker-grid">
          <view
            v-for="type in types"
            :key="type.value"
            class="picker-item"
            :class="{ selected: selectedType === type.label }"
            @click="selectType(type.label)"
          >
            {{ type.label }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// Tab切换
const tabs = [
  { label: '出租', value: 'rent' },
  { label: '出售', value: 'sell' },
  { label: '合租', value: 'share' },
  { label: '求租', value: 'want_rent' }
]
const currentTab = ref('rent')

// 筛选条件
const areas = ['不限', '城区', '东古城', '柳林', '桑阿镇', '北馆陶', '清水', '店子', '万善', '甘官屯', '兰沃', '斜店', '范寨', '辛集', '梁堂']
const prices = [
  { label: '不限', min: 0, max: 99999 },
  { label: '500元以下', min: 0, max: 500 },
  { label: '500-1000元', min: 500, max: 1000 },
  { label: '1000-2000元', min: 1000, max: 2000 },
  { label: '2000-3000元', min: 2000, max: 3000 },
  { label: '3000元以上', min: 3000, max: 99999 }
]
const types = [
  { label: '不限', value: 'all' },
  { label: '普通住宅', value: 'normal' },
  { label: '公寓', value: 'apartment' },
  { label: '商铺', value: 'shop' },
  { label: '厂房', value: 'factory' },
  { label: '仓库', value: 'warehouse' }
]

const selectedArea = ref('')
const selectedPrice = ref('')
const selectedType = ref('')
const showAreaPicker = ref(false)
const showPricePicker = ref(false)
const showTypePicker = ref(false)
const showFilterModal = ref(false)
const loading = ref(false)

// 房源静态数据
const houseList = ref([
  {
    id: 1,
    type: 'rent',
    typeText: '出租',
    title: '冠县城区精装两室 拎包入住',
    area: '85',
    floor: '中高层/共18层',
    direction: '南北通透',
    location: '冠县城区',
    price: '1500',
    priceUnit: '元/月',
    images: ['https://picsum.photos/seed/house1/400/300']
  },
  {
    id: 2,
    type: 'rent',
    typeText: '出租',
    title: '临近商业街 商铺转让',
    area: '60',
    floor: '一层',
    direction: '南',
    location: '冠县商业街',
    price: '2500',
    priceUnit: '元/月',
    images: ['https://picsum.photos/seed/house2/400/300']
  },
  {
    id: 3,
    type: 'sell',
    typeText: '出售',
    title: '冠县新区电梯房 户型方正',
    area: '120',
    floor: '中高层/共26层',
    direction: '南北通透',
    location: '冠县新区',
    price: '52',
    priceUnit: '万',
    images: ['https://picsum.photos/seed/house3/400/300']
  },
  {
    id: 4,
    type: 'share',
    typeText: '合租',
    title: '主卧求合租 限女生',
    area: '20',
    floor: '低层/共6层',
    direction: '南',
    location: '冠县城区',
    price: '500',
    priceUnit: '元/月',
    images: ['https://picsum.photos/seed/house4/400/300']
  },
  {
    id: 5,
    type: 'want_rent',
    typeText: '求租',
    title: '求租冠县城区两室一厅',
    area: '80-100',
    floor: '不限',
    direction: '不限',
    location: '冠县城区',
    price: '面议',
    priceUnit: '',
    images: ['https://picsum.photos/seed/house5/400/300']
  },
  {
    id: 6,
    type: 'rent',
    typeText: '出租',
    title: '工厂厂房出租 交通便利',
    area: '500',
    floor: '单层',
    direction: '南北',
    location: '冠县工业园区',
    price: '8000',
    priceUnit: '元/月',
    images: ['https://picsum.photos/seed/house6/400/300']
  }
])

const filteredList = computed(() => {
  let list = houseList.value.filter(item => item.type === currentTab.value)

  if (selectedArea.value && selectedArea.value !== '不限') {
    list = list.filter(item => item.location.includes(selectedArea.value))
  }
  if (selectedPrice.value && selectedPrice.value !== '不限') {
    const priceObj = prices.find(p => p.label === selectedPrice.value)
    if (priceObj) {
      list = list.filter(item => {
        const p = parseInt(item.price)
        return p >= priceObj.min && p <= priceObj.max
      })
    }
  }
  if (selectedType.value && selectedType.value !== '不限') {
    // 简化筛选
  }
  return list
})

const selectArea = (area) => {
  selectedArea.value = area === '不限' ? '' : area
  showAreaPicker.value = false
}
const selectPrice = (label) => {
  selectedPrice.value = label === '不限' ? '' : label
  showPricePicker.value = false
}
const selectType = (label) => {
  selectedType.value = label === '不限' ? '' : label
  showTypePicker.value = false
}

const toDetail = (id) => {
  uni.navigateTo({ url: `/pages/house/detail?id=${id}` })
}

const goPublish = () => {
  uni.showToast({ title: '发布功能开发中', icon: 'none' })
}

const loadMore = () => {
  // 静态数据，无需加载更多
}
</script>

<style lang="scss" scoped>
.house-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.filter-tabs {
  display: flex;
  background: #fff;
  border-bottom: 1rpx solid #eee;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 28rpx 0;
    font-size: 28rpx;
    color: #666;
    position: relative;

    &.active {
      color: #E63946;
      font-weight: bold;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60rpx;
        height: 4rpx;
        background: #E63946;
        border-radius: 2rpx;
      }
    }
  }
}

.filter-bar {
  display: flex;
  background: #fff;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;

  .filter-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6rpx;
    font-size: 26rpx;
    color: #333;
    border-right: 1rpx solid #eee;

    &.more {
      color: #E63946;
    }

    &:last-child {
      border-right: none;
    }

    .arrow {
      font-size: 20rpx;
      color: #999;
    }
  }
}

.house-list {
  flex: 1;
  padding: 20rpx 24rpx 120rpx;
}

.house-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  position: relative;

  .house-img {
    width: 100%;
    height: 300rpx;
    background: #eee;
  }

  .house-tag {
    position: absolute;
    top: 20rpx;
    left: 20rpx;
    padding: 6rpx 16rpx;
    border-radius: 8rpx;
    font-size: 22rpx;
    color: #fff;

    &.rent { background: #E63946; }
    &.sell { background: #4CAF50; }
    &.share { background: #2196F3; }
    &.want_rent { background: #FF9800; }
  }

  .house-info {
    padding: 20rpx;
  }

  .house-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 12rpx;
  }

  .house-detail {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 24rpx;
    color: #666;
    margin-bottom: 8rpx;

    .house-area-text {
      color: #999;
    }

    .dot {
      color: #ddd;
    }
  }

  .house-location {
    display: flex;
    align-items: center;
    gap: 4rpx;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 12rpx;
  }

  .house-footer {
    display: flex;
    align-items: baseline;
    gap: 4rpx;
  }

  .house-price {
    font-size: 36rpx;
    font-weight: bold;
    color: #E63946;
  }

  .house-unit {
    font-size: 24rpx;
    color: #999;
  }
}

.loading-more,
.no-more {
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
  gap: 20rpx;

  .empty-icon {
    font-size: 100rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.publish-btn {
  position: fixed;
  bottom: 40rpx;
  right: 40rpx;
  background: #E63946;
  color: #fff;
  padding: 20rpx 36rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  box-shadow: 0 8rpx 24rpx rgba(230, 57, 70, 0.4);
  z-index: 10;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.picker-modal {
  background: #fff;
  width: 100%;
  border-radius: 24rpx 24rpx 0 0;
  padding: 40rpx 30rpx 60rpx;

  .picker-title {
    text-align: center;
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
  }

  .picker-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
  }

  .picker-item {
    padding: 16rpx 30rpx;
    border-radius: 8rpx;
    background: #f5f5f5;
    font-size: 26rpx;
    color: #333;

    &.selected {
      background: #E63946;
      color: #fff;
    }
  }
}
</style>
