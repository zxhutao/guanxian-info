<template>
  <view class="chat-page">
    <!-- 聊天头部 -->
    <view class="chat-header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="header-center">
        <text class="header-title">{{ chatName }}</text>
      </view>
      <view class="header-right">
        <text class="more-icon">⋮</text>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view 
      scroll-y 
      class="message-list" 
      :scroll-top="scrollTop"
      :scroll-into-view="scrollIntoView"
      @scrolltoupper="loadMore"
    >
      <view class="loading-more" v-if="loadingMore">
        <text class="loading-text">加载?..</text>
      </view>
      
      <view 
        v-for="(msg, index) in messages" 
        :key="msg._id || index"
        :id="'msg-' + index"
        class="message-item"
        :class="{ 'message-self': msg.fromId === openId, 'message-other': msg.fromId !== openId }"
      >
        <!-- 时间?-->
        <view class="message-time" v-if="showTime(index)">
          <text>{{ formatTime(msg.createTime) }}</text>
        </view>
        
        <!-- 消息气泡 -->
        <view class="message-content-wrapper">
          <!-- 对方头像 -->
          <image 
            v-if="msg.fromId !== openId" 
            :src="chatAvatar" 
            class="message-avatar" 
            mode="aspectFill"
          />
          
          <!-- 消息气泡 -->
          <view class="message-bubble" :class="{ 'bubble-self': msg.fromId === openId }">
            <!-- 图片消息 -->
            <image 
              v-if="msg.type === 'image'" 
              :src="msg.content" 
              class="message-image"
              mode="aspectFill"
              @click="previewImage(msg.content)"
            />
            <!-- 文字消息 -->
            <text v-else class="bubble-text">{{ msg.content }}</text>
          </view>
          
          <!-- 自己头像 -->
          <image 
            v-if="msg.fromId === openId" 
            :src="myAvatar" 
            class="message-avatar" 
            mode="aspectFill"
          />
        </view>
      </view>
      
      <view id="bottom" class="bottom-anchor"></view>
    </scroll-view>

    <!-- 底部输入?-->
    <view class="input-area">
      <view class="input-wrapper">
        <input 
          v-model="inputText" 
          class="message-input"
          placeholder="输入消息..."
          :adjust-position="true"
          @confirm="sendTextMessage"
        />
        <view class="emoji-btn" @click="showEmoji = !showEmoji">
          <text>😊</text>
        </view>
      </view>
      <view class="action-btns">
        <view class="image-btn" @click="chooseImage">
          <text>📷</text>
        </view>
        <view 
          class="send-btn" 
          :class="{ active: inputText.trim() }"
          @click="sendTextMessage"
        >
          <text>发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 页面状?
const inputText = ref('')
const messages = ref([])
const scrollTop = ref(0)
const scrollIntoView = ref('')
const loadingMore = ref(false)
const page = ref(1)
const hasMore = ref(true)

// 聊天信息 - 统一使用 openId
const openId = ref('')
const conversationId = ref('')
const chatName = ref('客服')
const chatAvatar = ref('https://img.yzcdn.cn/vant/cat.jpeg')
const myAvatar = ref('https://img.yzcdn.cn/vant/cat.jpeg')
const toId = ref('') // 对方用户openId

// 云数据库引用
let db = null
let messagesCollection = null

onLoad(async (options) => {
  conversationId.value = options.conversationId || ''
  chatName.value = options.name || '客服'
  chatAvatar.value = options.avatar || 'https://img.yzcdn.cn/vant/cat.jpeg'
  toId.value = options.toId || ''
  
  // 获取当前用户openId
  await initUserInfo()
  
  // 初始化数据库
  initDatabase()
})

// 初始化用户信?- 统一使用openId
const initUserInfo = async () => {
  // #ifdef MP-WEIXIN
  try {
    const res = await uniCloud.callFunction({
      name: 'login'
    })
    if (res.result && res.result.openid) {
      openId.value = res.result.openid
    }
  } catch (e) {
    console.error('获取openId失败', e)
    // 降级方案
    const userInfo = uni.getStorageSync('userInfo') || {}
    openId.value = userInfo.openId || 'user_' + Date.now()
  }
  
  // 获取用户头像
  const userInfo = uni.getStorageSync('userInfo') || {}
  myAvatar.value = userInfo.avatar || 'https://img.yzcdn.cn/vant/cat.jpeg'
  // #endif
}

