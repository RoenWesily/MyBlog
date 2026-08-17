import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const blogRoot = path.resolve(
  process.cwd(),
  process.env.BLOG_ROOT?.trim() || '..',
);
export const postsDirectory = path.join(blogRoot, 'posts');

export type AdminPostSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
  modifiedAt: string;
};

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/.test(slug);
}

function postPath(slug: string): string {
  if (!isValidSlug(slug)) throw new Error('Slug 只能包含小写字母、数字和连字符。');
  return path.join(postsDirectory, `${slug}.md`);
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((tag) => tag.trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((tag) => tag.trim()).filter(Boolean);
  return [];
}

export function listPosts(): AdminPostSummary[] {
  fs.mkdirSync(postsDirectory, { recursive: true });

  const names: string[] = fs
    .readdirSync(postsDirectory)
    .filter((name: string) => name.endsWith('.md'));

  const posts: AdminPostSummary[] = names.map((name: string) => {
      const slug = name.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, name);
      const source = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(source);
      const stat = fs.statSync(fullPath);

      return {
        slug,
        title: String(data.title ?? slug),
        date: data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : String(data.date ?? ''),
        description: String(data.description ?? ''),
        tags: normalizeTags(data.tags),
        draft: Boolean(data.draft),
        modifiedAt: stat.mtime.toISOString(),
      };
    });

  return posts.sort(
    (a: AdminPostSummary, b: AdminPostSummary) =>
      b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN'),
  );
}

export function readPost(slug: string): string {
  return fs.readFileSync(postPath(slug), 'utf8');
}

export function writePost(slug: string, content: string): void {
  fs.mkdirSync(postsDirectory, { recursive: true });
  const target = postPath(slug);
  const temporary = `${target}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, content.replace(/\r\n/g, '\n'), 'utf8');
  fs.renameSync(temporary, target);
}

export function createPost(slug: string, title: string): string {
  const target = postPath(slug);
  if (fs.existsSync(target)) throw new Error('该 Slug 已存在。');

  const today = new Date().toISOString().slice(0, 10);
  const safeTitle = title.trim() || slug;
  const content = `---\ntitle: ${JSON.stringify(safeTitle)}\ndate: ${JSON.stringify(today)}\ndescription: \"\"\ntags:\n  - 笔记\ndraft: true\nfeatured: false\n---\n\n从这里开始写正文。\n`;
  writePost(slug, content);
  return content;
}

export function deletePost(slug: string): void {
  fs.unlinkSync(postPath(slug));
}
