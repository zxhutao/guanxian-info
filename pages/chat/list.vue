<template>
  <view class="chat-list-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">我的消息</text>
    </view>

    <!-- 会话列表 -->
    <scroll-view scroll-y class="conversation-list">
      <view 
        v-for="conv in conversations" 
        :key="conv._id"
        class="conversation-item"
        @click="goToChat(conv)"
      >
        <!-- 头像 -->
        <view class="conv-avatar-wrapper">
          <image lazy-load :src="conv.avatar || defaultAvatar" mode="aspectFill" class="conv-avatar" />
          <!-- 未读角标 -->
          <view class="unread-badge" v-if="conv.unreadCount > 0">
            <text>{{ conv.unreadCount > 99 ? '99+' : conv.unreadCount }}</text>
          </view>
        </view>
        
        <!-- 会话信息 -->
        <view class="conv-info">
          <view class="conv-header">
            <text class="conv-name">{{ conv.name }}</text>
            <text class="conv-time">{{ formatTime(conv.lastMessageTime) }}</text>
          </view>
          <view class="conv-preview">
            <text class="preview-text">{{ conv.lastMessage || '暂无消息' }}</text>
            <view class="conv-tags" v-if="conv.tags && conv.tags.length">
              <text class="conv-tag" v-for="(tag, i) in conv.tags" :key="i">{{ tag }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状�?-->
      <view class="empty-state" v-if="conversations.length === 0 && !loading">
        <text class="empty-icon">💬</text>
        <text class="empty-text">暂无消息</text>
        <text class="empty-hint">开始和客服沟通吧</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 状�?
const conversations = ref([])
const loading = ref(false)
const defaultAvatar = 'https://img.yzcdn.cn/vant/cat.jpeg'
const openId = ref('')

// 云数据库
let db = null
let conversationsCollection = null

onLoad(() => {
  initUserInfo()
})

onMounted(() => {
  initDatabase()
  loadConversations()
  // 监听会话变化
  watchConversations()
})

// 初始化用户信�?
const initUserInfo = async () => {
  // #ifdef MP-WEIXIN
  try {
    const res = await wx.cloud.callFunction({
      name: 'login'
    })
    if (res.result && res.result.openid) {
      openId.value = res.result.openid
    }
  } catch (e) {
    console.error('获取openId失败', e)
    const userInfo = uni.getStorageSync('userInfo') || {}
    openId.value = userInfo.openId || 'user_' + Date.now()
  }
  // #endif
}

// 初始化数据库
const initDatabase = () => {
  // #ifdef MP-WEIXIN
  if (!db) {
    db = wx.cloud.database()
    conversationsCollection = db.collection('chat_conversations')
  }
  // #endif
}

// 加载会话列表
const loadConversations = async () => {
  loading.value = true
  
  try {
    // #ifdef MP-WEIXIN
    const res = await wx.cloud.callFunction({
      name: 'getConversationList'
    })
    
    if (res.result && res.result.success) {
      conversations.value = res.result.data.list || []
    } else {
      conversations.value = getMockConversations()
    }
    // #endif
  } catch (e) {
    console.error('加载会话列表失败', e)
    // 使用模拟数据
    conversations.value = getMockConversations()
  } finally {
    loading.value = false
  }
}

// 实时监听会话变化
const watchConversations = () => {
  // #ifdef MP-WEIXIN
  if (!conversationsCollection || !openId.value) return
  
  conversationsCollection
    .where({
      participants: db.command.in([openId.value])
    })
    .orderBy('lastMessageTime', 'desc')
    .watch({
      onChange: (snapshot) => {
        console.log('会话列表变化', snapshot.type)
        
        if (snapshot.type === 'init') {
          // 初始化数�?
          conversations.value = snapshot.docs
        } else if (snapshot.type === 'update') {
          // 更新数据 - 重新排序
          conversations.value.sort((a, b) => b.lastMessageTime - a.lastMessageTime)
        } else if (snapshot.type === 'add') {
          // 新增会话
          snapshot.docchanges.forEach(change => {
            if (change.doc && !conversations.value.find(c => c._id === change.doc._id)) {
              conversations.value.unshift(change.doc)
            }
          })
        }
      },
      onError: (err) => {
        console.error('监听会话失败', err)
      }
    })
  // #endif
}

// 模拟会话数据
const getMockConversations = () => {
  const now = Date.now()
  return [
    {
      _id: 'conv_1',
      conversationId: 'conv_1',
      name: '冠县保洁公司',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      lastMessage: '您好，请问有什么可以帮您？',
      lastMessageTime: now - 1800000,
      unreadCount: 2,
      toId: 'service_1',
      participants: ['user_1', 'service_1'],
      tags: ['家政保洁']
    },
    {
      _id: 'conv_2',
      conversationId: 'conv_2',
      name: '家电维修中心',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      lastMessage: '好的，我明天安排师傅上门',
      lastMessageTime: now - 86400000,
      unreadCount: 0,
      toId: 'service_2',
      participants: ['user_1', 'service_2'],
      tags: ['家电维修']
    },
    {
      _id: 'conv_3',
      conversationId: 'conv_3',
      name: '冠县搬家公司',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      lastMessage: '谢谢您的惠顾，欢迎下次合作',
      lastMessageTime: now - 172800000,
      unreadCount: 0,
      toId: 'service_3',
      participants: ['user_1', 'service_3'],
      tags: ['搬家货运']
    },
    {
      _id: 'conv_4',
      conversationId: 'conv_4',
      name: '系统消息',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      lastMessage: '您的预约已确认',
      lastMessageTime: now - 259200000,
      unreadCount: 5,
      toId: 'system',
      participants: ['user_1', 'system'],
      tags: []
    }
  ]
}

// 格式化时�?
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  const diffDays = Math.floor((today.getTime() - msgDate.getTime()) / 86400000)
  
  if (diffDays === 0) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return weeks[date.getDay()]
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

// 进入聊天
const goToChat = (conv) => {
  // 标记已读
  markAsRead(conv.conversationId)
  
  uni.navigateTo({
    url: `/pages/chat/index?conversationId=${conv.conversationId}&toId=${conv.toId}&name=${encodeURIComponent(conv.name)}&avatar=${encodeURIComponent(conv.avatar || defaultAvatar)}`
  })
}

// 标记已读
const markAsRead = async (conversationId) => {
  try {
    // #ifdef MP-WEIXIN
    await wx.cloud.callFunction({
      name: 'markAsRead',
      data: { conversationId }
    })
    // #endif
    
    // 更新本地
    const conv = conversations.value.find(c => c.conversationId === conversationId)
    if (conv) conv.unreadCount = 0
  } catch (e) {
    console.error('标记已读失败', e)
  }
}
</script>

<style lang="scss" scoped>
.chat-list-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  padding: 60rpx 24rpx 24rpx;
  background: #fff;
  
  .page-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }
}

