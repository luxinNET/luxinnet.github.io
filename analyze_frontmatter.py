import os
import re
from pathlib import Path

# 正则表达式匹配YAML frontmatter
frontmatter_pattern = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)

# 定义标准字段
standard_fields = {'title', 'date', 'categories', 'tags', 'comments'}

def analyze_frontmatter(file_path):
    """分析单个文件的frontmatter"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        match = frontmatter_pattern.match(content)
        if not match:
            return {
                'file': file_path,
                'has_frontmatter': False,
                'fields': {},
                'missing_fields': list(standard_fields),
                'extra_fields': []
            }

        frontmatter_content = match.group(1)
        # 简单解析YAML字段（不处理复杂嵌套）
        fields = {}
        for line in frontmatter_content.split('\n'):
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip()
                # 处理数组类型
                if value.startswith('[') and value.endswith(']'):
                    value = [item.strip() for item in value[1:-1].split(',')]
                fields[key] = value

        missing_fields = list(standard_fields - set(fields.keys()))
        extra_fields = list(set(fields.keys()) - standard_fields)

        return {
            'file': file_path,
            'has_frontmatter': True,
            'fields': fields,
            'missing_fields': missing_fields,
            'extra_fields': extra_fields,
            'frontmatter_raw': frontmatter_content
        }
    except Exception as e:
        return {
            'file': file_path,
            'error': str(e)
        }

def main():
    posts_dir = Path('_posts')
    all_issues = []
    field_usage = {}

    # 遍历所有md文件
    for md_file in posts_dir.rglob('*.md'):
        result = analyze_frontmatter(md_file)
        if 'error' in result:
            print(f"Error processing {md_file}: {result['error']}")
            continue

        # 统计字段使用情况
        for field in result['fields']:
            if field not in field_usage:
                field_usage[field] = 0
            field_usage[field] += 1

        # 收集有问题的文件
        if not result['has_frontmatter'] or result['missing_fields'] or result['extra_fields']:
            all_issues.append(result)

    # 生成报告
    print("=" * 80)
    print("博客文章Frontmatter分析报告")
    print("=" * 80)
    print(f"\n总文件数: {len(list(posts_dir.rglob('*.md')))}")
    print(f"有问题的文件数: {len(all_issues)}")
    print(f"\n字段使用统计:")
    for field, count in sorted(field_usage.items(), key=lambda x: (-x[1], x[0])):
        status = "✓ 标准字段" if field in standard_fields else "✗ 非标准字段"
        print(f"  {field}: {count}次 {status}")

    print("\n" + "=" * 80)
    print("详细问题列表:")
    print("=" * 80)

    for issue in all_issues:
        print(f"\n文件: {issue['file']}")
        if not issue['has_frontmatter']:
            print("  问题: 没有Frontmatter")
        else:
            if issue['missing_fields']:
                print(f"  缺失字段: {', '.join(issue['missing_fields'])}")
            if issue['extra_fields']:
                print(f"  多余字段: {', '.join(issue['extra_fields'])}")
            print(f"  当前Frontmatter:")
            print("    ---")
            for line in issue['frontmatter_raw'].split('\n'):
                print(f"    {line}")
            print("    ---")

if __name__ == "__main__":
    main()
