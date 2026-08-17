import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { calculateReadingMinutes, parsePostDate } from '@/lib/format';

const postsDirectory = path.join(process.cwd(), 'posts');

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
  featured: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & {
  content: string;
};

let postCache: Post[] | null = null;

function normalizeDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const raw = String(value ?? '').trim();
  if (!raw) return '1970-01-01';

  const parsed = parsePostDate(raw);
  if (parsed.getTime() === 0 && raw !== '1970-01-01') return '1970-01-01';

  return parsed.toISOString().slice(0, 10);
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((tag) => tag.trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, fileName);
  const source = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(source);

  return {
    slug,
    title: String(data.title ?? slug).trim(),
    date: normalizeDate(data.date),
    description: String(data.description ?? '').trim(),
    tags: normalizeTags(data.tags),
    draft: Boolean(data.draft),
    featured: Boolean(data.featured),
    readingMinutes: calculateReadingMinutes(content),
    content,
  };
}

function includeDrafts(): boolean {
  return process.env.INCLUDE_DRAFTS === 'true';
}

export function getAllPosts(): Post[] {
  if (!postCache) {
    const files: string[] = fs.existsSync(postsDirectory)
      ? fs.readdirSync(postsDirectory).filter((name: string) => name.endsWith('.md'))
      : [];

    const loadedPosts: Post[] = files
      .map(readPostFile)
      .sort(
        (a: Post, b: Post) =>
          parsePostDate(b.date).getTime() - parsePostDate(a.date).getTime(),
      );
    postCache = loadedPosts;
  }

  const visiblePosts = postCache ?? [];
  return visiblePosts.filter((post) => includeDrafts() || !post.draft);
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getAllTags(): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();

  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}
