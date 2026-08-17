'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggleTheme() {
    const nextDark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    setDark(nextDark);
  }

  return (
    <button
      type="button"
      className="rounded-full border border-slate-300/80 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
      onClick={toggleTheme}
      aria-label={dark ? '切换到浅色模式' : '切换到深色模式'}
      title={dark ? '切换到浅色模式' : '切换到深色模式'}
    >
      {dark ? '浅色' : '深色'}
    </button>
  );
}
