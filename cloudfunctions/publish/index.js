const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { type, data } = event

  if (!type || !data) {
    return { code: -1, message: '参数不完整' }
  }

  try {
    let collectionName = ''
    let requiredFields = []

    switch (type) {
      case 'job':
        collectionName = 'jobs'
        requiredFields = ['title', 'company', 'salary', 'phone']
        break
      case 'service':
        collectionName = 'services'
        requiredFields = ['name', 'provider', 'price', 'phone']
        break
      case 'nursing':
        collectionName = 'workers'
        requiredFields = ['name', 'gender', 'experience', 'price', 'phone']
        break
      default:
        return { code: -2, message: '无效的类型' }
    }

    // 验证必填字段
    for (const field of requiredFields) {
      if (!data[field]) {
        return { code: -3, message: `缺少必填字段: ${field}` }
      }
    }

    // 添加元数据
    const record = {
      ...data,
      _openid: wxContext.OPENID,
      createTime: db.serverDate(),
      status: 1, // 1: 招聘中/服务中, 0: 已下架
      viewCount: 0
    }

    // 存入数据库
    const result = await db.collection(collectionName).add({
      data: record
    })

    return {
      code: 0,
      message: '发布成功',
      data: {
        id: result._id,
        type
      }
    }
  } catch (err) {
    console.error('发布失败:', err)
    return { code: -100, message: '发布失败: ' + err.message }
  }
}
