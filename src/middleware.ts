import { defineMiddleware } from 'astro:middleware';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ComingSoon from '@/components/shared/ComingSoon.astro';
import { getLangFromUrl } from '@/i18n/utils';
import type { SupportedLocale } from '@/types/i18n';

/**
 * Global Maintenance / Coming Soon Toggle
 * Set to `false` when ready to unveil all internal camp and expedition pages.
 */
export const MAINTENANCE_MODE = true;

/**
 * Whitelist of allowed routes during maintenance mode.
 * Trailing slashes are normalized before checking.
 */
const ALLOWED_PATHS = new Set(['/', '/en', '/tr', '/en/about', '/tr/about']);

/**
 * System and static asset route prefixes that must always bypass middleware
 */
const STATIC_PREFIXES = ['/_astro', '/_image', '/images', '/api', '/fonts', '/assets', '/favicon'];

/**
 * Static file extensions to bypass
 */
const STATIC_EXTENSIONS =
  /\.(svg|png|jpg|jpeg|webp|gif|ico|css|js|map|json|woff|woff2|ttf|eot|otf|xml|txt|webmanifest)$/i;

export const onRequest = defineMiddleware(async (context, next) => {
  // If maintenance mode is turned off, proceed normally
  if (!MAINTENANCE_MODE) {
    return next();
  }

  const { url } = context;
  const rawPathname = url.pathname;

  // 1. Bypass static asset directory prefixes
  if (STATIC_PREFIXES.some((prefix) => rawPathname.startsWith(prefix))) {
    return next();
  }

  // 2. Bypass static file extensions and search engine manifests
  if (
    STATIC_EXTENSIONS.test(rawPathname) ||
    rawPathname === '/robots.txt' ||
    rawPathname === '/sitemap.xml' ||
    rawPathname === '/site.webmanifest'
  ) {
    return next();
  }

  // 3. Normalize pathname (strip trailing slash safely, preserving single root '/')
  const normalizedPathname = rawPathname.length > 1 ? rawPathname.replace(/\/+$/, '') : rawPathname;

  // 4. If the route is in the whitelist, allow regular rendering
  if (ALLOWED_PATHS.has(normalizedPathname)) {
    return next();
  }

  // 5. Intercept all other internal routes and render Coming Soon with 503 HTTP status
  const locale: SupportedLocale = getLangFromUrl(url);

  try {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ComingSoon, {
      props: { locale },
      request: context.request
    });

    return new Response(html, {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Retry-After': '86400',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error rendering ComingSoon page in middleware:', error);
    return next();
  }
});
