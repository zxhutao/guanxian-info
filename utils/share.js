/**
 * 分享工具
 */
import { useUserStore } from '@/stores/user'

/**
 * 生成分享路径（带推荐人参数）
 * @param {string} page - 页面路径
 * @param {object} params - 参数
 */
export const buildSharePath = (page, params = {}) => {
  const userStore = useUserStore()
  const query = new URLSearchParams({
    ...params,
    ref: userStore.userInfo?.openid || '',
    ts: Date.now()
  }).toString()
  return `${page}?${query}`
}

/**
 * 解析邀请来源
 * @param {object} options - 页面参数
 */
export const parseInviteSource = (options) => {
  if (options.ref) {
    console.log('来源追踪:', {
      inviter: options.ref,
      channel: options.channel || 'unknown',
      scene: options.scene
    })
    // TODO: 上报邀请关系
  }
}

/**
 * 获取分享配置
 * @param {object} options - 分享配置
 */
export const getShareConfig = (options = {}) => {
  const defaultConfig = {
    title: '冠帮帮 - 冠县人必备的生活入口',
    path: buildSharePath('/pages/index/index', { channel: 'share' }),
    imageUrl: '/static/logo.png'
  }
  
  return {
    ...defaultConfig,
    ...options
  }
}

// 分享给朋友
export const onShareAppMessage = (options = {}) => {
  const config = getShareConfig(options)
  return {
    title: config.title,
    path: config.path,
    imageUrl: config.imageUrl
  }
}

// 分享到朋友圈
export const onShareTimeline = () => {
  const userStore = useUserStore()
  return {
    title: '冠帮帮 - 找工作/找服务/找护工',
    query: `ref=${userStore.userInfo?.openid || ''}&channel=timeline`,
    imageUrl: '/static/logo.png'
  }
}

export default {
  buildSharePath,
  parseInviteSource,
  getShareConfig,
  onShareAppMessage,
  onShareTimeline
}
