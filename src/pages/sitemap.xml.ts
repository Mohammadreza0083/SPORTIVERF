import type { APIRoute } from 'astro';
import { LOCALES_LIST } from '@/i18n/config';

import campsData from '@/data/camps.json';

interface SitemapRoute {
  path: string;
  priority: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

const STATIC_ROUTES: SitemapRoute[] = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: 'about', priority: '0.8', changefreq: 'monthly' },
  { path: 'football-camps', priority: '0.9', changefreq: 'weekly' },
  { path: 'volleyball-camps', priority: '0.9', changefreq: 'weekly' },
  { path: 'tours', priority: '0.9', changefreq: 'weekly' }
];

const DYNAMIC_CAMP_ROUTES: SitemapRoute[] = campsData.flatMap((camp) => [
  { path: `camps/${camp.slug}`, priority: '0.8', changefreq: 'weekly' },
  { path: `tours/${camp.slug}`, priority: '0.8', changefreq: 'weekly' }
]);

const ALL_ROUTES: SitemapRoute[] = [...STATIC_ROUTES, ...DYNAMIC_CAMP_ROUTES];

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ? site.href.replace(/\/$/, '') : 'https://sportiverf.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const xmlEntries = ALL_ROUTES.flatMap((route) => {
    const routeSuffix = route.path ? `/${route.path}` : '';

    return LOCALES_LIST.map((locale) => {
      const pageLoc = `${siteUrl}/${locale}${routeSuffix}`;

      const hreflangLinks = LOCALES_LIST.map((altLoc) => {
        const altHref = `${siteUrl}/${altLoc}${routeSuffix}`;
        return `    <xhtml:link rel="alternate" hreflang="${altLoc}" href="${altHref}" />`;
      }).join('\n');

      const xDefaultHref = `${siteUrl}/en${routeSuffix}`;
      const xDefaultLink = `    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultHref}" />`;

      return `  <url>
    <loc>${pageLoc}</loc>
${hreflangLinks}
${xDefaultLink}
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    });
  }).join('\n');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlEntries}
</urlset>`.trim();

  return new Response(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
};
