<template>
  <view class="publish-page">
    <view class="form">
      <!-- 职位名称 -->
      <view class="form-item">
        <text class="label">职位名称 *</text>
        <input
          class="input"
          placeholder="请输入职位名称"
          v-model="form.title"
        />
      </view>

      <!-- 公司名称 -->
      <view class="form-item">
        <text class="label">公司名称 *</text>
        <input
          class="input"
          placeholder="请输入公司名称"
          v-model="form.company"
        />
      </view>

      <!-- 薪资范围 -->
      <view class="form-item">
        <text class="label">薪资范围 *</text>
        <input
          class="input"
          placeholder="如：5000-8000元/月"
          v-model="form.salary"
        />
      </view>

      <!-- 工作地点 -->
      <view class="form-item">
        <text class="label">工作地点 *</text>
        <input
          class="input"
          placeholder="请输入工作地点"
          v-model="form.location"
        />
      </view>

      <!-- 职位类别 -->
      <view class="form-item">
        <text class="label">职位类别</text>
        <picker
          :value="categoryIndex"
          :range="categoryList"
          @change="onCategoryChange"
        >
          <view class="picker-value">
            {{ form.category || '请选择职位类别' }}
          </view>
        </picker>
      </view>

      <!-- 职位描述 -->
      <view class="form-item">
        <text class="label">职位描述</text>
        <textarea
          class="textarea"
          placeholder="请输入职位描述（可选）"
          v-model="form.description"
          :rows="4"
        />
      </view>

      <!-- 福利标签 -->
      <view class="form-item">
        <text class="label">福利标签</text>
        <view class="tag-list">
          <view
            v-for="tag in tagOptions"
            :key="tag"
            :class="['tag-item', { active: form.tags.includes(tag) }]"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </view>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-btn" @click="onSubmit">
      <text>发布职位</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { callCloudFunction, CLOUD_FUNCTIONS } from '../../utils/cloud.js'

// 表单数据
const form = ref({
  title: '',
  company: '',
  salary: '',
  location: '',
  category: '',
  description: '',
  tags: []
})

// 分类列表
const categoryList = ['工厂', '物流', '纺织', '技工', '质检', '包装', '其他']
const categoryIndex = ref(0)

// 标签选项
const tagOptions = ['包吃', '包住', '五险', '长白班', '加班费', '高温补贴', '节日福利', '年终奖']

// 分类选择
function onCategoryChange(e) {
  categoryIndex.value = e.detail.value
  form.value.category = categoryList[e.detail.value]
}

// 切换标签
function toggleTag(tag) {
  const index = form.value.tags.indexOf(tag)
  if (index > -1) {
    form.value.tags.splice(index, 1)
  } else {
    form.value.tags.push(tag)
  }
}

// 提交
async function onSubmit() {
  // 验证必填项
  if (!form.value.title) {
    uni.showToast({ title: '请输入职位名称', icon: 'none' })
    return
  }
  if (!form.value.company) {
    uni.showToast({ title: '请输入公司名称', icon: 'none' })
    return
  }
  if (!form.value.salary) {
    uni.showToast({ title: '请输入薪资范围', icon: 'none' })
    return
  }
  if (!form.value.location) {
    uni.showToast({ title: '请输入工作地点', icon: 'none' })
    return
  }

  uni.showLoading({ title: '发布中...' })

  try {
    const res = await callCloudFunction(CLOUD_FUNCTIONS.PUBLISH_JOB, {
      title: form.value.title,
      company: form.value.company,
      salary: form.value.salary,
      location: form.value.location,
      category: form.value.category,
      description: form.value.description,
      tags: form.value.tags
    })

    uni.hideLoading()

    if (res.success) {
      uni.showToast({ title: '发布成功！', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      uni.showToast({ title: res.message || '发布失败', icon: 'none' })
    }
  } catch (e) {
    uni.hideLoading()
    console.error('发布失败:', e)
    uni.showToast({ title: '发布失败，请重试', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.publish-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx 30rpx;
}

.form {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
}

.form-item {
  margin-bottom: 30rpx;

  .label {
    display: block;
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 16rpx;
  }

  .input {
    height: 80rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
  }

  .textarea {
    width: 100%;
    background: #f5f5f5;
    border-radius: 12rpx;
    padding: 24rpx;
    font-size: 28rpx;
    box-sizing: border-box;
  }

  .picker-value {
    height: 80rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    padding: 0 24rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    color: #666;
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .tag-item {
    padding: 12rpx 24rpx;
    background: #f5f5f5;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #666;

    &.active {
      background: #FFF0F0;
      color: #E63946;
    }
  }
}

.submit-btn {
  height: 88rpx;
  background: #E63946;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
  }
}
</style>