.conversation-list {
  height: calc(100vh - 100rpx);
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  background: #fff;
  border-bottom: 1rpx solid #f5f5f5;
  
  &:active {
    background: #f8f8f8;
  }
}

.conv-avatar-wrapper {
  position: relative;
  margin-right: 20rpx;
  
  .conv-avatar {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
  }
  
  .unread-badge {
    position: absolute;
    top: -8rpx;
    right: -8rpx;
    min-width: 36rpx;
    height: 36rpx;
    line-height: 36rpx;
    text-align: center;
    background: #E63946;
    color: #fff;
    font-size: 20rpx;
    border-radius: 18rpx;
    padding: 0 8rpx;
  }
}

.conv-info {
  flex: 1;
  overflow: hidden;
}

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
  
  .conv-name {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
  }
  
  .conv-time {
    font-size: 22rpx;
    color: #999;
  }
}

.conv-preview {
  display: flex;
  align-items: center;
  
  .preview-text {
    flex: 1;
    font-size: 26rpx;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .conv-tags {
    display: flex;
    gap: 8rpx;
    margin-left: 16rpx;
    
    .conv-tag {
      font-size: 18rpx;
      color: #E63946;
      background: rgba(230, 57, 70, 0.1);
      padding: 4rpx 12rpx;
      border-radius: 12rpx;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 200rpx 0;
  
  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
  }
  
  .empty-text {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 16rpx;
  }
  
  .empty-hint {
    font-size: 26rpx;
    color: #999;
  }
}
</style>


