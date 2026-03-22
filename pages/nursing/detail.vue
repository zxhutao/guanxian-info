<template>
  <view class="nursing-detail-page">
    <!-- 基本信息 -->
    <view class="info-card">
      <view class="caregiver-main">
        <image class="avatar" :src="caregiver.avatar" mode="aspectFill" />
        <view class="basic-info">
          <view class="name-row">
            <view class="name">{{ caregiver.name }}</view>
            <view class="gender-badge">{{ caregiver.gender }}</view>
          </view>
          <view class="meta-row">
            <text class="meta-item">{{ caregiver.age }}岁</text>
            <text class="meta-divider">|</text>
            <text class="meta-item">{{ caregiver.yearsExperience }}年经验</text>
            <text class="meta-divider">|</text>
            <text class="meta-item">{{ caregiver.hometown }}</text>
          </view>
          <view class="rating-row">
            <u-icon name="star-fill" color="#FFB800" size="28rpx" />
            <text class="rating-num">{{ caregiver.rating }}</text>
            <text class="rating-count">（{{ caregiver.reviewCount }}条评价）</text>
          </view>
        </view>
      </view>

      <view class="price-bar">
        <view class="price">
          <text class="price-label">服务价格</text>
          <text class="price-num">{{ caregiver.price }}</text>
          <text class="price-unit">/天</text>
        </view>
        <u-button type="primary" size="normal" @click="bookCaregiver">
          立即预约
        </u-button>
      </view>
    </view>

    <!-- 服务项目 -->
    <view class="section-card">
      <view class="section-title">服务项目</view>
      <view class="skills-list">
        <view v-for="skill in caregiver.services" :key="skill" class="skill-item">
          <u-icon name="checkmark-circle" size="28rpx" color="#4CAF50" />
          <text>{{ skill }}</text>
        </view>
      </view>
    </view>

    <!-- 个人简介 -->
    <view class="section-card">
      <view class="section-title">个人简介</view>
      <view class="bio-text">{{ caregiver.bio }}</view>
    </view>

    <!-- 工作经历 -->
    <view class="section-card">
      <view class="section-title">工作经历</view>
      <view class="experience-list">
        <view v-for="(exp, index) in caregiver.workHistory" :key="index" class="exp-item">
          <view class="exp-dot" />
          <view class="exp-content">
            <view class="exp-title">{{ exp.title }}</view>
            <view class="exp-desc">{{ exp.desc }}</view>
            <view class="exp-time">{{ exp.time }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 用户评价 -->
    <view class="section-card">
      <view class="section-title">用户评价（{{ reviews.length }}）</view>
      <view class="review-list">
        <view v-for="review in reviews" :key="review.id" class="review-item">
          <view class="review-header">
            <view class="reviewer">{{ review.name }}</view>
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

    <!-- 联系方式 -->
    <view class="section-card">
      <view class="section-title">联系方式</view>
      <view class="contact-btns">
        <view class="contact-btn" @click="callPhone">
          <u-icon name="phone" size="32rpx" color="#E63946" />
          <text>电话咨询</text>
        </view>
        <view class="contact-btn" @click="startChat">
          <u-icon name="chat" size="32rpx" color="#2196F3" />
          <text>在线咨询</text>
        </view>
        <view class="contact-btn" @click="handleShare">
          <u-icon name="share" size="32rpx" color="#4CAF50" />
          <text>分享</text>
        </view>
      </view>
    </view>

    <!-- 底部预约栏 -->
    <view class="bottom-bar">
      <view class="price-info">
        <text class="price-label">服务价格</text>
        <text class="price-num">{{ caregiver.price }}</text>
        <text class="price-unit">/天</text>
      </view>
      <view class="book-btn" @click="bookCaregiver">立即预约</view>
    </view>

    <view style="height: 160rpx;" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { makePhoneCall, showConfirm } from '@/utils/index'

const caregiverId = ref('')
const caregiver = ref({
  name: '',
  avatar: '',
  gender: '',
  age: 0,
  experience: 0,
  hometown: '',
  price: '',
  rating: 0,
  reviewCount: 0,
  services: [],
  bio: '',
  experienceList: []
})
const reviews = ref([])

const caregiverData = {
  1: {
    name: '张阿姨',
    avatar: 'https://via.placeholder.com/120x120/E63946/fff?text=Z',
    gender: '女',
    age: 48,
    yearsExperience: 5,
    hometown: '冠县崇文街道',
    price: '¥200',
    rating: 4.9,
    reviewCount: 28,
    services: ['日常起居护理', '饮食照料', '康复辅助', '陪同就医', '情感陪伴'],
    bio: '从事养老护理工作5年，持有高级养老护理员证书。性格温和有耐心，擅长与老人沟通，对失能老人护理有丰富经验。曾护理过多位高龄老人，获得家属一致好评。',
    workHistory: [
      { title: '冠县XX养老院', desc: '担任护理组长，负责8位老人日常护理', time: '2022.03 - 至今' },
      { title: '冠县XX护理中心', desc: '专职护理失能老人，负责翻身、擦洗等', time: '2020.06 - 2022.02' },
      { title: '个人护理', desc: '居家护理高龄老人，提供一对一服务', time: '2019.01 - 2020.05' }
    ],
    phone: '13800001111'
  },
  2: {
    name: '李大姐',
    avatar: 'https://via.placeholder.com/120x120/4CAF50/fff?text=L',
    gender: '女',
    age: 45,
    yearsExperience: 3,
    hometown: '冠县清泉街道',
    price: '¥220',
    rating: 4.8,
    reviewCount: 15,
    services: ['失能老人护理', '卧床老人护理', '压疮护理', '鼻饲护理', '吸痰护理'],
    bio: '持有中级养老护理员证书和红十字会急救证。擅长失能老人和卧床老人护理，对压疮预防和护理有丰富经验。工作认真负责，受到老人和家属信赖。',
    workHistory: [
      { title: '冠县XX护理院', desc: '护理区组长，负责12位失能老人', time: '2023.01 - 至今' },
      { title: '聊城XX医院', desc: '住院部护理助理，协助护士工作', time: '2021.03 - 2022.12' }
    ],
    phone: '13800002222'
  },
  3: {
    name: '王师傅',
    avatar: 'https://via.placeholder.com/120x120/2196F3/fff?text=W',
    gender: '男',
    age: 52,
    yearsExperience: 8,
    hometown: '冠县烟庄街道',
    price: '¥250',
    rating: 5.0,
    reviewCount: 36,
    services: ['男性老人护理', '康复训练辅助', '行动辅助', '户外陪同', '日常护理'],
    bio: '退伍军人，从事养老护理8年。持有高级护理证和康复师资格证。身体强壮，擅长男性老人护理和康复训练辅助。性格开朗，老人都喜欢和他交流。',
    workHistory: [
      { title: '冠县XX康复中心', desc: '康复护理师，负责老人康复训练', time: '2021.06 - 至今' },
      { title: '冠县XX养老院', desc: '护理主管，管理10人护理团队', time: '2018.01 - 2021.05' }
    ],
    phone: '13800003333'
  }
}

const reviewData = [
  { id: 1, name: '王*明', rating: 5, content: '张阿姨对我母亲的照顾非常细心，每天都会陪老人聊天，老人很喜欢她。饮食方面也安排得很合理，营养均衡。', time: '2026-03-15' },
  { id: 2, name: '刘*华', rating: 5, content: '护理很专业，翻身擦洗都很到位。母亲卧床半年了，自从请了护工之后，身上没有长过一次褥疮。非常感谢！', time: '2026-03-08' },
  { id: 3, name: '张*英', rating: 4, content: '护工态度很好，工作认真负责。就是有时候来早了会提前敲门，希望时间方面能再灵活一点。', time: '2026-02-28' }
]

onLoad((options) => {
  caregiverId.value = options.id || '1'
  const data = caregiverData[caregiverId.value] || caregiverData[1]
  caregiver.value = data
  reviews.value = reviewData

  // 启用分享功能
  uni.showShareMenu({ withShareTicket: true })
})

// 分享给好友
onShareAppMessage(() => {
  return {
    title: `${caregiver.value.name} - 冠帮帮金牌护工`,
    path: `/pages/nursing/detail?id=${caregiverId.value}`,
    imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg'
  }
})

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: `${caregiver.value.name} - 冠帮帮金牌护工`,
    query: `id=${caregiverId.value}`,
    imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg'
  }
})

