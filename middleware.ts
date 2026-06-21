import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const handleI18nRouting = createMiddleware({
  locales: ['en', 'vi', 'zh'],
  defaultLocale: 'vi',
});

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if path already has locale (/en, /vi, /zh)
  const hasLocale = /^\/(en|vi|zh)/.test(pathname);
  if (hasLocale) {
    return handleI18nRouting(request);
  }

  // Root path: redirect based on Accept-Language header
  if (pathname === '/' || pathname === '') {
    const acceptLanguage = request.headers.get('accept-language') || '';
    let locale = 'vi'; // fallback to Vietnamese

    if (acceptLanguage.includes('en')) {
      locale = 'en';
    } else if (acceptLanguage.includes('zh')) {
      locale = 'zh';
    }

    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // For all other paths, apply i18n routing
  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
