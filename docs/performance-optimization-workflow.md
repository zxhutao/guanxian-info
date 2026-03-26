# 冠帮帮小程序 - 性能优化工作流规范

**制定人**：小J（性能优化）  
**版本**：v1.1  
**日期**：2026-03-25  
**与小C Git规范**：已对齐（分支前缀 `perf/`，提交类型 `perf:`）  
**审核状态**：待小C验收

---

## 📋 目录

1. [性能指标基线](#1-性能指标基线)
2. [性能优化分支规范](#2-性能优化分支规范)
3. [性能测试方法](#3-性能测试方法)
4. [性能回归防护](#4-性能回归防护)
5. [优化优先级体系](#5-优化优先级体系)
6. [工作流协作模板](#6-工作流协作模板)

---

## 1. 性能指标基线

### 1.1 已建立基线（2026-03-23 P0优化后）

| 指标 | 优化前基线 | 当前基线 | 目标值 | 红线（不可退步）|
|------|-----------|---------|--------|----------------|
| **首屏加载时间** | 3.5s | 0.9s | ≤0.8s | ≤1.5s |
| **可交互时间(TTI)** | 2.8s | 0.7s | ≤0.6s | ≤1.2s |
| **API请求数（首页）** | 8个 | 3个 | ≤3个 | ≤5个 |
| **平均API响应时间** | 200ms | 45ms | ≤40ms | ≤100ms |
| **数据库查询时间** | 150ms | 40ms | ≤35ms | ≤80ms |
| **带宽占用（首屏）** | 2.5MB | 1.5MB | ≤1.2MB | ≤2.0MB |
| **主包大小** | - | - | ≤1.5MB | ≤2MB |
| **分包大小（各包）** | - | - | ≤2MB | ≤2MB |
| **内存占用** | - | - | ≤50MB | ≤100MB |
| **页面帧率（滑动）** | - | - | ≥55fps | ≥30fps |

### 1.2 关键页面加载时间基线

| 页面 | 当前加载时间 | 目标 | 红线 |
|------|------------|------|------|
| 首页 (index) | ~900ms | ≤800ms | ≤1500ms |
| 招聘列表 (job-list) | ~700ms | ≤600ms | ≤1200ms |
| 招聘详情 (job-detail) | ~600ms | ≤500ms | ≤1000ms |
| 服务列表 (service-list) | ~700ms | ≤600ms | ≤1200ms |
| 养老列表 (elder-list) | ~700ms | ≤600ms | ≤1200ms |
| 个人中心 (user/index) | ~500ms | ≤400ms | ≤800ms |
| 聊天会话列表 | ~400ms | ≤350ms | ≤700ms |
| 聊天消息页面 | ~300ms | ≤250ms | ≤500ms |

### 1.3 云函数性能基线

| 云函数 | 当前P99延迟 | 目标P99 | 红线 |
|--------|-----------|---------|------|
| jobList | ~80ms | ≤60ms | ≤150ms |
| getServices | ~75ms | ≤60ms | ≤150ms |
| getWorkers | ~80ms | ≤60ms | ≤150ms |
| getUserInfo | ~50ms | ≤40ms | ≤100ms |
| chat/getHistory | ~90ms | ≤70ms | ≤200ms |
| checkin | ~100ms | ≤80ms | ≤200ms |
| point-deduct | ~120ms | ≤100ms | ≤250ms |

---

## 2. 性能优化分支规范

> **与小C Git工作流规范对齐（v1.0）**

### 2.1 分支命名规则

```
perf/<优化目标>-<简要描述>
```

**命名示例**：

| 优化目标 | 分支名示例 |
|---------|-----------|
| 图片优化 | `perf/img-webp-convert` |
| 缓存策略 | `perf/cache-redis-intro` |
| 包体积优化 | `perf/bundle-split-optimize` |
| 数据库优化 | `perf/db-index-phase2` |
| API优化 | `perf/api-batch-v2` |
| 渲染优化 | `perf/render-virtual-list` |
| 预加载优化 | `perf/preload-data-strategy` |
| 监控体系 | `perf/monitor-baseline-setup` |

### 2.1.1 提交信息规范

性能优化提交统一使用 `perf:` 类型前缀（符合小C Git规范）：

```bash
perf: 添加图片懒加载，首屏减少30-40%
perf: 合并首页请求，API调用从8个降至3个
perf: 建立8个DB索引，查询提速78%
perf: 接入WebP图片格式，带宽降低30%
```

**禁止写法**：
```bash
update performance   # ❌ 无类型前缀
fix slow page        # ❌ 应用 perf: 而非 fix:
perf优化             # ❌ 缺少冒号和空格
```

### 2.2 分支生命周期

```
develop
   │
   ├── git checkout -b perf/<优化目标>-<描述>
   │
   │   [性能分析] 小J
   │   → 输出分析报告 + 优化方案
   │
   │   [代码实现] 小K
   │   → git commit -m "perf: 优化描述"
   │
   │   [性能验证] 小J
   │   → 对比基线，确认指标提升
   │
   │   [代码审核] 小H
   │   → 审核代码质量 + 性能回归检查
   │
   │   [回归测试] 小G
   │   → 运行 TC-PERF-001~005，功能无退步
   │
   └── PR → develop（小C审批）→ master
```

### 2.3 Performance PR 模板

创建性能优化 PR 时，描述必须包含：

```markdown
## 📊 性能优化 PR

### 优化类型
- [ ] 图片优化  - [ ] 缓存策略  - [ ] 包体积  - [ ] DB优化
- [ ] API优化   - [ ] 渲染优化  - [ ] 预加载  - [ ] 监控

### 优化前基线
| 指标 | 优化前 |
|------|--------|
| 首屏时间 | Xs |
| API请求数 | N个 |
| 其他关键指标 | - |

### 优化后指标
| 指标 | 优化后 | 提升幅度 |
|------|--------|---------|
| 首屏时间 | Xs | -XX% |
| API请求数 | N个 | -XX% |

### 测试方法
（说明如何验证性能提升）

### 风险评估
- [ ] 功能无回归  - [ ] 无内存泄漏  - [ ] 低端机兼容
```

---

## 3. 性能测试方法

### 3.1 微信小程序性能测试工具

#### 方法一：微信开发者工具 Audits（推荐）
1. 打开微信开发者工具
2. 菜单 → 工具 → 性能 Audits
3. 选择「小程序」→ 运行审计
4. 关注以下指标：
   - **First Render**（首次渲染时间）
   - **First Paint**（首次绘制）
   - **Total Blocking Time**（总阻塞时间）

#### 方法二：Performance Panel（真机调试）
```
开发者工具 → 调试 → Performance → 录制
```
- 录制首屏加载完整过程
- 查看 JavaScript 执行时间
- 识别长任务（>50ms）

#### 方法三：云函数日志监控
```javascript
// 在云函数中添加性能打点（已有模式）
const startTime = Date.now()
// ... 业务逻辑 ...
console.log(`[PERF] ${functionName} 耗时: ${Date.now() - startTime}ms`)
```

#### 方法四：小程序 API 耗时埋点
```javascript
// utils/performance-monitor.js（小J维护）
export const perfMark = (key) => {
  if (typeof wx !== 'undefined') {
    wx.reportPerformance(key, Date.now())
  }
}
```

### 3.2 关键场景性能测试用例

#### TC-PERF-001：首屏加载测试
```
测试场景：冷启动进入首页
测试环境：4G网络模拟（下行速度 10Mbps）
测试设备：iPhone 12 / 华为 P30（各测3次取平均）
测试步骤：
  1. 清除小程序缓存
  2. 重新进入小程序
  3. 记录白屏时间（显示Loading前）
  4. 记录首屏渲染时间（内容可见）
  5. 记录可交互时间（按钮可点击）
通过标准：首屏 ≤1.5s，可交互 ≤1.2s
```

#### TC-PERF-002：列表滑动流畅度测试
```
测试场景：招聘/服务列表连续滑动
测试步骤：
  1. 进入招聘列表
  2. 连续快速上下滑动 10 次
  3. 使用开发者工具录制帧率
通过标准：平均帧率 ≥55fps，无明显卡顿
```

#### TC-PERF-003：API 响应时间测试
```
测试场景：首页数据加载
测试步骤：
  1. 打开网络日志
  2. 进入首页
  3. 记录每个云函数调用时间
通过标准：
  - 单次云函数调用 ≤200ms
  - 首页总加载时间 ≤1.5s
```

#### TC-PERF-004：内存占用测试
```
测试场景：正常使用 10 分钟后
测试步骤：
  1. 进入小程序
  2. 浏览多个页面（首页→招聘→详情→返回→服务→详情）
  3. 检查内存占用
通过标准：10分钟使用后内存 ≤100MB，无内存泄漏趋势
```

#### TC-PERF-005：包大小检查
```
测试时机：每次发版前
检查项：
  - 主包大小 ≤1.5MB（微信限制2MB）
  - search分包 ≤2MB
  - publish分包 ≤2MB
检查命令：微信开发者工具 → 代码质量 → 包大小分析
```

### 3.3 性能测试报告模板

```markdown
# 性能测试报告 - YYYY-MM-DD

**测试人**：小G  
**性能分析**：小J  
**测试环境**：微信开发者工具 v3.x.x

## 测试结果汇总

| 测试用例 | 基线值 | 实测值 | 是否达标 |
|---------|-------|-------|---------|
| TC-PERF-001 首屏加载 | ≤1.5s | Xs | ✅/❌ |
| TC-PERF-002 列表帧率 | ≥55fps | Xfps | ✅/❌ |
| TC-PERF-003 API响应 | ≤200ms | Xms | ✅/❌ |
| TC-PERF-004 内存占用 | ≤100MB | XMB | ✅/❌ |
| TC-PERF-005 包大小 | ≤1.5MB | XMB | ✅/❌ |

## 性能异常记录

（如有指标退步，在此记录原因和修复方案）

## 测试结论

✅ 全部通过 / ❌ 存在退步需修复
```

---

## 4. 性能回归防护

### 4.1 PR 合并前性能检查清单

每个PR（包括非性能PR）合并前，**必须**完成以下检查：

```
性能回归防护检查清单 v1.0

□ 包大小检查
  - [ ] 主包 < 1.5MB（微信开发者工具确认）
  - [ ] 各分包 < 2MB

□ 图片资源检查
  - [ ] 新增图片已添加 lazy-load 属性
  - [ ] 图片尺寸合理（不超过显示尺寸2倍）
  - [ ] 无 base64 大图内联

□ 网络请求检查
  - [ ] 无新增的串行等待请求（应改为并发）
  - [ ] 新增云函数已有适当索引支持
  - [ ] 无循环内的网络请求

□ 渲染性能检查
  - [ ] 长列表使用了虚拟列表或分页
  - [ ] setData 无大量频繁更新
  - [ ] 无不必要的 watcher 监听

□ 内存泄漏检查
  - [ ] 页面销毁时清除了定时器
  - [ ] 页面销毁时取消了事件监听
  - [ ] 无循环引用导致的内存泄漏
```

### 4.2 性能红线自动检测脚本

```javascript
// scripts/perf-check.js - 小J维护，在CI流程中运行
const fs = require('fs')
const path = require('path')

// 检查图片懒加载
function checkLazyLoad(dir) {
  const issues = []
  const files = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const file of files) {
    if (file.isDirectory()) {
      issues.push(...checkLazyLoad(path.join(dir, file.name)))
    } else if (file.name.endsWith('.vue')) {
      const content = fs.readFileSync(path.join(dir, file.name), 'utf-8')
      const imgMatches = content.match(/<image(?![^>]*lazy-load)[^>]*src[^>]*>/g)
      if (imgMatches) {
        issues.push({
          file: path.join(dir, file.name),
          type: 'MISSING_LAZY_LOAD',
          count: imgMatches.length,
          message: `发现 ${imgMatches.length} 个缺少 lazy-load 的 image 标签`
        })
      }
    }
  }
  return issues
}

// 检查 setData 频率（启发式）
function checkSetDataAbuse(dir) {
  const issues = []
  const files = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const file of files) {
    if (file.isDirectory()) {
      issues.push(...checkSetDataAbuse(path.join(dir, file.name)))
    } else if (file.name.endsWith('.vue')) {
      const content = fs.readFileSync(path.join(dir, file.name), 'utf-8')
      // 检测循环体内的 setData / 响应式赋值密集模式
      const forSetData = content.match(/for\s*\([^)]+\)[^{]*\{[^}]*this\.\$set[^}]*\}/gs)
      if (forSetData) {
        issues.push({
          file: path.join(dir, file.name),
          type: 'SETDATA_IN_LOOP',
          message: '检测到循环内可能的频繁数据更新'
        })
      }
    }
  }
  return issues
}

// 主检查流程
function runPerfCheck() {
  console.log('🔍 冠帮帮性能检查开始...\n')
  
  const pagesDir = path.join(__dirname, '../pages')
  const subpackagesDir = path.join(__dirname, '../subpackages')
  
  const lazyIssues = [
    ...checkLazyLoad(pagesDir),
    ...checkLazyLoad(subpackagesDir)
  ]
  
  const setDataIssues = [
    ...checkSetDataAbuse(pagesDir)
  ]
  
  const allIssues = [...lazyIssues, ...setDataIssues]
  
  if (allIssues.length === 0) {
    console.log('✅ 性能检查通过！无回归问题。\n')
    process.exit(0)
  } else {
    console.log(`❌ 发现 ${allIssues.length} 个性能问题：\n`)
    allIssues.forEach(issue => {
      console.log(`  [${issue.type}] ${issue.file}`)
      console.log(`    ${issue.message}\n`)
    })
    console.log('请修复以上问题后再合并 PR。')
    process.exit(1)
  }
}

runPerfCheck()
```

### 4.3 发版前性能全检清单

每次发版（release/x.x 分支准备上线）前，小J负责完整性能评估：

```markdown
## 发版性能评估清单

### 必检项（阻断发版）
- [ ] 首屏加载时间 ≤ 1.5s（实测3次取平均）
- [ ] 主包大小 ≤ 1.5MB
- [ ] 无明显 JavaScript 报错
- [ ] 所有页面可正常进入

### 推荐检项（不阻断但需记录）
- [ ] 列表滑动帧率 ≥ 55fps
- [ ] 内存无持续增长（10分钟测试）
- [ ] API P99 ≤ 200ms
- [ ] 云函数冷启动 ≤ 3s

### 与上一版本对比
| 指标 | 上一版 | 本版 | 变化 |
|------|--------|------|------|
| 首屏时间 | - | - | - |
| 包大小 | - | - | - |
| API响应 | - | - | - |
```

---

## 5. 优化优先级体系

### 5.1 优化等级定义

| 等级 | 定义 | 响应时限 | 示例 |
|------|------|---------|------|
| **P0** | 严重性能问题，影响核心功能 | 立即处理（当天） | 首屏白屏 >5s、崩溃 |
| **P1** | 明显性能问题，影响用户体验 | 本迭代内 | 首屏 >3s、列表卡顿 |
| **P2** | 轻微性能问题，有改善空间 | 下个迭代 | 单页加载 >1.5s |
| **P3** | 优化锦上添花，影响有限 | 排入Backlog | 缓存命中率提升 |

### 5.2 已完成优化回顾

#### ✅ P0优化 - 2026-03-23（已完成）
- [x] **TASK-005**：图片懒加载 → 25个文件，首屏 -30-40%
- [x] **TASK-007**：请求合并机制 → API请求 -63%
- [x] **TASK-008**：数据库8索引 → 查询性能 -78%

### 5.3 待执行优化 Backlog

#### P1 优化（下一迭代推荐）

| ID | 任务 | 预期提升 | 工作量 | 负责人 |
|----|------|---------|-------|--------|
| TASK-P1-001 | WebP图片格式转换 + CDN | 带宽 -30-40% | M | 小K+小J |
| TASK-P1-002 | 虚拟列表（长列表优化） | 帧率 +20fps | L | 小K |
| TASK-P1-003 | 分包预下载策略 | 分包加载 -50% | S | 小K |
| TASK-P1-004 | 首页骨架屏 | 感知速度 +30% | M | 小K |

#### P2 优化（Backlog）

| ID | 任务 | 预期提升 | 工作量 |
|----|------|---------|-------|
| TASK-P2-001 | 数据预加载（行为预测） | 翻页速度 -40% | L |
| TASK-P2-002 | 离线缓存策略 | 离线可用性 | L |
| TASK-P2-003 | 云函数 Redis 缓存 | API响应 -50% | L |
| TASK-P2-004 | 图片压缩上传管道 | 存储成本 -40% | M |

---

## 6. 工作流协作模板

### 6.1 性能问题发现→修复流程

```
发现问题（任何人）
    ↓
小J 分析：
  - 确认问题严重程度（P0/P1/P2/P3）
  - 分析根因
  - 输出优化方案文档
    ↓
小C 确认优先级
    ↓
小K 开发优化方案
  - 创建 performance/xxx 分支
  - 实现优化代码
    ↓
小J 验证性能指标
  - 对比优化前后数据
  - 确认达到预期目标
    ↓
小H 代码审核
  - 代码质量检查
  - 性能实现是否合理
    ↓
小G 回归测试
  - 功能无退步
  - 性能TC通过
    ↓
小C 验收
  - 审批PR合并
  - 更新性能基线
```

### 6.2 小J 标准分析输出模板

每次进行性能分析，输出包含以下内容：

```markdown
# 性能分析报告 - YYYY-MM-DD

**分析人**：小J  
**分析范围**：XXX模块

## 问题现状
（数据量化，如：当前首屏时间 X.Xs）

## 瓶颈定位
（说明瓶颈在哪里，为什么慢）

## 优化方案
### 方案一（推荐）
- 实现方式：...
- 预期提升：...
- 工作量：S/M/L
- 风险：...

### 方案二（备选）
...

## 实施建议
（给小K的具体开发建议）

## 验证方法
（如何验证优化效果）
```

### 6.3 性能监控埋点规范

在关键页面和云函数中统一添加性能埋点：

#### 页面级埋点（Vue3 Composition API）
```javascript
// composables/usePerformance.js
import { onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

export function usePagePerf(pageName) {
  let loadStart = 0
  
  onLoad(() => {
    loadStart = Date.now()
  })
  
  onMounted(() => {
    const loadTime = Date.now() - loadStart
    console.log(`[PERF] ${pageName} 加载耗时: ${loadTime}ms`)
    
    // 超过红线时警告
    const redLines = {
      'index': 1500,
      'job-list': 1200,
      'service-list': 1200,
      'default': 1500
    }
    const redLine = redLines[pageName] || redLines['default']
    if (loadTime > redLine) {
      console.warn(`[PERF-WARNING] ${pageName} 超过性能红线！${loadTime}ms > ${redLine}ms`)
    }
  })
}
```

#### 云函数级埋点
```javascript
// 在每个云函数入口添加
exports.main = async (event, context) => {
  const perfStart = Date.now()
  const funcName = context.function_name
  
  try {
    // 业务逻辑
    const result = await handleBusiness(event)
    
    // 记录成功耗时
    const elapsed = Date.now() - perfStart
    console.log(`[PERF] ${funcName} 成功 耗时:${elapsed}ms`)
    
    return { success: true, data: result }
  } catch (error) {
    const elapsed = Date.now() - perfStart
    console.error(`[PERF] ${funcName} 失败 耗时:${elapsed}ms 错误:${error.message}`)
    throw error
  }
}
```

---

## 📊 性能优化历史记录

| 日期 | 优化内容 | 关键指标变化 | 分支 | 状态 |
|------|---------|------------|------|------|
| 2026-03-23 | P0三大优化（懒加载+请求合并+DB索引） | 首屏 3.5s→0.9s (-74%) | - | ✅ 已上线 |
| - | WebP图片优化（计划中） | 带宽预计-30% | performance/img-webp | 📋 Backlog |
| - | 虚拟列表（计划中） | 帧率预计+20fps | performance/render-vlist | 📋 Backlog |

---

## 🔔 性能告警阈值

当以下指标发生退步时，立即通知小J介入：

| 告警等级 | 触发条件 | 通知方式 |
|---------|---------|---------|
| 🔴 紧急 | 首屏 > 3s 或 主包 > 1.8MB | 立即通知小C + 小J |
| 🟡 警告 | 首屏 > 1.5s 或 API P99 > 200ms | 通知小J分析 |
| 🟢 关注 | 任何指标退步 > 20% | 小J下次迭代优先处理 |

---

**维护人**：小J（性能优化）  
**与小K协同**：性能方案设计 + 开发实现  
**与小G协同**：性能测试用例 + 验证数据  
**与小H协同**：PR性能回归检查  
**向小C汇报**：每次优化验收 + 发版性能评估

**下次审查**：2026-04-01（P1优化启动时）
