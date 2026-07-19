'use client';

import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/public/messages/en.json';
import viMessages from '@/public/messages/vi.json';
import zhMessages from '@/public/messages/zh.json';

const messages = {
    en: enMessages,
    vi: viMessages,
    zh: zhMessages,
};

export function IntlProvider({
    children,
    locale,
}: {
    children: ReactNode;
    locale: string;
}) {
    const locale_messages = messages[locale as keyof typeof messages] || messages.vi;

    return (
        <NextIntlClientProvider messages={locale_messages} locale={locale} timeZone="Asia/Ho_Chi_Minh">
            {children}
        </NextIntlClientProvider>
    );
}
