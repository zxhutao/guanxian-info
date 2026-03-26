# 冠帮帮小程序 CI/CD 工作流文档

本文档介绍冠帮帮小程序的 GitHub Actions 自动化工作流配置。

## 工作流概览

| 工作流 | 文件 | 触发条件 | 功能 |
|--------|------|----------|------|
| 构建与测试 | `build-and-test.yml` | PR、Push | 代码检查、语法验证、构建测试 |
| 云函数部署 | `deploy-cloudfunctions.yml` | 云函数变更、手动触发 | 自动部署云函数到腾讯云 |
| 小程序部署 | `deploy-miniprogram.yml` | 代码变更、手动触发 | 构建并部署到微信小程序平台 |

## 快速开始

### 1. 配置 Secrets

在 GitHub 仓库设置中添加以下 Secrets：

#### 腾讯云配置（云函数部署）
```
TENCENT_SECRET_ID      # 腾讯云 API 密钥 ID
TENCENT_SECRET_KEY     # 腾讯云 API 密钥 Key
```

获取方式：
1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/cam/capi)
2. 访问 访问管理 -> 访问密钥 -> API 密钥管理
3. 创建或复制已有密钥

#### 微信小程序配置（小程序部署）
```
WECHAT_PRIVATE_KEY     # 小程序代码上传密钥
```

获取方式：
1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 进入 开发 -> 开发设置 -> 小程序代码上传
3. 生成并下载代码上传密钥
4. 将密钥文件内容复制到 Secrets

### 2. 配置环境

在 GitHub 仓库设置中配置环境：

- `development` - 开发环境
- `production` - 生产环境

## 工作流详解

### 1. 构建与测试 (build-and-test.yml)

**触发条件：**
- 推送到 master、develop 或 feature/* 分支
- 创建 Pull Request 到 master 或 develop

**执行步骤：**
1. **代码检查 (lint)**
   - ESLint 代码规范检查
   - Prettier 格式检查

2. **构建测试 (build)**
   - 验证项目结构完整性
   - 检查 manifest.json 配置
   - 统计代码信息

3. **云函数检查 (cloudfunction-check)**
   - 验证云函数目录结构
   - JavaScript 语法检查

4. **测试报告**
   - 生成并上传测试报告

### 2. 云函数部署 (deploy-cloudfunctions.yml)

**触发条件：**
- uniCloud-tcb/cloudfunctions/ 目录下的文件变更
- 手动触发（workflow_dispatch）

**执行步骤：**
1. **部署准备**
   - 检测变更的云函数
   - 设置部署环境

2. **语法和依赖检查**
   - 验证 JavaScript 语法
   - 检查依赖配置

3. **部署到腾讯云**
   - 安装 CloudBase CLI
   - 登录腾讯云
   - 部署变更的云函数
   - 安装云函数依赖

4. **部署后测试**
   - 验证云函数可调用性

**手动触发参数：**
- `environment`: 部署环境（development/production）

### 3. 小程序部署 (deploy-miniprogram.yml)

**触发条件：**
- 推送到 master 或 develop 分支
- 手动触发（workflow_dispatch）

**执行步骤：**
1. **构建小程序**
   - 安装依赖
   - 构建项目
   - 验证构建产物

2. **代码质量检查**
   - 检查构建包大小（主包 < 2MB）
   - 检查文件数量

3. **部署到微信**
   - 预览版：生成预览二维码
   - 体验版：上传为体验版本
   - 正式版：上传待审核

**手动触发参数：**
- `environment`: 部署类型（preview/experience/production）
- `version`: 版本号
- `description`: 版本描述

## 使用指南

### 日常开发流程

```
1. 创建功能分支
   git checkout -b feature/xxx

2. 开发并提交代码
   git add .
   git commit -m "feat: xxx"
   git push origin feature/xxx

3. 创建 Pull Request
   - 自动触发构建与测试
   - 检查测试报告

4. 合并到 develop
   - 自动触发预览版部署
   - 获取预览二维码测试

5. 合并到 master
   - 自动触发体验版部署
   - 测试通过后手动触发正式版部署
```

### 手动部署

#### 部署云函数

1. 进入 Actions 页面
2. 选择 "Deploy Cloud Functions"
3. 点击 "Run workflow"
4. 选择环境（development/production）
5. 点击 "Run workflow"

#### 部署小程序

1. 进入 Actions 页面
2. 选择 "Deploy Mini Program"
3. 点击 "Run workflow"
4. 选择部署类型（preview/experience/production）
5. 输入版本号（可选）
6. 输入版本描述（可选）
7. 点击 "Run workflow"

## 环境配置

### 开发环境 (development)

- 云函数：独立开发环境
- 小程序：预览版/体验版
- 数据库：开发数据库

### 生产环境 (production)

- 云函数：正式环境
- 小程序：正式版（需审核）
- 数据库：生产数据库

## 故障排查

### 构建失败

**问题：** 构建步骤失败

**排查：**
1. 检查代码语法错误
2. 检查依赖是否完整
3. 查看构建日志

### 云函数部署失败

**问题：** 云函数无法部署

**排查：**
1. 检查腾讯云密钥是否正确
2. 检查云函数语法
3. 检查云环境 ID 是否正确
4. 查看 CloudBase CLI 输出

### 小程序部署失败

**问题：** 无法上传到微信小程序

**排查：**
1. 检查 WECHAT_PRIVATE_KEY 是否正确
2. 检查 AppID 是否匹配
3. 检查构建产物是否完整
4. 检查包大小是否超限

## 最佳实践

1. **分支保护**
   - master 分支需要 PR 审核
   - develop 分支需要 CI 通过

2. **版本管理**
   - 使用语义化版本号（semver）
   - 在 manifest.json 中维护版本

3. **提交规范**
   - feat: 新功能
   - fix: 修复
   - docs: 文档
   - style: 格式
   - refactor: 重构
   - test: 测试
   - chore: 构建/工具

4. **代码审查**
   - 所有 PR 需要代码审查
   - CI 必须通过才能合并

## 相关链接

- [腾讯云 CloudBase 文档](https://docs.cloudbase.net/)
- [微信小程序 CI 文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)
- [GitHub Actions 文档](https://docs.github.com/cn/actions)

## 维护者

- 开发团队：冠帮帮技术团队
- 项目负责人：小C
- 主要开发者：小K
