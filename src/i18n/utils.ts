import { DEFAULT_LOCALE, LOCALES_LIST, SUPPORTED_LOCALES } from './config';
import type { SupportedLocale, TextDirection } from '@/types/i18n';
import en from './translations/en';
import tr from './translations/tr';

const translations = { en, tr };

/**
 * Extracts locale code from current request URL
 */
export function getLangFromUrl(url: URL): SupportedLocale {
  const [, lang] = url.pathname.split('/');
  if (lang && LOCALES_LIST.includes(lang as SupportedLocale)) {
    return lang as SupportedLocale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Determines text direction (ltr or rtl) for document layout
 */
export function getDirFromLocale(locale: SupportedLocale): TextDirection {
  return SUPPORTED_LOCALES[locale]?.dir || 'ltr';
}

/**
 * Type-safe translation hook
 */
export function useTranslations(lang: SupportedLocale) {
  return function t(key: string): string {
    const keys = key.split('.');
    let result: unknown = translations[lang] || translations[DEFAULT_LOCALE];

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        // Fallback to default locale (English)
        let fallbackResult: unknown = translations[DEFAULT_LOCALE];
        for (const fk of keys) {
          if (fallbackResult && typeof fallbackResult === 'object' && fk in fallbackResult) {
            fallbackResult = (fallbackResult as Record<string, unknown>)[fk];
          } else {
            return key; // Return raw key if translation missing
          }
        }
        return typeof fallbackResult === 'string' ? fallbackResult : key;
      }
    }

    return typeof result === 'string' ? result : key;
  };
}

/**
 * Translates localized object fields (e.g. { en: 'Ski', tr: 'Kayak', fa: 'اسکی' })
 */
export function getLocalizedField(
  fieldMap: Record<string, string> | undefined,
  locale: SupportedLocale
): string {
  if (!fieldMap) return '';
  return fieldMap[locale] || fieldMap[DEFAULT_LOCALE] || Object.values(fieldMap)[0] || '';
}

/**
 * Generates locale-prefixed route URL
 */
export function getLocalizedRoute(path: string, locale: SupportedLocale): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${cleanPath}`;
}
