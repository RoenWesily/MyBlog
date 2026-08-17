'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Point = { x: string; y: number };
type Metric = { x: string; y: number };
type AnalyticsData = {
  configured: boolean;
  stats?: {
    pageviews: number;
    visitors: number;
    visits: number;
    bounces: number;
    totaltime: number;
  };
  pageviews?: {
    pageviews: Point[];
    sessions: Point[];
  };
  topPages?: Metric[];
  error?: string;
};

const numberFormatter = new Intl.NumberFormat('zh-CN');

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/analytics', { cache: 'no-store' })
      .then(async (response) => {
        const result = (await response.json()) as AnalyticsData;
        if (!response.ok) throw new Error(result.error || '读取统计失败。');
        setData(result);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : '读取统计失败。'));
  }, []);

  const trend = useMemo(() => {
    const sessions = new Map(data?.pageviews?.sessions?.map((point) => [point.x, point.y]) ?? []);
    return (data?.pageviews?.pageviews ?? []).map((point) => ({
      date: new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' }).format(new Date(point.x)),
      pageviews: point.y,
      sessions: sessions.get(point.x) ?? 0,
    }));
  }, [data]);

  if (error) return <div className="analytics-page"><div className="notice">{error}</div></div>;
  if (!data) return <div className="analytics-page">正在读取最近 30 天数据…</div>;
  if (!data.configured) {
    return (
      <div className="analytics-page">
        <h1>访问统计</h1>
        <div className="notice">
          尚未配置 Umami API。复制 <code>.env.local.example</code> 为 <code>.env.local</code>，填写 API 地址、Token 与 Website ID 后重启管理端。
        </div>
      </div>
    );
  }

  const stats = data.stats;
  const bounceRate = stats?.visits ? Math.round((stats.bounces / stats.visits) * 100) : 0;

  return (
    <div className="analytics-page">
      <h1>最近 30 天访问统计</h1>
      <p>数据直接从 Umami API 读取，不会暴露 Token 到浏览器。</p>

      <div className="metric-grid">
        <div className="metric-card"><small>浏览量</small><strong>{numberFormatter.format(stats?.pageviews ?? 0)}</strong></div>
        <div className="metric-card"><small>访客</small><strong>{numberFormatter.format(stats?.visitors ?? 0)}</strong></div>
        <div className="metric-card"><small>访问次数</small><strong>{numberFormatter.format(stats?.visits ?? 0)}</strong></div>
        <div className="metric-card"><small>跳出率</small><strong>{bounceRate}%</strong></div>
      </div>

      <div className="chart-grid">
        <section className="chart-card">
          <h2>浏览趋势</h2>
          <div style={{ width: '100%', height: 340 }}>
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" minTickGap={24} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="pageviews" name="浏览量" stroke="currentColor" dot={false} />
                <Line type="monotone" dataKey="sessions" name="访问次数" stroke="currentColor" strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="chart-card">
          <h2>热门路径</h2>
          <div style={{ width: '100%', height: 340 }}>
            <ResponsiveContainer>
              <BarChart data={data.topPages ?? []} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="x" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="y" name="访客" fill="currentColor" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
