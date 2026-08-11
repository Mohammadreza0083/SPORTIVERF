import type { SportsTourPackage } from '@/types/cms';

/**
 * Headless CMS Provider Strategy Interface
 */
export interface ICmsProvider {
  name: string;
  fetchPageContent<T>(pageSlug: string, locale: string): Promise<T | null>;
  fetchTourPackages(locale: string): Promise<SportsTourPackage[]>;
}

/**
 * Mock / Local Static File CMS Adapter
 */
export class StaticCmsAdapter implements ICmsProvider {
  public readonly name = 'StaticLocalCms';

  public async fetchPageContent<T>(_pageSlug: string, _locale: string): Promise<T | null> {
    return null;
  }

  public async fetchTourPackages(_locale: string): Promise<SportsTourPackage[]> {
    return [];
  }
}

/**
 * Strapi Headless CMS Adapter Strategy (Future Integration)
 */
export class StrapiCmsAdapter implements ICmsProvider {
  public readonly name = 'StrapiCMS';
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = import.meta.env.PUBLIC_CMS_URL || '';
    this.apiKey = import.meta.env.PUBLIC_CMS_API_KEY || '';
  }

  public async fetchPageContent<T>(pageSlug: string, locale: string): Promise<T | null> {
    const res = await fetch(
      `${this.baseUrl}/api/pages?filters[slug][$eq]=${pageSlug}&locale=${locale}`,
      {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.[0]?.attributes || null;
  }

  public async fetchTourPackages(_locale: string): Promise<SportsTourPackage[]> {
    return [];
  }
}

/**
 * Factory for selecting CMS Provider Strategy based on environment configuration
 */
export const getCmsProvider = (): ICmsProvider => {
  const providerType = import.meta.env.PUBLIC_CMS_PROVIDER;

  switch (providerType) {
    case 'strapi':
      return new StrapiCmsAdapter();
    default:
      return new StaticCmsAdapter();
  }
};
