import { ReactNode } from 'react';
import { Nav } from '@/components/layout/nav';
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

  return (
    <html lang={locale}>
      <body>
        <IntlProvider locale={locale}>
          <Nav />
          {children}
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
