# AI Binary Journal

个人博客项目，记录 AI 与二进制工程交叉方向的学习历程与实验。

## 技术栈

- Astro 5
- MDX
- Content Collections
- RSS + Sitemap
- GitHub API (build-time profile/repo sync)

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
  lib/          # 内容查询工具函数（blog/github）
  pages/        # 路由页面
```

## GitHub 深度绑定

- 读取账号：`src/consts.ts` 中 `GITHUB_USERNAME`
- 拉取数据：`src/lib/github.ts`
- 使用页面：`src/pages/index.astro`、`src/pages/about.astro`、`src/pages/projects.astro`

说明：部署构建时会从 GitHub API 拉取公开资料与仓库列表，站点内容随仓库更新而更新。

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

1. 修改 `src/consts.ts` 中站点标题和 `GITHUB_USERNAME`（如需切换账号）。
2. 修改 `astro.config.mjs` 中的 `site` 为真实域名。
3. 按需替换 `public/favicon.ico` 和 `public/favicon.svg`。
