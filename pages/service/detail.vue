<template>
  <view class="service-detail-page">
    <!-- 服务头部 -->
    <view class="service-header">
      <view class="service-icon-box" :style="{ background: service.bgColor }">
        <text class="service-icon">{{ service.icon }}</text>
      </view>
      <view class="service-info">
        <view class="service-name">{{ service.name }}</view>
        <view class="service-desc">{{ service.description }}</view>
      </view>
      <view class="service-price">{{ service.price }}</view>
    </view>

    <!-- 服务项目 -->
    <view class="section-card">
      <view class="section-title">服务项目</view>
      <view class="service-items">
        <view v-for="(item, index) in service.items" :key="index" class="service-item">
          <view class="item-left">
            <view class="item-name">{{ item.name }}</view>
            <view class="item-desc">{{ item.desc }}</view>
          </view>
          <view class="item-price">{{ item.price }}</view>
        </view>
      </view>
    </view>

    <!-- 服务说明 -->
    <view class="section-card">
      <view class="section-title">服务说明</view>
      <view class="service-notes">
        <view v-for="(note, index) in service.notes" :key="index" class="note-item">
          <u-icon name="checkmark-circle" size="26rpx" color="#4CAF50" />
          <text>{{ note }}</text>
        </view>
      </view>
    </view>

    <!-- 服务保障 -->
    <view class="section-card">
      <view class="section-title">服务保障</view>
      <view class="guarantee-list">
        <view class="guarantee-item">
          <u-icon name="shield-checkmark" size="40rpx" color="#E63946" />
          <text class="guarantee-title">服务保障</text>
          <text class="guarantee-desc">不满意可申请退款</text>
        </view>
        <view class="guarantee-item">
          <u-icon name="clock" size="40rpx" color="#2196F3" />
          <text class="guarantee-title">准时上门</text>
          <text class="guarantee-desc">预约时间准时到达</text>
        </view>
        <view class="guarantee-item">
          <u-icon name="medal" size="40rpx" color="#FF9800" />
          <text class="guarantee-title">专业技师</text>
          <text class="guarantee-desc">持证上岗，培训考核</text>
        </view>
      </view>
    </view>

    <!-- 用户评价 -->
    <view class="section-card">
      <view class="section-title">用户评价</view>
      <view class="review-list">
        <view v-for="review in reviews" :key="review.id" class="review-item">
          <view class="review-header">
            <view class="reviewer-info">
              <view class="reviewer-avatar">{{ review.name.charAt(0) }}</view>
              <view class="reviewer-name">{{ review.name }}</view>
            </view>
            <view class="review-rating">
              <u-icon name="star-fill" color="#FFB800" size="20rpx" />
              <text>{{ review.rating }}</text>
            </view>
          </view>
          <view class="review-content">{{ review.content }}</view>
          <view class="review-time">{{ review.time }}</view>
        </view>
      </view>
    </view>

    <view style="height: 140rpx;" />

    <!-- 底部操作 -->
    <view class="bottom-bar">
      <view class="bottom-left">
        <view class="action-item" @click="callService">
          <u-icon name="phone" size="36rpx" color="#E63946" />
          <text>电话</text>
        </view>
        <view class="action-item" @click="handleShare">
          <u-icon name="share" size="36rpx" color="#4CAF50" />
          <text>分享</text>
        </view>
      </view>
      <u-button type="primary" size="large" @click="bookService" class="book-btn">
        立即预约
      </u-button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { makePhoneCall, showConfirm } from '@/utils/index'

const serviceId = ref('')
const service = ref({
  name: '',
  icon: '',
  bgColor: '#f5f5f5',
  description: '',
  price: '',
  items: [],
  notes: [],
  phone: ''
})
const reviews = ref([])

