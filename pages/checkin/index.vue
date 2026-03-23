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
          <view v-if="checkinStreak >= item.days" class="reward-status">✓</view>
          <view v-else-if="checkinStreak + 1 === item.days && !hasCheckinToday" class="reward-status next">明日</view>
        </view>
      </view>
    </view>

    <!-- 签到日历 -->
    <view class="calendar-section">
      <view class="section-header">
        <text class="section-title">签到日历</text>
        <view class="month-selector">
          <text class="arrow" @click="changeMonth(-1)">‹</text>
          <text class="month-text">{{ currentYear }}年{{ currentMonth }}月</text>
          <text class="arrow" @click="changeMonth(1)">›</text>
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
            <text class="rule-desc">每天签到可获得10积分</text>
          </view>
          <text class="rule-points">+10</text>
        </view>
        <view class="rule-item">
          <text class="rule-icon">🔥</text>
          <view class="rule-content">
            <text class="rule-title">连续奖励</text>
            <text class="rule-desc">连续签到7天额外奖励50积分</text>
          </view>
          <text class="rule-points">+50</text>
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
import { ref, computed, onMounted } from 'vue'
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

// 获取今天日期字符串
const getTodayStr = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

// 获取昨天日期字符串
const getYesterdayStr = () => {
  const now = new Date()
  now.setDate(now.getDate() - 1)
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

// 加载签到状态（使用本地存储）
const loadCheckinStatus = () => {
  try {
    const checkinData = uni.getStorageSync('checkin_data') || {}
    const todayStr = getTodayStr()
    const yesterdayStr = getYesterdayStr()

    userPoints.value = checkinData.points || 0
    maxStreak.value = checkinData.maxStreak || 0

    // 检查今天是否签到
    hasCheckinToday.value = checkinData.lastCheckinDate === todayStr

    // 计算连续签到天数
    if (checkinData.lastCheckinDate === yesterdayStr) {
      // 昨天签到了，连续天数继续
      checkinStreak.value = checkinData.streak || 0
    } else if (checkinData.lastCheckinDate === todayStr) {
      // 今天签到了
      checkinStreak.value = checkinData.streak || 0
    } else {
      // 没有连续签到，重置
      checkinStreak.value = 0
    }

    // 计算明天的积分
    const nextStreak = hasCheckinToday.value ? checkinStreak.value : checkinStreak.value + 1
    tomorrowPoints.value = 10
    if (nextStreak === 6) tomorrowPoints.value = 15 // 7天奖励
    if (nextStreak === 13) tomorrowPoints.value = 20 // 14天奖励
    if (nextStreak === 29) tomorrowPoints.value = 25 // 30天奖励
  } catch (e) {
    console.error('加载签到状态失败', e)
  }
}

// 保存签到数据
const saveCheckinData = (data) => {
  try {
    uni.setStorageSync('checkin_data', data)
  } catch (e) {
    console.error('保存签到数据失败', e)
  }
}

// 执行签到（使用本地存储）
const handleCheckin = () => {
  if (hasCheckinToday.value || isAnimating.value) return

  isAnimating.value = true

  const todayStr = getTodayStr()
  const yesterdayStr = getYesterdayStr()

  // 获取当前数据
  let checkinData = uni.getStorageSync('checkin_data') || {}

  // 计算连续签到天数
  let newStreak = 1
  if (checkinData.lastCheckinDate === yesterdayStr) {
    newStreak = (checkinData.streak || 0) + 1
  }

  // 计算积分
  let pointsEarned = 10
  if (newStreak === 7) pointsEarned += 50 // 7天额外奖励
  if (newStreak === 14) pointsEarned += 40 // 14天额外奖励
  if (newStreak === 30) pointsEarned += 70 // 30天额外奖励

  // 更新数据
  const newData = {
    points: (checkinData.points || 0) + pointsEarned,
    streak: newStreak,
    maxStreak: Math.max(checkinData.maxStreak || 0, newStreak),
    lastCheckinDate: todayStr,
    checkinDates: checkinData.checkinDates || []
  }

  // 记录签到日期
  if (!newData.checkinDates.includes(todayStr)) {
    newData.checkinDates.push(todayStr)
  }

  // 保存
  saveCheckinData(newData)

  // 更新UI
  userPoints.value = newData.points
  checkinStreak.value = newStreak
  maxStreak.value = newData.maxStreak
  hasCheckinToday.value = true

  // 显示成功提示
  uni.showToast({
    title: `签到成功 +${pointsEarned}积分`,
    icon: 'success',
    duration: 2000
  })

  // 刷新日历
  generateCalendar()

  setTimeout(() => {
    isAnimating.value = false
  }, 1000)
}

// 生成日历
const generateCalendar = () => {
  const year = currentYear.value
  const month = currentMonth.value

  // 获取当月第一天是星期几
  const firstDay = new Date(year, month - 1, 1).getDay()
  // 获取当月天数
  const daysInMonth = new Date(year, month, 0).getDate()

  // 今天
  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth() + 1
  const todayDate = today.getDate()
  const todayStr = getTodayStr()

  // 获取签到日期列表
  const checkinData = uni.getStorageSync('checkin_data') || {}
  const checkinDates = checkinData.checkinDates || []

  // 生成日历数据
  const days = []

  // 填充前面的空位
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: '', isCurrentMonth: false })
  }

  // 当月日期
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({
      day: d,
      isCurrentMonth: true,
      isToday: year === todayYear && month === todayMonth && d === todayDate,
      hasCheckin: checkinDates.includes(dateStr),
      isFuture: new Date(year, month - 1, d) > today
    })
  }

  calendarDays.value = days
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

  currentYear.value = newYear
  currentMonth.value = newMonth
  generateCalendar()
}

