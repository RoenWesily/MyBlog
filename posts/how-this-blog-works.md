---
title: "这个博客是怎样工作的"
date: "2026-08-16"
description: "从 Markdown 文件到静态网页，再到 Vercel 自动部署的完整数据流。"
tags:
  - Next.js
  - Markdown
  - Vercel
featured: false
draft: false
---

## 构建流程

文章文件经过下面的流程生成页面：

```text
posts/example.md
  → gray-matter 解析 frontmatter
  → remark 解析 Markdown
  → remark-gfm 扩展表格与任务列表
  → remark-html 输出 HTML
  → Next.js 在构建阶段生成静态页面
  → out/ 目录部署到 CDN
```

## 为什么使用静态导出

静态博客没有运行时数据库，也不需要长期运行的后端进程。只要托管平台能提供 HTML、CSS 和 JavaScript 文件，就能部署。

## 评论和统计

评论由 Giscus 写入 GitHub Discussions；访问统计由 Umami 的轻量脚本上报。两者都通过环境变量启用，不配置时不影响博客主体运行。
