import { NextResponse } from 'next/server';
import { rejectNonLocalRequest } from '@/lib/local-only';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function umamiFetch<T>(path: string, token: string, baseUrl: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Umami API ${response.status}: ${await response.text()}`);
  }

  return (await response.json()) as T;
}

export async function GET(request: Request) {
  const rejected = rejectNonLocalRequest(request);
  if (rejected) return rejected;

  const baseUrl = process.env.UMAMI_API_BASE_URL?.trim().replace(/\/$/, '');
  const token = process.env.UMAMI_API_TOKEN?.trim();
  const websiteId = process.env.UMAMI_WEBSITE_ID?.trim();
  const timezone = process.env.UMAMI_TIMEZONE?.trim() || 'Asia/Shanghai';

  if (!baseUrl || !token || !websiteId) {
    return NextResponse.json({ configured: false });
  }

  try {
    const endAt = Date.now();
    const startAt = endAt - 30 * 24 * 60 * 60 * 1000;
    const query = new URLSearchParams({
      startAt: String(startAt),
      endAt: String(endAt),
    });
    const seriesQuery = new URLSearchParams({
      startAt: String(startAt),
      endAt: String(endAt),
      unit: 'day',
      timezone,
    });
    const metricsQuery = new URLSearchParams({
      startAt: String(startAt),
      endAt: String(endAt),
      type: 'path',
      limit: '10',
    });

    const [stats, pageviews, topPages] = await Promise.all([
      umamiFetch(`/websites/${websiteId}/stats?${query}`, token, baseUrl),
      umamiFetch(`/websites/${websiteId}/pageviews?${seriesQuery}`, token, baseUrl),
      umamiFetch(`/websites/${websiteId}/metrics?${metricsQuery}`, token, baseUrl),
    ]);

    return NextResponse.json({ configured: true, stats, pageviews, topPages });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '读取 Umami 数据失败。' },
      { status: 502 },
    );
  }
}
