# 云函数部署指南

**部署日期**: 2026-03-24  
**项目**: 冠帮帮小程序（冠县信息港）  
**云环境**: cloudbase-1gkioadld4516142

---

## 待部署云函数清单

| 云函数 | 类型 | 修复内容 | 优先级 |
|--------|------|----------|--------|
| deleteItem | 新增 | 删除功能 | P0 |
| login | 修复 | Token安全性增强 | P0 |
| publish | 修复 | 输入验证加固 | P0 |
| point-deduct | 修复 | 错误信息脱敏 | P0 |
| exchange | 修复 | 错误信息脱敏 | P0 |

---

## 部署方式一：HBuilderX 部署（推荐）

### 步骤：

1. **打开项目**
   ```
   HBuilderX → 文件 → 打开目录 → D:\Documents\HBuilderProjects\冠县信息港
   ```

2. **部署单个云函数**
   ```
   展开 uniCloud-tcb/cloudfunctions/
   右键目标云函数文件夹（如 deleteItem）
   选择 "创建并部署：云端安装依赖"
   等待部署成功提示
   ```

3. **批量部署顺序**（建议按顺序）:
   - ① deleteItem（新增）
   - ② login（Token安全）
   - ③ publish（输入验证）
   - ④ point-deduct（错误脱敏）
   - ⑤ exchange（错误脱敏）

---

## 部署方式二：微信开发者工具部署

### 步骤：

1. **打开项目**
   ```
   微信开发者工具 → 打开项目 → 选择 D:\Documents\HBuilderProjects\冠县信息港
   ```

2. **等待初始化**
   - 等待云开发初始化完成
   - 确保底部状态栏显示 "云开发已就绪"

3. **部署云函数**
   ```
   展开 uniCloud-tcb/cloudfunctions/
   右键目标云函数文件夹
   选择 "创建并部署：云端安装依赖"
   ```

---

## 部署后验证

### 1. 云函数列表验证
在云开发控制台 → 云函数页面，确认以下云函数已部署：
- [ ] deleteItem
- [ ] login
- [ ] publish
- [ ] point-deduct
- [ ] exchange

### 2. 功能测试

```javascript
// 测试 deleteItem 云函数
wx.cloud.callFunction({
  name: 'deleteItem',
  data: { type: 'job', id: 'test-id' }
})

// 测试 login 云函数
wx.cloud.callFunction({
  name: 'login',
  data: {}
})

// 测试 publish 云函数
wx.cloud.callFunction({
  name: 'publish',
  data: {
    type: 'job',
    title: '测试职位',
    phone: '13800138000'
  }
})
```

---

## 数据库集合检查

确保以下数据库集合存在（如果不存在需手动创建）：

| 集合名 | 用途 |
|--------|------|
| jobs | 职位信息 |
| services | 服务信息 |
| nursing | 护工信息 |
| houses | 房屋信息 |
| carpools | 顺风车信息 |
| news | 资讯信息 |

---

## 常见问题

### Q1: 部署失败提示 "function not found"
**解决**: 确保云函数文件夹包含 `index.js` 和 `package.json`

### Q2: 部署后云函数显示"未激活"
**解决**: 首次调用云函数后会自动激活

### Q3: 登录云函数返回错误
**解决**: 确保已在微信开发者工具中开通云开发环境

---

## 部署完成确认

- [ ] 所有5个云函数部署成功
- [ ] 云函数测试通过
- [ ] 数据库集合已创建
- [ ] 小程序端功能正常

---

**技术支持**: 小H（安全修复）、小K（代码优化）
