const fallbackUrl = 'http://localhost:3000';

function normalizeUrl(value: string | undefined): string {
  const candidate = value?.trim() || fallbackUrl;

  try {
    return new URL(candidate).toString().replace(/\/$/, '');
  } catch {
    return fallbackUrl;
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME?.trim() || '我的数字花园',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION?.trim() ||
    '记录技术、学习与思考。',
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
  author: {
    name: process.env.NEXT_PUBLIC_AUTHOR_NAME?.trim() || '你的名字',
    bio:
      process.env.NEXT_PUBLIC_AUTHOR_BIO?.trim() ||
      '一个持续学习和写作的人。',
  },
  links: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL?.trim() || '',
    email: process.env.NEXT_PUBLIC_EMAIL?.trim() || '',
  },
};
