import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ? site.href.replace(/\/$/, '') : 'https://sportiverf.com';

  const robotsTxt = `
# SportivERF Production Crawl Directive
User-agent: *
Allow: /
Allow: /en/
Allow: /fa/
Allow: /ar/
Disallow: /api/
Disallow: /admin/
Disallow: /*?*query=

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml
`.trim();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
};
