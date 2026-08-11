import type { SportsTourPackage, TourFilterOptions } from '@/types/cms';
import type { PaginatedResult } from '@/types/api';
import { apiClient } from './ApiClient';

/**
 * Repository Interface following Dependency Inversion Principle (SOLID)
 */
export interface ITourRepository {
  getTours(
    options?: TourFilterOptions,
    locale?: string
  ): Promise<PaginatedResult<SportsTourPackage>>;
  getTourBySlug(slug: string, locale?: string): Promise<SportsTourPackage | null>;
  getFeaturedTours(locale?: string): Promise<SportsTourPackage[]>;
}

/**
 * Static / Mock Implementation for SSG (Static Site Generation Phase)
 */
export class MockTourRepository implements ITourRepository {
  private mockData: SportsTourPackage[] = [
    {
      id: 'tour-001',
      slug: 'alpine-skiing-expedition',
      title: {
        en: 'Alpine Skiing Expedition',
        fa: 'تور تخصصی اسکی آلپاین',
        ar: 'رحلة التزلج على جبال الألب'
      },
      summary: {
        en: 'Experience world-class slopes with certified winter sports guides.',
        fa: 'تجربه پیست‌های بین‌المللی با مربیان مجرب ورزشی.',
        ar: 'تجربة منحدرات عالمية المستوى مع مرشدين معتمدين.'
      },
      descriptionHtml: {
        en: '<p>Complete high-altitude skiing experience with full gear provided.</p>',
        fa: '<p>تجربه کامل اسکی ارتفاع بالا همراه با تجهیزات کامل.</p>',
        ar: '<p>تجربة تزلج كاملة على ارتفاعات عالية مع توفير جميع المعدات.</p>'
      },
      category: {
        id: 'cat-skiing',
        slug: 'skiing',
        title: { en: 'Winter Sports', fa: 'ورزش‌های زمستانی', ar: 'الرياضات الشتوية' }
      },
      location: { country: 'Iran', city: 'Dizin' },
      durationDays: 5,
      difficultyLevel: 'Intermediate',
      basePriceUsd: 1200,
      featuredImages: [
        {
          id: 'img-1',
          url: '/assets/images/tours/skiing-1.jpg',
          altText: 'Skiing on snow mountains',
          width: 1200,
          height: 800
        }
      ],
      includedServices: ['Hotel Accommodation', 'Ski Pass', 'Equipment Rental'],
      excludedServices: ['Flights', 'Personal Insurance'],
      isFeatured: true,
      publishedAt: '2026-01-15T00:00:00Z'
    }
  ];

  public async getTours(
    options?: TourFilterOptions,
    _locale: string = 'en'
  ): Promise<PaginatedResult<SportsTourPackage>> {
    let filtered = [...this.mockData];
    if (options?.difficulty) {
      filtered = filtered.filter((t) => t.difficultyLevel === options.difficulty);
    }
    return {
      items: filtered,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
      totalCount: filtered.length,
      hasPreviousPage: false,
      hasNextPage: false
    };
  }

  public async getTourBySlug(
    slug: string,
    _locale: string = 'en'
  ): Promise<SportsTourPackage | null> {
    const tour = this.mockData.find((t) => t.slug === slug);
    return tour || null;
  }

  public async getFeaturedTours(_locale: string = 'en'): Promise<SportsTourPackage[]> {
    return this.mockData.filter((t) => t.isFeatured);
  }
}

/**
 * Future Production API Implementation (ASP.NET Core REST API Integration)
 */
export class ApiTourRepository implements ITourRepository {
  public async getTours(
    options?: TourFilterOptions,
    locale: string = 'en'
  ): Promise<PaginatedResult<SportsTourPackage>> {
    const params = new URLSearchParams({
      locale,
      ...(options?.difficulty && { difficulty: options.difficulty }),
      ...(options?.categoryId && { categoryId: options.categoryId })
    });
    const response = await apiClient.get<PaginatedResult<SportsTourPackage>>(
      `/tours?${params.toString()}`
    );
    return response.data;
  }

  public async getTourBySlug(
    slug: string,
    locale: string = 'en'
  ): Promise<SportsTourPackage | null> {
    const response = await apiClient.get<SportsTourPackage>(`/tours/${slug}?locale=${locale}`);
    return response.data;
  }

  public async getFeaturedTours(locale: string = 'en'): Promise<SportsTourPackage[]> {
    const response = await apiClient.get<SportsTourPackage[]>(`/tours/featured?locale=${locale}`);
    return response.data;
  }
}

/**
 * Repository Factory / Dependency Injection Provider
 */
export const getTourRepository = (): ITourRepository => {
  const cmsProvider = import.meta.env.PUBLIC_CMS_PROVIDER;
  if (cmsProvider === 'api') {
    return new ApiTourRepository();
  }
  return new MockTourRepository();
};
