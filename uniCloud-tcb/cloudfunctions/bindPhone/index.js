/*
 * 手机号绑定云函数
 * 支持发送验证码和验证绑定
 */

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 临时存储验证码（实际项目中应该使用Redis缓存）
const VerificationCollection = 'verifications'

// 生成6位随机数字验证码
function generateVerificationCode() {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  return code
}

// 发送短信验证码
async function sendSMSCode(phone, code) {
  // 注意：这里需要调用腾讯云短信服务
  // 但由于需要短信服务配置和付费，这里先模拟返回成功
  
  console.log(`\n========== [开发测试] 短信验证码 ==========`)
  console.log(`📱 手机号: ${phone}`)
  console.log(`🔐 验证码: ${code}`)
  console.log(`⏰ 有效期: 5分钟`)
  console.log(`============================================\n`)
  
  // 开发环境直接返回成功，方便测试
  // 生产环境需要接入真实短信服务
  return {
    success: true,
    phone,
    code
  }
}

// 主入口函数
exports.main = async (event, context) => {
  const { action, userId, phone, code } = event
  
  // 开发模式：跳过真实验证
  const IS_DEV_MODE = true
  
  try {
    if (action === 'send') {
      // 发送验证码
      if (!phone) {
        return {
          success: false,
          message: '手机号不能为空'
        }
      }
      
      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(phone)) {
        return {
          success: false,
          message: '手机号格式不正确'
        }
      }
      
      // 检查手机号是否已被其他用户绑定
      const userCheck = await db.collection('users')
        .where({
          phone: phone,
          _id: db.command.neq(userId)
        })
        .count()
      
      if (userCheck.total > 0) {
        return {
          success: false,
          message: '该手机号已被其他用户绑定'
        }
      }
      
      // 生成验证码
      const verificationCode = generateVerificationCode()
      
      // 保存验证码记录（有效期为5分钟）
      const now = Date.now()
      await db.collection(VerificationCollection).add({
        data: {
          phone,
          code: verificationCode,
          userId,
          createdAt: now,
          expiresAt: now + 5 * 60 * 1000, // 5分钟过期
          status: 'pending'
        }
      })
      
      // 发送短信验证码
      const sendResult = await sendSMSCode(phone, verificationCode)
      
      if (sendResult.success) {
        // 清理过期的验证码
        try {
          await db.collection(VerificationCollection)
            .where({
              expiresAt: db.command.lt(now)
            })
            .remove()
        } catch (cleanupErr) {
          console.warn('清理过期验证码失败:', cleanupErr)
        }
        
        return {
          success: true,
          message: '验证码已发送（开发模式：验证码见控制台日志）',
          phone: phone.slice(0, 3) + '****' + phone.slice(7), // 隐藏部分号码
          devCode: verificationCode // 开发测试用
        }
      } else {
        return {
          success: false,
          message: '验证码发送失败，请稍后重试'
        }
      }
      
    } else if (action === 'verify') {
      // 验证并绑定手机号
      if (!userId || !phone || !code) {
        return {
          success: false,
          message: '参数不完整'
        }
      }
      
      // 开发模式：跳过验证码验证，直接绑定
      if (IS_DEV_MODE) {
        console.log(`[开发模式] 跳过验证码验证，直接绑定手机号: ${phone}`)
      } else {
        // 查找验证码记录
        const verification = await db.collection(VerificationCollection)
          .where({
            phone,
            code,
            userId,
            status: 'pending',
            expiresAt: db.command.gt(now) // 未过期
          })
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get()
        
        if (verification.data.length === 0) {
          return {
            success: false,
            message: '验证码无效或已过期'
          }
        }
      }
      
      // 更新验证码状态为已使用（开发模式下跳过）
      if (!IS_DEV_MODE) {
        await db.collection(VerificationCollection)
          .doc(verification.data[0]._id)
          .update({
            data: {
              status: 'used',
              usedAt: now
            }
          })
      }
      
      // 更新用户手机号
      const now = Date.now()
      const updateResult = await db.collection('users')
        .doc(userId)
        .update({
          data: {
            phone: phone,
            updatedAt: now
          }
        })
      
      if (updateResult.stats.updated === 1) {
        return {
          success: true,
          message: '手机号绑定成功',
          phone
        }
      } else {
        // 用户不存在
        const userExists = await db.collection('users')
          .doc(userId)
          .count()
        
        if (userExists.total === 0) {
          return {
            success: false,
            message: '用户不存在'
          }
        }
        
        return {
          success: false,
          message: '手机号绑定失败，请稍后重试'
        }
      }
      
    } else if (action === 'unbind') {
      // 解绑手机号
      if (!userId) {
        return {
          success: false,
          message: '用户ID不能为空'
        }
      }
      
      // 更新用户手机号
      const updateResult = await db.collection('users')
        .doc(userId)
        .update({
          data: {
            phone: '',
            updatedAt: Date.now()
          }
        })
      
      if (updateResult.stats.updated === 1) {
        return {
          success: true,
          message: '手机号解绑成功'
        }
      } else {
        return {
          success: false,
          message: '解绑失败，请稍后重试'
        }
      }
      
    } else {
      return {
        success: false,
        message: '未知操作类型'
      }
    }
    
  } catch (error) {
    console.error('手机绑定功能异常:', error)
    return {
      success: false,
      message: '操作失败: ' + error.message
    }
  }
}