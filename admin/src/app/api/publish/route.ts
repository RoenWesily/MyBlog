import { execFileSync } from 'node:child_process';
import { NextResponse } from 'next/server';
import { blogRoot } from '@/lib/blog';
import { rejectNonLocalRequest } from '@/lib/local-only';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function runGit(args: string[]): string {
  return execFileSync('git', args, {
    cwd: blogRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

export async function POST(request: Request) {
  const rejected = rejectNonLocalRequest(request);
  if (rejected) return rejected;

  try {
    const body = (await request.json()) as { message?: string };
    const message = (body.message?.trim() || 'content: publish blog post')
      .replace(/[\r\n]+/g, ' ')
      .slice(0, 120);

    runGit(['rev-parse', '--is-inside-work-tree']);
    runGit(['add', '--', 'posts']);
    const status = runGit(['status', '--porcelain', '--', 'posts']);

    if (!status) {
      return NextResponse.json({ ok: true, message: '文章目录没有待发布的改动。' });
    }

    const commitOutput = runGit(['commit', '-m', message, '--', 'posts']);
    const pushOutput = runGit(['push']);

    return NextResponse.json({
      ok: true,
      message: '提交并推送成功，Vercel 将自动开始部署。',
      details: [commitOutput, pushOutput].filter(Boolean).join('\n'),
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      {
        error:
          '发布失败。请确认仓库已配置 Git、提交者姓名/邮箱和远程 upstream。',
        details,
      },
      { status: 500 },
    );
  }
}
