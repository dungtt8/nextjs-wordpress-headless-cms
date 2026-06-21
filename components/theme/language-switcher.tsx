// components/theme/language-switcher.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe } from '@phosphor-icons/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const LOCALE_LABELS = {
    en: 'English',
    vi: 'Tiếng Việt',
    zh: '中文',
};

const LOCALE_FLAGS = {
    en: '🇬🇧',
    vi: '🇻🇳',
    zh: '🇨🇳',
};

type LocaleKey = keyof typeof LOCALE_LABELS;

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const locales: LocaleKey[] = ['en', 'vi', 'zh'];

    const getCurrentLocale = (): LocaleKey => {
        const segments = pathname.split('/').filter(Boolean);
        const locale = segments[0];
        return (locale === 'en' || locale === 'vi' || locale === 'zh') ? locale : 'vi';
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full border-gray-300 hover:bg-gray-50"
                >
                    <Globe weight="bold" className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm font-medium">{LOCALE_LABELS[currentLocale]}</span>
                    <span className="sm:hidden text-sm">{LOCALE_FLAGS[currentLocale]}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {locales.map(locale => (
                    <DropdownMenuItem key={locale} asChild>
                        <Link
                            href={getLocalizedPath(locale)}
                            className={`flex items-center gap-3 cursor-pointer ${currentLocale === locale ? 'bg-gray-100' : ''
                                }`}
                        >
                            <span className="text-lg">{LOCALE_FLAGS[locale]}</span>
                            <span className={currentLocale === locale ? 'font-semibold' : ''}>
                                {LOCALE_LABELS[locale]}
                            </span>
                            {currentLocale === locale && (
                                <span className="ml-auto">✓</span>
                            )}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
