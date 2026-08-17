import Script from 'next/script';

export function UmamiScript() {
  const src = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim();
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();
  const domains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS?.trim();
  const hostUrl = process.env.NEXT_PUBLIC_UMAMI_HOST_URL?.trim();

  if (!src || !websiteId) return null;

  return (
    <Script
      id="umami-analytics"
      src={src}
      strategy="afterInteractive"
      data-website-id={websiteId}
      {...(domains ? { 'data-domains': domains } : {})}
      {...(hostUrl ? { 'data-host-url': hostUrl } : {})}
    />
  );
}
