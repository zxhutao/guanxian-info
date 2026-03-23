/**
 * 冠县114电话本数据
 * 包含冠县常用电话号码，按分类整理
 */

export const phoneCategories = [
  { id: 'hospital', name: '医院急救', icon: '🏥', color: '#E63946' },
  { id: 'school', name: '学校幼儿园', icon: '🏫', color: '#4A90D9' },
  { id: 'government', name: '政府机关', icon: '🏛️', color: '#8B4513' },
  { id: 'express', name: '快递物流', icon: '📦', color: '#F5A623' },
  { id: 'bank', name: '银行保险', icon: '🏦', color: '#50C878' },
  { id: 'utility', name: '水电燃气', icon: '💡', color: '#FF6B6B' },
  { id: 'service', name: '常用服务', icon: '☎️', color: '#9B59B6' }
]

export const phonebookData = [
  // ==================== 医院急救 ====================
  {
    id: 'h001',
    name: '冠县人民医院',
    phone: '0635-5231220',
    address: '冠县冠城镇红旗北路',
    category: 'hospital',
    description: '二级甲等综合医院'
  },
  {
    id: 'h002',
    name: '冠县中医院',
    phone: '0635-5232951',
    address: '冠县冠城镇建设北路',
    category: 'hospital',
    description: '中医特色综合医院'
  },
  {
    id: 'h003',
    name: '冠县妇幼保健院',
    phone: '0635-5232345',
    address: '冠县冠城镇振兴东路',
    category: 'hospital',
    description: '妇女儿童专科医院'
  },
  {
    id: 'h004',
    name: '冠县中心医院',
    phone: '0635-5231001',
    address: '冠县清泉街道办事处',
    category: 'hospital',
    description: '社区服务中心'
  },
  {
    id: 'h005',
    name: '急救中心',
    phone: '120',
    address: '冠县城区',
    category: 'hospital',
    description: '24小时急救热线'
  },

  // ==================== 学校幼儿园 ====================
  {
    id: 's001',
    name: '冠县第一中学',
    phone: '0635-5231888',
    address: '冠县冠城镇建设南路',
    category: 'school',
    description: '省级示范性高中'
  },
  {
    id: 's002',
    name: '冠县实验中学',
    phone: '0635-5231999',
    address: '冠县冠城镇红旗南路',
    category: 'school',
    description: '重点初中'
  },
  {
    id: 's003',
    name: '冠县实验小学',
    phone: '0635-5231777',
    address: '冠县冠城镇健康路',
    category: 'school',
    description: '省级规范化小学'
  },
  {
    id: 's004',
    name: '冠县第二实验小学',
    phone: '0635-5231666',
    address: '冠县冠城镇振兴西路',
    category: 'school',
    description: '重点小学'
  },
  {
    id: 's005',
    name: '冠县机关幼儿园',
    phone: '0635-5231555',
    address: '冠县县委县政府院内',
    category: 'school',
    description: '县直机关幼儿园'
  },
  {
    id: 's006',
    name: '冠县清华双语幼儿园',
    phone: '0635-5286001',
    address: '冠县建设北路',
    category: 'school',
    description: '双语特色幼儿园'
  },

  // ==================== 政府机关 ====================
  {
    id: 'g001',
    name: '冠县人民政府',
    phone: '0635-5231001',
    address: '冠县冠城镇红旗北路',
    category: 'government',
    description: '县政府办公室'
  },
  {
    id: 'g002',
    name: '冠县公安局',
    phone: '0635-5231002',
    address: '冠县冠城镇建设北路',
    category: 'government',
    description: '公安服务窗口'
  },
  {
    id: 'g003',
    name: '冠县民政局',
    phone: '0635-5231003',
    address: '冠县冠城镇振兴东路',
    category: 'government',
    description: '婚姻登记、救助等'
  },
  {
    id: 'g004',
    name: '冠县人力资源和社会保障局',
    phone: '0635-5231004',
    address: '冠县冠城镇劳动大厦',
    category: 'government',
    description: '社保、医保、就业'
  },
  {
    id: 'g005',
    name: '冠县市场监督管理局',
    phone: '0635-5231231',
    address: '冠县冠城镇建设南路',
    category: 'government',
    description: '营业执照、消费投诉'
  },
  {
    id: 'g006',
    name: '冠县税务局',
    phone: '0635-5231234',
    address: '冠县冠城镇税务大厦',
    category: 'government',
    description: '税务咨询、发票办理'
  },

  // ==================== 快递物流 ====================
  {
    id: 'e001',
    name: '顺丰速运冠县网点',
    phone: '95338',
    address: '冠县快递物流园',
    category: 'express',
    description: '顺丰官方客服'
  },
  {
    id: 'e002',
    name: '圆通速递冠县公司',
    phone: '021-69777888',
    address: '冠县物流园区A区',
    category: 'express',
    description: '快递寄件、取件'
  },
  {
    id: 'e003',
    name: '中通快递冠县网点',
    phone: '021-64710000',
    address: '冠县物流园区B区',
    category: 'express',
    description: '快递服务'
  },
  {
    id: 'e004',
    name: '韵达快递冠县公司',
    phone: '021-39295556',
    address: '冠县物流园区C区',
    category: 'express',
    description: '快递服务'
  },
  {
    id: 'e005',
    name: '京东快递冠县站',
    phone: '950616',
    address: '冠县城区',
    category: 'express',
    description: '京东配送'
  },
  {
    id: 'e006',
    name: '邮政速递(EMS)冠县',
    phone: '11183',
    address: '冠县邮电局',
    category: 'express',
    description: 'EMS特快专递'
  },

  // ==================== 银行保险 ====================
  {
    id: 'b001',
    name: '中国工商银行冠县支行',
    phone: '0635-5231005',
    address: '冠县冠城镇工商银行大楼',
    category: 'bank',
    description: '储蓄、贷款、理财'
  },
  {
    id: 'b002',
    name: '中国农业银行冠县支行',
    phone: '0635-5231006',
    address: '冠县冠城镇农行大楼',
    category: 'bank',
    description: '储蓄、贷款、惠农服务'
  },
  {
    id: 'b003',
    name: '中国建设银行冠县支行',
    phone: '0635-5231007',
    address: '冠县冠城镇建行大楼',
    category: 'bank',
    description: '储蓄、贷款、信用卡'
  },
  {
    id: 'b004',
    name: '中国银行冠县支行',
    phone: '0635-5231008',
    address: '冠县冠城镇中行大楼',
    category: 'bank',
    description: '国际业务、外币兑换'
  },
  {
    id: 'b005',
    name: '冠县农村商业银行',
    phone: '0635-5231009',
    address: '冠县冠城镇信用社大楼',
    category: 'bank',
    description: '本地金融服务'
  },
  {
    id: 'b006',
    name: '中国人寿保险冠县支公司',
    phone: '0635-5231010',
    address: '冠县冠城镇保险公司大楼',
    category: 'bank',
    description: '寿险、意外险、健康险'
  },

  // ==================== 水电燃气 ====================
  {
    id: 'u001',
    name: '冠县自来水公司',
    phone: '0635-5232001',
    address: '冠县水务局',
    category: 'utility',
    description: '自来水报装、缴费'
  },
  {
    id: 'u002',
    name: '国家电网冠县供电公司',
    phone: '0635-5231000',
    address: '冠县供电大厦',
    category: 'utility',
    description: '电费缴纳、报修'
  },
  {
    id: 'u003',
    name: '冠县奥德燃气公司',
    phone: '0635-5232111',
    address: '冠县燃气公司',
    category: 'utility',
    description: '燃气开户、缴费、维修'
  },
  {
    id: 'u004',
    name: '冠县供热公司',
    phone: '0635-5232222',
    address: '冠县热力公司',
    category: 'utility',
    description: '暖气报装、缴费'
  },

  // ==================== 常用服务 ====================
  {
    id: 'c001',
    name: '冠县家政服务公司',
    phone: '0635-5286001',
    address: '冠县城区',
    category: 'service',
    description: '保洁、保姆、月嫂'
  },
  {
    id: 'c002',
    name: '冠县开锁服务中心',
    phone: '0635-5286002',
    address: '冠县城区',
    category: 'service',
    description: '开锁、换锁服务'
  },
  {
    id: 'c003',
    name: '冠县管道疏通服务',
    phone: '0635-5286003',
    address: '冠县城区',
    category: 'service',
    description: '下水道、管道疏通'
  },
  {
    id: 'c004',
    name: '冠县搬家公司',
    phone: '0635-5286004',
    address: '冠县城区',
    category: 'service',
    description: '居民搬家、货物搬运'
  },
  {
    id: 'c005',
    name: '冠县电脑维修中心',
    phone: '0635-5286005',
    address: '冠县科技市场',
    category: 'service',
    description: '电脑维修、网络安装'
  },
  {
    id: 'c006',
    name: '冠县锁具批发中心',
    phone: '0635-5286006',
    address: '冠县五金市场',
    category: 'service',
    description: '锁具销售、安装'
  },
  {
    id: 'c007',
    name: '出租车叫车热线',
    phone: '0635-5231234',
    address: '冠县出租车公司',
    category: 'service',
    description: '叫车服务'
  },
  {
    id: 'c008',
    name: '冠县殡葬服务中心',
    phone: '0635-5231888',
    address: '冠县民政局',
    category: 'service',
    description: '殡葬一条龙服务'
  },
  {
    id: 'c009',
    name: '冠县律师事务所',
    phone: '0635-5231999',
    address: '冠县司法局',
    category: 'service',
    description: '法律咨询、诉讼代理'
  },
  {
    id: 'c010',
    name: '美的空调维修冠县站',
    phone: '400-889-9315',
    address: '冠县城区',
    category: 'service',
    description: '空调安装、维修、清洗'
  },
  {
    id: 'c011',
    name: '海尔电器冠县售后',
    phone: '400-699-9999',
    address: '冠县家电市场',
    category: 'service',
    description: '冰箱、洗衣机、热水器维修'
  },
  {
    id: 'c012',
    name: '冠县申通快递',
    phone: '0431-88668999',
    address: '冠县物流园区',
    category: 'service',
    description: '快递寄件取件服务'
  }
]

// 根据分类获取数据
export const getPhonesByCategory = (categoryId) => {
  return phonebookData.filter(item => item.category === categoryId)
}

// 搜索电话
export const searchPhones = (keyword) => {
  if (!keyword || keyword.trim() === '') {
    return []
  }
  const k = keyword.toLowerCase().trim()
  return phonebookData.filter(item => 
    item.name.toLowerCase().includes(k) ||
    item.phone.includes(k) ||
    item.description.toLowerCase().includes(k) ||
    item.address.toLowerCase().includes(k)
  )
}
