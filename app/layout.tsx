import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'ChinaHack',
  description: 'Mentorship for Chinese Scholarships',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
