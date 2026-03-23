<template>
  <view class="qa-detail-page">
    <!-- 问题区域 -->
    <view class="question-section">
      <!-- 标题 -->
      <view class="question-header">
        <text class="question-title">{{ question.title }}</text>
        <view class="reward-tag" v-if="question.reward > 0">
          <text class="reward-icon">💰</text>
          <text class="reward-text">{{ question.reward }}积分</text>
        </view>
      </view>

      <!-- 分类和状态 -->
      <view class="question-meta">
        <text class="category-tag">{{ getCategoryName(question.category) }}</text>
        <text class="status-tag" :class="{ solved: question.status === 'solved' }">
          {{ question.status === 'solved' ? '已解决' : '待解决' }}
        </text>
        <text class="meta-text">浏览 {{ question.viewCount }}</text>
      </view>

      <!-- 内容 -->
      <text class="question-content">{{ question.content }}</text>

      <!-- 提问者信息 -->
      <view class="author-section">
        <image class="avatar" :src="question.author.avatar" mode="aspectFill" />
        <view class="author-info">
          <text class="nickname">{{ question.author.nickname }}</text>
          <text class="time">发布于 {{ formatTime(question.createTime) }}</text>
        </view>
      </view>
    </view>

    <!-- 分割线 -->
    <view class="divider">
      <text class="divider-text">回答 ({{ answers.length }})</text>
    </view>

    <!-- 回答列表 -->
    <scroll-view class="answer-list" scroll-y>
      <view
        v-for="(answer, index) in answers"
        :key="answer.id"
        class="answer-card"
        :class="{ best: answer.isBest }"
      >
        <!-- 最佳答案标记 -->
        <view class="best-badge" v-if="answer.isBest">
          <text class="badge-icon">✓</text>
          <text class="badge-text">最佳答案</text>
        </view>

        <!-- 回答者信息 -->
        <view class="answer-header">
          <image class="avatar" :src="answer.author.avatar" mode="aspectFill" />
          <view class="author-info">
            <text class="nickname">{{ answer.author.nickname }}</text>
            <text class="time">{{ formatTime(answer.createTime) }}</text>
          </view>
        </view>

        <!-- 回答内容 -->
        <text class="answer-content">{{ answer.content }}</text>

        <!-- 点赞按钮 -->
        <view class="answer-footer">
          <view class="like-btn" :class="{ liked: likedAnswers.includes(answer.id) }" @click="toggleLike(answer)">
            <text class="like-icon">{{ likedAnswers.includes(answer.id) ? '👍' : '👍🏻' }}</text>
            <text class="like-count">{{ answer.likes + (likedAnswers.includes(answer.id) ? 1 : 0) }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="answers.length === 0">
        <text class="empty-icon">💬</text>
        <text class="empty-text">暂无回答</text>
        <text class="empty-hint">成为第一个回答的人吧！</text>
      </view>
    </scroll-view>

    <!-- 底部输入框 -->
    <view class="input-bar">
      <input
        class="input-field"
        v-model="replyContent"
        placeholder="写下你的回答..."
        confirm-type="send"
        @confirm="submitReply"
      />
      <view class="submit-btn" @click="submitReply">
        <text>发送</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { questionList, getAnswersByQuestionId, users } from './data.js'

// 问题ID
const questionId = ref('')

// 当前问题
const question = ref({})

// 回答列表
const answers = ref([])

// 回复内容
const replyContent = ref('')

// 已点赞的回答
const likedAnswers = ref([])

// 分类列表
const categories = [
  { label: '全部', value: 'all' },
  { label: '生活服务', value: 'life' },
  { label: '求职招聘', value: 'job' },
  { label: '房屋租售', value: 'house' },
  { label: '教育培训', value: 'edu' },
  { label: '其他', value: 'other' }
]

// 获取分类名称
const getCategoryName = (category) => {
  const cat = categories.find(c => c.value === category)
  return cat ? cat.label : '其他'
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

// 加载问题数据
const loadData = () => {
  const found = questionList.find(q => q.id === questionId.value)
  if (found) {
    question.value = found
    answers.value = getAnswersByQuestionId(questionId.value)
    // 将最佳答案排到前面
    answers.value.sort((a, b) => {
      if (a.isBest) return -1
      if (b.isBest) return 1
      return b.likes - a.likes
    })
  }
}

// 切换点赞
const toggleLike = (answer) => {
  const index = likedAnswers.value.indexOf(answer.id)
  if (index > -1) {
    likedAnswers.value.splice(index, 1)
  } else {
    likedAnswers.value.push(answer.id)
  }
}

// 提交回复
const submitReply = () => {
  if (!replyContent.value.trim()) {
    uni.showToast({ title: '请输入回答内容', icon: 'none' })
    return
  }

  // 模拟提交
  const newAnswer = {
    id: 'a' + Date.now(),
    questionId: questionId.value,
    content: replyContent.value,
    isBest: false,
    likes: 0,
    createTime: Date.now(),
    author: users[0]
  }

  answers.value.push(newAnswer)
  replyContent.value = ''

  uni.showToast({ title: '回答成功', icon: 'success' })
}

onLoad((options) => {
  questionId.value = options.id || 'q001'
  loadData()

  // 读取已点赞记录
  try {
    const liked = uni.getStorageSync('qa_liked_answers') || []
    likedAnswers.value = liked
  } catch (e) {
    likedAnswers.value = []
  }
})
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.qa-detail-page {
  min-height: 100vh;
  background: $bg-color;
  padding-bottom: 120rpx;
}

// 问题区域
.question-section {
  background: #fff;
  padding: $spacing-lg;

  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-md;

    .question-title {
      flex: 1;
      font-size: 36rpx;
      font-weight: 600;
      color: $text-primary;
      line-height: 1.4;
    }

    .reward-tag {
      display: flex;
      align-items: center;
      padding: $spacing-xs $spacing-sm;
      background: rgba(230, 57, 70, 0.1);
      border-radius: 20rpx;
      margin-left: $spacing-md;
      flex-shrink: 0;

      .reward-icon {
        font-size: 24rpx;
      }

      .reward-text {
        font-size: $font-size-xs;
        color: $primary-color;
        font-weight: 600;
      }
    }
  }

  .question-meta {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-lg;

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

    .meta-text {
      font-size: $font-size-xs;
      color: $text-grey;
      margin-left: auto;
    }
  }

  .question-content {
    font-size: $font-size-md;
    color: $text-primary;
    line-height: 1.8;
    margin-bottom: $spacing-lg;
  }

  .author-section {
    display: flex;
    align-items: center;
    padding-top: $spacing-lg;
    border-top: 1rpx solid $border-color;

    .avatar {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      margin-right: $spacing-md;
    }

    .author-info {
      .nickname {
        font-size: $font-size-md;
        color: $text-primary;
        font-weight: 500;
        display: block;
        margin-bottom: $spacing-xs;
      }

      .time {
        font-size: $font-size-xs;
        color: $text-grey;
      }
    }
  }
}

// 分割线
.divider {
  display: flex;
  align-items: center;
  padding: $spacing-md $spacing-lg;
  background: $bg-color;

  .divider-text {
    font-size: $font-size-md;
    color: $text-secondary;
    font-weight: 500;
  }
}

// 回答列表
.answer-list {
  height: calc(100vh - 850rpx);
  padding: 0 $spacing-md;

  .answer-card {
    background: #fff;
    border-radius: $radius-md;
    padding: $spacing-lg;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-sm;
    position: relative;

    &.best {
      border: 2rpx solid $success-color;
    }

    .best-badge {
      position: absolute;
      top: $spacing-md;
      right: $spacing-md;
      display: flex;
      align-items: center;
      padding: $spacing-xs $spacing-sm;
      background: $success-color;
      border-radius: 20rpx;

      .badge-icon {
        color: #fff;
        font-size: 20rpx;
        margin-right: $spacing-xs;
      }

      .badge-text {
        color: #fff;
        font-size: $font-size-xs;
        font-weight: 500;
      }
    }

    .answer-header {
      display: flex;
      align-items: center;
      margin-bottom: $spacing-md;

      .avatar {
        width: 56rpx;
        height: 56rpx;
        border-radius: 50%;
        margin-right: $spacing-md;
      }

      .author-info {
        .nickname {
          font-size: $font-size-md;
          color: $text-primary;
          font-weight: 500;
          display: block;
          margin-bottom: $spacing-xs;
        }

        .time {
          font-size: $font-size-xs;
          color: $text-grey;
        }
      }
    }

    .answer-content {
      font-size: $font-size-md;
      color: $text-primary;
      line-height: 1.7;
      margin-bottom: $spacing-md;
    }

    .answer-footer {
      display: flex;
      justify-content: flex-end;

      .like-btn {
        display: flex;
        align-items: center;
        padding: $spacing-sm $spacing-md;
        background: $bg-color;
        border-radius: 30rpx;

        .like-icon {
          font-size: 28rpx;
          margin-right: $spacing-xs;
        }

        .like-count {
          font-size: $font-size-sm;
          color: $text-secondary;
        }

        &.liked {
          background: rgba($primary-color, 0.1);

          .like-count {
            color: $primary-color;
          }
        }
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80rpx 0;

    .empty-icon {
      font-size: 80rpx;
      margin-bottom: $spacing-lg;
    }

    .empty-text {
      font-size: $font-size-md;
      color: $text-secondary;
      margin-bottom: $spacing-sm;
    }

    .empty-hint {
      font-size: $font-size-sm;
      color: $text-grey;
    }
  }
}

// 底部输入框
.input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: $spacing-md;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);

  .input-field {
    flex: 1;
    padding: $spacing-md $spacing-lg;
    background: $bg-color;
    border-radius: 40rpx;
    font-size: $font-size-md;
  }

  .submit-btn {
    padding: $spacing-md $spacing-lg;
    margin-left: $spacing-md;
    background: $primary-color;
    border-radius: 40rpx;

    text {
      color: #fff;
      font-size: $font-size-md;
    }
  }
}
</style>
