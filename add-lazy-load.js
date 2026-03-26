const fs = require('fs');
const path = require('path');

function getAllVueFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.')) {
      files = files.concat(getAllVueFiles(fullPath));
    } else if (item.endsWith('.vue')) {
      files.push(fullPath);
    }
  });
  
  return files;
}

function addLazyLoadAttributes(content) {
  // 替换没有 lazy-load 的 <image 标签
  let result = content.replace(/<image\s+(?!.*lazy-load)/g, '<image lazy-load ');
  
  // 清理双空格
  result = result.replace(/lazy-load\s+lazy-load/g, 'lazy-load');
  result = result.replace(/<image\s+lazy-load\s+/g, '<image lazy-load ');
  
  return result;
}

const vueFiles = getAllVueFiles('./pages').concat(getAllVueFiles('./subpackages'));
let modifiedCount = 0;

console.log('开始添加懒加载属性...\n');

vueFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const original = content;
    
    content = addLazyLoadAttributes(content);
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf-8');
      modifiedCount++;
      console.log('✅', file);
    }
  } catch (e) {
    console.error('❌', file, e.message);
  }
});

console.log('\n✓ 总计修改 ' + modifiedCount + ' 个文件');
