<template>
  <view class="detail-page">
    <!-- 顶部图片 -->
    <view class="header-image">
      <image lazy-load :src="serviceInfo.image" mode="aspectFill" />
      <view class="header-overlay">
        <text class="service-type">{{ categoryName }}</text>
      </view>
    </view>

    <!-- 服务商信息 -->
    <view class="provider-card">
      <view class="provider-header">
        <image lazy-load :src="serviceInfo.avatar" mode="aspectFill" class="provider-avatar" />
        <view class="provider-info">
          <view class="provider-name-row">
            <text class="provider-name">{{ serviceInfo.name }}</text>
            <view class="verified-tag" v-if="serviceInfo.isVerified">已认证</view>
          </view>
          <view class="provider-rating">
            <text class="stars">★★★★★</text>
            <text class="score">{{ serviceInfo.rating }}</text>
            <text class="orders">{{ serviceInfo.orderCount }}次服务</text>
          </view>
        </view>
        <view class="contact-btn" @click="handleChat">
          <text>咨询</text>
        </view>
      </view>
    </view>

    <!-- 服务项目 -->
    <view class="section">
      <view class="section-title">
        <text>服务项目</text>
      </view>
      <view class="service-items">
        <view 
          v-for="(item, index) in serviceInfo.items" 
          :key="index"
          class="service-item"
          :class="{ active: selectedItem === index }"
          @click="selectedItem = index"
        >
          <text class="item-name">{{ item.name }}</text>
          <text class="item-price">{{ item.price }}</text>
        </view>
      </view>
    </view>

    <!-- 服务介绍 -->
    <view class="section">
      <view class="section-title">
        <text>服务介绍</text>
      </view>
      <view class="intro-content">
        <text>{{ serviceInfo.description }}</text>
      </view>
    </view>

    <!-- 服务地址 -->
    <view v-if="serviceInfo.latitude && serviceInfo.longitude" class="section">
      <view class="section-title">
        <text>服务地址</text>
      </view>
      <view class="location-card" @click="openLocation">
        <view class="location-info">
          <text class="location-icon">📍</text>
          <text class="location-text">{{ serviceInfo.address || serviceInfo.location }}</text>
        </view>
        <view class="map-btn">
          <text>查看地图</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 用户评价 -->
    <view class="section">
      <view class="section-title">
        <text>用户评价</text>
        <text class="more-link">查看全部</text>
      </view>
      <view class="reviews">
        <view v-for="(review, index) in serviceInfo.reviews" :key="index" class="review-item">
          <view class="review-header">
            <image lazy-load :src="review.avatar" class="review-avatar" />
            <view class="review-info">
              <text class="review-name">{{ review.name }}</text>
              <text class="review-stars">★★★★★</text>
            </view>
            <text class="review-date">{{ review.date }}</text>
          </view>
          <text class="review-content">{{ review.content }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-icons">
        <view class="action-icon" @click="toggleFavorite">
          <view class="icon-circle" :class="{ active: isFavorite }">
            <text v-if="isFavorite">★</text>
            <text v-else>☆</text>
          </view>
          <text class="icon-text">{{ isFavorite ? '已收藏' : '收藏' }}</text>
        </view>
        <view class="action-icon" @click="shareService">
          <view class="icon-circle">
            <text>↗</text>
          </view>
          <text class="icon-text">分享</text>
        </view>
      </view>
      <view class="action-btns">
        <view class="review-btn" @click="goToReview">
          <text>写评价</text>
        </view>
        <view class="book-btn" @click="bookService">
          <text>立即预约</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

const category = ref('')
const serviceId = ref('')
const selectedItem = ref(0)
const isFavorite = ref(false)

// 收藏存储键名
const getFavoriteKey = () => `favorite_service_${serviceId.value || category.value}`

onLoad((options) => {
  category.value = options.category || 'housekeeping'
  serviceId.value = options.id || ''
  loadServiceInfo()
  loadFavoriteStatus()
})

// 加载收藏状态
const loadFavoriteStatus = () => {
  try {
    const favorites = uni.getStorageSync('service_favorites') || {}
    isFavorite.value = !!favorites[getFavoriteKey()]
  } catch (e) {
    isFavorite.value = false
  }
}

// 切换收藏
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  
  try {
    const favorites = uni.getStorageSync('service_favorites') || {}
    favorites[getFavoriteKey()] = isFavorite.value
    uni.setStorageSync('service_favorites', favorites)
  } catch (e) {
    console.error('收藏存储失败', e)
  }
  
  uni.showToast({
    title: isFavorite.value ? '已收藏' : '已取消收藏',
    icon: 'none',
    duration: 1500
  })
}

