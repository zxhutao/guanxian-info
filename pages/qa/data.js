/**
 * 问答社区模拟数据
 * 包含问题列表和回答列表
 */

// 用户列表
export const users = [
  { id: 'u001', nickname: '热心市民小王', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg' },
  { id: 'u002', nickname: '冠县老张', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg' },
  { id: 'u003', nickname: '求职达人', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg' },
  { id: 'u004', nickname: '房产顾问李姐', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg' },
  { id: 'u005', nickname: '两个孩子的妈', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg' },
  { id: 'u006', nickname: '冠县小青年', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg' },
  { id: 'u007', nickname: '退休教师王大爷', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg' },
  { id: 'u008', nickname: '创业者小李', avatar: 'https://img.yzcdn.cn/vant/cat.jpeg' }
]

// 问题列表
export const questionList = [
  {
    id: 'q001',
    title: '冠县哪里有比较好的牙科诊所？求推荐！',
    content: '我住在冠县县城，想找个靠谱的牙科诊所看牙，不知道有没有好的推荐？价格适中，服务态度好的那种。',
    category: 'life',
    reward: 10,
    status: 'solved',
    answerCount: 5,
    viewCount: 328,
    createTime: Date.now() - 3600000,
    author: users[0]
  },
  {
    id: 'q002',
    title: '冠县工业园区有哪些工厂在招工？',
    content: '我是农村来的，想在冠县找个工厂的工作，不知道工业园区有哪些厂在招人？希望包吃住的。',
    category: 'job',
    reward: 20,
    status: 'solved',
    answerCount: 8,
    viewCount: 562,
    createTime: Date.now() - 7200000,
    author: users[1]
  },
  {
    id: 'q003',
    title: '冠县实验小学入学有什么要求？',
    content: '我家孩子今年要上小学了，想问一下冠县实验小学的入学条件是什么？需要提前多久报名？',
    category: 'edu',
    reward: 15,
    status: 'solved',
    answerCount: 3,
    viewCount: 245,
    createTime: Date.now() - 86400000,
    author: users[4]
  },
  {
    id: 'q004',
    title: '冠县哪里有靠谱的月嫂？求推荐！',
    content: '老婆下个月要生了，想找个靠谱的月嫂照顾月子，有在冠县请过月嫂的朋友吗？求推荐！',
    category: 'life',
    reward: 50,
    status: 'unsolved',
    answerCount: 2,
    viewCount: 189,
    createTime: Date.now() - 172800000,
    author: users[4]
  },
  {
    id: 'q005',
    title: '冠县城区哪里有好的健身房？',
    content: '想找个健身房锻炼身体，不知道冠县有没有环境好、器械全的健身房？年卡多少钱？',
    category: 'life',
    reward: 5,
    status: 'unsolved',
    answerCount: 1,
    viewCount: 156,
    createTime: Date.now() - 259200000,
    author: users[5]
  },
  {
    id: 'q006',
    title: '冠县二手房交易有什么注意事项？',
    content: '想买一套二手房，第一次买房没什么经验，想问问冠县买二手房有什么需要注意的地方？',
    category: 'house',
    reward: 20,
    status: 'solved',
    answerCount: 6,
    viewCount: 423,
    createTime: Date.now() - 345600000,
    author: users[3]
  },
  {
    id: 'q007',
    title: '冠县哪家快递寄大件比较便宜？',
    content: '要寄一批家具回老家，问了几家快递都说太重了，有没有便宜点的寄送方式？',
    category: 'life',
    reward: 5,
    status: 'solved',
    answerCount: 4,
    viewCount: 298,
    createTime: Date.now() - 432000000,
    author: users[1]
  },
  {
    id: 'q008',
    title: '冠县哪里可以考电工证？',
    content: '想考个电工证，不知道冠县有没有正规的电工培训机构？学费大概多少？',
    category: 'edu',
    reward: 10,
    status: 'unsolved',
    answerCount: 1,
    viewCount: 167,
    createTime: Date.now() - 518400000,
    author: users[6]
  },
  {
    id: 'q009',
    title: '冠县有哪些好的装修公司推荐？',
    content: '新房要装修了，想找一家靠谱的装修公司，要求性价比高、质量有保障的！',
    category: 'house',
    reward: 30,
    status: 'unsolved',
    answerCount: 0,
    viewCount: 234,
    createTime: Date.now() - 604800000,
    author: users[7]
  },
  {
    id: 'q010',
    title: '冠县老年人活动中心在哪里？',
    content: '我爸退休了想找个地方活动活动，听说冠县有老年人活动中心，具体在哪里？有什么活动？',
    category: 'other',
    reward: 5,
    status: 'solved',
    answerCount: 3,
    viewCount: 189,
    createTime: Date.now() - 691200000,
    author: users[6]
  },
  {
    id: 'q011',
    title: '冠县哪里有靠谱的宠物医院？',
    content: '家里的猫咪生病了，想找个靠谱的宠物医院看看，冠县有宠物医院吗？',
    category: 'life',
    reward: 10,
    status: 'unsolved',
    answerCount: 2,
    viewCount: 145,
    createTime: Date.now() - 86400000 * 9,
    author: users[5]
  },
  {
    id: 'q012',
    title: '冠县幼儿园哪家好？收费多少？',
    content: '孩子3岁了想送幼儿园，不知道冠县哪个幼儿园比较好？收费大概什么标准？',
    category: 'edu',
    reward: 15,
    status: 'solved',
    answerCount: 5,
    viewCount: 356,
    createTime: Date.now() - 86400000 * 10,
    author: users[4]
  }
]

// 回答列表
export const answerList = [
  // q001的回答
  {
    id: 'a001',
    questionId: 'q001',
    content: '我之前在冠县中医院对面的牙科诊所看过牙，服务挺好的，医生技术也不错，价格也比较公道。你可以去看看。',
    isBest: true,
    likes: 12,
    createTime: Date.now() - 3500000,
    author: users[1]
  },
  {
    id: 'a002',
    questionId: 'q001',
    content: '推荐你去建设北路那家牙科，名字好像是微笑牙科，我蛀牙就是在那里补的，效果很好。',
    isBest: false,
    likes: 8,
    createTime: Date.now() - 3400000,
    author: users[3]
  },
  {
    id: 'a003',
    questionId: 'q001',
    content: '县医院口腔科可以的，就是人多需要排队。',
    isBest: false,
    likes: 5,
    createTime: Date.now() - 3300000,
    author: users[2]
  },
  {
    id: 'a004',
    questionId: 'q001',
    content: '振兴路上有一家私人口腔诊所，医生是省医院出来的，很专业！',
    isBest: false,
    likes: 6,
    createTime: Date.now() - 3200000,
    author: users[6]
  },
  {
    id: 'a005',
    questionId: 'q001',
    content: '别去那种小诊所，还是去正规医院口腔科靠谱一些。',
    isBest: false,
    likes: 3,
    createTime: Date.now() - 3100000,
    author: users[7]
  },

  // q002的回答
  {
    id: 'a006',
    questionId: 'q002',
    content: '我知道工业园区有几家大厂在招工：1.冠县光明玻璃厂 2.山东华兴金属 3.冠县纺织集团。都可以包吃住的，待遇也不错。',
    isBest: true,
    likes: 15,
    createTime: Date.now() - 7000000,
    author: users[2]
  },
  {
    id: 'a007',
    questionId: 'q002',
    content: '建议你直接去工业园区门口看看，很多厂都会在门口贴招聘启事。',
    isBest: false,
    likes: 7,
    createTime: Date.now() - 6900000,
    author: users[3]
  },
  {
    id: 'a008',
    questionId: 'q002',
    content: '冠县物流园那边也在招叉车司机、仓库管理员什么的，你可以去看看。',
    isBest: false,
    likes: 9,
    createTime: Date.now() - 6800000,
    author: users[0]
  },
  {
    id: 'a009',
    questionId: 'q002',
    content: '现在工厂招工都不难了，很多都是常年招人。',
    isBest: false,
    likes: 2,
    createTime: Date.now() - 6700000,
    author: users[5]
  },

  // q003的回答
  {
    id: 'a010',
    questionId: 'q003',
    content: '冠县实验小学入学需要：1.户口在本学区 2.房产证 3.接种证 4.体检证明。一般在6月份报名，建议提前准备材料。',
    isBest: true,
    likes: 10,
    createTime: Date.now() - 85000000,
    author: users[6]
  },
  {
    id: 'a011',
    questionId: 'q003',
    content: '我家孩子就是实验小学的，学校挺好的，就是名额有限，建议早点去报名。',
    isBest: false,
    likes: 6,
    createTime: Date.now() - 84000000,
    author: users[3]
  },
  {
    id: 'a012',
    questionId: 'q003',
    content: '可以关注学校官网或者打电话咨询，每年招生政策可能有变化。',
    isBest: false,
    likes: 4,
    createTime: Date.now() - 83000000,
    author: users[2]
  },

  // q004的回答
  {
    id: 'a013',
    questionId: 'q004',
    content: '我在冠县家政公司请过月嫂，姓刘，人特别细心，照顾产妇和宝宝都很专业。你可以联系她试试。',
    isBest: false,
    likes: 3,
    createTime: Date.now() - 170000000,
    author: users[0]
  },
  {
    id: 'a014',
    questionId: 'q004',
    content: '现在月嫂不好找，好的都被提前订走了。建议你多找几家家政公司问问。',
    isBest: false,
    likes: 2,
    createTime: Date.now() - 169000000,
    author: users[4]
  },

  // q006的回答
  {
    id: 'a015',
    questionId: 'q006',
    content: '买二手房最重要的几点：1.核实房产证和产权人信息 2.了解房屋是否有抵押或纠纷 3.确认水电物业费等是否结清 4.最好找正规中介。',
    isBest: true,
    likes: 18,
    createTime: Date.now() - 340000000,
    author: users[3]
  },
  {
    id: 'a016',
    questionId: 'q006',
    content: '建议找个靠谱的中介，虽然要付中介费，但是有保障很多。',
    isBest: false,
    likes: 8,
    createTime: Date.now() - 339000000,
    author: users[1]
  },
  {
    id: 'a017',
    questionId: 'q006',
    content: '冠县现在房价大概多少啊？我也想知道。',
    isBest: false,
    likes: 5,
    createTime: Date.now() - 338000000,
    author: users[7]
  },

  // q007的回答
  {
    id: 'a018',
    questionId: 'q007',
    content: '大件家具寄送建议找物流公司，比快递便宜很多。冠县物流园那边有很多物流公司，可以去问问。',
    isBest: true,
    likes: 11,
    createTime: Date.now() - 430000000,
    author: users[1]
  },
  {
    id: 'a019',
    questionId: 'q007',
    content: '我之前寄过家具，找的德邦物流，价格挺合理的，服务也不错。',
    isBest: false,
    likes: 7,
    createTime: Date.now() - 429000000,
    author: users[0]
  },

  // q010的回答
  {
    id: 'a020',
    questionId: 'q010',
    content: '冠县老年人活动中心在红旗北路老干部活动中心那边，里面有棋牌室、乒乓球室、书法室什么的，活动挺丰富的。',
    isBest: true,
    likes: 8,
    createTime: Date.now() - 690000000,
    author: users[6]
  },

  // q012的回答
  {
    id: 'a021',
    questionId: 'q012',
    content: '冠县比较好的幼儿园有：机关幼儿园、清华双语幼儿园、蓝天幼儿园。收费大概800-1500/月不等。',
    isBest: true,
    likes: 12,
    createTime: Date.now() - 864000000,
    author: users[4]
  }
]

// 获取问题的回答
export const getAnswersByQuestionId = (questionId) => {
  return answerList.filter(a => a.questionId === questionId)
}

// 导出所有数据
export const qaData = {
  users,
  questionList,
  answerList
}
