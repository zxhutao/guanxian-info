const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const {
    userId,
    profile
  } = event

  // 参数检查
  if (!userId) {
    return {
      success: false,
      message: '用户ID不能为空'
    }
  }

  try {
    console.log('更新用户信息参数:', event)

    // 构建更新数据
    const updateData = {
      'profile.nickname': profile.nickname || '',
      'profile.avatar': profile.avatar || '',
      'profile.phone': profile.phone || '',
      userType: profile.userType || 'jobseeker',
      updatedAt: db.serverDate()
    }

    // 更新用户信息
    const result = await db.collection('users')
      .doc(userId)
      .update({
        data: updateData
      })

    console.log('更新结果:', result)

    if (result.stats.updated === 0) {
      return {
        success: false,
        message: '未找到用户或更新失败'
      }
    }

    return {
      success: true,
      message: '更新成功',
      data: {
        userId,
        profile: {
          nickname: profile.nickname,
          avatar: profile.avatar,
          phone: profile.phone,
          userType: profile.userType
        }
      }
    }

  } catch (e) {
    console.error('更新用户信息失败:', e)
    return {
      success: false,
      message: '更新用户信息失败: ' + e.message
    }
  }
}