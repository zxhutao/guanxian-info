<template>
  <view class="collect-page">
    <!-- 分类标签 -->
    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: currentTab === tab.value }"
        @click="switchTab(tab.value)"
      >
        <text>{{ tab.label }}</text>
        <view v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</view>
      </view>
    </view>

    <!-- 职位收藏 -->
    <scroll-view v-if="currentTab === 'job'" class="content-scroll" scroll-y>
      <view v-if="jobList.length === 0" class="empty-state">
        <u-icon name="heart" size="80rpx" color="#ddd" />
        <text class="empty-text">暂无收藏的职位</text>
        <view class="empty-btn" @click="goBrowse">
          去看看
        </view>
      </view>
      <view v-else class="collect-list">
        <view
          v-for="item in jobList"
          :key="item.id"
          class="collect-item"
          @click="toJobDetail(item.id)"
        >
          <view class="item-main">
            <view class="item-header">
              <view class="item-title">{{ item.title }}</view>
              <view class="item-salary">{{ item.salary }}</view>
            </view>
            <view class="item-company">
              <u-icon name="building" size="24rpx" color="#999" />
              <text>{{ item.company }}</text>
            </view>
            <view class="item-tags">
              <text v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</text>
            </view>
          </view>
          <view class="item-action" @click.stop="removeCollect('job', item.id)">
            <u-icon :name="item.collected ? 'heart-fill' : 'heart'" :color="item.collected ? '#E63946' : '#ccc'" size="40rpx" />
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 服务收藏 -->
    <scroll-view v-if="currentTab === 'service'" class="content-scroll" scroll-y>
      <view v-if="serviceList.length === 0" class="empty-state">
        <u-icon name="heart" size="80rpx" color="#ddd" />
        <text class="empty-text">暂无收藏的服务</text>
        <view class="empty-btn" @click="goService">
          去看看
        </view>
      </view>
      <view v-else class="collect-list">
        <view
          v-for="item in serviceList"
          :key="item.id"
          class="collect-item"
          @click="toServiceDetail(item.id)"
        >
          <view class="item-main">
            <view class="item-header">
              <view class="item-icon">{{ item.icon }}</view>
              <view class="item-title">{{ item.name }}</view>
            </view>
            <view class="item-desc">{{ item.desc }}</view>
            <view class="item-price">{{ item.price }}</view>
          </view>
          <view class="item-action" @click.stop="removeCollect('service', item.id)">
            <u-icon :name="item.collected ? 'heart-fill' : 'heart'" :color="item.collected ? '#E63946' : '#ccc'" size="40rpx" />
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 护工收藏 -->
    <scroll-view v-if="currentTab === 'nursing'" class="content-scroll" scroll-y>
      <view v-if="nursingList.length === 0" class="empty-state">
        <u-icon name="heart" size="80rpx" color="#ddd" />
        <text class="empty-text">暂无收藏的护工</text>
        <view class="empty-btn" @click="goNursing">
          去看看
        </view>
      </view>
      <view v-else class="collect-list">
        <view
          v-for="item in nursingList"
          :key="item.id"
          class="collect-item"
          @click="toNursingDetail(item.id)"
        >
          <view class="item-main">
            <view class="item-header">
              <view class="item-title">{{ item.name }}</view>
              <view class="item-price">{{ item.price }}/天</view>
            </view>
            <view class="item-info">
              <text class="info-tag">{{ item.experience }}年经验</text>
              <text class="info-tag">{{ item.skill }}</text>
            </view>
            <view class="item-rating">
              <u-icon name="star-fill" color="#FFB800" size="22rpx" />
              <text>{{ item.rating }}</text>
            </view>
          </view>
          <view class="item-action" @click.stop="removeCollect('nursing', item.id)">
            <u-icon :name="item.collected ? 'heart-fill' : 'heart'" :color="item.collected ? '#E63946' : '#ccc'" size="40rpx" />
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { showConfirm } from '@/utils/index'

const currentTab = ref('job')

// 收藏数据（本地存储）
const jobList = ref([])
const serviceList = ref([])
const nursingList = ref([])

const tabs = computed(() => [
  { label: '职位', value: 'job', count: jobList.value.length },
  { label: '服务', value: 'service', count: serviceList.value.length },
  { label: '护工', value: 'nursing', count: nursingList.value.length }
])

