// lib/i18n.ts
export const LOCALES = ['en', 'vi', 'zh'] as const;
export const DEFAULT_LOCALE = 'vi' as const;

export type Locale = (typeof LOCALES)[number];

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  zh: '中文',
};

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}
