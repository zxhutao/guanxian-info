<template>
  <view class="nursing-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">养老护理</text>
      <text class="page-desc">专业护工，放心托付</text>
    </view>

    <!-- 服务类型 -->
    <view class="service-types">
      <view
        v-for="type in serviceTypes"
        :key="type.name"
        :class="['type-item', { active: selectedType === type.name }]"
        @click="onTypeChange(type.name)"
      >
        <text class="type-icon">{{ type.icon }}</text>
        <text class="type-name">{{ type.name }}</text>
      </view>
    </view>

    <!-- 护工列表 -->
    <scroll-view class="worker-list" scroll-y>
      <view class="worker-cards">
        <view
          v-for="worker in filteredWorkers"
          :key="worker.id"
          class="worker-card"
          @click="toDetail(worker.id)"
        >
          <view class="worker-avatar">👩</view>
          <view class="worker-info">
            <view class="worker-header">
              <text class="worker-name">{{ worker.name }}</text>
              <text class="worker-price">{{ worker.price }}</text>
            </view>
            <view class="worker-tags">
              <text class="tag">{{ worker.experience }}年经验</text>
              <text class="tag">{{ worker.skill }}</text>
            </view>
            <view class="worker-desc">{{ worker.description }}</view>
            <view class="worker-footer">
              <text class="rating">⭐ {{ worker.rating }}</text>
              <text class="contact-btn" @click.stop="handleContact(worker.phone)">联系Ta</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-tip" v-if="filteredWorkers.length === 0">
        <text>暂无护工</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// 选中类型
const selectedType = ref('全部')

// 护工列表 - 静态数据
const allWorkers = ref([
  { id: 1, name: '张阿姨', experience: 5, skill: '老年护理', price: '200元/天', rating: 4.9, phone: '13812345678', description: '持有护理证书，擅长老年人日常护理、康复训练' },
  { id: 2, name: '李大姐', experience: 3, skill: '康复护理', price: '220元/天', rating: 4.8, phone: '13923456789', description: '专业康复护理，可提供术后护理服务' },
  { id: 3, name: '王大哥', experience: 8, skill: '全天护理', price: '280元/天', rating: 5.0, phone: '13734567890', description: '专业护工，24小时陪护，经验丰富' },
  { id: 4, name: '刘阿姨', experience: 4, skill: '母婴护理', price: '300元/天', rating: 4.9, phone: '13645678901', description: '持证月嫂，专业母婴护理服务' },
  { id: 5, name: '陈阿姨', experience: 6, skill: '老年护理', price: '220元/天', rating: 4.7, phone: '13556789012', description: '耐心细致，擅长照顾失能老人' },
  { id: 6, name: '赵大姐', experience: 2, skill: '康复护理', price: '180元/天', rating: 4.6, phone: '13467890123', description: '细心负责，有医院护理经验' }
])

// 服务类型
const serviceTypes = [
  { name: '全部', icon: '👥' },
  { name: '老年护理', icon: '👴' },
  { name: '康复护理', icon: '🏥' },
  { name: '母婴护理', icon: '👶' },
  { name: '全天护理', icon: '🕐' }
]

// 过滤后的护工
const filteredWorkers = computed(() => {
  if (selectedType.value === '全部') {
    return allWorkers.value
  }
  return allWorkers.value.filter(w => w.skill === selectedType.value)
})

// 页面显示时
onShow(() => {
  selectedType.value = '全部'
})

// 类型切换
function onTypeChange(type) {
  selectedType.value = type
}

// 跳转详情
const toDetail = (id) => {
  uni.navigateTo({ url: `/pages/nursing/detail?id=${id}` })
}

// 联系护工
const handleContact = (phone) => {
  uni.makePhoneCall({
    phoneNumber: phone
  })
}
</script>

<style lang="scss" scoped>
.nursing-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  padding: 40rpx 30rpx;
  text-align: center;

  .page-title {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 10rpx;
  }

  .page-desc {
    display: block;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
  }
}

.service-types {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 20rpx;
  background: #fff;
  margin-bottom: 20rpx;

  .type-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;
    padding: 16rpx 24rpx;
    border-radius: 12rpx;

    &.active {
      background: #E8F5E9;
    }

    .type-icon {
      font-size: 48rpx;
    }

    .type-name {
      font-size: 24rpx;
      color: #333;
    }
  }
}

.worker-list {
  height: calc(100vh - 400rpx);
  padding: 0 30rpx;
}

.worker-cards {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 30rpx;

  .worker-card {
    display: flex;
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    gap: 24rpx;

    .worker-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      background: #F0F0F0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 60rpx;
      flex-shrink: 0;
    }

    .worker-info {
      flex: 1;
      min-width: 0;

      .worker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12rpx;

        .worker-name {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }

        .worker-price {
          font-size: 30rpx;
          color: #E63946;
          font-weight: bold;
        }
      }

      .worker-tags {
        display: flex;
        gap: 12rpx;
        margin-bottom: 12rpx;

        .tag {
          padding: 4rpx 12rpx;
          background: #f0f0f0;
          color: #666;
          font-size: 22rpx;
          border-radius: 6rpx;
        }
      }

      .worker-desc {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 16rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .worker-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .rating {
          font-size: 26rpx;
          color: #FFB800;
        }

        .contact-btn {
          padding: 10rpx 30rpx;
          background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
          color: #fff;
          font-size: 26rpx;
          border-radius: 30rpx;
        }
      }
    }
  }
}

.empty-tip {
  text-align: center;
  padding: 100rpx;
  color: #999;
  font-size: 28rpx;
}
</style>