const handleShare = () => {
  uni.showShareMenu({ withShareTicket: true })
}

const bookCaregiver = async () => {
  const confirmed = await showConfirm('预约确认', `确定预约${caregiver.value.name}吗？`)
  if (confirmed) {
    uni.showToast({ title: '预约成功，请等待电话确认', icon: 'success' })
  }
}

const callPhone = () => {
  makePhoneCall(caregiver.value.phone)
}

const startChat = () => {
  uni.showToast({ title: '在线咨询功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.nursing-detail-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 30rpx;
}

.info-card {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .caregiver-main {
    display: flex;
    gap: 24rpx;
    margin-bottom: 24rpx;

    .avatar {
      width: 140rpx;
      height: 140rpx;
      border-radius: 70rpx;
      background: #eee;
      flex-shrink: 0;
    }

    .basic-info {
      flex: 1;

      .name-row {
        display: flex;
        align-items: center;
        gap: 12rpx;
        margin-bottom: 12rpx;

        .name {
          font-size: 36rpx;
          font-weight: 600;
          color: #333;
        }

        .gender-badge {
          padding: 4rpx 16rpx;
          background: #E3F2FD;
          color: #2196F3;
          font-size: 22rpx;
          border-radius: 8rpx;
        }
      }

      .meta-row {
        display: flex;
        align-items: center;
        gap: 12rpx;
        font-size: 26rpx;
        color: #666;
        margin-bottom: 12rpx;

        .meta-divider {
          color: #ddd;
        }
      }

      .rating-row {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .rating-num {
          font-size: 28rpx;
          color: #FFB800;
          font-weight: 600;
        }

        .rating-count {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  .price-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24rpx;
    border-top: 1rpx solid #f5f5f5;

    .price {
      .price-label {
        font-size: 24rpx;
        color: #999;
      }

      .price-num {
        font-size: 44rpx;
        color: #E63946;
        font-weight: 600;
      }

      .price-unit {
        font-size: 24rpx;
        color: #999;
      }
    }
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

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .skill-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 12rpx 24rpx;
    background: #F5F5F5;
    border-radius: 12rpx;
    font-size: 26rpx;
    color: #333;
  }
}

.bio-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.experience-list {
  .exp-item {
    display: flex;
    gap: 20rpx;
    padding-bottom: 24rpx;

    &:not(:last-child) {
      border-left: 2rpx solid #eee;
      padding-left: 24rpx;
      margin-left: 8rpx;
    }

    .exp-dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background: #E63946;
      margin-top: 12rpx;
      flex-shrink: 0;
    }

    .exp-content {
      .exp-title {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 8rpx;
      }

      .exp-desc {
        font-size: 26rpx;
        color: #666;
        margin-bottom: 8rpx;
      }

      .exp-time {
        font-size: 24rpx;
        color: #999;
      }
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

      .reviewer {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
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

.contact-btns {
  display: flex;
  gap: 20rpx;

  .contact-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    padding: 24rpx 0;
    background: #F5F5F5;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #333;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);

  .price-info {
    display: flex;
    align-items: baseline;
    gap: 4rpx;

    .price-label {
      font-size: 24rpx;
      color: #999;
    }

    .price-num {
      font-size: 44rpx;
      color: #E63946;
      font-weight: 600;
    }

    .price-unit {
      font-size: 24rpx;
      color: #999;
    }
  }

  .book-btn {
    background: #E63946;
    color: #fff;
    padding: 24rpx 60rpx;
    border-radius: 50rpx;
    font-size: 32rpx;
  }
}
</style>
