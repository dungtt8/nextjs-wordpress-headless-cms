import "./globals.css";

import { Manrope, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/react";

import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

const fontSans = Manrope({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
});

const fontDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "ChinaHack | Mentorship & Scholarship Application",
  description:
    "Mentorship và scholarship application cho học sinh, sinh viên định hướng du học Trung Quốc.",
  metadataBase: new URL(siteConfig.site_domain),
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          fontSans.variable,
          fontDisplay.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