const serviceData = {
  1: {
    name: '家政保洁',
    icon: '🧹',
    bgColor: '#FFF0F0',
    description: '专业家政团队，提供日常保洁、深度清洁、开荒保洁等服务',
    price: '¥99起',
    items: [
      { name: '日常保洁', desc: '2小时标准清洁', price: '¥99' },
      { name: '深度清洁', desc: '4小时全屋深度', price: '¥199' },
      { name: '开荒保洁', desc: '新房装修后清洁', price: '¥299起' },
      { name: '玻璃清洗', desc: '全屋玻璃清洁', price: '¥150' }
    ],
    notes: [
      '服务人员持健康证上岗',
      '自备清洁工具和环保清洁剂',
      '服务完成后可现场验收',
      '如有不满意可免费返工一次'
    ],
    phone: '0635-8888001'
  },
  2: {
    name: '家电维修',
    icon: '🔧',
    bgColor: '#E3F2FD',
    description: '空调、冰箱、洗衣机、油烟机等各类家电维修与清洗',
    price: '¥50起',
    items: [
      { name: '空调维修', desc: '不制冷/漏水/异响等', price: '¥80起' },
      { name: '空调清洗', desc: '挂机/柜机深度清洗', price: '¥100' },
      { name: '油烟机清洗', desc: '拆洗+深度去油', price: '¥120' },
      { name: '洗衣机清洗', desc: '滚筒/波轮内筒清洗', price: '¥80' }
    ],
    notes: [
      '维修师傅持证上岗，经验丰富',
      '维修配件均为正品，质保3个月',
      '上门检测免费，检测后报价',
      '维修不成功不收费'
    ],
    phone: '0635-8888002'
  },
  3: {
    name: '开锁疏通',
    icon: '🔑',
    bgColor: '#FFF3E0',
    description: '24小时开锁、换锁、管道疏通服务',
    price: '¥50起',
    items: [
      { name: '开锁', desc: '防盗门/保险柜/汽车锁', price: '¥50起' },
      { name: '换锁芯', desc: 'A级/B级/C级锁芯', price: '¥80起' },
      { name: '马桶疏通', desc: '专业疏通设备', price: '¥80' },
      { name: '管道疏通', desc: '厨房/卫生间管道', price: '¥100起' }
    ],
    notes: [
      '开锁需提供身份证/房产证等证件',
      '24小时上门服务',
      '疏通不成功不收费',
      '换锁芯质保1年'
    ],
    phone: '0635-8888003'
  },
  4: {
    name: '搬家货运',
    icon: '📦',
    bgColor: '#E8F5E9',
    description: '居民搬家、公司搬迁、长途搬家、家具拆装',
    price: '¥200起',
    items: [
      { name: '小型搬家', desc: '1居室/单间', price: '¥200' },
      { name: '中型搬家', desc: '2-3居室', price: '¥400' },
      { name: '大型搬家', desc: '4居室及以上', price: '¥600起' },
      { name: '家具拆装', desc: '床/衣柜/书桌等', price: '¥50/件' }
    ],
    notes: [
      '提供纸箱、胶带等打包材料',
      '搬运过程如有损坏照价赔偿',
      '可提前预约，准时到达',
      '提供搬家后清洁服务'
    ],
    phone: '0635-8888004'
  },
  5: {
    name: '餐饮外卖',
    icon: '🍜',
    bgColor: '#FCE4EC',
    description: '冠县本地餐饮外卖配送，美食送到家',
    price: '¥15起',
    items: [
      { name: '快餐简餐', desc: '30分钟送达', price: '¥15起' },
      { name: '烧烤夜宵', desc: '晚上18:00-02:00', price: '¥30起' },
      { name: '蛋糕甜品', desc: '提前2小时预定', price: '¥20起' },
      { name: '水果生鲜', desc: '新鲜直达', price: '¥25起' }
    ],
    notes: [
      '支持微信/支付宝支付',
      '3公里内免费配送',
      '食品安全有保障',
      '配送时间准时'
    ],
    phone: '0635-8888005'
  },
  6: {
    name: '婚庆摄影',
    icon: '🎥',
    bgColor: '#F3E5F5',
    description: '婚礼策划、婚纱摄影、跟拍、摄像一站式服务',
    price: '¥999起',
    items: [
      { name: '婚纱摄影', desc: '室内+外景套系', price: '¥999起' },
      { name: '婚礼跟拍', desc: '全天候跟拍', price: '¥2000' },
      { name: '婚礼摄像', desc: '专业摄像团队', price: '¥3000' },
      { name: '婚礼策划', desc: '一站式婚礼服务', price: '¥5000起' }
    ],
    notes: [
      '摄影师持证，经验丰富',
      '拍摄不满意可重拍',
      '精修照片不少于50张',
      '成片交付时间7个工作日'
    ],
    phone: '0635-8888006'
  }
}

