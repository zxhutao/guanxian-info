# 云数据库初始化指南

## 集合列表

根据项目功能需求，需要创建以下数据库集合：

### 1. users - 用户信息
- 描述：存储用户基本信息和认证信息
- 权限：所有用户可读，仅创建者可写

**字段结构：**
```json
{
  "_openid": "用户OpenID",
  "nickName": "用户昵称",
  "avatarUrl": "头像URL",
  "phone": "手机号",
  "createTime": "创建时间",
  "updateTime": "更新时间"
}
```

---

### 2. resumes - 简历信息 ⚠️ **必须创建**
- 描述：存储用户简历数据
- 权限：所有用户可读，仅创建者可写

**字段结构：**
```json
{
  "_openid": "用户OpenID",
  "avatar": "头像URL",
  "name": "姓名",
  "gender": "性别",
  "age": "年龄",
  "phone": "联系电话",
  "education": "学历",
  "expectedJob": "期望职位",
  "expectedSalary": "期望薪资",
  "workArea": "工作区域",
  "jobType": "工作类型",
  "workExperience": [
    {
      "company": "公司名称",
      "position": "职位",
      "startTime": "开始时间",
      "endTime": "结束时间",
      "desc": "描述"
    }
  ],
  "intro": "自我介绍",
  "createTime": "创建时间",
  "updateTime": "更新时间"
}
```

---

### 3. jobs - 招聘信息
- 描述：存储招聘职位信息
- 权限：所有用户可读，创建者和管理员可写

**字段结构：**
```json
{
  "_openid": "发布者OpenID",
  "title": "职位名称",
  "company": "公司名称",
  "salary": "薪资范围",
  "workArea": "工作区域",
  "education": "学历要求",
  "experience": "经验要求",
  "desc": "职位描述",
  "contact": "联系方式",
  "status": "状态（active/closed）",
  "viewCount": "浏览次数",
  "createTime": "创建时间",
  "updateTime": "更新时间"
}
```

---

### 4. services - 服务信息
- 描述：存储生活服务信息
- 权限：所有用户可读，创建者和管理员可写

**字段结构：**
```json
{
  "_openid": "发布者OpenID",
  "title": "服务标题",
  "category": "服务分类",
  "price": "价格",
  "area": "服务区域",
  "desc": "服务描述",
  "images": ["图片URL数组"],
  "contact": "联系方式",
  "status": "状态（active/closed）",
  "viewCount": "浏览次数",
  "createTime": "创建时间",
  "updateTime": "更新时间"
}
```

---

### 5. caregivers - 护工信息
- 描述：存储养老护工信息
- 权限：所有用户可读，创建者和管理员可写

**字段结构：**
```json
{
  "_openid": "发布者OpenID",
  "name": "护工姓名",
  "age": "年龄",
  "gender": "性别",
  "experience": "从业经验",
  "skills": "技能特长",
  "price": "服务价格",
  "area": "服务区域",
  "desc": "个人简介",
  "images": ["图片URL数组"],
  "contact": "联系方式",
  "status": "状态（active/closed）",
  "viewCount": "浏览次数",
  "createTime": "创建时间",
  "updateTime": "更新时间"
}
```

---

### 6. checkin_records - 签到记录
- 描述：存储用户签到记录
- 权限：仅创建者可读写

**字段结构：**
```json
{
  "_openid": "用户OpenID",
  "date": "签到日期（YYYY-MM-DD）",
  "points": "获得的积分",
  "continuousDays": "连续签到天数",
  "createTime": "创建时间"
}
```

---

### 7. points_records - 积分记录
- 描述：存储用户积分变动记录
- 权限：仅创建者可读写

**字段结构：**
```json
{
  "_openid": "用户OpenID",
  "type": "类型（earn/deduct）",
  "points": "积分变动数量",
  "reason": "变动原因",
  "createTime": "创建时间"
}
```

---

### 8. exchange_records - 兑换记录
- 描述：存储积分兑换记录
- 权限：仅创建者可读写

