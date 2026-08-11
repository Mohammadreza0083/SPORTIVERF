/**
 * Image Strategy Engine Helper
 * Normalizes remote CMS image URLs, local static assets, and CDN optimization URLs.
 */
export interface ImageOptimizationParams {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg';
}

/**
 * Resolves final optimized image URL with CDN or fallback static assets
 */
export function resolveImageUrl(
  rawPath: string | undefined,
  fallbackPath: string = '/assets/images/defaults/tour-placeholder.jpg',
  _options?: ImageOptimizationParams
): string {
  if (!rawPath || rawPath.trim() === '') {
    return fallbackPath;
  }

  // Handle absolute remote URLs (e.g. from Headless CMS or ASP.NET Core API server)
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return rawPath;
  }

  // Handle relative local paths
  if (rawPath.startsWith('/')) {
    return rawPath;
  }

  return `/${rawPath}`;
}
