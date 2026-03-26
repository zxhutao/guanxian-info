/**
 * 微信开发者工具云开发连接测试脚本
 * 在微信开发者工具的Console中运行此代码
 */

function testWechatCloudConnection() {
  console.log('🚀 开始测试微信云开发连接...')
  
  // 测试1：检查wx.cloud对象是否存在
  if (typeof wx !== 'undefined' && wx.cloud) {
    console.log('✅ wx.cloud对象存在')
    
    // 初始化云开发环境
    wx.cloud.init({
      env: 'cloudbase-1gkioadld4516142', // 你的TCB环境ID
      traceUser: true
    })
    
    console.log('✅ 云开发环境已初始化')
    
    // 测试2：尝试调用云函数（使用最简单的函数）
    wx.cloud.callFunction({
      name: 'getUserInfo', // 替换为实际存在的云函数名
      data: {},
      success: (res) => {
        console.log('✅ 云函数调用成功:', res)
        
        // 测试3：尝试读取数据库
        const db = wx.cloud.database()
        console.log('✅ 数据库对象:', db)
        
        // 尝试查询用户集合
        db.collection('users').limit(1).get({
          success: (res) => {
            console.log('✅ 数据库查询成功:', res)
            console.log('🎉 云开发连接测试完全通过！')
          },
          fail: (err) => {
            console.log('⚠️ 数据库查询失败（可能是权限问题）:', err)
            console.log('✅ 云开发基础连接正常，权限可能需要配置')
          }
        })
      },
      fail: (err) => {
        console.log('⚠️ 云函数调用失败:', err)
        
        // 检查具体错误
        if (err.errCode === 'cloud.callFunction:fail function not found') {
          console.log('❌ 错误：未找到云函数，请确认：')
          console.log('1. 云函数目录是否正确：uniCloud-tcb/cloudfunctions/')
          console.log('2. 是否正确部署了云函数到云端')
          console.log('3. 在微信开发者工具中检查云函数列表')
        } else if (err.errCode === 'cloud.callFunction:fail cloud not init') {
          console.log('❌ 错误：云开发未初始化')
          console.log('1. 检查app.js中的wx.cloud.init是否已调用')
          console.log('2. 确认环境ID是否正确')
        } else {
          console.log('❌ 其他错误，详情：', err)
        }
      }
    })
  } else {
    console.log('❌ wx.cloud对象不存在')
    console.log('可能原因：')
    console.log('1. 微信开发者工具版本过低')
    console.log('2. 未在app.json中配置cloudfunctionRoot')
    console.log('3. AppID未开通云开发功能')
  }
}

// 运行测试
testWechatCloudConnection()

// 辅助函数：检查云开发配置
function checkCloudConfig() {
  console.log('🔧 检查当前云开发配置...')
  
  // 读取app.json配置
  const fs = require('fs')
  const path = require('path')
  
  try {
    const appJsonPath = path.join(__dirname, 'app.json')
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'))
    
    console.log('📋 app.json配置：', {
      cloudfunctionRoot: appJson.cloudfunctionRoot,
      hasCloudConfig: !!appJson.cloudfunctionRoot
    })
  } catch (error) {
    console.log('⚠️ 无法读取app.json:', error.message)
  }
}

// 执行配置检查（需要在Node.js环境）
// checkCloudConfig()

console.log('📚 测试说明：')
console.log('1. 在微信开发者工具中打开任意页面')
console.log('2. 切换到Console面板')
console.log('3. 复制并粘贴上面的testWechatCloudConnection()函数定义')
console.log('4. 输入 testWechatCloudConnection() 并回车执行')
console.log('')
console.log('💡 解决问题步骤：')
console.log('1. 重启微信开发者工具')
console.log('2. 确认微信公众平台已开通云开发')
console.log('3. 检查project.config.json和app.json配置一致性')
console.log('4. 在开发者工具中：工具 → 编译配置 → 勾选"云开发调试模式"')