<template>
  <view class="my-job-page">
    <!-- 顶部 Tab 切换 -->
    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab-item', { active: currentTab === tab.value }]"
        @click="currentTab = tab.value"
      >
        <text>{{ tab.label }}</text>
        <view v-if="currentTab === tab.value" class="tab-line"></view>
      </view>
    </view>

    <!-- 职位列表 -->
    <view class="job-list" v-if="currentJobs.length > 0">
      <view
        v-for="job in currentJobs"
        :key="job.id"
        class="job-card"
        @click="toDetail(job.id)"
      >
        <view class="job-top">
          <view class="job-title">{{ job.title }}</view>
          <view :class="['job-status', job.statusClass]">{{ job.statusText }}</view>
        </view>
        <view class="job-company">{{ job.company }}</view>
        <view class="job-info">
          <text class="job-salary">{{ job.salary }}</text>
          <text class="job-time">{{ job.updateTime }}</text>
        </view>
        <view class="job-actions">
          <view class="action-btn edit" @click.stop="editJob(job.id)">编辑</view>
          <view class="action-btn delete" @click.stop="deleteJob(job)">删除</view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无发布的职位</text>
      <view class="empty-btn" @click="publishJob">去发布</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const currentTab = ref('published')
const tabs = [
  { label: '已发布', value: 'published' },
  { label: '待审核', value: 'pending' },
  { label: '已下架', value: 'offline' }
]

// 模拟我的职位数据
const allJobs = ref([])

const currentJobs = computed(() => {
  return allJobs.value.filter(job => job.status === currentTab.value)
})

const statusMap = {
  published: { text: '招聘中', class: 'status-active' },
  pending: { text: '待审核', class: 'status-pending' },
  offline: { text: '已下架', class: 'status-offline' }
}

const loadJobs = () => {
  const stored = uni.getStorageSync('my_jobs') || []
  if (stored.length > 0) {
    allJobs.value = stored
  } else {
    // 默认空数据
    allJobs.value = []
  }
}

const toDetail = (id) => {
  uni.navigateTo({ url: `/pages/job/detail?id=${id}` })
}

const editJob = (id) => {
  uni.navigateTo({ url: `/pages/job/publish?id=${id}` })
}

const deleteJob = (job) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除「${job.title}」吗？`,
    success: (res) => {
      if (res.confirm) {
        allJobs.value = allJobs.value.filter(j => j.id !== job.id)
        uni.setStorageSync('my_jobs', allJobs.value)
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    }
  })
}

const publishJob = () => {
  uni.navigateTo({ url: '/pages/job/publish' })
}

onShow(() => {
  loadJobs()
})
</script>

<style lang="scss" scoped>
.my-job-page {
  min-height: 100vh;
  background: #F5F5F5;
}

.tab-bar {
  display: flex;
  background: #fff;
  padding: 0 20rpx;
  position: sticky;
  top: 0;
  z-index: 10;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 24rpx 0;
    font-size: 28rpx;
    color: #666;
    position: relative;

    &.active {
      color: #E63946;
      font-weight: 500;
    }

    .tab-line {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60rpx;
      height: 4rpx;
      background: #E63946;
      border-radius: 2rpx;
    }
  }
}

.job-list {
  padding: 20rpx 30rpx;

  .job-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

    .job-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12rpx;

      .job-title {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
        flex: 1;
      }

      .job-status {
        font-size: 22rpx;
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        margin-left: 16rpx;

        &.status-active {
          background: #E8F5E9;
          color: #4CAF50;
        }

        &.status-pending {
          background: #FFF8E1;
          color: #FF9800;
        }

        &.status-offline {
          background: #F5F5F5;
          color: #999;
        }
      }
    }

    .job-company {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 16rpx;
    }

    .job-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;

      .job-salary {
        font-size: 30rpx;
        color: #E63946;
        font-weight: 500;
      }

      .job-time {
        font-size: 24rpx;
        color: #999;
      }
    }

    .job-actions {
      display: flex;
      gap: 20rpx;
      padding-top: 20rpx;
      border-top: 1rpx solid #f5f5f5;

      .action-btn {
        flex: 1;
        text-align: center;
        padding: 14rpx 0;
        border-radius: 8rpx;
        font-size: 26rpx;

        &.edit {
          background: #FFF3F4;
          color: #E63946;
        }

        &.delete {
          background: #f5f5f5;
          color: #999;
        }
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 160rpx;

  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 30rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }

  .empty-btn {
    background: #E63946;
    color: #fff;
    padding: 20rpx 60rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
  }
}
</style>
