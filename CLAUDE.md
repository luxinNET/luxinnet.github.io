# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal blog (`https://luxinnet.github.io`) built with Jekyll and the **Chirpy theme** (~> 6.5, installed as a gem — theme files are not in this repo). Deploy is fully automatic: pushing to `main` triggers [pages-deploy.yml](.github/workflows/pages-deploy.yml) which builds and publishes via GitHub Pages. There is no manual deploy step.

Content is mostly Chinese: investment/book notes (Berkshire letters, 证券分析, Ray Dalio), training logs, and technical notes. Commit messages are usually Chinese or conventional-commit English.

## Commands

```bash
bundle install                  # first time (Gemfile.lock is gitignored)
bundle exec jekyll serve        # local preview at http://127.0.0.1:4000
```

There is no test suite; the Gemfile's `html-proofer` group is only used by the theme's CI, not here.

## Structure

- `_posts/YYYY/YYYY-MM-DD-title.md` — blog posts. Filenames may contain Chinese; keep the `YYYY-MM-DD-` prefix. Front matter: `title`, `date`, `categories`, `tags`, `comments: true`.
- `_tabs/` — static pages (about, archives, categories, tags), permalink `/:title/`.
- `_config.yml` — site config; notable custom bits: a `years` collection (`/year/:path/`, layout `year`), giscus comments, PWA enabled, timezone `Asia/Shanghai`.
- `_plugins/posts-lastmod-hook.rb` — sets `last_modified_at` from git history for posts changed in more than one commit.
- `assets/lib/` — git submodule (chirpy-static-assets); run `git submodule update --init` after a fresh clone if it's empty.
- Root-level `analyze_frontmatter.py`, `fix_frontmatter.py`, `fixFrontmatter.js`, `collectTagsCategories.js`, `normalizeTagsCategories.js` — one-off Node/Python utilities written to bulk-fix post front matter (tags/categories normalization). Read one before reusing it; they rewrite files in place.
- `code/` and `reports/` — personal scratch/reference material, not part of the built site.

## Important constraints

- **`.gitignore` excludes specific "private" files** (e.g. `_posts/2026/2026-10-26-求职作战计划.md`, `code/result.json`). Never force-add or publish these; check `.gitignore` before adding files in `_posts/` or `code/`.
- Per the README license, `_posts/` and image content are copyright the owner; do not reuse them elsewhere.

## Writing-style rules (from .cursor/rules/)

Two Cursor rules define content styles used in this repo:

- **writer-expert.mdc (刘润 style)** — for blog posts: reader-empathy writing, direct address using "你" (never "大家"), SCQA/ASC/CSA logic flow, story → example → analogy → memorable one-liner structure, short precise wording, humble/self-deprecating tone.
- **red-notes-expert.mdc (小红书 style)** — for Xiaohongshu posts: catchy titles using 正面/负面刺激 formulas, emoji throughout, colloquial tone, and `#tag` lists tied to trending keywords.

When asked to write a blog post or Xiaohongshu note, follow the matching rule's style.
