import { atom, map } from 'nanostores';
import type { SupportedLocale } from '@/types/i18n';

/**
 * Interface for active booking draft state in client island
 */
export interface ActiveBookingState {
  tourPackageId: string | null;
  tourTitle: string | null;
  selectedDate: string | null;
  participantsCount: number;
  estimatedPriceUsd: number;
}

/**
 * Nanostore Atom for active locale
 */
export const activeLocaleStore = atom<SupportedLocale>('en');

/**
 * Nanostore Map for reactive booking draft state across hydrated Astro Islands
 */
export const bookingDraftStore = map<ActiveBookingState>({
  tourPackageId: null,
  tourTitle: null,
  selectedDate: null,
  participantsCount: 1,
  estimatedPriceUsd: 0
});

/**
 * Action: Set selected tour package in booking draft
 */
export function selectTourForBooking(tourId: string, title: string, basePrice: number): void {
  bookingDraftStore.setKey('tourPackageId', tourId);
  bookingDraftStore.setKey('tourTitle', title);
  bookingDraftStore.setKey('estimatedPriceUsd', basePrice);
}

/**
 * Action: Update participants count and update total estimated price
 */
export function updateParticipantsCount(count: number, baseUnitPrice: number): void {
  const validCount = Math.max(1, count);
  bookingDraftStore.setKey('participantsCount', validCount);
  bookingDraftStore.setKey('estimatedPriceUsd', validCount * baseUnitPrice);
}

/**
 * Action: Reset booking draft state
 */
export function clearBookingDraft(): void {
  bookingDraftStore.set({
    tourPackageId: null,
    tourTitle: null,
    selectedDate: null,
    participantsCount: 1,
    estimatedPriceUsd: 0
  });
}