// 初始化数据库
const initDatabase = () => {
  // #ifdef MP-WEIXIN
  if (!db) {
    db = uniCloud.database()
    messagesCollection = db.collection('chat_messages')
  }
  loadMessages()
  // 监听新消?
  watchMessages()
  // #endif
}

// 加载消息
const loadMessages = async () => {
  if (!hasMore.value && page.value > 1) return
  
  try {
    // #ifdef MP-WEIXIN
    const res = await messagesCollection
      .where({
        conversationId: conversationId.value
      })
      .orderBy('createTime', 'asc')
      .skip((page.value - 1) * 20)
      .limit(20)
      .get()
    
    if (page.value === 1) {
      messages.value = res.data
    } else {
      messages.value = [...messages.value, ...res.data]
    }
    
    hasMore.value = res.data.length === 20
    page.value++
    // #endif
    
    scrollToBottom()
  } catch (e) {
    console.error('加载消息失败', e)
    // 使用模拟数据
    messages.value = getMockMessages()
    scrollToBottom()
  }
}

// 模拟消息数据
const getMockMessages = () => {
  const now = Date.now()
  return [
    { _id: '1', fromId: toId.value, toId: openId.value, content: '您好，请问有什么可以帮您？', type: 'text', createTime: now - 3600000 },
    { _id: '2', fromId: openId.value, toId: toId.value, content: '我想咨询一下保洁服务', type: 'text', createTime: now - 3500000 },
    { _id: '3', fromId: toId.value, toId: openId.value, content: '可以的，我们提供日常保洁、深度清洁等多种服务', type: 'text', createTime: now - 3400000 },
    { _id: '4', fromId: openId.value, toId: toId.value, content: '日常保洁多少钱？', type: 'text', createTime: now - 3300000 },
    { _id: '5', fromId: toId.value, toId: openId.value, content: '日常保洁50元/小时起，详情可以查看服务页面', type: 'text', createTime: now - 3200000 },
  ]
}

// 监听新消?
const watchMessages = () => {
  // #ifdef MP-WEIXIN
  if (!messagesCollection) return
  
  messagesCollection
    .where({
      conversationId: conversationId.value
    })
    .orderBy('createTime', 'asc')
    .watch({
      onChange: (snapshot) => {
        if (snapshot.type === 'add') {
          const newMsg = snapshot.doc
          // 避免重复添加
          if (!messages.value.find(m => m._id === newMsg._id)) {
            messages.value.push(newMsg)
            // 如果是收到的消息，标记已?
            if (newMsg.toId === openId.value) {
              markAsRead(newMsg._id)
            }
            nextTick(() => scrollToBottom())
          }
        }
      },
      onError: (err) => {
        console.error('监听消息失败', err)
      }
    })
  // #endif
}

// 发送文字消?
const sendTextMessage = async () => {
  const content = inputText.value.trim()
  if (!content) return
  
  inputText.value = ''
  
  const msg = {
    fromId: openId.value,
    toId: toId.value || 'service',
    content: content,
    type: 'text',
    conversationId: conversationId.value || `conv_${openId.value}_${toId.value}`,
    createTime: Date.now(),
    isRead: false
  }
  
  // 先显示到列表
  messages.value.push(msg)
  scrollToBottom()
  
  try {
    // #ifdef MP-WEIXIN
    await uniCloud.callFunction({
      name: 'sendMessage',
      data: msg
    })
    // #endif
  } catch (e) {
    console.error('发送消息失?, e)
  }
}

// 发送图片消?
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      
      // 先显示到列表（使用本地临时路径）
      const localMsgId = 'local_' + Date.now()
      const msg = {
        _id: localMsgId,
        fromId: openId.value,
        toId: toId.value || 'service',
        content: tempFilePath,
        type: 'image',
        conversationId: conversationId.value || `conv_${openId.value}_${toId.value}`,
        createTime: Date.now(),
        isRead: false
      }
      
      messages.value.push(msg)
      scrollToBottom()
      
      try {
        // #ifdef MP-WEIXIN
        // 上传图片到云存储
        const cloudPath = `chat/${Date.now()}.jpg`
        const uploadRes = await uniCloud.uploadFile({
          cloudPath,
          filePath: tempFilePath
        })
        
        const fileID = uploadRes.fileID
        
        // 更新消息内容为云存储URL
        await messagesCollection.doc(localMsgId).update({
          data: { content: fileID }
        })
        
        // 更新本地显示
        const msgIndex = messages.value.findIndex(m => m._id === localMsgId)
        if (msgIndex !== -1) {
          messages.value[msgIndex].content = fileID
        }
        
        // 调用云函数更新会?
        await uniCloud.callFunction({
          name: 'sendMessage',
          data: {
            content: fileID,
            type: 'image',
            toId: toId.value || 'service',
            conversationId: conversationId.value || `conv_${openId.value}_${toId.value}`
          }
        })
        // #endif
      } catch (e) {
        console.error('发送图片失败', e)
      }
    }
  })
}

