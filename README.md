# Markdown 静态博客

这是一个可直接运行的个人博客模板，架构来自文章《Welcome to fluttering》的方法：Next.js App Router、静态导出、Tailwind CSS、Markdown 内容、Vercel、Umami、Giscus，以及独立的本地写作管理端。

文章原方案使用 Next.js 14。该大版本已经结束官方安全支持，所以本模板升级为 Next.js 16，但保留同样的静态架构与工作流。

## 1. 本地启动

准备 Node.js 22，然后执行：

```bash
npm install
cp .env.example .env.local
npm run dev
```

浏览器打开 `http://localhost:3000`。

## 2. 修改站点信息

编辑 `.env.local`：

```dotenv
NEXT_PUBLIC_SITE_NAME=你的博客名
NEXT_PUBLIC_SITE_DESCRIPTION=一句话介绍
NEXT_PUBLIC_SITE_URL=https://your-blog.vercel.app
NEXT_PUBLIC_AUTHOR_NAME=你的名字
NEXT_PUBLIC_GITHUB_URL=https://github.com/your-name
NEXT_PUBLIC_EMAIL=hello@example.com
```

这些变量会在构建阶段写入静态 HTML。修改后需要重新构建和部署。

## 3. 写文章

在 `posts/` 中新建 `your-slug.md`：

```md
---
title: "文章标题"
date: "2026-08-17"
description: "显示在列表和搜索摘要中的一句话介绍"
tags:
  - Next.js
  - 学习笔记
featured: false
draft: false
---

从这里开始写正文。
```

文件名就是 URL：`posts/your-slug.md` 会生成 `/posts/your-slug/`。

- `draft: true`：默认不进入公开构建；本地临时查看可设置 `INCLUDE_DRAFTS=true`
- `featured: true`：优先显示为首页推荐文章
- `tags`：自动生成标签总览与标签详情页

Markdown 只应来自你信任的本地仓库，不要把此转换流程直接用于匿名用户提交的内容。

## 4. 构建静态站点

```bash
npm run build
npm run preview
```

`next build` 会把可部署文件输出到 `out/`。动态文章页和标签页由 `generateStaticParams()` 在构建时全部枚举，因此新增文章后必须重新构建。

## 5. 部署到 Vercel

1. 在 GitHub 新建公开或私有仓库，并把本项目推送上去。
2. 在 Vercel 导入仓库；Framework Preset 选择 Next.js。
3. 添加 `.env.local` 中对应的环境变量，至少设置站点名、站点 URL 和作者信息。
4. 点击部署。以后每次 `git push` 都会触发新构建。

项目启用了 `output: 'export'`，也能部署到任何能托管静态文件的平台；构建产物是 `out/`。

## 6. 配置 Giscus 评论

1. 用于保存评论的 GitHub 仓库必须公开。
2. 在仓库 Settings → General 中启用 Discussions。
3. 给该仓库安装 Giscus GitHub App。
4. 在 Giscus 配置页选择仓库、`pathname` 映射和 Discussion 分类。
5. 将生成的值写入 Vercel 环境变量：

```dotenv
NEXT_PUBLIC_GISCUS_REPO=your-name/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_...
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_...
```

不填写时，博客仍能运行，只会显示“评论区尚未配置”。

## 7. 配置 Umami

使用 Umami Cloud 或自托管 Umami，新建网站后复制追踪脚本信息：

```dotenv
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_UMAMI_DOMAINS=your-domain.example
```

自托管且追踪接收地址与脚本地址不同时，再填写：

```dotenv
NEXT_PUBLIC_UMAMI_HOST_URL=https://stats.example.com
```

## 8. 本地写作管理端

管理端位于 `admin/`，是完全独立且只监听本机的 Next.js 应用：

```bash
cd admin
npm install
cp .env.local.example .env.local
npm run dev
```

打开 `http://127.0.0.1:3100`。它提供 Monaco 编辑器、Markdown 预览、一键 Git 发布和可选 Umami 图表。完整说明见 `admin/README.md`。

不要将 `admin/` 部署到公网，也不要提交 `admin/.env.local`。

## 9. 常用命令

```bash
npm run dev        # 博客开发服务器
npm run build      # 生成 out/ 静态站点
npm run preview    # 本地预览 out/
npm run typecheck  # TypeScript 检查
npm run admin      # 已安装 admin 依赖后启动写作台
```

## 目录结构

```text
.
├── posts/                    # Markdown 文章
├── public/                   # 静态资源
├── src/app/                  # 首页、文章、标签、关于页
├── src/components/           # 导航、文章卡片、评论、统计脚本
├── src/lib/                  # Markdown 与文章读取逻辑
├── admin/                    # 仅本地运行的独立管理端
├── next.config.mjs           # output: 'export'
└── .env.example              # 环境变量模板
```

## 发布前检查

- `.env.local` 和 `admin/.env.local` 没有进入 Git
- `NEXT_PUBLIC_SITE_URL` 是正式域名，且没有写错协议
- 至少保留一篇 `draft: false` 的文章和一个标签
- Giscus 仓库公开、Discussions 已开启、App 已安装
- `npm run build` 能成功生成 `out/`
- 管理端只在 `127.0.0.1:3100` 使用