// 分享功能 - 点击直接触发微信分享菜单
const shareService = () => {
  // 微信小程序会自动调用 onShareAppMessage 和 onShareTimeline
  // 这里返回 false 阻止默认行为，让小程序显示分享菜单
  return
}

const categoryName = computed(() => {
  const names = {
    'housekeeping': '家政保洁',
    'appliance': '家电维修',
    'locksmith': '开锁疏通',
    'moving': '搬家货运',
    'food': '餐饮外卖',
    'photo': '婚庆摄影',
    'renovation': '装修建材',
    'car': '汽车服务'
  }
  return names[category.value] || '生活服务'
})

// 模拟服务商数据
const serviceInfo = ref({
  name: '冠县服务商',
  avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
  image: 'https://img.yzcdn.cn/vant/cat.jpeg',
  rating: 4.8,
  orderCount: 856,
  isVerified: true,
  description: '专业服务商，提供优质的生活服务...',
  location: '冠县城区',
  address: '山东省聊城市冠县',
  latitude: '36.48',
  longitude: '115.56',
  items: [],
  reviews: []
})

// 打开地图导航
const openLocation = () => {
  if (!serviceInfo.value.latitude || !serviceInfo.value.longitude) {
    uni.showToast({ title: '位置信息有误', icon: 'none' })
    return
  }
  uni.openLocation({
    name: serviceInfo.value.name,
    address: serviceInfo.value.address || serviceInfo.value.location,
    latitude: parseFloat(serviceInfo.value.latitude),
    longitude: parseFloat(serviceInfo.value.longitude),
    success: () => {
      console.log('打开地图成功')
    },
    fail: (err) => {
      console.error('打开地图失败', err)
      uni.showToast({ title: '打开地图失败', icon: 'none' })
    }
  })
}

