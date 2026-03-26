# 云函数部署验证测试计划
**测试员**：小G  
**审核通过**：小H  
**日期**：2026-03-25  
**状态**：等待部署完成后执行

---

## 测试范围

部署的7个云函数：
- `deleteItem`（权限修复版）
- `jobList`
- `getWorkers`
- `chat/sendMessage`
- `chat/getConversationList`
- `chat/getHistory`
- `chat/markAsRead`

---

## 测试用例

---

### TC-01：deleteItem 权限验证

**云函数**：`deleteItem`  
**测试目的**：验证只有发布者本人可以删除，他人无法越权删除

| # | 测试场景 | 入参 | 期望返回 | 结果 |
|---|---------|------|---------|------|
| 1.1 | 发布者删自己的职位 | `{type:"job", id:"自己发布的id"}` | `{code:0, message:"删除成功"}` | ⬜ |
| 1.2 | 发布者删自己的服务 | `{type:"service", id:"自己发布的id"}` | `{code:0, message:"删除成功"}` | ⬜ |
| 1.3 | 他人尝试删别人职位 | `{type:"job", id:"他人发布的id"}` | `{code:-1, message:"无权删除该记录"}` | ⬜ |
| 1.4 | 缺少id参数 | `{type:"job"}` | `{code:-1, message:"缺少必要参数"}` | ⬜ |
| 1.5 | 缺少type参数 | `{id:"某id"}` | `{code:-1, message:"缺少必要参数"}` | ⬜ |
| 1.6 | 不支持的type | `{type:"unknown", id:"某id"}` | `{code:-1, message:"不支持的类型"}` | ⬜ |
| 1.7 | 不存在的id | `{type:"job", id:"不存在的id"}` | `{code:-1, message:"记录不存在"}` | ⬜ |

**关键验证点**：权限校验基于 `_openid` 字段，需在已登录状态下调用

---

### TC-02：jobList 职位列表

**云函数**：`jobList`  
**测试目的**：验证分页、分类筛选、关键词搜索功能正常

| # | 测试场景 | 入参 | 期望返回 | 结果 |
|---|---------|------|---------|------|
| 2.1 | 默认查询（无参数） | `{}` | `{success:true, data:[...], total:N}` 返回前10条 | ⬜ |
| 2.2 | 指定分页 | `{page:2, pageSize:5}` | 返回第6-10条，total正确 | ⬜ |
| 2.3 | 分类筛选 | `{category:"制造业"}` | 只返回制造业职位 | ⬜ |
| 2.4 | 关键词搜索 | `{keyword:"玻璃"}` | 标题含"玻璃"的职位 | ⬜ |
| 2.5 | 组合筛选 | `{category:"制造业", keyword:"工人", page:1, pageSize:5}` | 分类+关键词交叉筛选正确 | ⬜ |
| 2.6 | 返回字段验证 | `{}` | 数据包含 title/company/salary/location/tags/createTime | ⬜ |
| 2.7 | 排序验证 | `{}` | 按 createTime 降序排列（最新在前） | ⬜ |

---

### TC-03：getWorkers 护工列表

**云函数**：`getWorkers`  
**测试目的**：验证护工列表查询和技能筛选功能

| # | 测试场景 | 入参 | 期望返回 | 结果 |
|---|---------|------|---------|------|
| 3.1 | 默认查询 | `{}` | `{success:true, data:[...]}` 返回护工列表 | ⬜ |
| 3.2 | 技能筛选 | `{skill:"养老护理"}` | 只返回有该技能的护工 | ⬜ |
| 3.3 | 分页查询 | `{page:1, pageSize:5}` | 返回前5条 | ⬜ |
| 3.4 | 排序验证 | `{}` | 按 rating（评分）降序排列 | ⬜ |
| 3.5 | status过滤 | `{}` | 只返回 status=1 的在职护工 | ⬜ |

---

### TC-04：sendMessage 发送消息

**云函数**：`chat/sendMessage`  
**测试目的**：验证消息发送、存储和会话自动更新

| # | 测试场景 | 入参 | 期望返回 | 结果 |
|---|---------|------|---------|------|
| 4.1 | 发送文字消息（新会话） | `{content:"你好", toId:"商家openid", type:"text"}` | 返回消息id，chat_conversations 新增一条 | ⬜ |
| 4.2 | 发送文字消息（已有会话） | `{content:"再问一下", conversationId:"conv_xxx", toId:"商家openid"}` | 消息入库，会话 lastMessage 更新，unreadCount+1 | ⬜ |
| 4.3 | 发送图片消息 | `{content:"图片url", type:"image", toId:"商家openid"}` | 会话 lastMessage 显示"[图片]" | ⬜ |
| 4.4 | 发送给客服 | `{content:"求助", toId:"service"}` | 会话名称为"在线客服" | ⬜ |
| 4.5 | 验证消息字段完整性 | `{content:"测试", toId:"某id"}` | 返回数据含 fromId/fromName/toId/content/isRead/createTime | ⬜ |

