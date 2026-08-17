import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: '博客写作台',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="admin-shell">
          <header className="admin-header">
            <strong>博客写作台 · 仅本地</strong>
            <nav className="admin-nav">
              <Link href="/">编辑器</Link>
              <Link href="/analytics/">统计</Link>
            </nav>
          </header>
          <main className="admin-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
