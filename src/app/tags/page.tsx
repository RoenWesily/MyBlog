import type { Metadata } from 'next';
import { TagPill } from '@/components/TagPill';
import { getAllTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: '标签',
  description: '按标签浏览全部文章。',
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">TAGS</p>
      <h1 className="mt-1 font-serif text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
        标签
      </h1>
      <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
        按主题浏览文章。
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        {tags.map((tag) => (
          <TagPill key={tag.name} tag={tag.name} count={tag.count} />
        ))}
      </div>
    </section>
  );
}
