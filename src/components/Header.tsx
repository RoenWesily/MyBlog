import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { href: '/', label: '文章' },
  { href: '/tags/', label: '标签' },
  { href: '/about/', label: '关于' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-slate-50/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/75">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          prefetch={false}
          className="font-serif text-xl font-bold tracking-tight text-slate-950 dark:text-white"
        >
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <nav aria-label="主导航" className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