// 页面显示时加载收藏
onShow(() => {
  jobList.value = uni.getStorageSync('collect_job') || []
  serviceList.value = uni.getStorageSync('collect_service') || []
  nursingList.value = uni.getStorageSync('collect_nursing') || []
})

const switchTab = (tab) => {
  currentTab.value = tab
}

const removeCollect = async (type, id) => {
  const confirmed = await showConfirm('取消收藏', '确定取消收藏吗？')
  if (!confirmed) return

  const key = `collect_${type}`
  let list
  if (type === 'job') list = jobList.value
  else if (type === 'service') list = serviceList.value
  else list = nursingList.value

  list = list.filter(item => item.id !== id)
  uni.setStorageSync(key, list)

  if (type === 'job') jobList.value = list
  else if (type === 'service') serviceList.value = list
  else nursingList.value = list

  uni.showToast({ title: '已取消收藏', icon: 'success' })
}

const toJobDetail = (id) => {
  uni.navigateTo({ url: `/pages/job/detail?id=${id}` })
}

const toServiceDetail = (id) => {
  uni.navigateTo({ url: `/pages/service/detail?id=${id}` })
}

const toNursingDetail = (id) => {
  uni.navigateTo({ url: `/pages/nursing/detail?id=${id}` })
}

const goBrowse = () => {
  uni.switchTab({ url: '/pages/job/list' })
}

const goService = () => {
  uni.switchTab({ url: '/pages/service/index' })
}

const goNursing = () => {
  uni.switchTab({ url: '/pages/nursing/index' })
}
</script>

<style lang="scss" scoped>
.collect-page {
  min-height: 100vh;
  background: #F5F5F5;
}

.tab-bar {
  display: flex;
  background: #fff;
  padding: 20rpx 0;

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    font-size: 30rpx;
    color: #666;
    position: relative;

    &.active {
      color: #E63946;
      font-weight: 500;
    }

    &.active::after {
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

    .tab-badge {
      min-width: 32rpx;
      height: 32rpx;
      line-height: 32rpx;
      text-align: center;
      background: #E63946;
      color: #fff;
      font-size: 20rpx;
      border-radius: 16rpx;
      padding: 0 8rpx;
    }
  }
}

.content-scroll {
  height: calc(100vh - 120rpx);
}

.collect-list {
  padding: 20rpx;

  .collect-item {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
    gap: 16rpx;

    .item-main {
      flex: 1;

      .item-header {
        display: flex;
        align-items: center;
        gap: 12rpx;
        margin-bottom: 12rpx;

        .item-icon {
          font-size: 36rpx;
        }

        .item-title {
          font-size: 30rpx;
          font-weight: 500;
          color: #333;
          flex: 1;
        }

        .item-salary {
          font-size: 30rpx;
          color: #E63946;
          font-weight: 500;
          flex-shrink: 0;
        }

        .item-price {
          font-size: 28rpx;
          color: #E63946;
          font-weight: 500;
          flex-shrink: 0;
        }
      }

      .item-company {
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: 24rpx;
        color: #999;
        margin-bottom: 12rpx;
      }

      .item-desc {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 8rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .item-tags {
        display: flex;
        gap: 10rpx;
        flex-wrap: wrap;

        .tag {
          padding: 4rpx 14rpx;
          background: #FFF0F0;
          color: #E63946;
          font-size: 22rpx;
          border-radius: 6rpx;
        }
      }

      .item-info {
        display: flex;
        gap: 10rpx;
        margin-bottom: 8rpx;

        .info-tag {
          padding: 4rpx 14rpx;
          background: #F5F5F5;
          color: #666;
          font-size: 22rpx;
          border-radius: 6rpx;
        }
      }

      .item-rating {
        display: flex;
        align-items: center;
        gap: 6rpx;
        font-size: 24rpx;
        color: #FFB800;
      }
    }

    .item-action {
      flex-shrink: 0;
      padding: 12rpx;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;

  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin: 20rpx 0 30rpx;
  }

  .empty-btn {
    padding: 16rpx 60rpx;
    background: #E63946;
    color: #fff;
    font-size: 28rpx;
    border-radius: 40rpx;
  }
}
</style>
