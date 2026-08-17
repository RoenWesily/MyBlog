import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';
import { formatDate } from '@/lib/format';
import { TagPill } from '@/components/TagPill';

type PostCardProps = {
  post: PostMeta;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group rounded-3xl border border-slate-200/80 bg-white/75 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readingMinutes} 分钟阅读</span>
        {post.featured ? (
          <>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-amber-700 dark:text-amber-300">精选</span>
          </>
        ) : null}
      </div>

      <h2 className="font-serif text-2xl font-bold tracking-tight text-slate-950 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-300">
        <Link href={`/posts/${post.slug}/`} prefetch={false}>
          {post.title}
        </Link>
      </h2>

      {post.description ? (
        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
          {post.description}
        </p>
      ) : null}

      {post.tags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      ) : null}
    </article>
  );
}
