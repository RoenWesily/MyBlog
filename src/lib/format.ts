const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'UTC',
});

const monthFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

export function parsePostDate(value: string): Date {
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00.000Z`
    : value;
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

export function formatDate(value: string): string {
  return dateFormatter.format(parsePostDate(value));
}

export function formatMonth(value: string): string {
  return monthFormatter.format(parsePostDate(value));
}

export function calculateReadingMinutes(markdown: string): number {
  const withoutCode = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[>#*_~\-]/g, ' ');

  const chineseCharacters = withoutCode.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const latinWords =
    withoutCode
      .replace(/[\u3400-\u9fff]/g, ' ')
      .match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;

  return Math.max(1, Math.ceil(chineseCharacters / 400 + latinWords / 220));
}

export function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
