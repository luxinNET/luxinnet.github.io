const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

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
  if (!match) return { categories: [], tags: [] };

  const frontmatterContent = match[1];
  let categories = [];
  let tags = [];

  frontmatterContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;

    if (line.startsWith('categories:')) {
      const value = line.slice('categories:'.length).trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        categories = value.slice(1, -1)
          .split(',')
          .map(item => item.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      }
    } else if (line.startsWith('tags:')) {
      const value = line.slice('tags:'.length).trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        tags = value.slice(1, -1)
          .split(',')
          .map(item => item.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      }
    }
  });

  return { categories, tags };
}

/**
 * 主函数
 */
async function main() {
  const postsDir = path.join(__dirname, '_posts');
  const allMdFiles = await getAllMdFiles(postsDir);

  const allCategories = new Set();
  const allTags = new Set();
  const categoryCount = {};
  const tagCount = {};
  const chineseItems = [];

  for (const file of allMdFiles) {
    const content = await readFile(file, 'utf8');
    const { categories, tags } = parseFrontmatter(content);

    categories.forEach(cat => {
      allCategories.add(cat);
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      if (/[一-龥]/.test(cat)) {
        chineseItems.push({ type: 'category', value: cat, file: path.relative(__dirname, file) });
      }
    });

    tags.forEach(tag => {
      allTags.add(tag);
      tagCount[tag] = (tagCount[tag] || 0) + 1;
      if (/[一-龥]/.test(tag)) {
        chineseItems.push({ type: 'tag', value: tag, file: path.relative(__dirname, file) });
      }
    });
  }

  console.log('='.repeat(80));
  console.log('分类 (Categories) 统计');
  console.log('='.repeat(80));
  console.log(`总分类数: ${allCategories.size}`);
  console.log('\n分类列表 (按使用次数排序):');
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      const isChinese = /[一-龥]/.test(cat);
      console.log(`  ${isChinese ? '🔴' : '🟢'} ${cat}: ${count}次`);
    });

  console.log('\n' + '='.repeat(80));
  console.log('标签 (Tags) 统计');
  console.log('='.repeat(80));
  console.log(`总标签数: ${allTags.size}`);
  console.log('\n标签列表 (按使用次数排序):');
  Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([tag, count]) => {
      const isChinese = /[一-龥]/.test(tag);
      console.log(`  ${isChinese ? '🔴' : '🟢'} ${tag}: ${count}次`);
    });

  console.log('\n' + '='.repeat(80));
  console.log('需要翻译的中文项目');
  console.log('='.repeat(80));
  if (chineseItems.length > 0) {
    const uniqueChinese = [...new Set(chineseItems.map(item => item.value))];
    uniqueChinese.forEach(item => {
      const files = chineseItems.filter(i => i.value === item).map(i => i.file);
      console.log(`\n📝 ${item}`);
      console.log(`  出现在 ${files.length} 个文件中`);
    });
  } else {
    console.log('🎉 没有发现中文的分类和标签！');
  }

  // 生成建议的翻译映射
  console.log('\n' + '='.repeat(80));
  console.log('建议的中英文映射表');
  console.log('='.repeat(80));
  console.log('请确认以下翻译是否合适，或者提供您想要的翻译：\n');

  const suggestedTranslations = {
    // 分类
    '阅读': 'Reading',
    'Article': 'Article',
    'Investment': 'Investment',

    // 标签
    'reading': 'reading',
    'plan': 'plan',
    'Python': 'python',
    'algorithm': 'algorithm',
    'machine-learning': 'machine-learning',
    'math': 'math',
    'investment': 'investment',
    'Ray-Dalio': 'ray-dalio',
    'WEB': 'warren-buffett',
    'value-investing': 'value-investing',
    'AllWeather': 'all-weather',
    'exercise': 'exercise',
    'Pig': 'pig-cycle',
    'muyuan': 'muyuan',
    'Warren E. Buffett': 'warren-buffett',
    'BRK': 'berkshire-hathaway'
  };

  // 找出所有中文项，自动生成翻译建议
  const chineseCatsAndTags = [...new Set(chineseItems.map(item => item.value))];
  chineseCatsAndTags.forEach(item => {
    // 简单的自动翻译逻辑（实际使用时需要确认）
    let suggested = suggestedTranslations[item] ||
      item
        .replace(/阅读/g, 'reading')
        .replace(/算法/g, 'algorithm')
        .replace(/机器学习/g, 'machine-learning')
        .replace(/投资/g, 'investment')
        .replace(/锻炼/g, 'exercise')
        .replace(/计划/g, 'plan')
        .replace(/笔记/g, 'notes')
        .toLowerCase()
        .replace(/\s+/g, '-');
    console.log(`  "${item}": "${suggested}",`);
  });
}

main().catch(console.error);