// 标记已读
const markAsRead = async (msgId) => {
  try {
    // #ifdef MP-WEIXIN
    await uniCloud.callFunction({
      name: 'markAsRead',
      data: { messageId: msgId }
    })
    // #endif
  } catch (e) {
    console.error('标记已读失败', e)
  }
}

// 加载更多
const loadMore = () => {
  if (!loadingMore.value && hasMore.value) {
    loadingMore.value = true
    loadMessages().finally(() => {
      loadingMore.value = false
    })
  }
}

// 预览图片
const previewImage = (url) => {
  uni.previewImage({
    urls: [url],
    current: url
  })
}

// 滚动到底?
const scrollToBottom = () => {
  nextTick(() => {
    scrollIntoView.value = 'bottom'
  })
}

// 是否显示时间?
const showTime = (index) => {
  if (index === 0) return true
  const currMsg = messages.value[index]
  const prevMsg = messages.value[index - 1]
  return currMsg.createTime - prevMsg.createTime > 300000 // 5分钟间隔
}

// 格式化时?
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  if (msgDate.getTime() === today.getTime()) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  } else {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
}

// 返回
const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

// 头部
.chat-header {
  display: flex;
  align-items: center;
  padding: 60rpx 24rpx 20rpx;
  background: #fff;
  border-bottom: 1rpx solid #eee;

  .header-left {
    width: 60rpx;
    
    .back-icon {
      font-size: 48rpx;
      color: #333;
    }
  }

  .header-center {
    flex: 1;
    text-align: center;
    
    .header-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .header-right {
    width: 60rpx;
    text-align: right;
    
    .more-icon {
      font-size: 40rpx;
      color: #666;
    }
  }
}

// 消息列表
.message-list {
  flex: 1;
  padding: 24rpx;
  overflow-y: auto;
}

.loading-more {
  text-align: center;
  padding: 20rpx;
  
  .loading-text {
    font-size: 24rpx;
    color: #999;
  }
}

.message-item {
  margin-bottom: 32rpx;
  
  &.message-self {
    .message-content-wrapper {
      justify-content: flex-end;
    }
  }
  
  &.message-other {
    .message-content-wrapper {
      justify-content: flex-start;
    }
  }
}

.message-time {
  text-align: center;
  margin-bottom: 20rpx;
  
  text {
    font-size: 22rpx;
    color: #999;
    background: rgba(0, 0, 0, 0.05);
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
  }
}

.message-content-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 16rpx;
}

.message-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.message-bubble {
  max-width: 70%;
  padding: 20rpx 28rpx;
  border-radius: 20rpx;
  background: #fff;
  position: relative;
  
  &.bubble-self {
    background: linear-gradient(135deg, #E63946, #FF6B6B);
    
    .bubble-text {
      color: #fff;
    }
  }
  
  .bubble-text {
    font-size: 28rpx;
    color: #333;
    line-height: 1.5;
    word-break: break-all;
  }
  
  .message-image {
    max-width: 300rpx;
    max-height: 300rpx;
    border-radius: 12rpx;
  }
}

.bottom-anchor {
  height: 20rpx;
}

// 输入?
.input-area {
  background: #fff;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #eee;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 40rpx;
  padding: 0 24rpx;
  margin-bottom: 16rpx;
  
  .message-input {
    flex: 1;
    height: 72rpx;
    font-size: 28rpx;
  }
  
  .emoji-btn {
    padding: 10rpx;
    
    text {
      font-size: 36rpx;
    }
  }
}

.action-btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .image-btn {
    padding: 10rpx 20rpx;
    
    text {
      font-size: 44rpx;
    }
  }
  
  .send-btn {
    background: #ccc;
    color: #fff;
    padding: 16rpx 40rpx;
    border-radius: 36rpx;
    font-size: 28rpx;
    
    &.active {
      background: linear-gradient(135deg, #E63946, #FF6B6B);
    }
  }
}
</style>

