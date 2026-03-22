<template>
  <view class="carpool-page">
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
      <view class="filter-item" @click="showDatePicker = true">
        <text>{{ selectedDate || '出发日期' }}</text>
        <text class="arrow">▼</text>
      </view>
      <view class="filter-item" @click="showTimePicker = true">
        <text>{{ selectedTime || '出发时间' }}</text>
        <text class="arrow">▼</text>
      </view>
    </view>

    <!-- 顺风车列表 -->
    <scroll-view scroll-y class="carpool-list">
      <view
        v-for="item in filteredList"
        :key="item.id"
        class="carpool-card"
        @click="toDetail(item.id)"
      >
        <view class="card-header">
          <image class="avatar" :src="item.avatar" mode="aspectFill" />
          <view class="user-info">
            <view class="user-name">{{ item.name }}</view>
            <view class="user-meta">
              <text class="star">★★★★★</text>
              <text class="rating">{{ item.rating }}</text>
              <text class="trips">{{ item.trips }}次行程</text>
            </view>
          </view>
          <view class="publish-time">{{ item.publishTime }}</view>
        </view>

        <view class="route-section">
          <view class="route-row from">
            <view class="dot green"></view>
            <view class="route-text">
              <text class="route-main">{{ item.from }}</text>
              <text class="route-sub">{{ item.fromDetail }}</text>
            </view>
          </view>
          <view class="route-line"></view>
          <view class="route-row to">
            <view class="dot red"></view>
            <view class="route-text">
              <text class="route-main">{{ item.to }}</text>
              <text class="route-sub">{{ item.toDetail }}</text>
            </view>
          </view>
        </view>

        <view class="card-footer">
          <view class="trip-info">
            <text class="trip-date">📅 {{ item.date }}</text>
            <text class="trip-time">⏰ {{ item.time }}</text>
            <text class="trip-seat">💺 {{ item.seat }}座</text>
          </view>
          <view class="price-info">
            <text class="price">{{ item.price }}</text>
            <text class="unit">元/人</text>
          </view>
        </view>
      </view>

      <view v-if="filteredList.length === 0" class="empty-state">
        <text class="empty-icon">🚗</text>
        <text class="empty-text">暂无顺风车信息</text>
        <text class="empty-sub">试试其他筛选条件</text>
      </view>

      <view class="no-more">
        <text>— 没有更多了 —</text>
      </view>
    </scroll-view>

    <!-- 发布按钮 -->
    <view class="publish-btn" @click="goPublish">
      <text>发布顺风车</text>
    </view>

    <!-- 日期选择 -->
    <view class="mask" v-if="showDatePicker" @click="showDatePicker = false">
      <view class="picker-modal" @click.stop>
        <view class="picker-title">选择出发日期</view>
        <view class="picker-grid">
          <view
            v-for="date in dates"
            :key="date"
            class="picker-item"
            :class="{ selected: selectedDate === date }"
            @click="selectedDate = date; showDatePicker = false"
          >
            {{ date }}
          </view>
        </view>
      </view>
    </view>

    <!-- 时间选择 -->
    <view class="mask" v-if="showTimePicker" @click="showTimePicker = false">
      <view class="picker-modal" @click.stop>
        <view class="picker-title">选择出发时间</view>
        <view class="picker-grid">
          <view
            v-for="time in times"
            :key="time"
            class="picker-item"
            :class="{ selected: selectedTime === time }"
            @click="selectedTime = time; showTimePicker = false"
          >
            {{ time }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const tabs = [
  { label: '车找人', value: 'find_car' },
  { label: '人找车', value: 'find_person' }
]
const currentTab = ref('find_car')

const dates = ['今天', '明天', '后天', '本周内', '本月内']
const times = ['不限时间', '凌晨(0-6点)', '上午(6-12点)', '下午(12-18点)', '晚上(18-24点)']
const selectedDate = ref('')
const selectedTime = ref('')
const showDatePicker = ref(false)
const showTimePicker = ref(false)

const carpoolList = ref([
  {
    id: 1,
    type: 'find_car',
    name: '张师傅',
    avatar: 'https://picsum.photos/seed/driver1/100/100',
    rating: 4.9,
    trips: 328,
    publishTime: '刚刚发布',
    from: '冠县城区',
    fromDetail: '振兴路附近',
    to: '聊城市区',
    toDetail: '聊城汽车总站',
    date: '今天',
    time: '08:00',
    seat: '3'
  },
  {
    id: 2,
    type: 'find_car',
    name: '李师傅',
    avatar: 'https://picsum.photos/seed/driver2/100/100',
    rating: 4.8,
    trips: 156,
    publishTime: '30分钟前',
    from: '冠县',
    fromDetail: '冠县汽车站',
    to: '济南',
    toDetail: '济南西站',
    date: '今天',
    time: '09:30',
    seat: '2'
  },
  {
    id: 3,
    type: 'find_person',
    name: '王先生',
    avatar: 'https://picsum.photos/seed/passenger1/100/100',
    rating: 5.0,
    trips: 12,
    publishTime: '1小时前',
    from: '冠县城区',
    fromDetail: '武训广场',
    to: '聊城市区',
    toDetail: '银座商城',
    date: '明天',
    time: '07:00',
    seat: '1'
  },
  {
    id: 4,
    type: 'find_car',
    name: '赵师傅',
    avatar: 'https://picsum.photos/seed/driver3/100/100',
    rating: 4.7,
    trips: 89,
    publishTime: '2小时前',
    from: '冠县',
    fromDetail: '冠县体育馆',
    to: '济南遥墙机场',
    toDetail: '机场航站楼',
    date: '明天',
    time: '06:00',
    seat: '2'
  },
  {
    id: 5,
    type: 'find_car',
    name: '刘师傅',
    avatar: 'https://picsum.photos/seed/driver4/100/100',
    rating: 4.9,
    trips: 241,
    publishTime: '3小时前',
    from: '冠县各镇',
    fromDetail: '上门接人',
    to: '聊城市区',
    toDetail: '聊城人民医院',
    date: '今天',
    time: '14:00',
    seat: '3'
  },
  {
    id: 6,
    type: 'find_person',
    name: '陈女士',
    avatar: 'https://picsum.photos/seed/passenger2/100/100',
    rating: 4.8,
    trips: 5,
    publishTime: '4小时前',
    from: '冠县',
    fromDetail: '城区内',
    to: '聊城',
    toDetail: '不限',
    date: '本周内',
    time: '不限',
    seat: '1'
  }
])

const filteredList = computed(() => {
  let list = carpoolList.value.filter(item => item.type === currentTab.value)
  if (selectedDate.value && selectedDate.value !== '不限') {
    list = list.filter(item => item.date === selectedDate.value)
  }
  if (selectedTime.value && selectedTime.value !== '不限时间') {
    list = list.filter(item => item.time.includes(selectedTime.value.split('(')[1]?.replace(')', '').split('-')[0] || ''))
  }
  return list
})

const toDetail = (id) => {
  uni.navigateTo({ url: `/pages/carpool/detail?id=${id}` })
}

const goPublish = () => {
  uni.showToast({ title: '发布功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.carpool-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.filter-tabs {
  display: flex;
  background: #fff;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 28rpx 0;
    font-size: 28rpx;
    color: #666;
    position: relative;

    &.active {
      color: #9C27B0;
      font-weight: bold;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60rpx;
        height: 4rpx;
        background: #9C27B0;
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

    &:last-child { border-right: none; }

    .arrow {
      font-size: 20rpx;
      color: #999;
    }
  }
}

.carpool-list {
  flex: 1;
  padding: 20rpx 24rpx 120rpx;
}

.carpool-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: #eee;
  }

  .user-info {
    flex: 1;
    margin-left: 16rpx;
  }

  .user-name {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 4rpx;
  }

  .user-meta {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 22rpx;
    color: #999;
  }

  .star {
    color: #FF9800;
    font-size: 20rpx;
  }

  .rating {
    color: #FF9800;
  }

  .publish-time {
    font-size: 22rpx;
    color: #999;
  }
}

.route-section {
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;

  .route-row {
    display: flex;
    align-items: center;
    gap: 16rpx;

    .dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;

      &.green { background: #4CAF50; }
      &.red { background: #E63946; }
    }

    .route-text {
      display: flex;
      flex-direction: column;
      gap: 2rpx;
    }

    .route-main {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }

    .route-sub {
      font-size: 22rpx;
      color: #999;
    }
  }

  .route-line {
    width: 2rpx;
    height: 20rpx;
    background: #ddd;
    margin: 6rpx 0 6rpx 7rpx;
  }
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .trip-info {
    display: flex;
    align-items: center;
    gap: 16rpx;
    font-size: 24rpx;
    color: #666;
  }

  .price-info {
    display: flex;
    align-items: baseline;
    gap: 4rpx;
  }

  .price {
    font-size: 36rpx;
    font-weight: bold;
    color: #9C27B0;
  }

  .unit {
    font-size: 24rpx;
    color: #999;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
  gap: 12rpx;

  .empty-icon { font-size: 100rpx; }
  .empty-text { font-size: 28rpx; color: #999; }
  .empty-sub { font-size: 24rpx; color: #ccc; }
}

.no-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 24rpx;
}

.publish-btn {
  position: fixed;
  bottom: 40rpx;
  right: 40rpx;
  background: #9C27B0;
  color: #fff;
  padding: 20rpx 36rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  box-shadow: 0 8rpx 24rpx rgba(156, 39, 176, 0.4);
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
      background: #9C27B0;
      color: #fff;
    }
  }
}
</style>
