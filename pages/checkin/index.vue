<template>
  <view class="checkin-page">
    <!-- 头部背景 -->
    <view class="header-bg">
      <view class="header-content">
        <text class="header-title">每日签到</text>
        <text class="header-subtitle">连续签到，积分大礼拿</text>
      </view>
    </view>

    <!-- 积分卡片 -->
    <view class="points-card">
      <view class="points-info">
        <view class="points-item">
          <text class="points-label">我的积分</text>
          <text class="points-value">{{ userPoints }}</text>
        </view>
        <view class="points-divider"></view>
        <view class="points-item">
          <text class="points-label">连续签到</text>
          <text class="points-value streak">{{ checkinStreak }}<text class="unit">天</text></text>
        </view>
      </view>
    </view>

    <!-- 签到按钮区域 -->
    <view class="checkin-section">
      <view class="checkin-btn-wrapper">
        <view
          class="checkin-btn"
          :class="{ checked: hasCheckinToday, animating: isAnimating }"
          @click="handleCheckin"
        >
          <text v-if="hasCheckinToday" class="btn-text">已签到</text>
          <text v-else class="btn-text">立即签到</text>
          <text v-if="!hasCheckinToday" class="btn-points">+{{ tomorrowPoints }}</text>
        </view>
        <text v-if="hasCheckinToday" class="checkin-tip">明天再来，积分更多！</text>
        <text v-else class="checkin-tip">连续签到7天，积分翻倍！</text>
      </view>
    </view>

    <!-- 连续签到奖励说明 -->
    <view class="reward-section">
      <view class="section-title">连续签到奖励</view>
      <view class="reward-list">
        <view
          v-for="(item, index) in rewardList"
          :key="index"
          class="reward-item"
          :class="{ active: checkinStreak >= item.days, current: checkinStreak + 1 === item.days && !hasCheckinToday }"
        >
          <view class="reward-day">{{ item.days }}天</view>
          <view class="reward-points">+{{ item.points }}</view>
          <view v-if="checkinStreak >= item.days" class="reward-status">已完成</view>
          <view v-else-if="checkinStreak + 1 === item.days && !hasCheckinToday" class="reward-status next">明日</view>
        </view>
      </view>
    </view>

    <!-- 签到日历 -->
    <view class="calendar-section">
      <view class="section-header">
        <text class="section-title">签到日历</text>
        <view class="month-selector">
          <text class="arrow" @click="changeMonth(-1)">&lt;</text>
          <text class="month-text">{{ currentYear }}年{{ currentMonth }}月</text>
          <text class="arrow" @click="changeMonth(1)">&gt;</text>
        </view>
      </view>
      <view class="calendar">
        <view class="week-header">
          <text v-for="day in weekDays" :key="day" class="week-day">{{ day }}</text>
        </view>
        <view class="days-grid">
          <view
            v-for="(day, index) in calendarDays"
            :key="index"
            class="day-item"
            :class="{
              'other-month': !day.isCurrentMonth,
              'today': day.isToday,
              'checked': day.hasCheckin,
              'future': day.isFuture
            }"
          >
            <text class="day-number">{{ day.day }}</text>
            <text v-if="day.hasCheckin" class="check-mark">✓</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 积分规则 -->
    <view class="rules-section">
      <view class="section-title">积分规则</view>
      <view class="rules-list">
        <view class="rule-item">
          <text class="rule-icon">📅</text>
          <view class="rule-content">
            <text class="rule-title">每日签到</text>
            <text class="rule-desc">每天签到可获?0积分</text>
          </view>
          <text class="rule-points">+10</text>
        </view>
        <view class="rule-item">
          <text class="rule-icon">🔥</text>
          <view class="rule-content">
            <text class="rule-title">连续奖励</text>
            <text class="rule-desc">连续签到7天额外奖励50积分</text>
          </view>
          <text class="rule-points">+15</text>
        </view>
        <view class="rule-item">
          <text class="rule-icon">🎯</text>
          <view class="rule-content">
            <text class="rule-title">更多任务</text>
            <text class="rule-desc">完成订单、邀请好友获得积分</text>
          </view>
          <text class="rule-points">更多</text>
        </view>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// 数据
