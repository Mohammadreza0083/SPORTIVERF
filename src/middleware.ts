import { defineMiddleware } from 'astro:middleware';

/**
 * Global Maintenance / Coming Soon Toggle
 * Set to `false` when ready to unveil all internal camp and expedition pages.
 */
export const MAINTENANCE_MODE = true;

/**
 * Whitelist of allowed routes during maintenance mode.
 * Trailing slashes are normalized before checking.
 */
const ALLOWED_PATHS = new Set(['/', '/en', '/tr', '/en/about', '/tr/about', '/coming-soon']);

export const onRequest = defineMiddleware(async (context, next) => {
  // If maintenance mode is turned off, proceed normally
  if (!MAINTENANCE_MODE) {
    return next();
  }

  const { url } = context;
  const rawPathname = url.pathname;

  // 1. Instantly bypass any asset, Vite dev server, image, API, or static file requests
  const isAsset =
    rawPathname.startsWith('/_astro') ||
    rawPathname.startsWith('/_image') ||
    rawPathname.startsWith('/src/') ||
    rawPathname.startsWith('/@') ||
    rawPathname.startsWith('/assets/') ||
    rawPathname.startsWith('/images/') ||
    rawPathname.startsWith('/fonts/') ||
    rawPathname.startsWith('/api/') ||
    rawPathname.startsWith('/favicon') ||
    rawPathname === '/robots.txt' ||
    rawPathname === '/sitemap.xml' ||
    rawPathname === '/site.webmanifest' ||
    /\.[a-zA-Z0-9]+$/.test(rawPathname);

  if (isAsset) {
    return next();
  }

  // 2. Normalize pathname (strip trailing slash safely, convert to lowercase, preserving single root '/')
  const normalizedPathname = (
    rawPathname.length > 1 ? rawPathname.replace(/\/+$/, '') : rawPathname
  ).toLowerCase();

  // 3. If the route is in the whitelist, allow regular rendering
  if (ALLOWED_PATHS.has(normalizedPathname)) {
    return next();
  }

  // 4. Rewrite all other internal routes to the Coming Soon page with explicit 503 response
  const rewriteResponse = await context.rewrite('/coming-soon');
  const responseHeaders = new Headers(rewriteResponse.headers);
  responseHeaders.set('Retry-After', '3600');
  responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate');

  return new Response(rewriteResponse.body, {
    status: 503,
    statusText: 'Service Unavailable',
    headers: responseHeaders
  });
});
