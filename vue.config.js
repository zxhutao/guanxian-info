const path = require('path')
const fs = require('fs')

module.exports = {
  configureWebpack: {
    plugins: [
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('CopyCloudFunctions', () => {
            // 开发模式目标目录
            const devTarget = path.resolve(__dirname, 'unpackage/dist/dev/mp-weixin/uniCloud-tcb/cloudfunctions')
            // 生产模式目标目录
            const buildTarget = path.resolve(__dirname, 'unpackage/dist/build/mp-weixin/uniCloud-tcb/cloudfunctions')
            // 源目录 - 使用 uniCloud-tcb/cloudfunctions
            const source = path.resolve(__dirname, 'uniCloud-tcb/cloudfunctions')

            // 复制到开发目录
            if (fs.existsSync(path.dirname(devTarget))) {
              copyDir(source, devTarget)
              console.log('CloudFunctions copied to dev/mp-weixin/uniCloud-tcb/cloudfunctions')
            }

            // 复制到生产目录
            if (fs.existsSync(path.dirname(buildTarget))) {
              copyDir(source, buildTarget)
              console.log('CloudFunctions copied to build/mp-weixin/uniCloud-tcb/cloudfunctions')
            }
          })
        }
      }
    ]
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log('Source directory not found:', src)
    return
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}