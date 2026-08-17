import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/PostCard';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import { safeDecodeURIComponent } from '@/lib/format';

type PageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return getAllTags().map(({ name }) => ({ tag: name }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag: encodedTag } = await params;
  const tag = safeDecodeURIComponent(encodedTag);

  return {
    title: `标签：${tag}`,
    description: `浏览标签“${tag}”下的文章。`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag: encodedTag } = await params;
  const tag = safeDecodeURIComponent(encodedTag);
  const posts = getPostsByTag(tag);

  if (posts.length === 0) notFound();

  return (
    <section className="mx-auto max-w-3xl">
      <Link
        href="/tags/"
        prefetch={false}
        className="text-sm font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
      >
        ← 返回全部标签
      </Link>
      <h1 className="mt-7 font-serif text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
        标签：{tag}
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        共 {posts.length} 篇文章
      </p>

      <div className="mt-10 space-y-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