const loadServiceInfo = () => {
  const dataMap = {
    'housekeeping': {
      name: '冠县保洁公司',
      description: '我们是一家专业的家政保洁公司，拥有多年从业经验的服务人员团队。提供日常保洁、深度清洁、新房开荒、家电清洗等多种服务。服务覆盖冠县城区及周边乡镇，深受广大客户信赖。\n\n【服务优势】\n• 严格筛选每位服务人员\n• 使用环保清洁用品\n• 服务不满意可免费返工\n• 购买家政险，安全有保障',
      items: [
        { name: '日常保洁', price: '50元/小时起' },
        { name: '深度清洁', price: '200元/次起' },
        { name: '新房开荒', price: '300元/次起' },
        { name: '家电清洗', price: '80元/台起' },
        { name: '收纳整理', price: '150元/次起' }
      ],
      reviews: [
        { name: '王女士', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '服务非常认真仔细，清洁得很干净，下次还找这家！', date: '2026-03-15' },
        { name: '李先生', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '师傅很专业，工具齐全，价格合理，推荐！', date: '2026-03-10' }
      ]
    },
    'appliance': {
      name: '冠县家电维修中心',
      description: '专业家电维修十年，服务千万家庭。擅长空调、冰箱、洗衣机、电视机、热水器等各类家电的维修与安装。提供24小时上门服务，修好再付款。\n\n【服务优势】\n• 原厂配件，品质保障\n• 统一报价，透明消费\n• 保修三个月，售后无忧\n• 快速响应，最快30分钟上门',
      items: [
        { name: '空调维修', price: '50元/次起' },
        { name: '空调安装', price: '100元/台起' },
        { name: '冰箱维修', price: '60元/次起' },
        { name: '洗衣机维修', price: '50元/次起' },
        { name: '水电维修', price: '40元/次起' }
      ],
      reviews: [
        { name: '张先生', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '空调不制冷的问题解决了，师傅技术很好！', date: '2026-03-18' },
        { name: '刘女士', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '非常及时，半小时就到了，收费也很合理。', date: '2026-03-12' }
      ]
    },
    'locksmith': {
      name: '冠县开锁服务中心',
      description: '24小时专业开锁服务，公安备案，安全可靠。提供开锁、换锁芯、配钥匙、管道疏通等服务。全程录音录像，保护您的财产安全。\n\n【服务优势】\n• 24小时全年无休\n• 公安系统备案认证\n• 全程录音录像\n• 价格透明，拒绝乱收费',
      items: [
        { name: '普通开锁', price: '80元/次起' },
        { name: '防盗门开锁', price: '100元/次起' },
        { name: '换锁芯', price: '150元/个起' },
        { name: '配钥匙', price: '10元/把起' },
        { name: '管道疏通', price: '60元/次起' }
      ],
      reviews: [
        { name: '赵先生', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '忘带钥匙了，师傅来得很快，开锁技术专业！', date: '2026-03-20' },
        { name: '孙女士', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '下水道堵了，疏通得很干净，很满意！', date: '2026-03-16' }
      ]
    },
    'moving': {
      name: '冠县搬家公司',
      description: '专业搬家团队，为您提供居民搬家、公司搬迁、长途货运等服务。配备专业搬家车辆和搬运工具，师傅们经验丰富，确保您的物品安全无损。\n\n【服务优势】\n• 免费上门评估报价\n• 专业打包材料\n• 全程搬运，无需动手\n• 损坏物品照价赔偿',
      items: [
        { name: '小型搬家', price: '200元/次起' },
        { name: '中型搬家', price: '350元/次起' },
        { name: '大型搬家', price: '500元/次起' },
        { name: '钢琴搬运', price: '200元/次起' },
        { name: '货运服务', price: '80元/次起' }
      ],
      reviews: [
        { name: '周先生', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '搬家过程很顺利，师傅们很细心，大件都保护得很好！', date: '2026-03-19' },
        { name: '吴女士', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '价格实惠，没有额外收费，非常满意！', date: '2026-03-14' }
      ]
    },
    'food': {
      name: '冠县家常菜馆',
      description: '正宗冠县地方特色菜，家常味道，实惠价格。支持外卖配送，承接团体订餐、生日宴席等。食材新鲜，当日采购，保证品质。\n\n【服务优势】\n• 当日食材，新鲜保障\n• 满50元免费配送\n• 承接团体订餐\n• 生日寿宴优惠多多',
      items: [
        { name: '单点菜品', price: '15元/份起' },
        { name: '套餐A', price: '88元/套' },
        { name: '套餐B', price: '128元/套' },
        { name: '团体订餐', price: '面议' },
        { name: '生日宴席', price: '388元/桌起' }
      ],
      reviews: [
        { name: '陈先生', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '味道很正宗，就是小时候妈妈做的味道！', date: '2026-03-21' },
        { name: '林女士', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '外卖送到还是热的，包装很好，推荐！', date: '2026-03-17' }
      ]
    },
    'photo': {
      name: '定格影像工作室',
      description: '专业摄影团队，提供婚纱摄影、孕妇照、宝宝照、个人写真、商业拍摄等服务。拥有专业影棚和资深摄影师，为您定格美好瞬间。\n\n【服务优势】\n• 资深摄影师团队\n• 多种风格可选\n• 底片全送\n• 精修照片赠送',
      items: [
        { name: '个人写真', price: '299元/套起' },
        { name: '孕妇照', price: '399元/套起' },
        { name: '宝宝照', price: '299元/套起' },
        { name: '婚纱摄影', price: '1999元/套起' },
        { name: '商业拍摄', price: '500元/次起' }
      ],
      reviews: [
        { name: '杨女士', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '拍出来的照片太好看了，摄影师很会引导，推荐！', date: '2026-03-18' },
        { name: '黄先生', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '婚纱照拍得很满意，化妆师也很专业！', date: '2026-03-12' }
      ]
    },
    'renovation': {
      name: '冠县装饰公司',
      description: '专业室内装修团队，提供新房装修、旧房翻新、局部改造、全屋定制等服务。拥有资深设计师团队和经验丰富的施工队伍。\n\n【服务优势】\n• 免费上门量房设计\n• 透明预算清单\n• 环保材料保障\n• 整体质保两年',
      items: [
        { name: '设计方案', price: '免费咨询' },
        { name: '基础装修', price: '300元/平起' },
        { name: '全包装修', price: '600元/平起' },
        { name: '旧房翻新', price: '400元/平起' },
        { name: '全屋定制', price: '面议' }
      ],
      reviews: [
        { name: '郑先生', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '设计师很有想法，装修效果超出预期！', date: '2026-03-15' },
        { name: '钱女士', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '整体很满意，工人师傅很负责，细节处理到位。', date: '2026-03-08' }
      ]
    },
    'car': {
      name: '冠县汽车服务中心',
      description: '专业汽车服务平台，提供汽车保养、维修、洗车、美容、保险理赔等一站式服务。技师持证上岗，配件品质保障。\n\n【服务优势】\n• 4S店品质服务\n• 价格更实惠\n• 原厂配件供应\n• 24小时救援服务',
      items: [
        { name: '普通洗车', price: '30元/次' },
        { name: '精洗打蜡', price: '100元/次' },
        { name: '小保养', price: '200元/次起' },
        { name: '大保养', price: '500元/次起' },
        { name: '补胎换胎', price: '50元/次起' }
      ],
      reviews: [
        { name: '冯先生', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '保养很专业，价格比4S店便宜很多！', date: '2026-03-20' },
        { name: '何女士', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg', content: '洗车洗得很干净，服务态度也很好。', date: '2026-03-16' }
      ]
    }
  }

  serviceInfo.value = {
    ...serviceInfo.value,
    ...(dataMap[category.value] || dataMap['housekeeping'])
  }
}

// 联系服务商/咨询
const handleChat = () => {
  // 构建会话ID
  const userInfo = uni.getStorageSync('userInfo') || {}
  const userId = userInfo.openId || 'guest_' + Date.now()
  const providerId = serviceInfo.value.name || 'provider_default'
  const conversationId = `conv_${userId}_${providerId}`
  
  // 跳转到聊天页面
  uni.navigateTo({
    url: `/pages/chat/index?conversationId=${conversationId}&name=${encodeURIComponent(serviceInfo.value.name)}&avatar=${encodeURIComponent(serviceInfo.value.avatar)}&toId=${providerId}`
  })
}

// 拨打电话
const contactProvider = () => {
  uni.makePhoneCall({
    phoneNumber: '400-888-8888',
    fail: () => {
      uni.showToast({ title: '拨打失败', icon: 'none' })
    }
  })
}

const goToReview = () => {
  uni.navigateTo({ url: '/pages/review/submit?type=service&id=' + (serviceId.value || category.value) })
}

const bookService = () => {
  uni.showModal({
    title: '预约服务',
    content: `您选择的服务：${serviceInfo.value.items[selectedItem.value]?.name || '标准服务'}`,
    confirmText: '确认预约',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '预约成功！', icon: 'success' })
      }
    }
  })
}

