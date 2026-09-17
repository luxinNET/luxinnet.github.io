const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

// 正则表达式匹配YAML frontmatter
const frontmatterPattern = /^---\s*\n([\s\S]*?)\n---\s*\n/;

// 翻译映射表
const translationMap = {
  // 分类
  '阅读': 'Reading',
  '计划': 'Plan',
  '机器学习': 'Machine Learning',
  '大模型应用开发极简入门': 'LLM Development',
  '训练': 'Training',

  // 标签
  '大模型': 'LLM',
  '大模型应用': 'LLM Application',
  '徐霞客': 'Xu Xiake',
  '李大霄': 'Li Daxiao',
  '李光耀': 'Lee Kuan Yew',
  '段永平': 'Duan Yongping',
  'A股': 'A Share',
  '丁昶': 'Ding Chang'
};

// 标签合并映射表（统一为标准名称）
const tagMergeMap = {
  // 人物
  'Warren E. Buffett': 'Warren Buffett',
  'Warren Buffett': 'Warren Buffett',
  'Buffett': 'Warren Buffett',
  'WEB': 'Warren Buffett',
  'Ray Dalio': 'Ray Dalio',
  'Dalio': 'Ray Dalio',
  'Charlie Munger': 'Charlie Munger',
  'Charles T. Munger': 'Charlie Munger',
  'Munger': 'Charlie Munger',
  'Benjamin Graham': 'Benjamin Graham',
  'David Dodd': 'David Dodd',
  'Mark Rippetoe': 'Mark Rippetoe',
  'Elon Must': 'Elon Musk', // 修正拼写错误
  'Trump': 'Donald Trump',
  'Franklin': 'Benjamin Franklin',
  'Volcker': 'Paul Volcker',
  'Ramaswamy': 'Vivek Ramaswamy',
  'Xu Xiake': 'Xu Xiake',
  'Li Daxiao': 'Li Daxiao',
  'Lee Kuan Yew': 'Lee Kuan Yew',
  'Duan Yongping': 'Duan Yongping',
  'Ding Chang': 'Ding Chang',

  // 公司/机构
  'BRK': 'Berkshire Hathaway',
  'BerkshireHathaway': 'Berkshire Hathaway',
  'Berkshire Hathaway Corporation': 'Berkshire Hathaway',
  'Bridgewater': 'Bridgewater Associates',
  'muyuan': 'Muyuan Foods',

  // 主题
  'Pig': 'Pig Cycle',
  'pig-cycle': 'Pig Cycle',
  'All Weather': 'All Weather Strategy',
  'AllWeather': 'All Weather Strategy',
  'Letters': 'Shareholder Letters',
  'exercise': 'Exercise',
  'training': 'Exercise',
  'plan': 'Plan',
  'reading': 'Reading',
  'study': 'Study',
  'machine learning': 'Machine Learning',
  'Machine Learning Theory': 'Machine Learning',
  'The intelligent investor': 'The Intelligent Investor',
  'FluentPython2ndEdition': 'Fluent Python 2nd Edition',
  'Strength lifts the foundation': 'Strength Training',
  'algorithm': 'Algorithm',
  'Dual pointers': 'Algorithm',
  'Pythonic': 'Python',
  'Python dic': 'Python',
  'Python list': 'Python',
  'Python fuc': 'Python',
  'Python comprehension': 'Python',
  'Python class': 'Python',
  'Python interface': 'Python',
  'Python hook': 'Python',
  'Python namedtuple': 'Python',
  'Python callable': 'Python',
  'Python super': 'Python',
  'Python @property': 'Python',
  'Python WeakKeyDictionary': 'Python',
  'TheZenOfPython': 'Python',
  'flutter': 'Flutter',
  'Bank Shares': 'Bank Stocks',
  'English-Exercise': 'English Study',
  'study English': 'English Study',
  'january': 'January',
  'annual': 'Annual',
  'securities transactions': 'Securities Transactions',
  'list': 'List',
  'log': 'Log',
  'code': 'Code',
  'Tech News': 'Tech News',
  'introduction': 'Introduction',
  'A Share': 'A Share Market',
  'Investment': 'Investment',
  'Iran': 'Iran',
  'book': 'Book',

  // 书籍
  'Effective Python': 'Effective Python',
  'Principles': 'Principles',
  'Security Analysis': 'Security Analysis',
  'Math for Programmers': 'Math for Programmers',
};

