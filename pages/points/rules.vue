<template>
  <view class="points-rules-container">
    <!-- 积分价值说明 -->
    <view class="rule-section">
      <view class="section-title">
        <text class="icon">💎</text>
        <text>积分价值</text>
      </view>
      <view class="rule-content">
        <view class="value-box">
          <text class="value-num">100</text>
          <text class="value-unit">积分 = 1元</text>
        </view>
        <view class="value-examples">
          <text class="example-item">1,000 积分 = 10 元</text>
          <text class="example-item">2,000 积分 = 20 元</text>
          <text class="example-item">5,000 积分 = 50 元</text>
        </view>
      </view>
    </view>

    <!-- 使用限制 -->
    <view class="rule-section">
      <view class="section-title">
        <text class="icon">⚠️</text>
        <text>使用限制</text>
      </view>
      <view class="rule-list">
        <view class="rule-item">
          <text class="rule-dot">•</text>
          <text class="rule-text">最高可抵订单金额的 20%</text>
        </view>
        <view class="rule-item">
          <text class="rule-dot">•</text>
          <text class="rule-text">单笔订单最高抵扣 50 元</text>
        </view>
        <view class="rule-item">
          <text class="rule-dot">•</text>
          <text class="rule-text">订单金额满 10 元可用</text>
        </view>
        <view class="rule-item">
          <text class="rule-dot">•</text>
          <text class="rule-text">积分抵扣部分不支持开发票</text>
        </view>
      </view>
    </view>

    <!-- 支持订单类型 -->
    <view class="rule-section">
      <view class="section-title">
        <text class="icon">📋</text>
        <text>支持订单类型</text>
      </view>
      <view class="order-types">
        <view class="type-item">
          <text class="type-icon">💼</text>
          <text class="type-name">招聘</text>
          <text class="type-desc">招聘信息发布费、置顶费等</text>
        </view>
        <view class="type-item">
          <text class="type-icon">🔧</text>
          <text class="type-name">服务</text>
          <text class="type-desc">家政、维修、搬家等服务费用</text>
        </view>
        <view class="type-item">
          <text class="type-icon">👴</text>
          <text class="type-name">养老护理</text>
          <text class="type-desc">养老护工、护理服务费用</text>
        </view>
      </view>
    </view>

    <!-- 积分获取方式 -->
    <view class="rule-section">
      <view class="section-title">
        <text class="icon">🎯</text>
        <text>如何获取积分</text>
      </view>
      <view class="earn-methods">
        <view class="method-item">
          <view class="method-left">
            <text class="method-icon">📅</text>
            <view class="method-info">
              <text class="method-name">每日签到</text>
              <text class="method-desc">每天签到即可获得</text>
            </view>
          </view>
          <text class="method-points">+10 积分</text>
        </view>
        <view class="method-item">
          <view class="method-left">
            <text class="method-icon">📝</text>
            <view class="method-info">
              <text class="method-name">发布信息</text>
              <text class="method-desc">发布招聘/服务/护工信息</text>
            </view>
          </view>
          <text class="method-points">+50 积分</text>
        </view>
        <view class="method-item">
          <view class="method-left">
            <text class="method-icon">⭐</text>
            <view class="method-info">
              <text class="method-name">评价奖励</text>
              <text class="method-desc">完成订单后评价</text>
            </view>
          </view>
          <text class="method-points">+20 积分</text>
        </view>
        <view class="method-item">
          <view class="method-left">
            <text class="method-icon">👥</text>
            <view class="method-info">
              <text class="method-name">邀请好友</text>
              <text class="method-desc">邀请好友注册并签到</text>
            </view>
          </view>
          <text class="method-points">+100 积分</text>
        </view>
      </view>
    </view>

    <!-- 成本分担说明 -->
    <view class="rule-section">
      <view class="section-title">
        <text class="icon">🤝</text>
        <text>成本分担说明</text>
      </view>
      <view class="cost-share">
        <view class="share-item">
          <text class="share-title">平台承担 60%</text>
          <text class="share-example">例：积分抵扣 15 元，平台承担 9 元</text>
        </view>
        <view class="share-item">
          <text class="share-title">商家承担 40%</text>
          <text class="share-example">例：积分抵扣 15 元，商家承担 6 元</text>
        </view>
      </view>
    </view>

    <!-- FAQ -->
    <view class="rule-section">
      <view class="section-title">
        <text class="icon">❓</text>
        <text>常见问题</text>
      </view>
      <view class="faq-list">
        <view class="faq-item" v-for="(faq, index) in faqs" :key="index">
          <view class="faq-question" @click="toggleFaq(index)">
            <text class="q-mark">Q</text>
            <text class="q-text">{{ faq.question }}</text>
            <text class="arrow" :class="{ expanded: faq.expanded }">▼</text>
          </view>
          <view class="faq-answer" v-if="faq.expanded">
            <text class="a-mark">A</text>
            <text class="a-text">{{ faq.answer }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const faqs = ref([
  {
    question: '积分可以提现吗？',
    answer: '积分不能直接提现，但可以在下单时抵扣现金使用，100积分=1元。',
    expanded: false
  },
  {
    question: '积分会过期吗？',
    answer: '积分有效期为获得之日起12个月，请及时使用。',
    expanded: false
  },
  {
    question: '订单退款后积分会退回吗？',
    answer: '会的，订单退款后使用的积分将原路退回到您的账户。',
    expanded: false
  },
  {
    question: '为什么有些订单不能使用积分？',
    answer: '目前仅支持招聘、服务、养老护理三类订单使用积分抵扣，其他类型订单暂不支持。',
    expanded: false
  }
])

const toggleFaq = (index) => {
  faqs.value[index].expanded = !faqs.value[index].expanded
}
</script>

<style scoped>
.points-rules-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.rule-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.icon {
  margin-right: 10rpx;
}

.value-box {
  text-align: center;
  padding: 40rpx;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  border-radius: 12rpx;
  margin-bottom: 30rpx;
}

.value-num {
  font-size: 72rpx;
  font-weight: bold;
  color: #fff;
}

.value-unit {
  font-size: 32rpx;
  color: #fff;
  margin-left: 10rpx;
}

.value-examples {
  display: flex;
  justify-content: space-around;
}

.example-item {
  font-size: 26rpx;
  color: #666;
  background: #f5f5f5;
  padding: 16rpx 24rpx;
  border-radius: 8rpx;
}

.rule-list {
  padding-left: 10rpx;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.rule-dot {
  color: #FF6B6B;
  margin-right: 10rpx;
  font-size: 32rpx;
  line-height: 1.2;
}

.rule-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.order-types {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.type-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 8rpx;
}

.type-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.type-name {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  margin-right: 20rpx;
}

.type-desc {
  font-size: 26rpx;
  color: #999;
  flex: 1;
  text-align: right;
}

.earn-methods {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.method-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 8rpx;
}

.method-left {
  display: flex;
  align-items: center;
}

.method-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.method-info {
  display: flex;
  flex-direction: column;
}

.method-name {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}

.method-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 6rpx;
}

.method-points {
  font-size: 32rpx;
  color: #52C41A;
  font-weight: bold;
}

.cost-share {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.share-item {
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 8rpx;
}

.share-title {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.share-example {
  font-size: 26rpx;
  color: #666;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.faq-item {
  border-bottom: 1rpx solid #f5f5f5;
  padding-bottom: 20rpx;
}

.faq-question {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}

.q-mark {
  background: #FF6B6B;
  color: #fff;
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  text-align: center;
  border-radius: 50%;
  font-size: 24rpx;
  margin-right: 16rpx;
}

.q-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.arrow {
  font-size: 24rpx;
  color: #999;
  transition: transform 0.3s;
}

.arrow.expanded {
  transform: rotate(180deg);
}

.faq-answer {
  display: flex;
  padding: 20rpx 0;
  padding-left: 52rpx;
}

.a-mark {
  background: #52C41A;
  color: #fff;
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  text-align: center;
  border-radius: 50%;
  font-size: 24rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.a-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}
</style>