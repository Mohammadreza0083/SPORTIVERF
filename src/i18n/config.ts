import type { LocaleMeta, SupportedLocale } from '@/types/i18n';

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleMeta> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    flagCode: 'GB'
  },
  tr: {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    dir: 'ltr',
    flagCode: 'TR'
  }
};

export const LOCALES_LIST: SupportedLocale[] = Object.keys(SUPPORTED_LOCALES) as SupportedLocale[];