// 分享给好友
onShareAppMessage(() => {
  return {
    title: `${serviceInfo.value.name} - ${categoryName.value}`,
    path: `/pages/service/detail?id=${serviceId.value}&category=${category.value}`,
    imageUrl: serviceInfo.value.avatar
  }
})

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: `${serviceInfo.value.name} - 冠县${categoryName.value}服务`,
    query: `id=${serviceId.value}&category=${category.value}`
  }
})
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

.header-image {
  position: relative;
  height: 400rpx;
  
  image {
    width: 100%;
    height: 100%;
  }
  
  .header-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx 30rpx;
    background: linear-gradient(transparent, rgba(0,0,0,0.6));
    
    .service-type {
      color: #fff;
      font-size: 28rpx;
    }
  }
}

.provider-card {
  margin: -60rpx 30rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
  
  .provider-header {
    display: flex;
    align-items: center;
    
    .provider-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }
    
    .provider-info {
      flex: 1;
      
      .provider-name-row {
        display: flex;
        align-items: center;
        gap: 10rpx;
        margin-bottom: 8rpx;
        
        .provider-name {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
        }
        
        .verified-tag {
          background: #E63946;
          color: #fff;
          font-size: 18rpx;
          padding: 4rpx 10rpx;
          border-radius: 8rpx;
        }
      }
      
      .provider-rating {
        display: flex;
        align-items: center;
        gap: 8rpx;
        
        .stars {
          color: #FFD700;
          font-size: 22rpx;
        }
        
        .score {
          color: #E63946;
          font-size: 24rpx;
          font-weight: 600;
        }
        
        .orders {
          color: #999;
          font-size: 22rpx;
        }
      }
    }
    
    .contact-btn {
      background: linear-gradient(135deg, #E63946, #FF6B6B);
      color: #fff;
      padding: 16rpx 30rpx;
      border-radius: 30rpx;
      font-size: 26rpx;
    }
  }
}

