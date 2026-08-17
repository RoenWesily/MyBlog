import Link from 'next/link';

type TagPillProps = {
  tag: string;
  count?: number;
};

export function TagPill({ tag, count }: TagPillProps) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}/`}
      prefetch={false}
      className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-200 dark:hover:border-sky-800"
    >
      <span>{tag}</span>
      {typeof count === 'number' ? (
        <span className="text-sky-500 dark:text-sky-400">{count}</span>
      ) : null}
    </Link>
  );
}
