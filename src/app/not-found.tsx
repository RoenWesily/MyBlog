import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">404</p>
      <h1 className="mt-3 font-serif text-4xl font-bold text-slate-950 dark:text-white">
        页面不存在
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        链接可能已变更，或者文章尚未发布。
      </p>
      <Link
        href="/"
        prefetch={false}
        className="mt-8 inline-flex rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      >
        返回首页
      </Link>
    </div>
  );
}
