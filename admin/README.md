# 本地写作管理端

这个目录是独立的 Next.js 应用，只应在本机运行。它可以：

- 用 Monaco Editor 编辑 `../posts/*.md`
- 分屏预览 Markdown
- 新建、保存、删除草稿
- 通过安全参数形式调用 Git，提交并推送 `posts/` 目录
- 使用 Recharts 展示 Umami 最近 30 天统计

## 启动

```bash
cd admin
npm install
cp .env.local.example .env.local
npm run dev
```

打开 `http://127.0.0.1:3100`。

## 安全说明

开发命令只监听 `127.0.0.1`，API 也拒绝非本机主机名。不要把管理端部署到 Vercel，不要把 Umami Token 提交到 Git。

“一键发布”只会 `git add/commit` 博客根目录下的 `posts/`，不会自动提交代码目录。首次使用前请确保：

```bash
git config user.name "你的名字"
git config user.email "you@example.com"
git push -u origin main
```