---

### TC-05：getConversationList 会话列表

**云函数**：`chat/getConversationList`  
**测试目的**：验证用户会话列表获取，且只能看到自己的会话

| # | 测试场景 | 入参 | 期望返回 | 结果 |
|---|---------|------|---------|------|
| 5.1 | 获取会话列表 | `{}` | `{success:true, data:{list:[...], total:N}}` | ⬜ |
| 5.2 | 分页查询 | `{page:1, pageSize:10}` | 返回前10条会话 | ⬜ |
| 5.3 | 排序验证 | `{}` | 按 lastMessageTime 降序（最新在前） | ⬜ |
| 5.4 | 权限隔离验证 | 用不同openid调用 | 只返回包含当前用户的会话，看不到他人私聊 | ⬜ |

---

### TC-06：getHistory 聊天记录

**云函数**：`chat/getHistory`  
**测试目的**：验证按会话获取消息历史、分页、排序

| # | 测试场景 | 入参 | 期望返回 | 结果 |
|---|---------|------|---------|------|
| 6.1 | 获取会话记录 | `{conversationId:"conv_xxx"}` | 返回该会话消息列表，按时间升序 | ⬜ |
| 6.2 | 缺少conversationId | `{}` | `{success:false, error:"缺少会话ID"}` | ⬜ |
| 6.3 | 分页查询 | `{conversationId:"conv_xxx", page:1, pageSize:20}` | 返回前20条，total正确 | ⬜ |
| 6.4 | 排序验证 | `{conversationId:"conv_xxx"}` | 按 createTime 升序（最早在前，符合聊天习惯） | ⬜ |

---

### TC-07：markAsRead 消息已读

**云函数**：`chat/markAsRead`  
**测试目的**：验证标记已读后 isRead 更新、会话 unreadCount 归零

| # | 测试场景 | 入参 | 期望返回 | 结果 |
|---|---------|------|---------|------|
| 7.1 | 标记整个会话已读 | `{conversationId:"conv_xxx"}` | 会话 unreadCount=0，消息 isRead=true | ⬜ |
| 7.2 | 标记单条消息已读 | `{messageId:"msg_xxx"}` | 该消息 isRead=true | ⬜ |
| 7.3 | 同时传入两个参数 | `{conversationId:"conv_xxx", messageId:"msg_xxx"}` | 两者都被标记 | ⬜ |
| 7.4 | 缺少两个参数 | `{}` | `{success:false, error:"缺少会话ID或消息ID"}` | ⬜ |
| 7.5 | 已读后再次标记 | 对已读会话再调用 | `{success:true}`，unreadCount 仍为 0，无副作用 | ⬜ |

---

## 回归测试（关键流程）

部署完成后还需验证端到端流程：

### RT-01：完整聊天流程
1. 用户A在招聘详情页点击"咨询"按钮 → 进入聊天页
2. 用户A发送消息（sendMessage）
3. 用户A查看会话列表（getConversationList）→ 会话出现
4. 用户A查看聊天记录（getHistory）→ 消息显示
5. 用户A进入会话（markAsRead）→ 未读数归零

### RT-02：发布与删除流程
1. 用户在发布页发布一条职位
2. 在"我的职位"中看到该职位
3. 点击删除（deleteItem）→ 成功删除
4. 列表刷新后该职位消失

---

## 测试结论模板

```
测试日期：2026-03-25
部署环境：微信云开发 cloudbase-1gkioadld4516142
测试结论：[ ] 通过  [ ] 有问题待修复

| 模块 | 用例总数 | 通过 | 失败 | 通过率 |
|------|---------|------|------|--------|
| deleteItem | 7 | - | - | - |
| jobList | 7 | - | - | - |
| getWorkers | 5 | - | - | - |
| sendMessage | 5 | - | - | - |
| getConversationList | 4 | - | - | - |
| getHistory | 4 | - | - | - |
| markAsRead | 5 | - | - | - |
| 回归测试 | 2 | - | - | - |
| **合计** | **39** | - | - | - |

失败用例：
- （无 / 列举具体用例）

建议：
- （无 / 具体修复建议）
```
