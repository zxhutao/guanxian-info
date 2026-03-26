/**
 * 请求管理器 - 实现请求合并和缓存
 * 用途：减少重复请求，合并多个相同的异步请求，提高性能
 */

// 请求缓存存储
const requestCache = new Map();

// 待处理的请求队列
const pendingRequests = new Map();

/**
 * 批量请求 - 合并多个请求为一个
 * 
 * 使用场景：
 * - 首页同时请求职位列表、服务列表、护工列表
 * - 用户页同时请求用户信息、积分信息、订单列表
 * 
 * @param {Array<Object>} requests - 请求配置数组
 * @returns {Promise<Array>} 按顺序返回结果数组
 * 
 * @example
 * const results = await batchRequest([
 *   { name: 'getJobs', data: { category: 'job' } },
 *   { name: 'getServices', data: { category: 'service' } },
 *   { name: 'getCaregivers', data: { category: 'worker' } }
 * ])
 */
async function batchRequest(requests) {
  console.log(`[批量请求] 合并 ${requests.length} 个请求为 1 个云函数调用`);
  
  try {
    // 使用 Promise.all 并发执行所有请求
    const results = await Promise.all(
      requests.map(req => 
        wx.cloud.callFunction({
          name: req.name,
          data: req.data
        })
      )
    );
    
    return results.map(r => r.result);
  } catch (error) {
    console.error('[批量请求] 失败:', error);
    throw error;
  }
}

/**
 * 智能请求缓存 - 自动缓存和复用请求结果
 * 
 * 使用场景：
 * - 分类数据（职位分类、服务分类）- 整个会话期间不变
 * - 用户基础信息 - 变化频率低
 * - 积分规则 - 很少变化
 * 
 * @param {string} key - 缓存键（唯一标识）
 * @param {Function} requestFn - 发起请求的函数
 * @param {number} ttl - 缓存时间（毫秒，默认5分钟）
 * @returns {Promise<any>} 缓存或新请求的结果
 * 
 * @example
 * // 首次调用会发起请求，后续5分钟内直接返回缓存
 * const categories = await cacheRequest(
 *   'job-categories',
 *   () => wx.cloud.callFunction({
 *     name: 'getJobCategories',
 *     data: {}
 *   }),
 *   5 * 60 * 1000 // 5分钟
 * )
 */
async function cacheRequest(key, requestFn, ttl = 5 * 60 * 1000) {
  const now = Date.now();
  
  // 检查缓存是否有效
  if (requestCache.has(key)) {
    const cached = requestCache.get(key);
    if (now - cached.timestamp < ttl) {
      console.log(`[缓存命中] ${key} - 使用缓存数据`);
      return cached.data;
    } else {
      // 缓存已过期，删除
      requestCache.delete(key);
    }
  }
  
  // 检查是否有相同的请求正在处理中
  if (pendingRequests.has(key)) {
    console.log(`[请求合并] ${key} - 等待已有请求结果`);
    return pendingRequests.get(key);
  }
  
  // 发起新请求
  console.log(`[新请求] ${key}`);
  const requestPromise = requestFn()
    .then(result => {
      // 缓存结果
      requestCache.set(key, {
        data: result,
        timestamp: now
      });
      
      // 清理待处理队列
      pendingRequests.delete(key);
      
      return result;
    })
    .catch(error => {
      // 清理待处理队列
      pendingRequests.delete(key);
      throw error;
    });
  
  // 记录待处理请求
  pendingRequests.set(key, requestPromise);
  
  return requestPromise;
}

/**
 * 清除单个缓存
 */
function clearCache(key) {
  requestCache.delete(key);
  console.log(`[缓存清除] ${key}`);
}

/**
 * 清除所有缓存
 */
function clearAllCache() {
  requestCache.clear();
  console.log('[缓存清除] 已清除所有缓存');
}

/**
 * 获取缓存统计信息
 */
function getCacheStats() {
  return {
    cachedItems: requestCache.size,
    pendingRequests: pendingRequests.size,
    items: Array.from(requestCache.entries()).map(([key, value]) => ({
      key,
      age: Date.now() - value.timestamp
    }))
  };
}

// 导出函数
export {
  batchRequest,
  cacheRequest,
  clearCache,
  clearAllCache,
  getCacheStats
}
