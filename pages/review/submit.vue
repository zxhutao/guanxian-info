<template>
  <view class="review-page">
    <!-- 服务商信息-->
    <view class="provider-card">
      <image :src="providerInfo.avatar" mode="aspectFill" class="provider-avatar" />
      <view class="provider-info">
        <text class="provider-name">{{ providerInfo.name }}</text>
        <text class="provider-type">{{ providerInfo.type }}</text>
      </view>
    </view>

    <!-- 评分区域 -->
    <view class="rating-section">
      <text class="section-title">您对这次服务满意吗？</text>
      <text class="section-subtitle">您的评价能让更多冠县老乡找到靠谱商家</text>
      <view class="star-rating">
        <view
          v-for="index in 5"
          :key="index"
          class="star-item"
          @click="setRating(index)"
        >
          <text class="star" :class="{ active: index <= rating }">★</text>
        </view>
      </view>
      <text class="rating-text">{{ ratingText }}</text>
    </view>

    <!-- 评价标签 -->
    <view class="tags-section" v-if="rating > 0">
      <text class="section-title">选择标签（可多选）</text>
      <view class="tags-list">
        <view
          v-for="tag in currentTags"
          :key="tag"
          class="tag-item"
          :class="{ active: selectedTags.includes(tag) }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </view>
      </view>
    </view>

    <!-- 评价内容 -->
    <view class="content-section">
      <text class="section-title">详细评价</text>
      <textarea
        v-model="content"
        class="content-input"
        placeholder="请分享您的真实服务体验，帮助其他冠县老乡避坑避雷，找到靠谱商?.."
        maxlength="500"
      />
      <text class="word-count">{{ content.length }}/500</text>
    </view>

    <!-- 上传图片 -->
    <view class="images-section">
      <text class="section-title">上传图片（可选）</text>
      <view class="images-list">
        <view
          v-for="(img, index) in images"
          :key="index"
          class="image-item"
        >
          <image :src="img" mode="aspectFill" />
          <view class="delete-btn" @click="removeImage(index)">×</view>
        </view>
        <view class="upload-btn" @click="chooseImage" v-if="images.length < 6">
          <text class="upload-icon">+</text>
          <text class="upload-text">{{ images.length }}/6</text>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button
        class="submit-btn"
        :class="{ disabled: !canSubmit }"
        :disabled="!canSubmit"
        @click="submitReview"
      >
        提交评价
      </button>
      <text class="submit-tip">评价提交后不可修改，请认真填★</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const providerId = ref('')
const providerType = ref('service')
const orderId = ref('')
const rating = ref(0)
const content = ref('')
const selectedTags = ref([])
const images = ref([])

const providerInfo = ref({
  name: '',
  avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
  type: ''
})

// 好评标签
const positiveTags = ['服务热情', '技术专业', '准时到达', '价格合理', '态度好', '效率高', '细心耐心', '推荐']
// 差评标签
const negativeTags = ['服务态度差', '技术不好', '迟到', '乱收费', '不专业', '敷衍了事']

// 根据评分显示不同标签
const currentTags = computed(() => {
  if (rating.value >= 4) return positiveTags
  if (rating.value <= 2) return negativeTags
  return [...positiveTags, ...negativeTags]
})

const ratingText = computed(() => {
  const texts = ['', '非常不满 - 问题严重，不推荐', '不满 - 问题较多，有待改进', '一般 - 还可以，但有改进空间', '满意 - 服务不错，值得推荐', '非常满意 - 超出预期，强烈推荐！']
  return texts[rating.value] || '点击星星评分'
})

const canSubmit = computed(() => {
  return rating.value > 0 && content.value.trim().length >= 5
})

onLoad((options) => {
  providerId.value = options.providerId || ''
  providerType.value = options.type || 'service'
  orderId.value = options.orderId || ''
  
  // 加载服务商信?
  loadProviderInfo()
})

const loadProviderInfo = () => {
  // 模拟数据，实际应从接口获?
  const typeMap = {
    'service': '生活服务',
    'worker': '养老护?
  }
  
  const nameMap = {
    'housekeeping': '冠县保洁公司',
    'appliance': '冠县家电维修中心',
    'locksmith': '冠县开锁服务中?,
    'moving': '冠县搬家公司'
  }
  
  providerInfo.value = {
    name: nameMap[providerId.value] || '冠县服务?,
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    type: typeMap[providerType.value] || '生活服务'
  }
}

