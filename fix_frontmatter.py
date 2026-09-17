import os
import re
from pathlib import Path
from datetime import datetime

# 正则表达式匹配YAML frontmatter
frontmatter_pattern = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)

def parse_frontmatter(content):
    """解析frontmatter返回字段字典"""
    match = frontmatter_pattern.match(content)
    if not match:
        return None, content

    frontmatter_content = match.group(1)
    fields = {}
    for line in frontmatter_content.split('\n'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()

            # 处理布尔值
            if value.lower() == 'true':
                value = True
            elif value.lower() == 'false':
                value = False
            # 处理数组类型
            elif value.startswith('[') and value.endswith(']'):
                value = [item.strip().strip('"\'') for item in value[1:-1].split(',') if item.strip()]
            # 处理带引号的字符串
            elif (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
                value = value[1:-1]

            fields[key] = value

    return fields, content[match.end():]

def generate_standard_frontmatter(fields, file_path):
    """生成标准的frontmatter"""
    standard = []

    # 1. title
    if 'title' in fields:
        title = fields['title']
        # 如果标题包含特殊字符，加引号
        if any(c in title for c in ':[]{}\'"') or not title:
            standard.append(f'title: "{title}"')
        else:
            standard.append(f'title: {title}')
    else:
        # 从文件名提取标题
        file_name = Path(file_path).stem
        # 移除日期前缀
        title = re.sub(r'^\d{4}-\d{2}-\d{2}-', '', file_name)
        title = title.replace('-', ' ').strip()
        standard.append(f'title: "{title}"')

    # 2. date
    if 'date' in fields:
        date_val = fields['date']
        # 确保日期格式正确
        if isinstance(date_val, str):
            try:
                # 尝试解析日期
                datetime.strptime(date_val, '%Y-%m-%d')
                standard.append(f'date: {date_val}')
            except ValueError:
                # 从文件名提取日期
                date_match = re.match(r'^(\d{4}-\d{2}-\d{2})-', Path(file_path).stem)
                if date_match:
                    standard.append(f'date: {date_match.group(1)}')
                else:
                    standard.append(f'date: {datetime.now().strftime("%Y-%m-%d")}')
        else:
            standard.append(f'date: {fields["date"]}')
    else:
        # 从文件名提取日期
        date_match = re.match(r'^(\d{4}-\d{2}-\d{2})-', Path(file_path).stem)
        if date_match:
            standard.append(f'date: {date_match.group(1)}')
        else:
            standard.append(f'date: {datetime.now().strftime("%Y-%m-%d")}')

    # 3. categories (处理单数category的情况)
    categories = []
    if 'categories' in fields:
        cats = fields['categories']
        if isinstance(cats, list):
            categories = cats
        elif isinstance(cats, str):
            categories = [cats.strip()]
    elif 'category' in fields:
        cat = fields['category']
        if isinstance(cat, list):
            categories = cat
        elif isinstance(cat, str):
            categories = [cat.strip()]

    # 确保categories是数组
    if not categories:
        categories = ['Article']  # 默认分类

    standard.append(f'categories: {categories}')

    # 4. tags
    tags = []
    if 'tags' in fields:
        ts = fields['tags']
        if isinstance(ts, list):
            tags = ts
        elif isinstance(ts, str):
            tags = [t.strip() for t in ts.split(',') if t.strip()]

    standard.append(f'tags: {tags}')

    # 5. comments
    if 'comments' in fields:
        standard.append(f'comments: {str(fields["comments"]).lower()}')
    else:
        standard.append('comments: true')

    # 组合成frontmatter
    return '---\n' + '\n'.join(standard) + '\n---\n\n'

def fix_file_frontmatter(file_path):
    """修复单个文件的frontmatter"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        fields, body = parse_frontmatter(content)
        if fields is None:
            fields = {}

        new_frontmatter = generate_standard_frontmatter(fields, file_path)
        new_content = new_frontmatter + body.lstrip()

        # 只有当内容变化时才写入
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True, "已修复"
        else:
            return False, "无需修改"

    except Exception as e:
        return False, f"错误: {str(e)}"

def main():
    posts_dir = Path('_posts')
    results = []

    print("开始修复所有文章的Frontmatter...\n")

    for md_file in posts_dir.rglob('*.md'):
        changed, status = fix_file_frontmatter(md_file)
        results.append((md_file, changed, status))
        print(f"{md_file:<60} {status}")

    # 统计结果
    total = len(results)
    changed_count = sum(1 for _, changed, _ in results if changed)
    error_count = sum(1 for _, _, status in results if status.startswith('错误'))

    print("\n" + "=" * 80)
    print(f"修复完成! 共处理 {total} 个文件, {changed_count} 个文件已修复, {error_count} 个错误")
    print("=" * 80)

if __name__ == "__main__":
    main()
