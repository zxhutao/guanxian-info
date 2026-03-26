# 签到功能修复后 - 性能监控验证报告

**制定人**：小J（性能优化）  
**时间**：2026-03-25 15:55  
**触发原因**：P0 Bug 修复后性能基准验证  
**关联 Bug**：checkins 集合不存在 → 修复后建立性能基线

---

## 📊 性能基准预期

### API 响应时间基准

| 云函数 action | 场景 | 预期响应 | 红线 | 测量方法 |
|--------------|------|---------|------|---------|
| `doCheckin` | 首次签到（含事务） | 120-150ms | ≤250ms | 云函数日志 |
| `doCheckin` | 已签到（早期拦截） | 30-50ms | ≤100ms | 云函数日志 |
| `getCheckinStatus` | 读取签到状态+积分 | 80-100ms | ≤200ms | 云函数日志 |
| `getCheckinCalendar` | 读取当月日历 | 60-80ms | ≤200ms | 云函数日志 |
| `getPointsInfo` | 读取积分+流水 | 80-120ms | ≤200ms | 云函数日志 |

---

## 🔍 数据库集合状态确认清单

修复后验证以下集合均存在：

```
□ checkins      - 签到记录（本次新建）
□ user_points   - 积分账户
□ users         - 用户基础信息
□ points_log    - 积分流水
```

---

## ⚠️ 已识别性能风险（P1级，下次迭代处理）

### 风险1：checkins 集合无索引

**影响**：用户量 >1000 时，getCheckinCalendar 和 doCheckin 查重慢
**修复方案**：创建 `perf/db-checkin-indexes` 分支，添加：
```javascript
// 索引1：查询今日是否签到（doCheckin + getCheckinStatus 高频使用）
db.collection('checkins').indexes.create({
  indexesInfo: [{ key: { _openid: 1, date: 1 }, unique: true }]
})

// 索引2：查询当月签到日历（getCheckinCalendar 使用）
db.collection('checkins').indexes.create({
  indexesInfo: [{ key: { _openid: 1, year: 1, month: 1 } }]
})
```
**优先级**：P1，不阻断当前修复上线，但应在下个迭代添加

---

## ✅ 小G 验证时的性能观测点

验证签到功能时，同步记录以下数据给小J分析：

```
1. 点击"立即签到"到收到成功提示的总耗时：___ms
2. 云函数日志中 doCheckin 实际执行时间：___ms
3. 签到后积分页面刷新耗时：___ms
4. 连续签到第2天是否有延迟变化：___ms
```

---

## 📋 后续性能优化计划（Bug稳定后）

| 任务 | 分支 | 优先级 | 预期收益 |
|------|------|--------|---------|
| checkins 集合索引建立 | `perf/db-checkin-indexes` | P1 | 查询 -60% |
| getCheckinStatus 串行改并发 | `perf/api-checkin-parallel` | P2 | 响应 -30% |
| 签到结果客户端缓存 | `perf/cache-checkin-today` | P2 | 重复进入 -90% |

---

**等待小G验证数据后填写实测值，本报告将更新为最终版本。**
