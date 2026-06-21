// app/[locale]/layout.tsx
import { ReactNode } from 'react';

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'vi' },
    { locale: 'zh' },
  ];
}
