import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Nav } from '@/components/layout/nav';
import { Footer } from '@/components/layout/footer';
import { isValidLocale } from '@/lib/i18n';
import { IntlProvider } from './provider';
import '../globals.css';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // The [locale] segment matches ANY single path segment (including dotted paths like
  // "llms.txt" that bypass the i18n middleware) — reject anything that isn't a real locale.
  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <IntlProvider locale={locale}>
          <Nav locale={locale} />
          {children}
          <Footer locale={locale} />
        </IntlProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'vi' },
    { locale: 'zh' },
  ];
}
