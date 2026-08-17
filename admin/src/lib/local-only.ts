import { NextResponse } from 'next/server';

const localHosts = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

export function rejectNonLocalRequest(request: Request): NextResponse | null {
  const hostname = new URL(request.url).hostname;

  if (!localHosts.has(hostname)) {
    return NextResponse.json(
      { error: '管理端只允许从本机访问。' },
      { status: 403 },
    );
  }

  return null;
}
