/**
 * Media Asset Contract
 * Compatible with Headless CMS (Strapi/Sanity/Contentful) and ASP.NET Media Entities.
 */
export interface CmsImage {
  id: string;
  url: string;
  altText: string;
  width: number;
  height: number;
  caption?: string;
  responsiveFormats?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
  };
}

/**
 * Sports Category Domain Model
 */
export interface SportCategory {
  id: string;
  slug: string;
  title: Record<string, string>; // Multilingual map: { en: 'Skiing', fa: 'اسکی', ar: 'التزلج' }
  description?: Record<string, string>;
  iconName?: string;
  heroImage?: CmsImage;
}

/**
 * Tour Package Entity
 */
export interface SportsTourPackage {
  id: string;
  slug: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  descriptionHtml: Record<string, string>;
  category: SportCategory;
  location: {
    country: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  durationDays: number;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  basePriceUsd: number;
  featuredImages: CmsImage[];
  includedServices: string[];
  excludedServices: string[];
  isFeatured: boolean;
  publishedAt: string;
}

/**
 * Filter Params for Sports Packages
 */
export interface TourFilterOptions {
  categoryId?: string;
  country?: string;
  difficulty?: string;
  minPrice?: number;
  maxPrice?: number;
  durationDays?: number;
}
