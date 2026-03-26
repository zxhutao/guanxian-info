/**
 * useShare Hook - 分享功能逻辑复用
 * 适用于：所有详情页的分享功能（微信好友和朋友圈）
 */
import { ref } from 'vue'
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

export function useShare(options = {}) {
  const {
    title: defaultTitle = '冠帮帮 - 冠县本地生活服务平台',
    path: defaultPath = '/pages/index/index',
    imageUrl: defaultImageUrl = 'https://img.yzcdn.cn/vant/cat.jpeg',
    getShareData // 可选的自定义获取分享数据函数
  } = options

  const shareData = ref({
    title: defaultTitle,
    path: defaultPath,
    imageUrl: defaultImageUrl
  })

  // 更新分享数据
  const updateShareData = (data) => {
    shareData.value = {
      ...shareData.value,
      ...data
    }
  }

  // 设置页面分享数据（基于当前页面数据）
  const setPageShareData = (pageData, options = {}) => {
    const {
      type = 'job', // job | service | house | nurse | news | carpool
      id,
      title,
      cover,
      desc
    } = options

    if (!id) return

    let shareTitle = title || defaultTitle
    let sharePath = ''
    let shareImageUrl = cover || defaultImageUrl

    // 根据类型构建分享路径和标题
    switch (type) {
      case 'job':
        sharePath = `/pages/job/detail?id=${id}`
        shareTitle = title ? `${title} - 冠县招聘` : '冠县好工作推荐'
        break
      case 'service':
        sharePath = `/pages/service/detail?id=${id}`
        shareTitle = title ? `${title} - 冠县服务` : '冠县便民服务'
        break
      case 'house':
        sharePath = `/pages/house/detail?id=${id}`
        shareTitle = title ? `${title} - 冠县房产` : '冠县房屋租售'
        break
      case 'nurse':
        sharePath = `/pages/elder-care/detail?id=${id}`
        shareTitle = title ? `${title} - 冠县养老护理` : '冠县专业护工推荐'
        break
      case 'news':
        sharePath = `/pages/news/detail?id=${id}`
        shareTitle = title || '冠县本地资讯'
        break
      case 'carpool':
        sharePath = `/pages/carpool/detail?id=${id}`
        shareTitle = title || '冠县顺风车'
        break
      default:
        sharePath = defaultPath
    }

    shareData.value = {
      title: shareTitle,
      path: sharePath,
      imageUrl: shareImageUrl,
      desc: desc || shareTitle
    }
  }

  // 显示分享菜单
  const showShareMenu = () => {
    // #ifdef MP-WEIXIN
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // #endif
  }

  // 隐藏分享菜单
  const hideShareMenu = () => {
    // #ifdef MP-WEIXIN
    wx.hideShareMenu()
    // #endif
  }

  // 分享到微信好友
  const onShareAppMessageHandler = () => {
    if (getShareData) {
      return getShareData()
    }
    return {
      title: shareData.value.title,
      path: shareData.value.path,
      imageUrl: shareData.value.imageUrl
    }
  }

  // 分享到朋友圈
  const onShareTimelineHandler = () => {
    if (getShareData) {
      const data = getShareData()
      return {
        title: data.title,
        query: data.path?.split('?')[1] || '',
        imageUrl: data.imageUrl
      }
    }
    return {
      title: shareData.value.title,
      query: shareData.value.path?.split('?')[1] || '',
      imageUrl: shareData.value.imageUrl
    }
  }

  // 使用uni-app的分享生命周期
  onShareAppMessage(onShareAppMessageHandler)
  onShareTimeline(onShareTimelineHandler)

  return {
    shareData,
    updateShareData,
    setPageShareData,
    showShareMenu,
    hideShareMenu,
    onShareAppMessageHandler,
    onShareTimelineHandler
  }
}
