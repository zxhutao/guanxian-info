<template>
  <view class="detail-page">
    <view class="header">
      <view class="title">{{ job.title }}</view>
      <view class="salary">{{ job.salary }}</view>
    </view>

    <view class="section">
      <view class="section-title">职位信息</view>
      <view class="info-row">
        <text class="label">工作地点</text>
        <text class="value">{{ job.location }}</text>
      </view>
      <!-- 位置导航卡片 -->
      <view v-if="job.latitude && job.longitude" class="location-card" @click="openLocation">
        <view class="location-info">
          <text class="location-icon">📍</text>
          <text class="location-text">{{ job.location }}</text>
        </view>
        <view class="map-btn">
          <text>查看地图</text>
          <text class="arrow">›</text>
        </view>
      </view>
      <view class="info-row">
        <text class="label">工作经验</text>
        <text class="value">{{ job.experience }}</text>
      </view>
      <view class="info-row">
        <text class="label">学历要求</text>
        <text class="value">{{ job.education }}</text>
      </view>
      <view class="info-row">
        <text class="label">招聘人数</text>
        <text class="value">{{ job.count }}人</text>
      </view>
    </view>

    <view class="section">
      <view class="section-title">职位描述</view>
      <view class="description">{{ job.description }}</view>
    </view>

    <view class="section">
      <view class="section-title">企业信息</view>
      <view class="company-info">
        <view class="company-name">{{ job.company }}</view>
        <view class="company-desc">{{ job.companyDesc }}</view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">联系方式</view>
      <view class="contact-info">
        <view class="contact-row">
          <text>联系人：{{ job.contact }}</text>
        </view>
        <view class="contact-row">
          <text>电话：{{ job.phone }}</text>
        </view>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="action-btn favorite" :class="{ active: isCollected }" @click="handleFavorite">
        <text>{{ isCollected ? '❤️' : '🤍' }}</text>
        <text>{{ isCollected ? '已收藏' : '收藏' }}</text>
      </view>
      <view class="action-btn share" @click="handleShare">
        <text>📤</text>
        <text>分享</text>
      </view>
      <view class="chat-btn" @click="handleChat">咨询</view>
      <view class="apply-btn" @click="handleApply">立即报名</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShareAppMessage, onShareTimeline, onLoad } from '@dcloudio/uni-app'

const jobId = ref('')
const isCollected = ref(false)

const job = ref({
  title: '普工/操作工',
  salary: '5000-8000元/月',
  location: '冠县工业园区',
  latitude: '36.48',  // 示例纬度
  longitude: '115.56', // 示例经度
  experience: '不限',
  education: '不限',
  count: 10,
  description: '岗位职责：\n1. 按照生产计划完成生产任务\n2. 负责生产设备的日常维护保养\n3. 遵守公司规章制度，安全生产\n\n任职要求：\n1. 年龄18-50周岁\n2. 身体健康，能吃苦耐劳\n3. 有工厂工作经验优先',
  company: '冠县XX玻璃厂',
  companyDesc: '冠县知名玻璃制品企业，年产值过亿元',
  contact: '张经理',
  phone: '138****8888'
})

// 打开地图导航
const openLocation = () => {
  if (!job.value.latitude || !job.value.longitude) {
    uni.showToast({ title: '位置信息有误', icon: 'none' })
    return
  }
  uni.openLocation({
    name: job.value.location,
    address: job.value.location,
    latitude: parseFloat(job.value.latitude),
    longitude: parseFloat(job.value.longitude),
    success: () => {
      console.log('打开地图成功')
    },
    fail: (err) => {
      console.error('打开地图失败', err)
      uni.showToast({ title: '打开地图失败', icon: 'none' })
    }
  })
}

// 获取收藏状态
const loadCollectStatus = () => {
  try {
    const collectList = uni.getStorageSync('collect_job') || []
    isCollected.value = collectList.some(item => item.id === jobId.value)
  } catch (e) {
    console.error('读取收藏状态失败', e)
  }
}

