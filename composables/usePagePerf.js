/**
 * 冠帮帮小程序 - 页面性能监控 Composable
 * 维护人：小J（性能优化）
 * 用法：在页面 setup() 中调用 usePagePerf('页面名')
 */

import { onMounted } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'

// ============================================================
// 性能红线配置（ms）
// 超过红线则打印 WARNING
// ============================================================
const PERF_RED_LINES = {
  'index': 1500,
  'job-list': 1200,
  'job-detail': 1000,
  'service-list': 1200,
  'service-detail': 1000,
  'elder-list': 1200,
  'elder-detail': 1000,
  'chat': 700,
  'user-index': 800,
  'default': 1500
}

// ============================================================
// usePagePerf - 页面性能监控
// ============================================================
export function usePagePerf(pageName) {
  let loadStart = 0
  let mountTime = 0
  let timers = []
  
  onLoad(() => {
    loadStart = Date.now()
  })
  
  onMounted(() => {
    mountTime = Date.now()
    const ttMount = mountTime - loadStart
    
    const redLine = PERF_RED_LINES[pageName] || PERF_RED_LINES['default']
    
    console.log(`[PERF] ${pageName} 挂载耗时: ${ttMount}ms`)
    
    if (ttMount > redLine) {
      console.warn(
        `[PERF-WARN] ⚠️ ${pageName} 超过性能红线！\n` +
        `  实际: ${ttMount}ms > 红线: ${redLine}ms\n` +
        `  请通知小J分析优化。`
      )
    }
  })
  
  onUnload(() => {
    // 清除所有性能相关定时器
    timers.forEach(t => clearTimeout(t))
    timers = []
  })
  
  /**
   * 标记自定义性能节点
   * @param {string} label - 节点描述（如 '数据加载完成'）
   */
  function markPerf(label) {
    const elapsed = Date.now() - loadStart
    console.log(`[PERF] ${pageName}:${label} @ ${elapsed}ms`)
  }
  
  return { markPerf }
}

// ============================================================
// measureApiCall - API 调用性能测量
// ============================================================
export async function measureApiCall(name, fn) {
  const start = Date.now()
  try {
    const result = await fn()
    const elapsed = Date.now() - start
    console.log(`[PERF-API] ${name} 成功 ${elapsed}ms`)
    
    // API红线：200ms
    if (elapsed > 200) {
      console.warn(`[PERF-WARN] API ${name} 响应慢：${elapsed}ms > 200ms`)
    }
    return result
  } catch (error) {
    const elapsed = Date.now() - start
    console.error(`[PERF-API] ${name} 失败 ${elapsed}ms: ${error.message}`)
    throw error
  }
}

// ============================================================
// PerformanceReport - 获取当前会话性能摘要
// ============================================================
const _pageLoadTimes = {}

export function recordPageLoad(pageName, ms) {
  if (!_pageLoadTimes[pageName]) {
    _pageLoadTimes[pageName] = []
  }
  _pageLoadTimes[pageName].push(ms)
}

export function getPerformanceSummary() {
  const summary = {}
  for (const [page, times] of Object.entries(_pageLoadTimes)) {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    const max = Math.max(...times)
    const min = Math.min(...times)
    summary[page] = { avg, max, min, count: times.length }
  }
  return summary
}
