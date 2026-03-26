<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')

  // 初始化云开发
  // #ifdef MP-WEIXIN
  wx.cloud.init({
    env: 'cloudbase-1gkioadld4516142', // 云环境ID
    traceUser: true // 记录用户访问
  })
  console.log('云开发已初始化')
  // #endif
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import '@/uni.scss';

// 全局样式
page {
  background-color: #f5f5f5;
  font-size: 28rpx;
  color: #333;
}

.app-container {
  width: 100%;
  min-height: 100vh;
}

// 通用工具类
.text-primary {
  color: #E63946;
}

.text-secondary {
  color: #666;
}

.text-grey {
  color: #999;
}

.bg-primary {
  background-color: #E63946;
  color: #fff;
}
</style>
