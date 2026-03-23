/**
 * 数据库初始化脚本
 * 运行方式：在微信开发者工具控制台执行
 */

const db = wx.cloud.database()
const _ = db.command

// 初始化积分规则
async function initPointRules() {
  try {
    const res = await db.collection('point_rules').doc('default').get()
    console.log('积分规则已存在，跳过初始化')
    return res
  } catch (e) {
    // 文档不存在，创建初始数据
    await db.collection('point_rules').add({
      data: {
        _id: 'default',
        rules: [
          {
            key: 'pointsToYuan',
            value: 100,
            desc: '100积分=1元'
          },
          {
            key: 'maxDeductPercent',
            value: 20,
            desc: '最高抵扣20%'
          },
          {
            key: 'maxDeductPerOrder',
            value: 50,
            desc: '单笔最高抵扣50元'
          },
          {
            key: 'minOrderAmount',
            value: 10,
            desc: '订单满10元可用'
          },
          {
            key: 'enabledOrderTypes',
            value: ['job', 'service', 'nursing'],
            desc: '支持的订单类型'
          }
        ],
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
    console.log('✅ 积分规则初始化成功')
  }
}

// 创建集合（如果集合不存在会自动创建）
async function createCollections() {
  const collections = [
    'user_points',              // 用户积分账户
    'points_log',               // 积分流水记录
    'point_orders',             // 积分订单
    'merchant_settlements',     // 商家结算
    'point_rules',              // 积分规则
    'merchant_points_config'    // 商家积分配置
  ]
  
  for (const name of collections) {
    try {
      await db.collection(name).limit(1).get()
      console.log(`✅ 集合 ${name} 已存在`)
    } catch (e) {
      // 集合不存在，添加一个空文档来创建集合
      await db.collection(name).add({
        data: {
          _init: true,
          createTime: db.serverDate()
        }
      })
      // 删除初始化文档
      const res = await db.collection(name).where({ _init: true }).get()
      if (res.data.length > 0) {
        await db.collection(name).doc(res.data[0]._id).remove()
      }
      console.log(`✅ 集合 ${name} 创建成功`)
    }
  }
}

// 测试云函数
async function testCloudFunction() {
  try {
    const res = await wx.cloud.callFunction({
      name: 'point-deduct',
      data: { action: 'getPointRules' }
    })
    console.log('✅ 云函数测试成功:', res.result)
    return res.result
  } catch (e) {
    console.error('❌ 云函数测试失败:', e)
    throw e
  }
}

// 主函数
async function main() {
  console.log('🚀 开始初始化数据库...')
  
  try {
    // 1. 创建集合
    await createCollections()
    
    // 2. 初始化积分规则
    await initPointRules()
    
    // 3. 测试云函数
    await testCloudFunction()
    
    console.log('✅ 数据库初始化完成！')
    console.log('')
    console.log('📋 下一步：')
    console.log('1. 在微信开发者工具中测试下单页面')
    console.log('2. 验证积分抵扣功能')
    console.log('3. 测试商家结算功能')
    
  } catch (e) {
    console.error('❌ 初始化失败:', e)
  }
}

// 执行初始化
main()