.section {
  background: #fff;
  margin: 0 30rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  
  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    text {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
    }
    
    .more-link {
      font-size: 24rpx;
      color: #E63946;
    }
  }
}

.service-items {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  
  .service-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx;
    background: #f8f8f8;
    border-radius: 12rpx;
    border: 2rpx solid transparent;
    
    &.active {
      background: #FFF5F5;
      border-color: #E63946;
    }
    
    .item-name {
      font-size: 28rpx;
      color: #333;
    }
    
    .item-price {
      font-size: 28rpx;
      color: #E63946;
      font-weight: 600;
    }
  }
}

.intro-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
  white-space: pre-line;
}

// 服务地址卡片
.location-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background: #f0f9ff;
  border-radius: 12rpx;
  border: 1rpx solid #91d5ff;

  .location-info {
    display: flex;
    align-items: center;
    flex: 1;

    .location-icon {
      font-size: 36rpx;
      margin-right: 16rpx;
    }

    .location-text {
      font-size: 28rpx;
      color: #333;
    }
  }

  .map-btn {
    display: flex;
    align-items: center;
    color: #1890ff;
    font-size: 28rpx;

    .arrow {
      font-size: 36rpx;
      margin-left: 4rpx;
    }
  }
}

.reviews {
  .review-item {
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    .review-header {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;
      
      .review-avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        margin-right: 16rpx;
      }
      
      .review-info {
        flex: 1;
        
        .review-name {
          font-size: 26rpx;
          color: #333;
          margin-right: 10rpx;
        }
        
        .review-stars {
          color: #FFD700;
          font-size: 20rpx;
        }
      }
      
      .review-date {
        font-size: 22rpx;
        color: #999;
      }
    }
    
    .review-content {
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.08);
  
  .action-icons {
    display: flex;
    gap: 40rpx;
    
    .action-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6rpx;
      padding: 10rpx 16rpx;
      
      .icon-circle {
        width: 52rpx;
        height: 52rpx;
        background: #f5f5f5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        color: #666;
        
        &.active {
          background: #FFF0F0;
          color: #E63946;
        }
      }
      
      .icon-text {
        font-size: 20rpx;
        color: #666;
      }
    }
  }
  
  .action-btns {
    flex: 1;
    display: flex;
    gap: 16rpx;
    margin-left: 20rpx;
    
    .review-btn {
      flex: 1;
      background: #FFF5F5;
      color: #E63946;
      text-align: center;
      padding: 22rpx 0;
      border-radius: 40rpx;
      font-size: 28rpx;
      font-weight: 600;
      border: 2rpx solid #E63946;
    }
    
    .book-btn {
      flex: 1.2;
      background: linear-gradient(135deg, #E63946, #FF6B6B);
      color: #fff;
      text-align: center;
      padding: 24rpx 0;
      border-radius: 40rpx;
      font-size: 28rpx;
      font-weight: 600;
    }
  }
}
</style>
