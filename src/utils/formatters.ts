import type { SupportedLocale } from '@/types/i18n';

/**
 * Format currency amount with locale-aware number formatting and currency symbol
 */
export function formatCurrency(
  amountUsd: number,
  locale: SupportedLocale = 'en',
  currency: string = 'USD'
): string {
  const localeMap: Record<SupportedLocale, string> = {
    en: 'en-US',
    tr: 'tr-TR',
    fa: 'fa-IR'
  };

  try {
    return new Intl.NumberFormat(localeMap[locale], {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amountUsd);
  } catch {
    return `$${amountUsd}`;
  }
}

/**
 * Format ISO date string according to current locale calendar
 */
export function formatDate(
  isoDateString: string,
  locale: SupportedLocale = 'en',
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(isoDateString);
  const localeMap: Record<SupportedLocale, string> = {
    en: 'en-US',
    tr: 'tr-TR',
    fa: 'fa-IR-u-ca-persian' // Persian Solar Hijri calendar
  };

  const defaultOptions: Intl.DateTimeFormatOptions = options || {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  try {
    return new Intl.DateTimeFormat(localeMap[locale], defaultOptions).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

/**
 * Format numbers (e.g. participant counts, duration) in native locale digits (123 -> ۱۲۳)
 */
export function formatNumber(value: number, locale: SupportedLocale = 'en'): string {
  const localeMap: Record<SupportedLocale, string> = {
    en: 'en-US',
    tr: 'tr-TR',
    fa: 'fa-IR'
  };

  try {
    return new Intl.NumberFormat(localeMap[locale]).format(value);
  } catch {
    return String(value);
  }
}
