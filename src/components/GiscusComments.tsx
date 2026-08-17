'use client';

import { useEffect, useRef } from 'react';

const config = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO || '',
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '',
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Announcements',
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '',
};

export function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const configured = Boolean(
    config.repo && config.repoId && config.category && config.categoryId,
  );

  useEffect(() => {
    if (!configured || !containerRef.current) return;

    const container = containerRef.current;
    container.replaceChildren();

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.repo = config.repo;
    script.dataset.repoId = config.repoId;
    script.dataset.category = config.category;
    script.dataset.categoryId = config.categoryId;
    script.dataset.mapping = 'pathname';
    script.dataset.strict = '1';
    script.dataset.reactionsEnabled = '1';
    script.dataset.emitMetadata = '0';
    script.dataset.inputPosition = 'bottom';
    script.dataset.theme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
    script.dataset.lang = 'zh-CN';
    script.dataset.loading = 'lazy';
    container.appendChild(script);

    const observer = new MutationObserver(() => {
      const theme = document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';
      const frame = container.querySelector<HTMLIFrameElement>('.giscus-frame');
      frame?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme } } },
        'https://giscus.app',
      );
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      container.replaceChildren();
    };
  }, [configured]);

  if (!configured) {
    return (
      <aside className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-5 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
        评论区尚未配置。请在 <code>.env.local</code> 中填写 Giscus 的仓库与分类参数。
      </aside>
    );
  }

  return <div ref={containerRef} className="giscus min-h-24" />;
}
