import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GiscusComments } from '@/components/GiscusComments';
import { TagPill } from '@/components/TagPill';
import { siteConfig } from '@/config/site';
import { formatDate } from '@/lib/format';
import { markdownToHtml } from '@/lib/markdown';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  const url = `${siteConfig.url}/posts/${post.slug}/`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const html = await markdownToHtml(post.content);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
    mainEntityOfPage: `${siteConfig.url}/posts/${post.slug}/`,
  };

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/"
        prefetch={false}
        className="text-sm font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
      >
        ← 返回文章列表
      </Link>

      <header className="mt-8 border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} 分钟阅读</span>
        </div>
        <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          {post.title}
        </h1>
        {post.description ? (
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
            {post.description}
          </p>
        ) : null}
        {post.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        ) : null}
      </header>

      <div
        className="prose prose-slate mt-10 max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-a:text-sky-700 prose-img:rounded-2xl dark:prose-invert dark:prose-a:text-sky-300"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <section className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800" aria-labelledby="comments-title">
        <h2 id="comments-title" className="mb-6 font-serif text-2xl font-bold text-slate-950 dark:text-white">
          评论
        </h2>
        <GiscusComments />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </article>
  );
}
