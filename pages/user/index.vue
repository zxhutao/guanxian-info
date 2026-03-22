<template>
  <view class="user-page">
    <!-- 用户信息 -->
    <view class="user-header">
      <view class="user-info" @click="goLogin">
        <image
          class="user-avatar"
          :src="userInfo.avatarUrl || '/static/images/logo.png'"
          mode="aspectFill"
        />
        <view class="user-detail">
          <view class="user-name">{{ userInfo.nickName || '点击登录' }}</view>
          <view class="user-desc">{{ userInfo.phone || '登录后享受更多服务' }}</view>
        </view>
        <u-icon name="arrow-right" color="#fff" size="32rpx" />
      </view>
    </view>

    <!-- 订单快捷入口 -->
    <view class="order-quick">
      <view
        v-for="item in orderMenus"
        :key="item.status"
        class="order-item"
        @click="goOrderList(item.status)"
      >
        <u-icon :name="item.icon" size="48rpx" color="#E63946" />
        <text class="order-label">{{ item.label }}</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <view class="menu-group">
        <view class="menu-group-title">我的发布</view>
        <view class="menu-item" @click="goPage('/pages/job/my')">
          <u-icon name="briefcase" size="40rpx" color="#666" />
          <text class="menu-text">我的职位</text>
          <u-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
        <view class="menu-item" @click="goPage('/pages/service/my')">
          <u-icon name="grid" size="40rpx" color="#666" />
          <text class="menu-text">我的服务</text>
          <u-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
        <view class="menu-item" @click="goPage('/pages/appointment/my')">
          <u-icon name="heart" size="40rpx" color="#666" />
          <text class="menu-text">我的预约</text>
          <u-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-group-title">会员服务</view>
        <view class="menu-item" @click="goPage('/pages/membership/index')">
          <u-icon name="star-fill" size="40rpx" color="#FFD700" />
          <text class="menu-text">会员中心</text>
          <view class="member-tag">白银会员</view>
          <u-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
        <view class="menu-item" @click="goPage('/pages/membership/orders')">
          <u-icon name="order" size="40rpx" color="#2196F3" />
          <text class="menu-text">我的订单</text>
          <u-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
        <view class="menu-item" @click="goPage('/pages/membership/points')">
          <u-icon name="red-packet" size="40rpx" color="#E63946" />
          <text class="menu-text">我的积分</text>
          <text class="points-num">580</text>
          <u-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-group-title">常用功能</view>
        <view class="menu-item" @click="goPageFree('/pages/user/collect')">
          <u-icon name="heart-fill" size="40rpx" color="#E63946" />
          <text class="menu-text">我的收藏</text>
          <u-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
        <view class="menu-item" @click="goPageFree('/pages/user/resume')">
          <u-icon name="file-text" size="40rpx" color="#4CAF50" />
          <text class="menu-text">我的简历</text>
          <u-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
        <view class="menu-item" @click="goPage('/pages/user/coupon')">
          <u-icon name="ticket" size="40rpx" color="#FF9800" />
          <text class="menu-text">优惠券</text>
          <u-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
        <view class="menu-item" @click="goPage('/pages/user/message')">
          <u-icon name="chat" size="40rpx" color="#2196F3" />
          <text class="menu-text">消息通知</text>
          <view class="badge" v-if="hasUnread">1</view>
          <u-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
        <view class="menu-item" @click="goCustomerService">
          <u-icon name="phone" size="40rpx" color="#9C27B0" />
          <text class="menu-text">联系客服</text>
          <u-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-group-title">其他</view>
        <view class="menu-item" @click="goPage('/pages/user/settings')">
          <u-icon name="setting" size="40rpx" color="#999" />
          <text class="menu-text">设置</text>
          <u-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
        <view class="menu-item" @click="goPageFree('/pages/user/about')">
          <u-icon name="info" size="40rpx" color="#999" />
          <text class="menu-text">关于我们</text>
          <u-icon name="arrow-right" size="32rpx" color="#999" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 计算属性
const userInfo = computed(() => userStore.userInfo || {})
const hasUnread = ref(false)

// 订单菜单
const orderMenus = ref([
  { status: 'pending', label: '待付款', icon: 'hourglass' },
  { status: 'paid', label: '待服务', icon: 'clock' },
  { status: 'done', label: '已完成', icon: 'checkmark-circle' },
  { status: 'all', label: '全部订单', icon: 'file-text' }
])

// 方法
const goLogin = () => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' })
  }
}

const goOrderList = (status) => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' })
    return
  }
  uni.navigateTo({ url: `/pages/appointment/my?status=${status}` })
}

// 需要登录才能访问的页面
const goPage = (url) => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({ url: '/pages/auth/login' })
    return
  }
  uni.navigateTo({ url })
}

// 无需登录直接跳转（我的收藏、我的简历、关于我们等）
const goPageFree = (url) => {
  uni.navigateTo({ url })
}

// 联系客服
const goCustomerService = () => {
  uni.showModal({
    title: '联系客服',
    content: '冠帮帮客服热线：400-888-8888\n工作时间：9:00-18:00\n\n您也可以通过以下方式联系我们：',
    confirmText: '拨打热线',
    cancelText: '知道了',
    success: (res) => {
      if (res.confirm) {
        uni.makePhoneCall({
          phoneNumber: '4008888888'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.user-page {
  min-height: 100vh;
  background: #F5F5F5;
}

.user-header {
  background: linear-gradient(135deg, #E63946 0%, #C1121F 100%);
  padding: 60rpx 30rpx 40rpx;

  .user-info {
    display: flex;
    align-items: center;
    gap: 24rpx;

    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
      background: #eee;
    }

    .user-detail {
      flex: 1;

      .user-name {
        font-size: 36rpx;
        font-weight: 500;
        color: #fff;
        margin-bottom: 8rpx;
      }

      .user-desc {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.order-quick {
  display: flex;
  background: #fff;
  padding: 30rpx 0;
  margin: -20rpx 30rpx 0;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);

  .order-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;

    .order-label {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.menu-list {
  padding: 30rpx;

  .menu-group {
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;

    .menu-group-title {
      padding: 24rpx 30rpx 16rpx;
      font-size: 26rpx;
      color: #999;
      background: #fff;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 28rpx 30rpx;
      border-top: 1rpx solid #f5f5f5;
      gap: 20rpx;

      .menu-text {
        flex: 1;
        font-size: 30rpx;
        color: #333;
      }

      .badge {
        min-width: 36rpx;
        height: 36rpx;
        background: #E63946;
        color: #fff;
        font-size: 22rpx;
        border-radius: 18rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10rpx;
        margin-right: 10rpx;
      }

      .member-tag {
        background: linear-gradient(135deg, #c0c0c0, #808080);
        color: #fff;
        font-size: 20rpx;
        padding: 4rpx 12rpx;
        border-radius: 16rpx;
        margin-right: 10rpx;
      }

      .points-num {
        color: #E63946;
        font-size: 28rpx;
        margin-right: 10rpx;
      }
    }
  }
}
</style>
