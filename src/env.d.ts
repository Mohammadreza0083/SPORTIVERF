/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_DEFAULT_LOCALE: string;
  readonly PUBLIC_API_BASE_URL: string;
  readonly PUBLIC_API_TIMEOUT_MS: string;
  readonly PUBLIC_CMS_PROVIDER: 'mock' | 'strapi' | 'contentful' | 'sanity' | 'api';
  readonly PUBLIC_CMS_URL: string;
  readonly PUBLIC_CMS_API_KEY: string;
  readonly PUBLIC_BOOKING_SERVICE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
