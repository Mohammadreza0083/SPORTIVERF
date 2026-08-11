import type { SupportedLocale } from '@/types/i18n';
import campsRawData from './camps.json';

export type SportType = 'FOOTBALL' | 'VOLLEYBALL';
export type StarRating = 3 | 4 | 5;
export type StarTier = '3-Star' | '4-Star' | '5-Star';
export type PriceModel = 'PRICE_ON_REQUEST';

export interface CampItem {
  id: string;
  slug: string;
  sport: SportType;
  starRating: StarRating;
  starTier: StarTier;
  priceModel: PriceModel;
  priceOnRequest: boolean;
  tierName: Record<SupportedLocale, string>;
  title: Record<SupportedLocale, string>;
  location: Record<SupportedLocale, string>;
  dates: Record<SupportedLocale, string>;
  ageGroup: Record<SupportedLocale, string>;
  capacity: Record<SupportedLocale, string>;
  imageUrl: string;
  summary: Record<SupportedLocale, string>;
  includedServices: Record<SupportedLocale, string[]>;
}

export const CAMPS_DATA: CampItem[] = campsRawData as CampItem[];

export function getCampsBySport(sport?: SportType): CampItem[] {
  if (!sport) return CAMPS_DATA;
  return CAMPS_DATA.filter((camp) => camp.sport === sport);
}

export function getCampsByStarRating(starRating?: StarRating): CampItem[] {
  if (!starRating) return CAMPS_DATA;
  return CAMPS_DATA.filter((camp) => camp.starRating === starRating);
}

export function filterCamps(sport?: string, starRating?: number): CampItem[] {
  return CAMPS_DATA.filter((camp) => {
    const matchSport = !sport || sport === 'ALL' || camp.sport === sport;
    const matchStars = !starRating || starRating === 0 || camp.starRating === starRating;
    return matchSport && matchStars;
  });
}

export function getCampBySlug(slug: string): CampItem | undefined {
  return CAMPS_DATA.find((camp) => camp.slug === slug);
}