onShow(() => {
  loadCheckinStatus()
  generateCalendar()
})
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
  margin: 30rpx;

  .checkin-btn-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx;

    .checkin-btn {
      width: 200rpx;
      height: 200rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #E63946 0%, #FF6B6B 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8rpx 30rpx rgba(230, 57, 70, 0.4);

      &.checked {
        background: linear-gradient(135deg, #ccc 0%, #ddd 100%);
        box-shadow: none;
      }

      &.animating {
        animation: pulse 0.5s ease-in-out;
      }

      .btn-text {
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
      }

      .btn-points {
        font-size: 28rpx;
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
        font-size: 32rpx;
        color: #666;
        padding: 10rpx;
      }

      .month-text {
        font-size: 28rpx;
        color: #333;
        min-width: 160rpx;
        text-align: center;
      }
    }
  }

  .week-header {
    display: flex;
    justify-content: space-around;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #eee;

    .week-day {
      flex: 1;
      text-align: center;
      font-size: 24rpx;
      color: #999;
    }
  }

  .days-grid {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10rpx;

    .day-item {
      width: 14.28%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16rpx 0;
      position: relative;

      &.other-month {
        opacity: 0.3;
      }

      &.today {
        .day-number {
          background: #E63946;
          color: #fff;
          border-radius: 50%;
          width: 56rpx;
          height: 56rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      &.checked {
        .day-number {
          color: #E63946;
          font-weight: bold;
        }
      }

      &.future {
        opacity: 0.4;
      }

      .day-number {
        font-size: 28rpx;
        color: #333;
      }

      .check-mark {
        font-size: 18rpx;
        color: #4CAF50;
        position: absolute;
        bottom: 8rpx;
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
    display: flex;
    flex-direction: column;
    gap: 24rpx;

    .rule-item {
      display: flex;
      align-items: center;
      gap: 20rpx;

      .rule-icon {
        font-size: 40rpx;
      }

      .rule-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6rpx;

        .rule-title {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
        }

        .rule-desc {
          font-size: 24rpx;
          color: #999;
        }
      }

      .rule-points {
        font-size: 28rpx;
        color: #E63946;
        font-weight: bold;
      }
    }
  }
}

.bottom-space {
  height: 100rpx;
}
</style>
