# Phase 3 积分抵现功能部署指南

## 📋 部署步骤

### 1. 部署云函数

在微信开发者工具中执行：

```
1. 右键 cloudfunctions/point-deduct 文件夹
2. 选择 "创建并部署：云端安装依赖"
3. 等待部署完成
```

### 2. 创建数据库集合

在云开发控制台 - 数据库中创建以下集合：

#### 2.1 point_orders（积分订单记录）
```json
{
  "_id": "string",
  "orderId": "string",
  "userId": "string",
  "merchantId": "string",
  "orderAmount": "number",
  "deductPoints": "number",
  "deductAmount": "number",
  "actualAmount": "number",
  "status": "number",
  "createdAt": "date",
  "confirmAt": "date"
}
```

#### 2.2 merchant_settlements（商家结算记录）
```json
{
  "_id": "string",
  "merchantId": "string",
  "orderId": "string",
  "orderAmount": "number",
  "deductAmount": "number",
  "settleAmount": "number",
  "costRatio": "number",
  "merchantCost": "number",
  "platformCost": "number",
  "status": "number",
  "settleDate": "date",
  "createdAt": "date"
}
```

#### 2.3 point_rules（积分规则配置）
```json
{
  "_id": "string",
  "rules": "array"
}
```

#### 2.4 merchant_points_config（商家积分配置）
```json
{
  "_id": "string",
  "enabled": "boolean",
  "costRatio": "number",
  "deductPercent": "number",
  "updatedAt": "date"
}
```

### 3. 初始化积分规则数据

在 `point_rules` 集合中插入初始数据：

```json
{
  "_id": "default",
  "rules": [
    {
      "key": "pointsToYuan",
      "value": 100,
      "desc": "100积分=1元"
    },
    {
      "key": "maxDeductPercent",
      "value": 20,
      "desc": "最高抵扣20%"
    },
    {
      "key": "maxDeductPerOrder",
      "value": 50,
      "desc": "单笔最高抵扣50元"
    },
    {
      "key": "minOrderAmount",
      "value": 10,
      "desc": "订单满10元可用"
    },
    {
      "key": "enabledOrderTypes",
      "value": ["job", "service", "nursing"],
      "desc": "支持的订单类型"
    }
  ]
}
```

### 4. 配置数据库权限

为所有集合设置权限：
- 用户积分账户：仅创建者可读写
- 积分订单记录：仅创建者可读写，管理员可读写
- 商家结算记录：仅商家可读写，管理员可读写
- 积分规则：所有用户可读，仅管理员可写

### 5. 测试云函数

部署完成后，在开发者工具中测试以下接口：

```javascript
// 测试获取积分规则
wx.cloud.callFunction({
  name: 'point-deduct',
  data: { action: 'getPointRules' }
})

// 测试获取用户积分
wx.cloud.callFunction({
  name: 'point-deduct',
  data: { action: 'getUserPoints' }
})

// 测试计算抵扣
wx.cloud.callFunction({
  name: 'point-deduct',
  data: {
    action: 'calculateDeduct',
    orderId: 'test123',
    orderAmount: 100,
    orderType: 'job'
  }
})
```

## ✅ 部署检查清单

- [ ] point-deduct 云函数已部署
- [ ] point_orders 集合已创建
- [ ] merchant_settlements 集合已创建
- [ ] point_rules 集合已创建
- [ ] merchant_points_config 集合已创建
- [ ] 积分规则初始数据已插入
- [ ] 数据库权限已配置
- [ ] 云函数接口测试通过

## 🐛 常见问题

### 1. 云函数部署失败
- 检查 package.json 格式是否正确
- 确认微信开发者工具已登录
- 检查云开发环境是否正常

### 2. 数据库权限错误
- 确认集合权限设置为"所有用户可读，仅创建者可写"
- 管理员操作需要设置 admin 权限

### 3. 积分计算不正确
- 检查 point_rules 数据是否正确
- 确认用户积分账户存在

## 📞 联系支持

部署过程中遇到问题请联系：
- 技术问题：小K
- 文案问题：小G
