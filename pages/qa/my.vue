<template>
  <view class="my-qa-page">
    <!-- Tab切换 -->
    <view class="tab-bar">
      <view
        class="tab-item"
        :class="{ active: currentTab === 'asked' }"
        @click="currentTab = 'asked'"
      >
        我提问的 ({{ myQuestions.length }})
      </view>
      <view
        class="tab-item"
        :class="{ active: currentTab === 'answered' }"
        @click="currentTab = 'answered'"
      >
        我回答的 ({{ myAnswers.length }})
      </view>
    </view>

    <!-- 我提问的 -->
    <scroll-view class="content-list" scroll-y v-if="currentTab === 'asked'">
      <view
        v-for="question in myQuestions"
        :key="question.id"
        class="question-card"
        @click="goToDetail(question.id)"
      >
        <view class="card-header">
          <text class="question-title">{{ question.title }}</text>
          <view class="reward-tag" v-if="question.reward > 0">
            <text>{{ question.reward }}积分</text>
          </view>
        </view>

        <view class="card-meta">
          <text class="category-tag">{{ getCategoryName(question.category) }}</text>
          <text class="status-tag" :class="{ solved: question.status === 'solved' }">
            {{ question.status === 'solved' ? '已解决' : '待解决' }}
          </text>
        </view>

        <view class="card-footer">
          <text class="time">{{ formatTime(question.createTime) }}</text>
          <view class="stats">
            <text class="stat-item">💬 {{ question.answerCount }}</text>
            <text class="stat-item">👁️ {{ question.viewCount }}</text>
          </view>
        </view>
      </view>

      <view class="empty-state" v-if="myQuestions.length === 0">
        <text class="empty-icon">❓</text>
        <text class="empty-text">您还没有提问</text>
        <view class="empty-btn" @click="goToAsk">
          <text>去提问</text>
        </view>
      </view>
    </scroll-view>

    <!-- 我回答的 -->
    <scroll-view class="content-list" scroll-y v-else>
      <view
        v-for="answer in myAnswers"
        :key="answer.id"
        class="answer-card"
        @click="goToDetail(answer.questionId)"
      >
        <view class="answer-question">
          <text class="question-label">问题：</text>
          <text class="question-title">{{ getQuestionTitle(answer.questionId) }}</text>
        </view>

        <view class="answer-content">
          <text class="content-label">我的回答：</text>
          <text class="content-text">{{ answer.content }}</text>
        </view>

        <view class="answer-footer">
          <text class="time">{{ formatTime(answer.createTime) }}</text>
          <view class="answer-stats">
            <text class="stat-item" :class="{ liked: answer.isBest }">
              {{ answer.isBest ? '✓ 最佳答案' : '👍 ' + answer.likes }}
            </text>
          </view>
        </view>
      </view>

      <view class="empty-state" v-if="myAnswers.length === 0">
        <text class="empty-icon">💬</text>
        <text class="empty-text">您还没有回答过问题</text>
        <view class="empty-btn" @click="goToHome">
          <text>去回答</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { questionList, answerList } from './data.js'

// 当前Tab
const currentTab = ref('asked')

// 当前用户ID
const currentUserId = 'u001'

// 分类列表
const categories = [
  { label: '全部', value: 'all' },
  { label: '生活服务', value: 'life' },
  { label: '求职招聘', value: 'job' },
  { label: '房屋租售', value: 'house' },
  { label: '教育培训', value: 'edu' },
  { label: '其他', value: 'other' }
]

// 我提问的
const myQuestions = computed(() => {
  return questionList.filter(q => q.author.id === currentUserId)
})

// 我回答的
const myAnswers = computed(() => {
  return answerList.filter(a => a.author.id === currentUserId)
})

// 获取分类名称
const getCategoryName = (category) => {
  const cat = categories.find(c => c.value === category)
  return cat ? cat.label : '其他'
}

// 获取问题标题
const getQuestionTitle = (questionId) => {
  const question = questionList.find(q => q.id === questionId)
  return question ? question.title : '未知问题'
}

// 格式化时间
const formatTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return new Date(timestamp).toLocaleDateString()
}

