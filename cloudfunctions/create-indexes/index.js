/**
 * 云函数：create-indexes
 * 用途：批量建立数据库索引并验证性能
 * 执行时间：TASK-20260323-008 - 2026-03-23 下午
 */

const cloud = require('wx-server-sdk')
cloud.init({ env: process.env.CLOUD_ENV })
const db = cloud.database()

/**
 * 性能测试工具
 */
class IndexPerformanceTest {
  constructor() {
    this.results = []
    this.startTime = null
    this.endTime = null
  }

  async startTest(indexName, query, collection) {
    const start = Date.now()
    try {
      // 执行查询
      const result = await db.collection(collection)
        .where(query.where)
        .orderBy(query.orderBy.field, query.orderBy.direction)
        .limit(10)
        .get()
      
      const duration = Date.now() - start
      this.results.push({
        indexName,
        collection,
        duration,
        status: '✅ 成功',
        recordCount: result.data.length
      })
      return duration
    } catch (e) {
      this.results.push({
        indexName,
        collection,
        status: '❌ 失败',
        error: e.message
      })
      throw e
    }
  }

  getReport() {
    return {
      totalIndexes: this.results.length,
      successCount: this.results.filter(r => r.status === '✅ 成功').length,
      failureCount: this.results.filter(r => r.status === '❌ 失败').length,
      averageQueryTime: this.results
        .filter(r => r.duration)
        .reduce((a, b) => a + b.duration, 0) / this.results.filter(r => r.duration).length,
      details: this.results
    }
  }
}

/**
 * 主函数：建立索引和测试
 */
exports.main = async (event, context) => {
  const tester = new IndexPerformanceTest()
  const results = {
    phase: event.phase || 'all',
    timestamp: new Date().toISOString(),
    indexes: [],
    tests: []
  }

  try {
    console.log('[索引建立] 开始执行 TASK-20260323-008')
    
    // ===== P0-1: 聊天模块 (2个索引) =====
    if (event.phase === 'p0-1' || event.phase === 'all') {
      console.log('[P0-1] 建立聊天模块索引...')
      
      // 1. chat_conversations: participants + lastMessageTime
      try {
        await db.collection('chat_conversations').createIndex({
          name: 'participants_lastMessageTime_index',
          keys: { participants: 1, lastMessageTime: -1 }
        })
        results.indexes.push({
          collection: 'chat_conversations',
          index: 'participants_lastMessageTime_index',
          status: '✅ 建立成功'
        })
        console.log('✅ chat_conversations 索引建立成功')
      } catch (e) {
        console.error('❌ chat_conversations 索引建立失败:', e)
        results.indexes.push({
          collection: 'chat_conversations',
          index: 'participants_lastMessageTime_index',
          status: '❌ 建立失败',
          error: e.message
        })
      }

      // 2. chat_messages: conversationId + createTime
      try {
        await db.collection('chat_messages').createIndex({
          name: 'conversationId_createTime_index',
          keys: { conversationId: 1, createTime: 1 }
        })
        results.indexes.push({
          collection: 'chat_messages',
          index: 'conversationId_createTime_index',
          status: '✅ 建立成功'
        })
        console.log('✅ chat_messages 索引建立成功')
      } catch (e) {
        console.error('❌ chat_messages 索引建立失败:', e)
        results.indexes.push({
          collection: 'chat_messages',
          index: 'conversationId_createTime_index',
          status: '❌ 建立失败',
          error: e.message
        })
      }
    }

    // ===== P0-2: 核心业务表 (4个索引) =====
    if (event.phase === 'p0-2' || event.phase === 'all') {
      console.log('[P0-2] 建立核心业务索引...')
      
      const businessIndexes = [
        {
          collection: 'jobs',
          name: 'status_createTime_index',
          keys: { status: 1, createTime: -1 }
        },
        {
          collection: 'jobs',
          name: 'status_isVisible_index',
          keys: { status: 1, isVisible: 1 }
        },
        {
          collection: 'services',
          name: 'status_createTime_index',
          keys: { status: 1, createTime: -1 }
        },
        {
          collection: 'services',
          name: 'status_isVisible_index',
          keys: { status: 1, isVisible: 1 }
        }
      ]

      for (const idx of businessIndexes) {
        try {
          await db.collection(idx.collection).createIndex({
            name: idx.name,
            keys: idx.keys
          })
          results.indexes.push({
            collection: idx.collection,
            index: idx.name,
            status: '✅ 建立成功'
          })
          console.log(`✅ ${idx.collection}:${idx.name} 建立成功`)
        } catch (e) {
          console.error(`❌ ${idx.collection}:${idx.name} 建立失败:`, e)
          results.indexes.push({
            collection: idx.collection,
            index: idx.name,
            status: '❌ 建立失败',
            error: e.message
          })
        }
      }
    }

    // ===== P0-3: 用户中心 (2个索引) =====
    if (event.phase === 'p0-3' || event.phase === 'all') {
      console.log('[P0-3] 建立用户中心索引...')
      
      // 7. user_points: _openid
      try {
        await db.collection('user_points').createIndex({
          name: '_openid_index',
          keys: { _openid: 1 }
        })
        results.indexes.push({
          collection: 'user_points',
          index: '_openid_index',
          status: '✅ 建立成功'
        })
        console.log('✅ user_points 索引建立成功')
      } catch (e) {
        console.error('❌ user_points 索引建立失败:', e)
        results.indexes.push({
          collection: 'user_points',
          index: '_openid_index',
          status: '❌ 建立失败',
          error: e.message
        })
      }

      // 8. checkin_history: openid + createTime
      try {
        await db.collection('checkin_history').createIndex({
          name: 'openid_createTime_index',
          keys: { openid: 1, createTime: -1 }
        })
        results.indexes.push({
          collection: 'checkin_history',
          index: 'openid_createTime_index',
          status: '✅ 建立成功'
        })
        console.log('✅ checkin_history 索引建立成功')
      } catch (e) {
        console.error('❌ checkin_history 索引建立失败:', e)
        results.indexes.push({
          collection: 'checkin_history',
          index: 'openid_createTime_index',
          status: '❌ 建立失败',
          error: e.message
        })
      }
    }

    // ===== 性能验证测试 =====
    if (event.runTests) {
      console.log('[测试] 开始性能验证...')
      
      const testQueries = [
        {
          name: 'chat_conversations_query',
          collection: 'chat_conversations',
          where: { participants: event.testOpenid || 'test' },
          orderBy: { field: 'lastMessageTime', direction: 'desc' }
        },
        {
          name: 'jobs_status_query',
          collection: 'jobs',
          where: { status: 1 },
          orderBy: { field: 'createTime', direction: 'desc' }
        },
        {
          name: 'services_visible_query',
          collection: 'services',
          where: { status: 1, isVisible: true },
          orderBy: { field: 'createTime', direction: 'desc' }
        }
      ]

      for (const query of testQueries) {
        try {
          await tester.startTest(query.name, query, query.collection)
          results.tests.push({
            name: query.name,
            status: '✅ 通过'
          })
        } catch (e) {
          console.error(`❌ 测试失败 ${query.name}:`, e)
          results.tests.push({
            name: query.name,
            status: '❌ 失败',
            error: e.message
          })
        }
      }

      results.testReport = tester.getReport()
    }

    console.log('[完成] 索引建立和测试完成')
    return {
      code: 0,
      message: '✅ 索引建立完成',
      data: results
    }

  } catch (error) {
    console.error('[错误] 执行过程中出错:', error)
    return {
      code: -1,
      message: '❌ 执行失败',
      error: error.message,
      data: results
    }
  }
}
