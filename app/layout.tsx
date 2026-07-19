import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: 'ChinaHack',
  description: 'Mentorship for Chinese Scholarships',
  metadataBase: new URL(siteConfig.site_domain),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