// 处理收藏
const handleFavorite = () => {
  try {
    let collectList = uni.getStorageSync('collect_job') || []
    
    if (isCollected.value) {
      // 已收藏，取消收藏
      collectList = collectList.filter(item => item.id !== jobId.value)
      isCollected.value = false
      uni.showToast({ title: '已取消收藏', icon: 'success' })
    } else {
      // 未收藏，添加收藏
      const jobItem = {
        id: jobId.value,
        title: job.value.title,
        salary: job.value.salary,
        company: job.value.company,
        tags: ['热招', '急招'],
        collected: true
      }
      collectList.push(jobItem)
      isCollected.value = true
      uni.showToast({ title: '收藏成功', icon: 'success' })
    }
    
    uni.setStorageSync('collect_job', collectList)
  } catch (e) {
    console.error('收藏操作失败', e)
    uni.showToast({ title: '操作失败，请重试', icon: 'error' })
  }
}

onLoad((options) => {
  jobId.value = options.id || 'job_' + Date.now()
  loadCollectStatus()
})

const handleShare = () => {
  enableShareMenu()
}

const enableShareMenu = () => {
  // #ifdef MP-WEIXIN
  uni.showShareMenu({ withShareTicket: true }).catch(() => {
    // 分享菜单已禁用或出错，静默处理
  })
  // #endif
}

// 分享给好友
onShareAppMessage(() => {
  return {
    title: `${job.value.title} | ${job.value.salary} - 冠帮帮招聘`,
    path: '/pages/job/detail',
    imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg'
  }
})

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: `${job.value.title} | ${job.value.salary} - 冠帮帮招聘`,
    query: '',
    imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg'
  }
})

const handleApply = () => {
  uni.showModal({
    title: '确认报名',
    content: '确定要报名该职位吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '报名成功', icon: 'success' })
      }
    }
  })
}

// 联系企业/咨询
const handleChat = () => {
  // 构建会话ID（格式：conv_用户openid_企业id）
  const userInfo = uni.getStorageSync('userInfo') || {}
  const userId = userInfo.openId || 'guest_' + Date.now()
  const companyId = job.value.company || 'company_default'
  const conversationId = `conv_${userId}_${companyId}`
  
  // 跳转到聊天页面
  uni.navigateTo({
    url: `/pages/chat/index?conversationId=${conversationId}&name=${encodeURIComponent(job.value.company)}&avatar=${encodeURIComponent('https://img.yzcdn.cn/vant/cat.jpeg')}&toId=${companyId}`
  })
}
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

.header {
  background: #fff;
  padding: 40rpx 30rpx;

  .title {
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  .salary {
    font-size: 48rpx;
    color: #E63946;
    font-weight: bold;
  }
}

.section {
  background: #fff;
  margin-top: 20rpx;
  padding: 30rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 24rpx;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 16rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    .label {
      color: #999;
    }

    .value {
      color: #333;
      font-weight: 500;
    }
  }
  
  // 位置导航卡片
  .location-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    margin: 16rpx 0;
    background: #f0f9ff;
    border-radius: 12rpx;
    border: 1rpx solid #91d5ff;

    .location-info {
      display: flex;
      align-items: center;
      flex: 1;

      .location-icon {
        font-size: 32rpx;
        margin-right: 12rpx;
      }

      .location-text {
        font-size: 26rpx;
        color: #333;
      }
    }

    .map-btn {
      display: flex;
      align-items: center;
      color: #1890ff;
      font-size: 26rpx;

      .arrow {
        font-size: 32rpx;
        margin-left: 4rpx;
      }
    }
  }

  .description {
    line-height: 1.8;
    color: #666;
    white-space: pre-wrap;
  }

  .company-info {
    .company-name {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .company-desc {
      color: #999;
      font-size: 26rpx;
    }
  }

  .contact-info {
    .contact-row {
      padding: 12rpx 0;
      color: #333;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  gap: 20rpx;

  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 22rpx;
    color: #666;
    gap: 8rpx;
    transition: all 0.3s;
    
    &.active {
      color: #E63946;
      font-weight: bold;
    }
  }

  .chat-btn {
    flex: 1;
    background: #2196F3;
    color: #fff;
    text-align: center;
    padding: 24rpx;
    border-radius: 50rpx;
    font-size: 32rpx;
  }

  .apply-btn {
    flex: 0.8;
    background: #E63946;
    color: #fff;
    text-align: center;
    padding: 24rpx;
    border-radius: 50rpx;
    font-size: 32rpx;
  }
}
</style>
