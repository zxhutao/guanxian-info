# 冠帮帮小程序 - 代码审查规范

**制定人**: 小H（代码审核）  
**版本**: v1.0  
**日期**: 2026-03-25  
**适用分支**: feature/* → develop → release/* → master

---

## 📋 目录

1. [审查流程概述](#1-审查流程概述)
2. [代码风格检查项](#2-代码风格检查项)
3. [性能检查项](#3-性能检查项)
4. [安全检查项](#4-安全检查项)
5. [测试覆盖检查项](#5-测试覆盖检查项)
6. [PR审查模板](#6-pr审查模板)
7. [优先级等级说明](#7-优先级等级说明)
8. [审查通过标准](#8-审查通过标准)

---

## 1. 审查流程概述

```
小K 提交 PR → 小H 代码审查 → 小G 功能测试 → 小C 最终验收合并
      ↓              ↓              ↓               ↓
  feature/xxx    审查报告       测试报告         合并 develop
```

### 审查时效要求

| PR 类型 | 审查时限 | 说明 |
|---------|---------|------|
| hotfix (紧急修复) | 2小时内 | 生产紧急修复，优先处理 |
| feature (功能开发) | 24小时内 | 正常功能迭代 |
| refactor (重构) | 48小时内 | 架构/代码优化 |

---

## 2. 代码风格检查项

### 2.1 通用规范

- [ ] **命名规范**
  - 变量/函数使用 camelCase（如 `getUserInfo`）
  - 组件名使用 PascalCase（如 `UserCard`）
  - 常量使用 UPPER_SNAKE_CASE（如 `MAX_RETRY_COUNT`）
  - 文件名与组件名保持一致
  
- [ ] **注释规范**
  - 复杂业务逻辑必须有注释说明
  - 公共函数必须有 JSDoc 注释（包含参数、返回值说明）
  - 临时代码或 TODO 必须标注负责人和日期：`// TODO(小K, 2026-03-25): 待优化`
  - 禁止保留无意义的注释代码（已注释掉的废弃代码请删除）

- [ ] **代码结构**
  - 函数职责单一，单函数不超过 60 行
  - 文件不超过 400 行（超过需考虑拆分）
  - 避免深层嵌套（最多 4 层）
  - 禁止 `console.log` 遗留在生产代码中（调试用 `console.log` 请在 PR 前删除）

### 2.2 Vue3 / uni-app 规范

- [ ] **组合式 API 使用规范**
  ```javascript
  // ✅ 正确：从各自包导入
  import { ref, computed, onMounted } from 'vue'
  import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
  
  // ❌ 错误：从 vue 导入小程序生命周期
  import { onLoad } from 'vue'
  ```

- [ ] **响应式数据**
  - 基础类型使用 `ref()`，对象/数组使用 `reactive()` 或 `ref()`
  - 避免直接修改 props（必须通过 emit）
  - computed 用于派生状态，避免在 template 中写复杂表达式

- [ ] **模板规范**
  - `v-for` 必须配合 `:key`，key 值必须是唯一且稳定的（禁止用 index 作 key）
  - `v-if` 与 `v-for` 不得同时用于同一元素
  - 图片统一使用 `<image>` 标签，不得使用 `<img>`

- [ ] **云函数调用规范**
  ```javascript
  // ✅ 正确：统一使用 utils/cloud.js 封装
  import { callCloud } from '@/utils/cloud.js'
  const result = await callCloud('functionName', params)
  
  // ❌ 错误：直接调用 wx.cloud
  wx.cloud.callFunction({ name: 'xxx', data: {} })
  ```

- [ ] **分享功能规范**
  - 分享图片必须使用 HTTPS 链接
  - `onShareAppMessage` 和 `onShareTimeline` 需从 `@dcloudio/uni-app` 导入

### 2.3 提交信息规范

提交信息必须符合以下格式：

```
<type>(<scope>): <subject>

[可选 body]

[可选 footer]
```

| type | 含义 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(job): 添加职位收藏功能` |
| `fix` | Bug修复 | `fix(chat): 修复表情面板遮挡输入框` |
| `perf` | 性能优化 | `perf(index): 首页请求合并优化` |
| `refactor` | 代码重构 | `refactor(utils): 提取时间格式化工具函数` |
| `style` | 样式调整 | `style(service): 调整服务卡片间距` |
| `docs` | 文档更新 | `docs: 更新部署指南` |
| `test` | 测试相关 | `test(login): 添加登录场景测试用例` |
| `chore` | 构建/工具 | `chore: 升级uni-app版本` |
| `hotfix` | 紧急修复 | `hotfix(security): 修复token校验漏洞` |

---

## 3. 性能检查项

### 3.1 图片优化

- [ ] 所有 `<image>` 标签是否添加了 `lazy-load` 属性
  ```vue
  <!-- ✅ 正确 -->
  <image lazy-load src="..." mode="aspectFill" />
  
  <!-- ❌ 未使用懒加载 -->
  <image src="..." mode="aspectFill" />
  ```
- [ ] 图片是否指定了 `width` 和 `height`，避免布局抖动
- [ ] 大图是否经过压缩处理（单张图片不超过 300KB）

### 3.2 请求优化

- [ ] 首页等高频页面是否使用了 `batchRequest` 合并请求（见 `utils/request-manager.js`）
- [ ] 频繁调用的接口是否使用了 `cacheRequest` 缓存（默认 TTL 5分钟）
- [ ] 是否使用了 `Promise.allSettled` 替代 `Promise.all`（防单个请求失败导致全部失败）
  ```javascript
  // ✅ 推荐：单个失败不影响其他
  const results = await Promise.allSettled(promises)
  
  // ⚠️ 谨慎：一个失败全部失败
  const results = await Promise.all(promises)
  ```
- [ ] 列表页是否实现了分页加载（避免一次性加载全部数据）

### 3.3 渲染优化

- [ ] 长列表是否使用虚拟列表或分页（列表项超过 50 条需要）
- [ ] 是否避免在 `template` 中调用函数（使用 `computed` 替代）
  ```vue
  <!-- ❌ 每次渲染都执行函数 -->
  <text>{{ formatTime(item.createTime) }}</text>
  
  <!-- ✅ 使用 computed 缓存 -->
  <text>{{ formattedTime }}</text>
  ```
- [ ] 非 TabBar 页面是否正确清理定时器和监听器（`onUnload` 中清理）

### 3.4 分包优化

- [ ] 新增页面是否放入了合适的分包（`subpackages/search/` 或 `subpackages/publish/`）
- [ ] 分包大小是否在限制范围内（单分包 < 2MB，总包 < 20MB）

### 3.5 云函数优化

- [ ] 云函数是否使用了数据库索引字段进行查询（已建立索引：jobs.status、services.status 等）
- [ ] 查询时是否使用了 `.field()` 限制返回字段（不返回不需要的字段）
  ```javascript
  // ✅ 只返回需要的字段
  db.collection('jobs').field({ title: true, salary: true, createTime: true }).get()
  
  // ❌ 返回所有字段
  db.collection('jobs').get()
  ```

---

## 4. 安全检查项

### 4.1 输入验证（云函数端）

- [ ] **必填字段验证**：所有必填字段在云函数中是否有非空检查
- [ ] **手机号格式验证**：
  ```javascript
  // ✅ 必须使用的验证函数
  const validatePhone = (phone) => /^1[3-9]\d{9}$/.test(phone?.trim())
  ```
- [ ] **数字字段边界检查**：年龄、人数、金额等数字字段是否有范围限制
- [ ] **文本长度检查**：标题（≤100字）、描述（≤500字）等是否有长度限制
- [ ] **敏感词过滤**：用户发布内容（职位/服务/评论）是否经过敏感词检查

### 4.2 身份验证

- [ ] 需要登录的云函数是否验证了 `openid` 非空
  ```javascript
  // ✅ 云函数中验证调用者身份
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) {
    return { success: false, msg: '未登录', code: 401 }
  }
  ```
- [ ] 用户只能操作自己的数据（发布的职位/服务/订单等需验证 openid 归属）
- [ ] Token 是否包含过期时间（不得使用无期限 token）

### 4.3 错误信息安全

- [ ] 云函数错误信息是否根据环境脱敏（使用统一的 `handleError` 函数）：
  ```javascript
  // ✅ 正确：生产环境不暴露详细错误
  const { handleError } = require('./utils')
  return handleError(error, '操作失败')
  
  // ❌ 错误：直接暴露错误信息
  return { success: false, msg: error.message }
  ```
- [ ] 是否避免在返回数据中包含敏感字段（如 openid、password 等）

### 4.4 数据操作安全

- [ ] 删除操作是否有权限校验（只能删除自己的数据）
- [ ] 金额/积分相关操作是否有防重放处理
- [ ] 是否避免了 N+1 查询（循环中不应有数据库查询）

### 4.5 前端安全

- [ ] 用户输入展示时是否防止 XSS（注意 `rich-text` 组件使用场景）
- [ ] `uni.getStorageSync` 返回值是否做了安全处理（防 `'undefined'` 字符串问题）：
  ```javascript
  // ✅ 安全获取 storage
  const getStorageSafely = (key, defaultValue) => {
    const value = uni.getStorageSync(key)
    return (value && value !== 'undefined') ? value : defaultValue
  }
  ```

---

## 5. 测试覆盖检查项

### 5.1 功能自测要求

提交 PR 前，小K 必须完成以下自测：

- [ ] **正常流程测试**：功能主路径是否正常工作
- [ ] **边界值测试**：空数据、最大值、最小值场景
- [ ] **网络异常测试**：断网、超时时功能表现是否友好
- [ ] **权限测试**：未登录状态下受保护功能是否正确跳转登录

### 5.2 新功能必测场景

| 功能类型 | 必测场景 |
|---------|---------|
| 列表页面 | 空列表提示、上拉加载更多、下拉刷新 |
| 表单提交 | 必填项为空、格式错误、提交成功/失败 |
| 详情页面 | 正常加载、数据不存在、分享功能 |
| 云函数 | 正常返回、参数缺失、超时处理 |
| 支付/积分 | 余额不足、重复提交、成功回调 |

### 5.3 回归测试要求

以下核心路径每次发布前必须回归测试（由小G执行）：

- [ ] 微信登录 → 获取用户信息
- [ ] 首页加载 → 各模块数据正常显示
- [ ] 发布职位/服务 → 发布成功 → 在列表中显示
- [ ] 聊天功能 → 发送消息 → 对方收到
- [ ] 签到 → 积分增加 → 积分明细更新
- [ ] 积分兑换 → 余额扣减 → 兑换记录

### 5.4 代码覆盖要求

- 云函数核心逻辑（登录、发布、积分、聊天）需有对应测试说明
- 工具函数（utils/）新增函数需在文档中说明使用方式和边界情况

---

## 6. PR审查模板

> 复制以下模板，填写后粘贴到 GitHub PR 描述中

```markdown
## 📌 PR 信息

- **功能描述**：[简要描述此 PR 做了什么]
- **关联任务**：[如有 Issue 或任务编号]
- **影响范围**：[列出受影响的页面/组件/云函数]

---

## ✅ 自测清单（小K 提交前填写）

### 功能验证
- [ ] 主流程已测试通过
- [ ] 边界情况已测试（空数据/超长输入/网络异常）
- [ ] 未登录跳转登录页已验证

### 代码自查
- [ ] 无遗留 `console.log`（调试日志已清理）
- [ ] 无注释掉的废弃代码
- [ ] 提交信息符合规范（如 `feat(job): 添加收藏功能`）
- [ ] 图片已添加 `lazy-load`
- [ ] 云函数调用使用了 `utils/cloud.js` 封装

### 安全自查
- [ ] 云函数输入字段已做验证
- [ ] 数据库操作已验证用户归属（openid 校验）
- [ ] 错误信息使用了统一处理函数（不直接暴露 error.message）

---

## 🔍 审查要点（小H 填写）

### 代码风格
- [ ] 命名规范符合团队规范
- [ ] 注释清晰，复杂逻辑有解释
- [ ] 无代码重复，工具函数已合理复用
- [ ] 函数单一职责，不超过 60 行

### 性能审查
- [ ] 图片使用懒加载
- [ ] 列表请求是否使用 batchRequest / cacheRequest
- [ ] 数据库查询使用了索引字段
- [ ] 查询使用了 .field() 限制返回字段

### 安全审查
- [ ] 云函数输入验证完整
- [ ] openid 验证存在（需登录的操作）
- [ ] 错误信息已脱敏
- [ ] 无敏感信息泄露（openid/密钥不在返回数据中）

### 测试覆盖
- [ ] 主流程覆盖
- [ ] 边界情况处理
- [ ] 异常场景友好提示

---

## 📊 审查结论（小H 填写）

**总体评分**：___/100

**优秀方面**：
- 

**需要修改**（必须修改后才能合并）：
- [ ] P0: 
- [ ] P1: 

**建议优化**（可选）：
- [ ] P2: 

**审查结论**：
- [ ] ✅ 通过，可以合并
- [ ] ⚠️ 需要修改，修改后重新审查
- [ ] ❌ 拒绝合并，请重新设计方案

---

## 🧪 测试报告（小G 填写）

**测试环境**：微信开发者工具 / 真机

**测试结论**：
- [ ] ✅ 测试通过
- [ ] ❌ 发现问题（见下方 Bug 列表）

**Bug 列表**：
| 编号 | 描述 | 严重程度 | 截图 |
|------|------|---------|------|
| - | - | - | - |
```

---

## 7. 优先级等级说明

| 等级 | 定义 | 处理要求 |
|------|------|---------|
| **P0 - 阻断** | 安全漏洞、数据丢失风险、崩溃 Bug | **必须修复，才能合并** |
| **P1 - 高** | 功能缺失、体验严重影响、稳定性问题 | **建议修复，否则需说明理由** |
| **P2 - 中** | 代码质量、性能微调、可读性问题 | **记录技术债务，下次迭代处理** |
| **P3 - 低** | 代码风格、注释完善、命名优化 | **可选，鼓励处理** |

### P0 典型示例
- Token 无验证/无过期时间
- 用户可操作他人数据（越权漏洞）
- 敏感信息（openid、密钥）直接返回前端
- 云函数无输入验证导致非法数据入库
- 应用崩溃（白屏、无限循环）

### P1 典型示例
- Promise.all 替代 Promise.allSettled（单请求失败导致全部失败）
- Storage 安全获取未处理（`'undefined'` 字符串问题）
- 列表无分页导致全量加载
- 错误处理缺失导致无反馈给用户

### P2 典型示例
- 图片未使用 lazy-load
- 重复代码未提取为工具函数
- 查询未限制返回字段（未使用 .field()）
- 时间格式化在多处重复实现

---

## 8. 审查通过标准

### 必须满足（无法豁免）
- ✅ 无 P0 级问题
- ✅ 无编译错误
- ✅ 提交信息符合规范
- ✅ 图片已添加 lazy-load
- ✅ 云函数关键操作有 openid 验证

### 建议满足（有理由可暂缓）
- ✅ 无 P1 级问题（或已记录技术债务）
- ✅ 代码质量评分 ≥ 85 分
- ✅ 小G 功能测试通过

### 可选优化
- P2/P3 问题处理
- 性能指标进一步提升
- 代码注释完善

---

## 📌 附录：项目规范速查

### 云函数目录
```
uniCloud-tcb/cloudfunctions/
├── login/          # 登录
├── publish/        # 发布招聘/服务
├── chat/           # 聊天（sendMessage/getHistory/getConversationList）
├── checkin/        # 每日签到
├── exchange/       # 积分兑换
├── point-deduct/   # 积分抵现
├── getUserInfo/    # 用户信息
├── getUserPoints/  # 积分查询
└── ...
```

### 工具函数目录
```
utils/
├── cloud.js           # 云函数统一调用封装
├── request-manager.js # 批量请求 & 缓存管理
├── navigation.js      # 页面跳转（isTabPage / smartNavigate）
└── time.js            # 时间格式化（formatRelativeTime）
```

### 已建立的数据库索引（不要破坏！）
```
jobs:               status+createTime, status+isVisible
services:           status+createTime, status+category
workers:            status+createTime, status+location
chat_conversations: participants+lastMessageTime
chat_messages:      conversationId+createTime
user_points:        _openid
checkin_history:    openid+createTime
```

### 积分规则（核心业务逻辑）
- 100积分 = 1元
- 最高抵扣20%，单笔上限50元
- 订单金额 ≥ 10元才可使用积分
- 成本分担：平台60% + 商家40%

---

*制定: 小H (代码审核)*  
*版本: v1.0 | 2026-03-25*  
*下次评审: 2026-04-25*