// 跳转详情
const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/qa/detail?id=${id}`
  })
}

// 去提问
const goToAsk = () => {
  uni.navigateTo({
    url: '/pages/qa/ask'
  })
}

// 去首页
const goToHome = () => {
  uni.navigateTo({
    url: '/pages/qa/index'
  })
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.my-qa-page {
  min-height: 100vh;
  background: $bg-color;
}

// Tab栏
.tab-bar {
  display: flex;
  background: #fff;
  padding: $spacing-md;
  border-bottom: 1rpx solid $border-color;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: $spacing-md 0;
    font-size: $font-size-md;
    color: $text-secondary;
    position: relative;

    &.active {
      color: $primary-color;
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80rpx;
        height: 4rpx;
        background: $primary-color;
        border-radius: 2rpx;
      }
    }
  }
}

// 内容列表
.content-list {
  height: calc(100vh - 120rpx);
  padding: $spacing-md;

  // 问题卡片
  .question-card {
    background: #fff;
    border-radius: $radius-md;
    padding: $spacing-lg;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-sm;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: $spacing-sm;

      .question-title {
        flex: 1;
        font-size: $font-size-md;
        font-weight: 600;
        color: $text-primary;
        line-height: 1.4;
      }

      .reward-tag {
        padding: $spacing-xs $spacing-sm;
        background: rgba($primary-color, 0.1);
        border-radius: 20rpx;
        margin-left: $spacing-sm;

        text {
          font-size: $font-size-xs;
          color: $primary-color;
          font-weight: 500;
        }
      }
    }

    .card-meta {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-md;

      .category-tag {
        padding: $spacing-xs $spacing-sm;
        background: $bg-color;
        border-radius: $radius-sm;
        font-size: $font-size-xs;
        color: $text-secondary;
      }

      .status-tag {
        padding: $spacing-xs $spacing-sm;
        background: rgba($warning-color, 0.1);
        border-radius: $radius-sm;
        font-size: $font-size-xs;
        color: $warning-color;

        &.solved {
          background: rgba($success-color, 0.1);
          color: $success-color;
        }
      }
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: $spacing-md;
      border-top: 1rpx solid $border-color;

      .time {
        font-size: $font-size-xs;
        color: $text-grey;
      }

      .stats {
        display: flex;
        gap: $spacing-md;

        .stat-item {
          font-size: $font-size-xs;
          color: $text-grey;
        }
      }
    }
  }

  // 回答卡片
  .answer-card {
    background: #fff;
    border-radius: $radius-md;
    padding: $spacing-lg;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-sm;

    .answer-question {
      margin-bottom: $spacing-md;

      .question-label {
        font-size: $font-size-xs;
        color: $text-grey;
      }

      .question-title {
        font-size: $font-size-md;
        font-weight: 600;
        color: $text-primary;
        line-height: 1.4;
      }
    }

    .answer-content {
      margin-bottom: $spacing-md;
      padding: $spacing-md;
      background: $bg-color;
      border-radius: $radius-md;

      .content-label {
        font-size: $font-size-xs;
        color: $text-grey;
        display: block;
        margin-bottom: $spacing-xs;
      }

      .content-text {
        font-size: $font-size-sm;
        color: $text-primary;
        line-height: 1.6;
      }
    }

    .answer-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .time {
        font-size: $font-size-xs;
        color: $text-grey;
      }

      .answer-stats {
        .stat-item {
          font-size: $font-size-sm;
          color: $text-secondary;

          &.liked {
            color: $success-color;
            font-weight: 600;
          }
        }
      }
    }
  }

  // 空状态
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 0;

    .empty-icon {
      font-size: 80rpx;
      margin-bottom: $spacing-lg;
    }

    .empty-text {
      font-size: $font-size-md;
      color: $text-grey;
      margin-bottom: $spacing-lg;
    }

    .empty-btn {
      padding: $spacing-md $spacing-xl;
      background: $primary-color;
      border-radius: $radius-md;

      text {
        color: #fff;
        font-size: $font-size-md;
      }
    }
  }
}
</style>