**字段结构：**
```json
{
  "_openid": "用户OpenID",
  "itemId": "兑换项ID",
  "itemName": "兑换项名称",
  "points": "消耗积分",
  "status": "状态（success/failed）",
  "createTime": "创建时间"
}
```

---

### 9. orders - 订单记录
- 描述：存储订单信息
- 权限：仅创建者和管理员可读写

**字段结构：**
```json
{
  "_openid": "用户OpenID",
  "orderId": "订单编号",
  "type": "订单类型（job/service/caregiver）",
  "itemId": "关联项目ID",
  "itemName": "项目名称",
  "amount": "订单金额",
  "pointsDeduct": "积分抵扣金额",
  "status": "订单状态（pending/paid/completed/cancelled）",
  "createTime": "创建时间",
  "updateTime": "更新时间"
}
```

---

## 创建步骤

### 方法一：通过微信开发者工具（推荐）

1. 打开微信开发者工具
2. 点击顶部菜单 **"云开发"**
3. 在左侧导航栏选择 **"数据库"**
4. 点击 **"+"** 按钮创建新集合
5. 输入集合名称（如 `resumes`）
6. 点击 **"确定"**

重复以上步骤，创建所有需要的集合。

---

### 方法二：通过云开发控制台网页

1. 访问 [微信云开发控制台](https://console.cloud.tencent.com/tcb)
2. 登录并选择你的环境（cloudbase-1gkioadld4516142）
3. 在左侧导航栏选择 **"数据库"**
4. 点击 **"添加集合"**
5. 输入集合名称
6. 点击 **"确定"**

---

### 方法三：使用云函数批量创建（需要编写云函数）

可以编写一个云函数，调用 `db.createCollection()` API 批量创建集合。

---

## 权限设置建议

| 集合名称 | 所有用户可读 | 所有用户可写 | 仅创建者可写 |
|---------|-----------|-----------|-----------|
| users | ✓ | ✗ | ✓ |
| resumes | ✓ | ✗ | ✓ |
| jobs | ✓ | ✗ | ✓ |
| services | ✓ | ✗ | ✓ |
| caregivers | ✓ | ✗ | ✓ |
| checkin_records | ✗ | ✗ | ✓ |
| points_records | ✗ | ✗ | ✓ |
| exchange_records | ✗ | ✗ | ✓ |
| orders | ✗ | ✗ | ✓ |

---

## 索引建议

为提高查询性能，建议为以下字段创建索引：

### resumes
- `_openid`（唯一索引）

### jobs
- `_openid`（用于查询某用户发布的职位）
- `status`（用于筛选有效职位）
- `createTime`（用于排序）

### services
- `_openid`
- `category`
- `status`
- `createTime`

### caregivers
- `_openid`
- `status`
- `createTime`

### checkin_records
- `_openid` + `date`（复合索引，用于查询某用户某日期是否已签到）

### points_records
- `_openid`
- `createTime`

---

## 常见问题

### Q1: 为什么代码里调用 `db.collection('xxx').add()` 不自动创建集合？

**A**: 微信云开发中，集合默认不会自动创建。虽然某些情况下（如使用云函数）可能会自动创建，但为了确保程序稳定运行，建议**先在控制台手动创建所有需要的集合**。

---

### Q2: 如何设置集合权限？

**A**:
1. 在数据库页面点击集合名称进入详情
2. 点击 **"权限设置"**
3. 选择合适的权限模板（所有用户可读/仅创建者可写等）
4. 点击 **"保存"**

---

### Q3: 如何验证集合是否创建成功？

**A**:
1. 打开微信开发者工具 → 云开发 → 数据库
2. 应该能看到刚创建的集合名称
3. 点击集合名称，可以查看和编辑数据

---

## 注意事项

1. ⚠️ **resumes 集合必须先创建，否则简历保存功能无法正常工作**
2. 集合名称区分大小写，建议使用小写字母
3. 集合一旦创建，名称无法修改（只能删除重建）
4. 生产环境建议使用更严格的权限设置
5. 删除集合会丢失所有数据，请谨慎操作
