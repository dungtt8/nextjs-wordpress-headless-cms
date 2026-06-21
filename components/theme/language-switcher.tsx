// components/theme/language-switcher.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LOCALE_LABELS = {
  en: 'English',
  vi: 'Tiếng Việt',
  zh: '中文',
};

type LocaleKey = keyof typeof LOCALE_LABELS;

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const locales: LocaleKey[] = ['en', 'vi', 'zh'];

  const getCurrentLocale = (): string => {
    const segments = pathname.split('/').filter(Boolean);
    return segments[0] || 'vi';
  };

  const getLocalizedPath = (newLocale: string): string => {
    const segments = pathname.split('/').filter(Boolean);

    // Replace or prepend locale
    if (['en', 'vi', 'zh'].includes(segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }

    return '/' + segments.join('/');
  };

  const currentLocale = getCurrentLocale();

  return (
    <nav className="flex gap-2">
      {locales.map(locale => (
        <Link
          key={locale}
          href={getLocalizedPath(locale)}
          className={`px-3 py-2 rounded transition-colors ${
            currentLocale === locale
              ? 'bg-primary text-white font-semibold'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          aria-label={`Switch to ${LOCALE_LABELS[locale]}`}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
