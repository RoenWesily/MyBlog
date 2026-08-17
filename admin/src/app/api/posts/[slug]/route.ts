import { NextResponse } from 'next/server';
import { deletePost, readPost, writePost } from '@/lib/blog';
import { rejectNonLocalRequest } from '@/lib/local-only';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const rejected = rejectNonLocalRequest(request);
  if (rejected) return rejected;

  try {
    const { slug } = await context.params;
    return NextResponse.json({ slug, content: readPost(slug) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '读取文章失败。' },
      { status: 404 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const rejected = rejectNonLocalRequest(request);
  if (rejected) return rejected;

  try {
    const { slug } = await context.params;
    const body = (await request.json()) as { content?: string };
    if (typeof body.content !== 'string') throw new Error('缺少文章内容。');
    writePost(slug, body.content);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '保存文章失败。' },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const rejected = rejectNonLocalRequest(request);
  if (rejected) return rejected;

  try {
    const { slug } = await context.params;
    deletePost(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '删除文章失败。' },
      { status: 400 },
    );
  }
}