// 分类合并映射表
const categoryMergeMap = {
  '阅读': 'Reading',
  '计划': 'Plan',
  '机器学习': 'Machine Learning',
  '大模型应用开发极简入门': 'LLM Development',
  '训练': 'Training',
  'algorithm Notes': 'Algorithm Notes',
  'Exercise Notes': 'Exercise Notes',
  'Read Notes': 'Reading Notes',
  'Read Exercises': 'Reading Exercises',
  'study': 'Study',
};

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

    if (line.startsWith('title:')) {
      fields.title = line.slice('title:'.length).trim().replace(/^["']|["']$/g, '');
    } else if (line.startsWith('date:')) {
      fields.date = line.slice('date:'.length).trim();
    } else if (line.startsWith('categories:')) {
      const value = line.slice('categories:'.length).trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        fields.categories = value.slice(1, -1)
          .split(',')
          .map(item => item.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      }
    } else if (line.startsWith('tags:')) {
      const value = line.slice('tags:'.length).trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        fields.tags = value.slice(1, -1)
          .split(',')
          .map(item => item.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      }
    } else if (line.startsWith('comments:')) {
      fields.comments = line.slice('comments:'.length).trim().toLowerCase() === 'true';
    }
  });

  return {
    fields,
    body: content.slice(match[0].length)
  };
}

/**
 * 规范化单个字符串（翻译+合并+Title Case）
 */
function normalizeString(str, mergeMap) {
  // 首先翻译
  let normalized = translationMap[str] || str;

  // 然后合并
  normalized = mergeMap[normalized] || normalized;

  // Title Case 处理
  return normalized
    .split(/[\s-]/)
    .map(word => {
      if (!word) return '';
      // 特殊词保持全大写
      const uppercaseWords = ['LLM', 'AI', 'PYTHON', 'BRK', 'A SHARE'];
      if (uppercaseWords.includes(word.toUpperCase())) {
        return word.toUpperCase();
      }
      // 普通单词首字母大写
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * 规范化分类数组
 */
function normalizeCategories(categories) {
  if (!Array.isArray(categories)) categories = [];

  const normalized = categories
    .map(cat => normalizeString(cat, categoryMergeMap))
    .filter((cat, index, self) => self.indexOf(cat) === index); // 去重

  // 确保至少有一个分类
  return normalized.length > 0 ? normalized : ['Article'];
}

/**
 * 规范化标签数组
 */
function normalizeTags(tags) {
  if (!Array.isArray(tags)) tags = [];

  const normalized = tags
    .map(tag => normalizeString(tag, tagMergeMap))
    .filter((tag, index, self) => self.indexOf(tag) === index); // 去重

  return normalized;
}

/**
 * 生成标准的frontmatter
 */
function generateStandardFrontmatter(fields) {
  const standard = [];

  // Title
  if (fields.title) {
    // 处理标题中的特殊字符
    const title = fields.title.replace(/"/g, '\\"');
    standard.push(`title: "${title}"`);
  }

  // Date
  if (fields.date) {
    standard.push(`date: ${fields.date}`);
  }

  // Categories
  const categories = normalizeCategories(fields.categories);
  standard.push(`categories: [${categories.map(c => `"${c}"`).join(', ')}]`);

  // Tags
  const tags = normalizeTags(fields.tags);
  standard.push(`tags: [${tags.map(t => `"${t}"`).join(', ')}]`);

  // Comments
  standard.push(`comments: ${fields.comments !== undefined ? fields.comments : true}`);

  return '---\n' + standard.join('\n') + '\n---\n\n';
}

/**
 * 修复单个文件
 */
async function normalizeFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    const { fields, body } = parseFrontmatter(content);
    const newFrontmatter = generateStandardFrontmatter(fields);
    const newContent = newFrontmatter + body.trimStart();

    if (newContent !== content) {
      await writeFile(filePath, newContent, 'utf8');
      return { changed: true, status: '已规范化' };
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

  console.log('开始规范化所有分类和标签...\n');

  const results = [];
  for (const file of allMdFiles) {
    const relativePath = path.relative(__dirname, file);
    const { changed, status } = await normalizeFile(file);
    results.push({ file: relativePath, changed, status });
    console.log(`${relativePath.padEnd(60)} ${status}`);
  }

  // 统计结果
  const total = results.length;
  const changedCount = results.filter(r => r.changed).length;
  const errorCount = results.filter(r => r.status.startsWith('错误')).length;

  console.log('\n' + '='.repeat(80));
  console.log(`规范化完成! 共处理 ${total} 个文件, ${changedCount} 个文件已更新, ${errorCount} 个错误`);
  console.log('='.repeat(80));

  // 统计最终的分类和标签
  console.log('\n' + '='.repeat(80));
  console.log('最终统计结果');
  console.log('='.repeat(80));

  const allCategories = new Set();
  const allTags = new Set();

  for (const file of allMdFiles) {
    const content = await readFile(file, 'utf8');
    const { fields } = parseFrontmatter(content);
    fields.categories.forEach(c => allCategories.add(c));
    fields.tags.forEach(t => allTags.add(t));
  }

  console.log(`\n总分类数: ${allCategories.size}`);
  console.log('分类列表:');
  Array.from(allCategories).sort().forEach(c => console.log(`  ✅ ${c}`));

  console.log(`\n总标签数: ${allTags.size}`);
  console.log('标签列表 (部分):');
  Array.from(allTags).sort().slice(0, 30).forEach(t => console.log(`  ✅ ${t}`));
  if (allTags.size > 30) {
    console.log(`  ... 还有 ${allTags.size - 30} 个标签`);
  }
}

main().catch(console.error);
