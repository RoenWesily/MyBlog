import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { formatDate, formatMonth } from '@/lib/format';
import { getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const timeline = new Map<string, typeof posts>();

  for (const post of posts) {
    const month = formatMonth(post.date);
    const group = timeline.get(month) ?? [];
    group.push(post);
    timeline.set(month, group);
  }

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/70 px-7 py-12 shadow-sm backdrop-blur sm:px-12 sm:py-16 dark:border-slate-800 dark:bg-slate-900/55">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
        <div className="relative max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
            Personal knowledge garden
          </p>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl dark:text-white">
            {siteConfig.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {siteConfig.description}
          </p>
        </div>
      </section>

      {featured ? (
        <section aria-labelledby="featured-title">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">FEATURED</p>
              <h2 id="featured-title" className="mt-1 font-serif text-3xl font-bold text-slate-950 dark:text-white">
                推荐阅读
              </h2>
            </div>
          </div>
          <PostCard post={featured} />
        </section>
      ) : null}

      <section aria-labelledby="timeline-title">
        <div className="mb-8">
          <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">TIMELINE</p>
          <h2 id="timeline-title" className="mt-1 font-serif text-3xl font-bold text-slate-950 dark:text-white">
            全部文章
          </h2>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-slate-600 dark:border-slate-700 dark:text-slate-300">
            暂无已发布文章。请在 <code>posts/</code> 目录中新建 Markdown 文件。
          </div>
        ) : (
          <div className="space-y-10">
            {[...timeline.entries()].map(([month, monthPosts]) => (
              <div key={month} className="grid gap-4 md:grid-cols-[9rem_1fr]">
                <h3 className="pt-2 font-serif text-lg font-semibold text-slate-500 dark:text-slate-400">
                  {month}
                </h3>
                <ol className="divide-y divide-slate-200/80 border-t border-slate-200/80 dark:divide-slate-800 dark:border-slate-800">
                  {monthPosts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/posts/${post.slug}/`}
                        prefetch={false}
                        className="group grid gap-2 py-5 sm:grid-cols-[7rem_1fr_auto] sm:items-center"
                      >
                        <time className="text-sm text-slate-500 dark:text-slate-400" dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                        <span className="font-serif text-lg font-semibold text-slate-900 transition group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-300">
                          {post.title}
                        </span>
                        <span className="text-sm text-slate-400 dark:text-slate-500">
                          {post.readingMinutes} min
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