const setRating = (value) => {
  rating.value = value
}

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const chooseImage = () => {
  uni.chooseImage({
    count: 6 - images.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      images.value.push(...res.tempFilePaths)
    }
  })
}

const removeImage = (index) => {
  images.value.splice(index, 1)
}

const submitReview = async () => {
  if (!canSubmit.value) return
  
  uni.showLoading({ title: '提交?..' })
  
  try {
    // 上传图片到云存储
    const uploadedImages = []
    for (const img of images.value) {
      const result = await uni.cloud.uploadFile({
        cloudPath: `reviews/${Date.now()}_${Math.random().toString(36).substr(2)}.jpg`,
        filePath: img
      })
      uploadedImages.push(result.fileID)
    }
    
    // 调用云函数提交评?
    const { result } = await uniCloud.callFunction({
      name: 'reviews',
      data: {
        action: 'submitReview',
        data: {
          providerId: providerId.value,
          providerType: providerType.value,
          orderId: orderId.value,
          rating: rating.value,
          content: content.value,
          tags: selectedTags.value,
          images: uploadedImages
        }
      }
    })
    
    if (result.code === 0) {
      uni.showToast({
        title: '评价成功',
        icon: 'success'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      uni.showToast({
        title: result.message || '评价失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('提交评价失败:', error)
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
  }
}
</script>

<style lang="scss" scoped>
.review-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.provider-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .provider-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }

  .provider-info {
    .provider-name {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 8rpx;
    }

    .provider-type {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.rating-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;
  text-align: center;

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 12rpx;
    display: block;
  }

  .section-subtitle {
    font-size: 26rpx;
    color: #999;
    margin-bottom: 30rpx;
    display: block;
  }

  .star-rating {
    display: flex;
    justify-content: center;
    gap: 30rpx;
    margin-bottom: 20rpx;

    .star-item {
      .star {
        font-size: 60rpx;
        color: #ddd;
        transition: color 0.2s;

        &.active {
          color: #FFD700;
        }
      }
    }
  }

  .rating-text {
    font-size: 28rpx;
    color: #666;
  }
}

.tags-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .section-title {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .tag-item {
      padding: 12rpx 24rpx;
      background: #f5f5f5;
      border-radius: 30rpx;
      font-size: 26rpx;
      color: #666;
      border: 2rpx solid transparent;

      &.active {
        background: #FFF5F5;
        color: #E63946;
        border-color: #E63946;
      }
    }
  }
}

.content-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .section-title {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }

  .content-input {
    width: 100%;
    height: 200rpx;
    background: #f8f8f8;
    border-radius: 12rpx;
    padding: 20rpx;
    font-size: 28rpx;
    box-sizing: border-box;
  }

  .word-count {
    text-align: right;
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
    display: block;
  }
}

.images-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .section-title {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }

  .images-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;

    .image-item {
      width: 160rpx;
      height: 160rpx;
      border-radius: 12rpx;
      overflow: hidden;
      position: relative;

      image {
        width: 100%;
        height: 100%;
      }

      .delete-btn {
        position: absolute;
        top: 0;
        right: 0;
        width: 40rpx;
        height: 40rpx;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        border-radius: 0 12rpx 0 12rpx;
      }
    }

    .upload-btn {
      width: 160rpx;
      height: 160rpx;
      border: 2rpx dashed #ddd;
      border-radius: 12rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .upload-icon {
        font-size: 48rpx;
        color: #999;
      }

      .upload-text {
        font-size: 24rpx;
        color: #999;
        margin-top: 8rpx;
      }
    }
  }
}

.submit-section {
  padding: 40rpx 30rpx;

  .submit-btn {
    background: linear-gradient(135deg, #E63946, #FF6B6B);
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;

    &.disabled {
      background: #ccc;
    }

    &::after {
      border: none;
    }
  }

  .submit-tip {
    display: block;
    text-align: center;
    font-size: 24rpx;
    color: #999;
    margin-top: 20rpx;
  }
}
</style>

