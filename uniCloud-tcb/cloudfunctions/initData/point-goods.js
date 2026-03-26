/**
 * 积分商城商品初始化数据
 */

const pointGoods = [
  {
    name: '满50减10元优惠券',
    description: '冠县本地商家通用',
    category: 'coupon',
    points: 100,
    stock: 999,
    status: 'on',
    sort: 1,
    image: 'https://img.yzcdn.cn/vant/coupon.png',
    createTime: new Date()
  },
  {
    name: '保洁服务8折券',
    description: '限冠县本地保洁服务',
    category: 'coupon',
    points: 200,
    stock: 999,
    status: 'on',
    sort: 2,
    image: 'https://img.yzcdn.cn/vant/coupon.png',
    createTime: new Date()
  },
  {
    name: '职位置顶卡（7天）',
    description: '发布的职位置顶展示7天',
    category: 'top',
    points: 500,
    stock: 999,
    status: 'on',
    sort: 3,
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    createTime: new Date()
  },
  {
    name: '冠县特色烧鸡',
    description: '本地特产，美味可口',
    category: 'product',
    points: 800,
    stock: 100,
    status: 'on',
    sort: 4,
    image: 'https://img.yzcdn.cn/vant/cat.jpeg',
    createTime: new Date()
  }
]

module.exports = pointGoods
