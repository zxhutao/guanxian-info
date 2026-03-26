/**
 * 冠帮帮小程序 - 性能回归防护检查脚本
 * 维护人：小J（性能优化）
 * 运行时机：每次 PR 合并前
 * 用法：node scripts/perf-check.js
 */

const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.join(__dirname, '..')

// ============================================================
// 检查项 1：图片懒加载
// ============================================================
function checkLazyLoad(dir, issues = []) {
  if (!fs.existsSync(dir)) return issues
  
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      checkLazyLoad(fullPath, issues)
    } else if (file.name.endsWith('.vue')) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      // 查找有 src 但没有 lazy-load 的 <image> 标签
      const imgMatches = content.match(/<image(?![^>]*lazy-load)[^>]*src[^>]*>/g)
      if (imgMatches) {
        issues.push({
          file: path.relative(PROJECT_ROOT, fullPath),
          type: 'MISSING_LAZY_LOAD',
          level: 'WARNING',
          count: imgMatches.length,
          message: `发现 ${imgMatches.length} 个缺少 lazy-load 属性的 <image> 标签`
        })
      }
    }
  }
  return issues
}

// ============================================================
// 检查项 2：循环内频繁数据更新
// ============================================================
function checkLoopSetData(dir, issues = []) {
  if (!fs.existsSync(dir)) return issues
  
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      checkLoopSetData(fullPath, issues)
    } else if (file.name.endsWith('.vue')) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      // 检测 forEach/for 循环内的 this.$set 或直接赋值
      if (/\.(forEach|map)\s*\([^)]+\)\s*\{[^}]*this\.\$set/s.test(content)) {
        issues.push({
          file: path.relative(PROJECT_ROOT, fullPath),
          type: 'SETDATA_IN_LOOP',
          level: 'WARNING',
          message: '检测到循环内可能存在频繁响应式赋值，建议批量更新'
        })
      }
    }
  }
  return issues
}

// ============================================================
// 检查项 3：包大小（读取编译后 dist）
// ============================================================
function checkBundleSize(issues = []) {
  const distDirs = [
    { dir: path.join(PROJECT_ROOT, 'unpackage/dist/build/mp-weixin'), label: '编译包' }
  ]
  
  for (const { dir, label } of distDirs) {
    if (!fs.existsSync(dir)) {
      // 未编译则跳过，仅给提示
      console.log(`  ℹ️  ${label} 目录不存在，跳过包大小检查（请在微信开发者工具中确认）`)
      continue
    }
    
    const totalSize = getDirSize(dir)
    const sizeMB = (totalSize / 1024 / 1024).toFixed(2)
    
    if (totalSize > 1.5 * 1024 * 1024) {
      issues.push({
        file: label,
        type: 'BUNDLE_TOO_LARGE',
        level: 'ERROR',
        message: `包大小 ${sizeMB}MB 超过 1.5MB 警戒线（微信限制 2MB）`
      })
    } else {
      console.log(`  ✅ ${label}大小: ${sizeMB}MB（正常）`)
    }
  }
  return issues
}

function getDirSize(dir) {
  let total = 0
  if (!fs.existsSync(dir)) return 0
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const full = path.join(dir, file.name)
    if (file.isDirectory()) {
      total += getDirSize(full)
    } else {
      total += fs.statSync(full).size
    }
  }
  return total
}

// ============================================================
// 检查项 4：内联大图（base64）
// ============================================================
function checkInlineBase64(dir, issues = []) {
  if (!fs.existsSync(dir)) return issues
  
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      checkInlineBase64(fullPath, issues)
    } else if (file.name.endsWith('.vue') || file.name.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      const base64Matches = content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/]{500,}/g)
      if (base64Matches) {
        const totalKB = base64Matches.reduce((sum, m) => sum + m.length / 1024, 0).toFixed(1)
        issues.push({
          file: path.relative(PROJECT_ROOT, fullPath),
          type: 'LARGE_BASE64_IMAGE',
          level: 'WARNING',
          message: `发现 ${base64Matches.length} 个内联大图（共约 ${totalKB}KB），建议改为云存储 URL`
        })
      }
    }
  }
  return issues
}

// ============================================================
// 主检查流程
// ============================================================
function runPerfCheck() {
  console.log('╔══════════════════════════════════════════════╗')
  console.log('║    冠帮帮小程序 - 性能回归防护检查           ║')
  console.log('║    维护人：小J（性能优化）                   ║')
  console.log('╚══════════════════════════════════════════════╝\n')
  
  const pagesDir = path.join(PROJECT_ROOT, 'pages')
  const subDir = path.join(PROJECT_ROOT, 'subpackages')
  const compDir = path.join(PROJECT_ROOT, 'components')
  
  console.log('🔍 检查图片懒加载...')
  const lazyIssues = [
    ...checkLazyLoad(pagesDir),
    ...checkLazyLoad(subDir),
    ...checkLazyLoad(compDir)
  ]
  
  console.log('🔍 检查循环内数据更新...')
  const loopIssues = [
    ...checkLoopSetData(pagesDir),
    ...checkLoopSetData(subDir)
  ]
  
  console.log('🔍 检查包大小...')
  const bundleIssues = checkBundleSize()
  
  console.log('🔍 检查内联大图...')
  const base64Issues = [
    ...checkInlineBase64(pagesDir),
    ...checkInlineBase64(subDir),
    ...checkInlineBase64(compDir)
  ]
  
  const allIssues = [...lazyIssues, ...loopIssues, ...bundleIssues, ...base64Issues]
  const errors = allIssues.filter(i => i.level === 'ERROR')
  const warnings = allIssues.filter(i => i.level === 'WARNING')
  
  console.log('\n══════════════════════════════════════════════')
  console.log('📊 检查结果汇总')
  console.log('══════════════════════════════════════════════')
  
  if (allIssues.length === 0) {
    console.log('\n✅ 全部通过！无性能回归问题。\n')
    process.exit(0)
  }
  
  if (errors.length > 0) {
    console.log(`\n🔴 ERROR（${errors.length}个，必须修复）：`)
    errors.forEach(issue => {
      console.log(`  [${issue.type}] ${issue.file}`)
      console.log(`    → ${issue.message}\n`)
    })
  }
  
  if (warnings.length > 0) {
    console.log(`\n🟡 WARNING（${warnings.length}个，强烈建议修复）：`)
    warnings.forEach(issue => {
      console.log(`  [${issue.type}] ${issue.file}`)
      console.log(`    → ${issue.message}\n`)
    })
  }
  
  console.log('══════════════════════════════════════════════')
  if (errors.length > 0) {
    console.log(`❌ 存在 ${errors.length} 个 ERROR，请修复后再合并 PR。`)
    process.exit(1)
  } else {
    console.log(`⚠️  存在 ${warnings.length} 个 WARNING，建议修复后合并 PR。`)
    process.exit(0)
  }
}

runPerfCheck()
