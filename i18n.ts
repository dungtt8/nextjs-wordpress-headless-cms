import { getRequestConfig } from 'next-intl/server';

import enMessages from '@/public/messages/en.json';
import viMessages from '@/public/messages/vi.json';
import zhMessages from '@/public/messages/zh.json';

const messages = {
  en: enMessages,
  vi: viMessages,
  zh: zhMessages,
} as const;

export type Locale = keyof typeof messages;

export const locales: Locale[] = ['en', 'vi', 'zh'];
export const defaultLocale: Locale = 'vi';

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `requestLocale` is valid
  const localeString = await requestLocale;
  const locale = (localeString || defaultLocale) as Locale;
  
  if (!locales.includes(locale)) {
    console.warn(`Unsupported locale requested: ${locale}, falling back to ${defaultLocale}`);
  }

  return {
    locale: locale as Locale,
    messages: messages[locale as Locale] || messages[defaultLocale],
    timeZone: 'Asia/Ho_Chi_Minh',
  };
});
