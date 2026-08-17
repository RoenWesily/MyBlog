'use client';

import dynamic from 'next/dynamic';
import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="empty-state">正在加载编辑器…</div>,
});

type PostSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
  modifiedAt: string;
};

type ApiError = { error?: string; details?: string };

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & ApiError;
  if (!response.ok) throw new Error(data.error || data.details || '请求失败。');
  return data;
}

export default function EditorPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [status, setStatus] = useState('正在读取文章…');
  const [busy, setBusy] = useState(false);

  const dirty = content !== savedContent;

  const loadPosts = useCallback(async (preferredSlug?: string) => {
    const data = await parseResponse<{ posts: PostSummary[] }>(
      await fetch('/api/posts', { cache: 'no-store' }),
    );
    setPosts(data.posts);
    const selectedStillExists = data.posts.some((post) => post.slug === selectedSlug);
    const nextSlug =
      preferredSlug ||
      (selectedStillExists ? selectedSlug : data.posts[0]?.slug || '');
    if (nextSlug) await selectPost(nextSlug, false);
    else setStatus('暂无文章，请先创建一篇。');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug]);

  async function selectPost(slug: string, checkDirty = true) {
    if (checkDirty && dirty && !window.confirm('当前文章有未保存修改，确定切换吗？')) return;
    setBusy(true);
    try {
      const data = await parseResponse<{ slug: string; content: string }>(
        await fetch(`/api/posts/${encodeURIComponent(slug)}`, { cache: 'no-store' }),
      );
      setSelectedSlug(data.slug);
      setContent(data.content);
      setSavedContent(data.content);
      setStatus(`正在编辑 ${data.slug}.md`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '读取失败。');
    } finally {
      setBusy(false);
    }
  }

  async function savePost(): Promise<boolean> {
    if (!selectedSlug) return false;
    setBusy(true);
    setStatus('正在保存…');
    try {
      await parseResponse(
        await fetch(`/api/posts/${encodeURIComponent(selectedSlug)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        }),
      );
      setSavedContent(content);
      await loadPosts(selectedSlug);
      setStatus('已保存到 posts/ 目录。');
      return true;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '保存失败。');
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function createNewPost() {
    setBusy(true);
    try {
      const data = await parseResponse<{ slug: string; content: string }>(
        await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle, slug: newSlug }),
        }),
      );
      setNewTitle('');
      setNewSlug('');
      await loadPosts(data.slug);
      setStatus('已创建草稿。');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '创建失败。');
    } finally {
      setBusy(false);
    }
  }

  async function deleteCurrentPost() {
    if (!selectedSlug || !window.confirm(`确定删除 ${selectedSlug}.md 吗？此操作不可撤销。`)) return;
    setBusy(true);
    try {
      await parseResponse(
        await fetch(`/api/posts/${encodeURIComponent(selectedSlug)}`, { method: 'DELETE' }),
      );
      setSelectedSlug('');
      setContent('');
      setSavedContent('');
      await loadPosts();
      setStatus('文章已删除；提交 Git 前仍可从版本历史恢复。');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '删除失败。');
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (dirty && !(await savePost())) return;
    const defaultMessage = selectedSlug
      ? `content: publish ${selectedSlug}`
      : 'content: publish blog posts';
    const message = window.prompt('Git 提交信息：', defaultMessage);
    if (message === null) return;

    setBusy(true);
    setStatus('正在提交并推送 posts/…');
    try {
      const data = await parseResponse<{ message: string }>(
        await fetch('/api/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        }),
      );
      setStatus(data.message);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '发布失败。');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadPosts().catch((error) => {
      setStatus(error instanceof Error ? error.message : '初始化失败。');
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPost = useMemo(
    () => posts.find((post) => post.slug === selectedSlug),
    [posts, selectedSlug],
  );

  return (
    <div className="editor-grid">
      <aside className="sidebar">
        <form
          className="new-post"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            void createNewPost();
          }}
        >
          <strong>新建文章</strong>
          <input
            className="input"
            value={newTitle}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setNewTitle(event.target.value)}
            placeholder="文章标题"
            required
          />
          <input
            className="input"
            value={newSlug}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setNewSlug(event.target.value.toLowerCase())}
            placeholder="slug-like-this"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            required
          />
          <button className="button" type="submit" disabled={busy}>创建草稿</button>
        </form>

        <h2 className="sidebar-title">文章（{posts.length}）</h2>
        <div className="post-list">
          {posts.map((post) => (
            <button
              type="button"
              key={post.slug}
              className={`post-button ${post.slug === selectedSlug ? 'active' : ''}`}
              onClick={() => void selectPost(post.slug)}
            >
              <strong>{post.title}</strong>
              <small>
                {post.date || '无日期'} {post.draft ? <span className="draft-badge">· 草稿</span> : ''}
              </small>
            </button>
          ))}
        </div>
      </aside>

      <section className="workspace">
        <div className="toolbar">
          <button className="button" type="button" onClick={() => void savePost()} disabled={busy || !selectedSlug || !dirty}>
            保存
          </button>
          <button className="button secondary" type="button" onClick={() => void publish()} disabled={busy}>
            一键发布
          </button>
          <button className="button danger" type="button" onClick={() => void deleteCurrentPost()} disabled={busy || !selectedSlug}>
            删除
          </button>
          <span className="spacer" />
          <span className="status">
            {dirty ? '● 未保存 · ' : ''}{status}
          </span>
        </div>

        {selectedSlug ? (
          <div className="split-pane">
            <div className="editor-pane">
              <MonacoEditor
                height="100%"
                defaultLanguage="markdown"
                language="markdown"
                theme="vs-light"
                value={content}
                onChange={(value: string | undefined) => setContent(value ?? '')}
                options={{
                  wordWrap: 'on',
                  minimap: { enabled: false },
                  fontSize: 15,
                  lineHeight: 24,
                  padding: { top: 16, bottom: 16 },
                  automaticLayout: true,
                }}
              />
            </div>
            <div className="preview-pane">
              <article>
                {selectedPost ? <p><small>预览：{selectedPost.slug}.md</small></p> : null}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.replace(/^---[\s\S]*?---\s*/, '')}</ReactMarkdown>
              </article>
            </div>
          </div>
        ) : (
          <div className="empty-state">从左侧选择文章，或创建一篇新草稿。</div>
        )}
      </section>
    </div>
  );
}
