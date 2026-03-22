<template>
  <view class="message-page">
    <!-- 消息列表 -->
    <view class="message-list">
      <view 
        class="message-item" 
        v-for="item in messageList" 
        :key="item.id"
        @click="viewDetail(item)"
      >
        <view class="message-icon" :class="item.type">
          <text>{{ item.icon }}</text>
        </view>
        <view class="message-content">
          <view class="message-header">
            <text class="message-title">{{ item.title }}</text>
            <text class="message-time">{{ item.time }}</text>
          </view>
          <view class="message-desc">{{ item.content }}</view>
        </view>
        <view class="unread-dot" v-if="!item.read"></view>
      </view>
      
      <view class="empty-state" v-if="messageList.length === 0">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无消息</text>
      </view>
    </view>
    
    <!-- 系统公告 -->
    <view class="notice-section">
      <view class="notice-header">
        <text class="notice-title">📢 系统公告</text>
      </view>
      <view class="notice-list">
        <view class="notice-item" v-for="notice in notices" :key="notice.id" @click="viewNotice(notice)">
          <view class="notice-badge" v-if="!notice.read">NEW</view>
          <view class="notice-title-text">{{ notice.title }}</view>
          <view class="notice-date">{{ notice.date }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const messageList = ref([
  {
    id: 1,
    type: 'job',
    icon: '💼',
    title: '简历投递成功',
    content: '您投递的"玻璃厂操作工"已收到，企业HR会尽快查看',
    time: '10:30',
    read: false
  },
  {
    id: 2,
    type: 'service',
    icon: '🔧',
    title: '服务预约成功',
    content: '您预约的家政保洁服务已确认，师傅将在约定时间上门',
    time: '昨天',
    read: false
  },
  {
    id: 3,
    type: 'nursing',
    icon: '👩‍⚕️',
    title: '护工预约确认',
    content: '张阿姨已确认您的预约请求，请保持电话畅通',
    time: '03-20',
    read: true
  },
  {
    id: 4,
    type: 'system',
    icon: '🔔',
    title: '优惠券到账提醒',
    content: '恭喜获得新用户专享优惠券，满100减20元',
    time: '03-18',
    read: true
  }
])

const notices = ref([
  {
    id: 1,
    title: '冠帮帮V1.0版本正式上线，欢迎使用！',
    date: '2026-03-01',
    read: true
  },
  {
    id: 2,
    title: '平台服务时间调整通知',
    date: '2026-02-15',
    read: true
  },
  {
    id: 3,
    title: '关于规范信息发布的公告',
    date: '2026-01-20',
    read: true
  }
])

const viewDetail = (item) => {
  item.read = true
  uni.showToast({ title: '查看详情', icon: 'none' })
}

const viewNotice = (notice) => {
  notice.read = true
  uni.showModal({
    title: notice.title,
    content: '公告内容详情开发中...\n\n感谢您使用冠帮帮平台，我们将持续优化服务体验。',
    showCancel: false
  })
}
</script>

<style lang="scss" scoped>
.message-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50rpx;
}

.message-list {
  background: #fff;
  
  .message-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f5f5f5;
    position: relative;
    
    &:active {
      background: #fafafa;
    }
    
    .message-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36rpx;
      margin-right: 24rpx;
      flex-shrink: 0;
      
      &.job {
        background: #FFF0F0;
      }
      
      &.service {
        background: #E3F2FD;
      }
      
      &.nursing {
        background: #E8F5E9;
      }
      
      &.system {
        background: #FFF3E0;
      }
    }
    
    .message-content {
      flex: 1;
      overflow: hidden;
      
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12rpx;
        
        .message-title {
          font-size: 30rpx;
          font-weight: 600;
          color: #333;
        }
        
        .message-time {
          font-size: 24rpx;
          color: #999;
        }
      }
      
      .message-desc {
        font-size: 26rpx;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    
    .unread-dot {
      position: absolute;
      right: 30rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 16rpx;
      height: 16rpx;
      background: #E63946;
      border-radius: 50%;
    }
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 0;
    
    .empty-icon {
      font-size: 80rpx;
      margin-bottom: 20rpx;
    }
    
    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}

.notice-section {
  margin-top: 20rpx;
  background: #fff;
  padding: 30rpx;
  
  .notice-header {
    margin-bottom: 24rpx;
    
    .notice-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }
  
  .notice-list {
    .notice-item {
      padding: 24rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      display: flex;
      align-items: center;
      gap: 16rpx;
      
      &:last-child {
        border-bottom: none;
      }
      
      &:active {
        background: #fafafa;
      }
      
      .notice-badge {
        background: #E63946;
        color: #fff;
        font-size: 20rpx;
        padding: 4rpx 12rpx;
        border-radius: 8rpx;
        flex-shrink: 0;
      }
      
      .notice-title-text {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .notice-date {
        font-size: 24rpx;
        color: #999;
        flex-shrink: 0;
      }
    }
  }
}
</style>
