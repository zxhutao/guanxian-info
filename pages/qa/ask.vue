<template>
  <view class="ask-page">
    <!-- 标题 -->
    <view class="form-section">
      <view class="form-label">问题标题</view>
      <input
        class="form-input"
        v-model="form.title"
        placeholder="请输入问题标题（5-50字）"
        maxlength="50"
      />
    </view>

    <!-- 内容 -->
    <view class="form-section">
      <view class="form-label">问题详情</view>
      <textarea
        class="form-textarea"
        v-model="form.content"
        placeholder="请详细描述您的问题（至少10个字）"
        maxlength="500"
        :show-count="true"
      />
    </view>

    <!-- 分类选择 -->
    <view class="form-section">
      <view class="form-label">选择分类</view>
      <view class="category-grid">
        <view
          v-for="cat in categories"
          :key="cat.value"
          class="category-item"
          :class="{ active: form.category === cat.value }"
          @click="form.category = cat.value"
        >
          {{ cat.label }}
        </view>
      </view>
    </view>

    <!-- 悬赏积分 -->
    <view class="form-section">
      <view class="form-label">
        悬赏积分
        <text class="label-hint">（可选，悬赏能让问题更快得到回答）</text>
      </view>
      <view class="reward-options">
        <view
          v-for="reward in rewardOptions"
          :key="reward"
          class="reward-item"
          :class="{ active: form.reward === reward }"
          @click="form.reward = reward"
        >
          {{ reward === 0 ? '无悬赏' : reward + '积分' }}
        </view>
      </view>
    </view>

    <!-- 用户积分提示 -->
    <view class="tip-section">
      <text class="tip-icon">💡</text>
      <text class="tip-text">当前可用积分：{{ userPoints }}积分</text>
    </view>

    <!-- 发布按钮 -->
    <view class="submit-section">
      <view class="submit-btn" :class="{ disabled: !canSubmit }" @click="submitQuestion">
        <text>发布问题</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { questionList } from './data.js'

// 分类列表
const categories = [
  { label: '生活服务', value: 'life' },
  { label: '求职招聘', value: 'job' },
  { label: '房屋租售', value: 'house' },
  { label: '教育培训', value: 'edu' },
  { label: '其他', value: 'other' }
]

// 悬赏选项
const rewardOptions = [0, 5, 10, 20, 50]

// 用户积分
const userPoints = ref(100)

// 表单数据
const form = ref({
  title: '',
  content: '',
  category: 'life',
  reward: 0
})

// 是否可以提交
const canSubmit = computed(() => {
  return form.value.title.trim().length >= 5 &&
         form.value.content.trim().length >= 10 &&
         form.value.category !== '' &&
         form.value.reward <= userPoints.value
})

// 提交问题
const submitQuestion = () => {
  if (!canSubmit.value) {
    if (form.value.title.trim().length < 5) {
      uni.showToast({ title: '标题至少5个字', icon: 'none' })
      return
    }
    if (form.value.content.trim().length < 10) {
      uni.showToast({ title: '内容至少10个字', icon: 'none' })
      return
    }
    return
  }

  // 扣除积分
  if (form.value.reward > 0) {
    userPoints.value -= form.value.reward
    // 保存到本地存储
    uni.setStorageSync('qa_user_points', userPoints.value)
  }

  // 模拟添加问题
  const newQuestion = {
    id: 'q' + Date.now(),
    title: form.value.title,
    content: form.value.content,
    category: form.value.category,
    reward: form.value.reward,
    status: 'unsolved',
    answerCount: 0,
    viewCount: 0,
    createTime: Date.now(),
    author: {
      id: 'u001',
      nickname: '当前用户',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
    }
  }

  questionList.unshift(newQuestion)

  uni.showToast({ title: '发布成功', icon: 'success' })

  // 延迟跳转
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}

onMounted(() => {
  // 读取用户积分
  try {
    const points = uni.getStorageSync('qa_user_points')
    if (points !== '') {
      userPoints.value = points
    }
  } catch (e) {
    userPoints.value = 100
  }
})
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.ask-page {
  min-height: 100vh;
  background: $bg-color;
  padding: $spacing-md;
}

// 表单区域
.form-section {
  background: #fff;
  border-radius: $radius-md;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;

  .form-label {
    font-size: $font-size-md;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-md;
    display: flex;
    align-items: center;

    .label-hint {
      font-size: $font-size-xs;
      color: $text-grey;
      font-weight: normal;
      margin-left: $spacing-sm;
    }
  }

  .form-input {
    width: 100%;
    padding: $spacing-md;
    background: $bg-color;
    border-radius: $radius-md;
    font-size: $font-size-md;
  }

  .form-textarea {
    width: 100%;
    min-height: 200rpx;
    padding: $spacing-md;
    background: $bg-color;
    border-radius: $radius-md;
    font-size: $font-size-md;
    line-height: 1.6;
  }
}

// 分类选择
.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;

  .category-item {
    padding: $spacing-md $spacing-lg;
    background: $bg-color;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $text-secondary;
    border: 2rpx solid transparent;

    &.active {
      background: rgba($primary-color, 0.1);
      color: $primary-color;
      border-color: $primary-color;
    }
  }
}

// 悬赏选择
.reward-options {
  display: flex;
  gap: $spacing-sm;

  .reward-item {
    flex: 1;
    text-align: center;
    padding: $spacing-md;
    background: $bg-color;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $text-secondary;
    border: 2rpx solid transparent;

    &.active {
      background: rgba($primary-color, 0.1);
      color: $primary-color;
      border-color: $primary-color;
    }
  }
}

// 提示
.tip-section {
  display: flex;
  align-items: center;
  padding: $spacing-md $spacing-lg;
  background: rgba($primary-color, 0.05);
  border-radius: $radius-md;
  margin-bottom: $spacing-lg;

  .tip-icon {
    font-size: 28rpx;
    margin-right: $spacing-sm;
  }

  .tip-text {
    font-size: $font-size-sm;
    color: $primary-color;
  }
}

// 发布按钮
.submit-section {
  padding: $spacing-md 0;

  .submit-btn {
    width: 100%;
    padding: $spacing-lg;
    background: $primary-color;
    border-radius: $radius-lg;
    text-align: center;

    text {
      font-size: $font-size-lg;
      color: #fff;
      font-weight: 600;
    }

    &.disabled {
      background: #ccc;
    }
  }
}
</style>
