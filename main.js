import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// 初始化微信云开发
if (!wx.cloud) {
  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
} else {
  wx.cloud.init({
    env: 'cloudbase-1gkioadld4516142',
    traceUser: true
  })
}

export function createApp() {
  const app = createSSRApp(App)

  // 使用 Pinia 状态管理
  const pinia = createPinia()
  app.use(pinia)

  return {
    app,
    pinia
  }
}
