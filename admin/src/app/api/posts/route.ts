import { NextResponse } from 'next/server';
import { createPost, listPosts } from '@/lib/blog';
import { rejectNonLocalRequest } from '@/lib/local-only';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const rejected = rejectNonLocalRequest(request);
  if (rejected) return rejected;

  try {
    return NextResponse.json({ posts: listPosts() });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '读取文章失败。' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const rejected = rejectNonLocalRequest(request);
  if (rejected) return rejected;

  try {
    const body = (await request.json()) as { slug?: string; title?: string };
    const slug = body.slug?.trim() || '';
    const title = body.title?.trim() || '';
    const content = createPost(slug, title);
    return NextResponse.json({ slug, content }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '创建文章失败。' },
      { status: 400 },
    );
  }
}