const userPoints = ref(0)
const checkinStreak = ref(0)
const maxStreak = ref(0)
const hasCheckinToday = ref(false)
const tomorrowPoints = ref(10)
const isAnimating = ref(false)

// 日历数据
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const calendarDays = ref([])

// 奖励列表
const rewardList = [
  { days: 1, points: 10 },
  { days: 3, points: 15 },
  { days: 7, points: 25 },
  { days: 14, points: 40 },
  { days: 30, points: 70 }
]

onShow(() => {
  loadCheckinStatus()
  loadCalendar()
})

// 加载签到状?
const loadCheckinStatus = async () => {
  try {
    const { result } = await uniCloud.callFunction({
      name: 'checkin',
      data: { action: 'getCheckinStatus' }
    })
    
    if (result.code === 0) {
      const data = result.data
      userPoints.value = data.points
      checkinStreak.value = data.streak
      maxStreak.value = data.maxStreak
      hasCheckinToday.value = data.hasCheckinToday
      tomorrowPoints.value = data.tomorrowPoints
    }
  } catch (error) {
    console.error('加载签到状态失?', error)
  }
}

// 执行签到
const handleCheckin = async () => {
  if (hasCheckinToday.value || isAnimating.value) return
  
  isAnimating.value = true
  
  try {
    const { result } = await uniCloud.callFunction({
      name: 'checkin',
      data: { action: 'doCheckin' }
    })
    
    if (result.code === 0) {
      const data = result.data
      userPoints.value += data.points
      checkinStreak.value = data.streak
      hasCheckinToday.value = true
      
      // 显示成功提示
      uni.showToast({
        title: `签到成功 +${data.points}积分`,
        icon: 'success',
        duration: 2000
      })
      
      // 刷新日历
      loadCalendar()
    } else {
      uni.showToast({
        title: result.message || '签到失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('签到失败:', error)
    uni.showToast({
      title: '签到失败，请重试',
      icon: 'none'
    })
  } finally {
    setTimeout(() => {
      isAnimating.value = false
    }, 1000)
  }
}

// 加载日历
const loadCalendar = async () => {
  try {
    const { result } = await uniCloud.callFunction({
      name: 'checkin',
      data: {
        action: 'getCheckinCalendar',
        data: {
          year: currentYear.value,
          month: currentMonth.value
        }
      }
    })
    
    if (result.code === 0) {
      const data = result.data
      // 填充日历前面的空?
      const days = []
      for (let i = 0; i < data.firstDay; i++) {
        days.push({ day: '', isCurrentMonth: false })
      }
      // 添加当月天数
      days.push(...data.days)
      calendarDays.value = days
    }
  } catch (error) {
    console.error('加载日历失败:', error)
  }
}

// 切换月份
const changeMonth = (delta) => {
  let newMonth = currentMonth.value + delta
  let newYear = currentYear.value
  
  if (newMonth > 12) {
    newMonth = 1
    newYear++
  } else if (newMonth < 1) {
    newMonth = 12
    newYear--
  }
  
  currentMonth.value = newMonth
  currentYear.value = newYear
  loadCalendar()
}
</script>

<style lang="scss" scoped>
.checkin-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header-bg {
  background: linear-gradient(135deg, #E63946 0%, #FF6B6B 100%);
  padding: 60rpx 40rpx 100rpx;

  .header-content {
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

.points-card {
  margin: -60rpx 30rpx 30rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);

  .points-info {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .points-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;

      .points-label {
        font-size: 26rpx;
        color: #999;
      }

      .points-value {
        font-size: 56rpx;
        font-weight: bold;
        color: #E63946;

        &.streak {
          color: #FF9800;

          .unit {
            font-size: 28rpx;
            color: #999;
            margin-left: 8rpx;
          }
        }
      }
    }

    .points-divider {
      width: 2rpx;
      height: 80rpx;
      background: #eee;
    }
  }
}

.checkin-section {
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 50rpx 40rpx;

  .checkin-btn-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24rpx;

    .checkin-btn {
      width: 280rpx;
      height: 280rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #E63946 0%, #FF6B6B 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 12rpx 40rpx rgba(230, 57, 70, 0.4);
      transition: all 0.3s ease;

      &.checked {
        background: linear-gradient(135deg, #ccc 0%, #999 100%);
        box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.2);
      }

      &.animating {
        animation: pulse 0.5s ease;
      }

      &:active:not(.checked) {
        transform: scale(0.95);
      }

      .btn-text {
        font-size: 40rpx;
        font-weight: bold;
        color: #fff;
      }

      .btn-points {
        font-size: 32rpx;
        color: rgba(255, 255, 255, 0.9);
        margin-top: 10rpx;
      }
    }

    .checkin-tip {
      font-size: 26rpx;
      color: #666;
    }
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.reward-section {
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 30rpx;
    display: block;
  }

  .reward-list {
    display: flex;
    justify-content: space-between;
    gap: 16rpx;

    .reward-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24rpx 0;
      background: #f8f8f8;
      border-radius: 16rpx;
      position: relative;

      &.active {
        background: linear-gradient(135deg, #FFF5F5 0%, #FFE8E8 100%);
        border: 2rpx solid #E63946;
      }

      &.current {
        background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
        border: 2rpx solid #FF9800;
      }

      .reward-day {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 8rpx;
      }

      .reward-points {
        font-size: 32rpx;
        font-weight: bold;
        color: #E63946;
      }

      .reward-status {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        width: 32rpx;
        height: 32rpx;
        background: #4CAF50;
        color: #fff;
        border-radius: 50%;
        font-size: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        &.next {
          width: auto;
          padding: 4rpx 12rpx;
          border-radius: 12rpx;
          background: #FF9800;
          font-size: 18rpx;
        }
      }
    }
  }
}

.calendar-section {
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .month-selector {
      display: flex;
      align-items: center;
      gap: 20rpx;

      .arrow {
        font-size: 36rpx;
        color: #666;
        padding: 10rpx;
      }

      .month-text {
        font-size: 28rpx;
        color: #333;
      }
    }
  }

  .calendar {
    .week-header {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20rpx;

      .week-day {
        font-size: 26rpx;
        color: #999;
        width: 80rpx;
        text-align: center;
      }
    }

    .days-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      .day-item {
        width: calc(100% / 7);
        height: 80rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;

        &.other-month {
          opacity: 0.3;
        }

        &.today {
          .day-number {
            background: #E63946;
            color: #fff;
            width: 56rpx;
            height: 56rpx;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        &.checked {
          .day-number {
            color: #4CAF50;
            font-weight: bold;
          }

          .check-mark {
            position: absolute;
            bottom: 4rpx;
            font-size: 20rpx;
            color: #4CAF50;
          }
        }

        &.future {
          .day-number {
            color: #ccc;
          }
        }

        .day-number {
          font-size: 28rpx;
          color: #333;
        }
      }
    }
  }
}

.rules-section {
  background: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 30rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 30rpx;
    display: block;
  }

  .rules-list {
    .rule-item {
      display: flex;
      align-items: center;
      padding: 24rpx 0;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .rule-icon {
        font-size: 40rpx;
        margin-right: 20rpx;
      }

      .rule-content {
        flex: 1;

        .rule-title {
          font-size: 30rpx;
          color: #333;
          display: block;
          margin-bottom: 8rpx;
        }

        .rule-desc {
          font-size: 24rpx;
          color: #999;
        }
      }

      .rule-points {
        font-size: 32rpx;
        font-weight: bold;
        color: #E63946;
      }
    }
  }
}

.bottom-space {
  height: 40rpx;
}
</style>