const reviewData = [
  { id: 1, name: '赵*', rating: 5, content: '阿姨打扫得非常干净，比我自己收拾得还干净！下次还会预约。', time: '2026-03-18' },
  { id: 2, name: '孙*', rating: 5, content: '师傅很专业，很快就修好了，而且收费很合理。', time: '2026-03-15' },
  { id: 3, name: '周*', rating: 4, content: '服务不错，就是预约时间不太灵活，希望能增加更多时间段选择。', time: '2026-03-10' }
]

onLoad((options) => {
  serviceId.value = options.id || '1'
  const data = serviceData[serviceId.value] || serviceData[1]
  service.value = data
  reviews.value = reviewData

  // 启用分享功能
  try { uni.showShareMenu({ withShareTicket: true }) } catch (e) {}
})

// 分享给好友
onShareAppMessage(() => {
  return {
    title: `${service.value.name} - 冠帮帮生活服务`,
    path: `/pages/service/detail?id=${serviceId.value}`,
    imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg'
  }
})

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: `${service.value.name} - 冠帮帮生活服务`,
    query: `id=${serviceId.value}`,
    imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg'
  }
})

const handleShare = () => {
  try { uni.showShareMenu({ withShareTicket: true }) } catch (e) {}
}

const callService = () => {
  makePhoneCall(service.value.phone)
}

const bookService = async () => {
  const confirmed = await showConfirm('预约确认', `确定预约${service.value.name}吗？`)
  if (confirmed) {
    uni.showToast({ title: '预约成功，请等待电话确认', icon: 'success' })
  }
}
</script>

<style lang="scss" scoped>
.service-detail-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 30rpx;
}

.service-header {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .service-icon-box {
    width: 100rpx;
    height: 100rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;

    .service-icon {
      font-size: 48rpx;
    }
  }

  .service-info {
    margin-bottom: 16rpx;

    .service-name {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .service-desc {
      font-size: 26rpx;
      color: #999;
      line-height: 1.6;
    }
  }

  .service-price {
    font-size: 40rpx;
    color: #E63946;
    font-weight: 600;
  }
}

.section-card {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 20rpx;
  }
}

.service-items {
  .service-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .item-left {
      flex: 1;

      .item-name {
        font-size: 30rpx;
        color: #333;
        margin-bottom: 6rpx;
      }

      .item-desc {
        font-size: 24rpx;
        color: #999;
      }
    }

    .item-price {
      font-size: 30rpx;
      color: #E63946;
      font-weight: 500;
      flex-shrink: 0;
      margin-left: 20rpx;
    }
  }
}

.service-notes {
  .note-item {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
    padding: 12rpx 0;
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
  }
}

.guarantee-list {
  display: flex;

  .guarantee-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;

    .guarantee-title {
      font-size: 26rpx;
      color: #333;
      font-weight: 500;
    }

    .guarantee-desc {
      font-size: 22rpx;
      color: #999;
    }
  }
}

.review-list {
  .review-item {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12rpx;

      .reviewer-info {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .reviewer-avatar {
          width: 48rpx;
          height: 48rpx;
          border-radius: 24rpx;
          background: #E63946;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24rpx;
        }

        .reviewer-name {
          font-size: 28rpx;
          color: #333;
        }
      }

      .review-rating {
        display: flex;
        align-items: center;
        gap: 6rpx;
        font-size: 24rpx;
        color: #FFB800;
      }
    }

    .review-content {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
      margin-bottom: 12rpx;
    }

    .review-time {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #fff;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);

  .bottom-left {
    display: flex;
    gap: 40rpx;
    margin-right: 30rpx;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6rpx;
      font-size: 22rpx;
      color: #666;
    }
  }

  .book-btn {
    flex: 1;
  }
}
</style>
