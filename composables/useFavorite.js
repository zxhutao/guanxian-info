/**
 * useFavorite Hook - 收藏功能逻辑复用
 * 适用于：职位、服务、房屋、护工等详情页的收藏功能
 */
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

export function useFavorite(options = {}) {
  const {
    type = 'job', // 'job' | 'service' | 'house' | 'nurse' | 'news'
    idField = '_id',
    onSuccess,
    onError
  } = options

  const userStore = useUserStore()
  const isFavorite = ref(false)
  const isLoading = ref(false)

  // 检查是否已收藏
  const checkFavoriteStatus = async (itemId) => {
    if (!userStore.isLogin || !itemId) {
      isFavorite.value = false
      return
    }

    try {
      const { result } = await wx.cloud.callFunction({
        name: 'checkFavorite',
        data: {
          type,
          itemId
        }
      })
      isFavorite.value = result?.isFavorite || false
    } catch (err) {
      console.error('检查收藏状态失败:', err)
      isFavorite.value = false
    }
  }

  // 切换收藏状态
  const toggleFavorite = async (item) => {
    if (!userStore.isLogin) {
      uni.navigateTo({
        url: '/pages/auth/login'
      })
      return { success: false, needLogin: true }
    }

    if (isLoading.value || !item) return { success: false }

    const itemId = item[idField]
    if (!itemId) {
      console.error('收藏失败: 无效的ID字段')
      return { success: false }
    }

    isLoading.value = true

    try {
      const action = isFavorite.value ? 'remove' : 'add'
      const { result } = await wx.cloud.callFunction({
        name: 'toggleFavorite',
        data: {
          type,
          itemId,
          action,
          itemData: {
            title: item.title || item.name || '',
            cover: item.cover || item.avatar || '',
            price: item.price || item.salary || item.monthlyPrice || ''
          }
        }
      })

      if (result.code === 0) {
        isFavorite.value = !isFavorite.value
        const message = isFavorite.value ? '收藏成功' : '取消收藏'
        uni.showToast({ title: message, icon: 'success' })
        onSuccess?.({ isFavorite: isFavorite.value, itemId })
        return { success: true, isFavorite: isFavorite.value }
      } else {
        throw new Error(result.message || '操作失败')
      }
    } catch (err) {
      console.error('收藏操作失败:', err)
      uni.showToast({ title: '操作失败', icon: 'none' })
      onError?.(err)
      return { success: false, error: err }
    } finally {
      isLoading.value = false
    }
  }

  // 收藏图标类名
  const favoriteIconClass = computed(() => {
    return isFavorite.value ? 'icon-favorite-filled' : 'icon-favorite'
  })

  // 收藏文字
  const favoriteText = computed(() => {
    return isFavorite.value ? '已收藏' : '收藏'
  })

  return {
    isFavorite,
    isLoading,
    favoriteIconClass,
    favoriteText,
    checkFavoriteStatus,
    toggleFavorite
  }
}
