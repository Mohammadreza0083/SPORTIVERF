export type SupportedLocale = 'en' | 'tr';

export type TextDirection = 'ltr' | 'rtl';

export interface LocaleMeta {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  dir: TextDirection;
  flagCode: string;
}

export type TranslationDictionary = Record<string, string | Record<string, string>>;
