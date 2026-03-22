<template>
  <view class="info-detail-page">
    <!-- 文章头部 -->
    <view class="article-header">
      <view class="article-title">{{ article.title }}</view>
      <view class="article-meta">
        <view class="meta-source">{{ article.source }}</view>
        <view class="meta-time">{{ article.time }}</view>
        <view class="meta-views">{{ article.views }}阅读</view>
      </view>
    </view>

    <!-- 文章封面 -->
    <image
      v-if="article.cover"
      class="article-cover"
      :src="article.cover"
      mode="widthFix"
    />

    <!-- 文章正文 -->
    <view class="article-content">
      <view class="content-text" v-for="(para, index) in article.content" :key="index">
        <text>{{ para }}</text>
      </view>
    </view>

    <!-- 相关推荐 -->
    <view class="related-section">
      <view class="section-title">相关推荐</view>
      <view class="related-list">
        <view
          v-for="item in relatedList"
          :key="item.id"
          class="related-item"
          @click="toRelated(item.id)"
        >
          <image class="related-image" :src="item.image" mode="aspectFill" />
          <view class="related-info">
            <view class="related-title">{{ item.title }}</view>
            <view class="related-time">{{ item.time }}</view>
          </view>
        </view>
      </view>
    </view>

    <view style="height: 60rpx;" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const articleId = ref('')
const article = ref({
  title: '',
  source: '',
  time: '',
  views: 0,
  cover: '',
  content: []
})
const relatedList = ref([])

const articleData = {
  1: {
    title: '冠县最新招聘信息，待遇优厚',
    source: '冠帮帮',
    time: '2026-03-22',
    views: 1256,
    cover: 'https://via.placeholder.com/750x400/E63946/fff?text=Job',
    content: [
      '近日，冠县多家企业发布最新招聘信息，涵盖普工、技工、销售、文员等多个岗位类型，月薪范围3000-15000元不等，部分岗位还提供包吃包住、五险一金等福利。',
      '据了解，冠县工业园区多家玻璃制造企业正在大量招聘普工和操作工，月薪5000-8000元，提供免费食宿和五险。XX玻璃厂负责人表示，随着订单增加，近期需要补充30名一线工人。',
      '此外，冠县开发区的几家五金制造和纺织企业也有招聘需求。质检员、包装工、叉车司机等技术岗位月薪可达6000-10000元，有经验者优先。',
      '冠帮帮小编提醒广大求职者，找工作时请注意辨别招聘信息真伪，通过正规渠道应聘，签订正式劳动合同，维护自身合法权益。更多招聘信息请关注冠帮帮小程序。'
    ]
  },
  2: {
    title: '冠县家政服务价格表出炉',
    source: '生活服务',
    time: '2026-03-21',
    views: 892,
    cover: 'https://via.placeholder.com/750x400/FF6B35/fff?text=Clean',
    content: [
      '为方便冠县居民了解家政服务价格，冠帮帮整理了本地主要家政服务项目的参考价格，供大家参考。',
      '日常保洁：小型公寓（1居室）约99元/次（2小时），普通住宅（2-3居室）约149元/次（3小时），大户型（4居室以上）约199元/次（4小时）。',
      '深度清洁：包括厨房去油、卫生间除垢、玻璃清洗等，参考价格199-399元不等，具体根据房屋面积和清洁难度确定。',
      '家电清洗：空调清洗100元/台，油烟机清洗120元，洗衣机清洗80元。如需多个家电清洗，可享受套餐优惠。',
      '温馨提示：选择家政服务时，建议选择有正规资质的服务机构，确认服务人员持有健康证。如需预约，可通过冠帮帮小程序在线预约。'
    ]
  },
  3: {
    title: '冠县养老护理服务指南',
    source: '养老护理',
    time: '2026-03-20',
    views: 678,
    cover: 'https://via.placeholder.com/750x400/4CAF50/fff?text=Nursing',
    content: [
      '随着老龄化趋势加剧，冠县养老护理需求不断增长。为帮助有需要的家庭了解养老护理服务，冠帮帮整理了以下指南。',
      '目前冠县养老服务主要分为居家护理、机构养老和社区日间照料三种模式。其中居家护理是最普遍的选择，护工上门为老人提供日常生活照料。',
      '居家护工的选择标准：建议选择持有养老护理员职业资格证书的护工，优先考虑有3年以上经验的护理员。可通过冠帮帮查看护工资质、评价等信息。',
      '收费标准方面，普通护工约150-250元/天，高级护工（持有高级证书、有特殊护理经验）约300-500元/天。长期护理（月嫂模式）可享受一定优惠。',
      '冠帮帮小编提醒：选择护工时要仔细核实身份信息，签订正式服务合同，明确服务内容和收费标准。如遇到服务质量问题，可及时通过平台反馈。'
    ]
  }
}

const relatedData = [
  { id: 2, title: '冠县家政服务价格表出炉', image: 'https://via.placeholder.com/200x150/eee/999?text=Home', time: '2026-03-21' },
  { id: 3, title: '冠县养老护理服务指南', image: 'https://via.placeholder.com/200x150/eee/999?text=Nurse', time: '2026-03-20' }
]

onLoad((options) => {
  articleId.value = options.id || '1'
  const data = articleData[articleId.value] || articleData[1]
  article.value = data
  relatedList.value = relatedData.filter(item => item.id !== Number(articleId.value))
})

const toRelated = (id) => {
  uni.redirectTo({ url: `/pages/info/detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
.info-detail-page {
  min-height: 100vh;
  background: #F5F5F5;
}

.article-header {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 2rpx;

  .article-title {
    font-size: 40rpx;
    font-weight: 600;
    color: #333;
    line-height: 1.4;
    margin-bottom: 20rpx;
  }

  .article-meta {
    display: flex;
    align-items: center;
    gap: 20rpx;
    font-size: 24rpx;
    color: #999;

    .meta-source {
      padding: 4rpx 16rpx;
      background: #FFF0F0;
      color: #E63946;
      border-radius: 6rpx;
    }
  }
}

.article-cover {
  width: 100%;
  background: #eee;
}

.article-content {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .content-text {
    font-size: 30rpx;
    color: #333;
    line-height: 2;
    margin-bottom: 24rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.related-section {
  background: #fff;
  padding: 30rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 20rpx;
  }

  .related-list {
    .related-item {
      display: flex;
      gap: 20rpx;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .related-image {
        width: 180rpx;
        height: 120rpx;
        border-radius: 12rpx;
        background: #eee;
        flex-shrink: 0;
      }

      .related-info {
        flex: 1;

        .related-title {
          font-size: 28rpx;
          color: #333;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 12rpx;
        }

        .related-time {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}
</style>
