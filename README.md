# AI Binary Journal

个人博客项目，记录 AI 与二进制工程交叉方向的学习历程与实验。

## 技术栈

- Astro 5
- MDX
- Content Collections
- RSS + Sitemap

## 快速开始

```bash
npm install
npm run dev
```

本地访问：`http://localhost:4321`

## 目录结构

```text
src/
  components/   # 通用组件
  content/blog/ # 博客文章 (Markdown/MDX)
  layouts/      # 页面布局
  lib/          # 内容查询工具函数
  pages/        # 路由页面
```

## 文章 Frontmatter

```yaml
title: 文章标题
description: 摘要
pubDate: 2026-02-10
updatedDate: 2026-02-12 # optional
tags: [ai, binary]
series: AI x Binary      # optional
difficulty: intermediate # beginner|intermediate|advanced
tools: [python, gdb]
draft: false             # optional
```

## 上线前必改

1. 修改 `src/consts.ts` 中的 `SITE_AUTHOR` 与社交链接。
2. 修改 `astro.config.mjs` 中的 `site` 为真实域名。
3. 按需替换 `public/favicon.ico` 和 `public/favicon.svg`。
