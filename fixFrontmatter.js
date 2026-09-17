const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// 正则表达式匹配YAML frontmatter
const frontmatterPattern = /^---\s*\n([\s\S]*?)\n---\s*\n/;

/**
 * 递归遍历目录获取所有md文件
 */
async function getAllMdFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return getAllMdFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      return fullPath;
    }
    return null;
  }));
  return files.flat().filter(Boolean);
}

/**
 * 解析frontmatter
 */
function parseFrontmatter(content) {
  const match = content.match(frontmatterPattern);
  if (!match) {
    return { fields: {}, body: content };
  }

  const frontmatterContent = match[1];
  const fields = {};

  frontmatterContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // 处理布尔值
    if (value.toLowerCase() === 'true') {
      value = true;
    } else if (value.toLowerCase() === 'false') {
      value = false;
    }
    // 处理数组类型
    else if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    }
    // 处理带引号的字符串
    else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    fields[key] = value;
  });

  return {
    fields,
    body: content.slice(match[0].length)
  };
}

/**
 * 生成标准的frontmatter
 */
function generateStandardFrontmatter(fields, filePath) {
  const standard = [];
  const fileName = path.basename(filePath, '.md');

  // 1. title
  if (fields.title) {
    let title = fields.title;
    // 如果标题包含特殊字符，加引号
    if (/[:{}\[\]'"]/.test(title) || !title) {
      standard.push(`title: "${title.replace(/"/g, '\\"')}"`);
    } else {
      standard.push(`title: ${title}`);
    }
  } else {
    // 从文件名提取标题
    let title = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ').trim();
    standard.push(`title: "${title}"`);
  }

  // 2. date
  if (fields.date) {
    // 简单验证日期格式
    if (/^\d{4}-\d{2}-\d{2}/.test(fields.date)) {
      standard.push(`date: ${fields.date}`);
    } else {
      // 从文件名提取日期
      const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})-/);
      if (dateMatch) {
        standard.push(`date: ${dateMatch[1]}`);
      } else {
        const today = new Date().toISOString().split('T')[0];
        standard.push(`date: ${today}`);
      }
    }
  } else {
    // 从文件名提取日期
    const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})-/);
    if (dateMatch) {
      standard.push(`date: ${dateMatch[1]}`);
    } else {
      const today = new Date().toISOString().split('T')[0];
      standard.push(`date: ${today}`);
    }
  }

  // 3. categories (处理单数category的情况)
  let categories = [];
  if (fields.categories) {
    categories = Array.isArray(fields.categories) ? fields.categories : [fields.categories];
  } else if (fields.category) {
    categories = Array.isArray(fields.category) ? fields.category : [fields.category];
  }

  // 确保categories是数组且有值
  if (!categories.length) {
    categories = ['Article'];
  }
  standard.push(`categories: [${categories.map(c => `"${c}"`).join(', ')}]`);

  // 4. tags
  let tags = [];
  if (fields.tags) {
    tags = Array.isArray(fields.tags) ? fields.tags :
           typeof fields.tags === 'string' ? fields.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  }
  standard.push(`tags: [${tags.map(t => `"${t}"`).join(', ')}]`);

  // 5. comments
  standard.push(`comments: ${fields.comments !== undefined ? fields.comments : true}`);

  // 组合成frontmatter
  return '---\n' + standard.join('\n') + '\n---\n\n';
}

/**
 * 修复单个文件的frontmatter
 */
async function fixFileFrontmatter(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    const { fields, body } = parseFrontmatter(content);
    const newFrontmatter = generateStandardFrontmatter(fields, filePath);
    const newContent = newFrontmatter + body.trimStart();

    // 只有当内容变化时才写入
    if (newContent !== content) {
      await writeFile(filePath, newContent, 'utf8');
      return { changed: true, status: '已修复' };
    } else {
      return { changed: false, status: '无需修改' };
    }
  } catch (e) {
    return { changed: false, status: `错误: ${e.message}` };
  }
}

/**
 * 主函数
 */
async function main() {
  const postsDir = path.join(__dirname, '_posts');
  const allMdFiles = await getAllMdFiles(postsDir);

  console.log('开始修复所有文章的Frontmatter...\n');

  const results = [];
  for (const file of allMdFiles) {
    const relativePath = path.relative(__dirname, file);
    const { changed, status } = await fixFileFrontmatter(file);
    results.push({ file: relativePath, changed, status });
    console.log(`${relativePath.padEnd(60)} ${status}`);
  }

  // 统计结果
  const total = results.length;
  const changedCount = results.filter(r => r.changed).length;
  const errorCount = results.filter(r => r.status.startsWith('错误')).length;

  console.log('\n' + '='.repeat(80));
  console.log(`修复完成! 共处理 ${total} 个文件, ${changedCount} 个文件已修复, ${errorCount} 个错误`);
  console.log('='.repeat(80));
}

main().catch(console.error);
