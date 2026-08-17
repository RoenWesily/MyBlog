import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: '关于',
  description: `关于 ${siteConfig.name} 与作者 ${siteConfig.author.name}。`,
};

export default function AboutPage() {
  const emailHref = siteConfig.links.email
    ? `mailto:${siteConfig.links.email}`
    : '';

  return (
    <article className="prose prose-slate mx-auto max-w-3xl prose-headings:font-serif dark:prose-invert">
      <p className="not-prose text-sm font-semibold text-sky-700 dark:text-sky-300">ABOUT</p>
      <h1>关于</h1>
      <p>{siteConfig.author.bio}</p>

      <h2>这个博客会记录什么</h2>
      <ul>
        <li>技术学习笔记与原理拆解</li>
        <li>项目实践、踩坑过程与解决方案</li>
        <li>读书、工具与长期思考</li>
      </ul>

      <h2>技术栈</h2>
      <ul>
        <li>Next.js App Router + 静态导出</li>
        <li>Tailwind CSS</li>
        <li>Markdown + gray-matter + remark</li>
        <li>Giscus 评论与 Umami 统计（可选）</li>
      </ul>

      {(siteConfig.links.github || emailHref) && (
        <>
          <h2>联系我</h2>
          <p className="not-prose flex flex-wrap gap-3">
            {siteConfig.links.github ? (
              <a
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            ) : null}
            {emailHref ? (
              <a
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                href={emailHref}
              >
                Email
              </a>
            ) : null}
          </p>
        </>
      )}
    </article>
  );
}
