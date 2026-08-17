import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/80 py-10 dark:border-slate-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:text-slate-400">
        <p>
          © {new Date().getUTCFullYear()} {siteConfig.author.name}
        </p>
        <p>Built with Next.js, Tailwind CSS &amp; Markdown</p>
      </div>
    </footer>
  );
}
