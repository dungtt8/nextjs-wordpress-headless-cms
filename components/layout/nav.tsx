import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/nav/mobile-nav";
import LanguageSwitcher from "@/components/theme/language-switcher";
import { mainMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { DEFAULT_LOCALE, isValidLocale } from "@/lib/i18n";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";

import enMessages from "@/public/messages/en.json";
import viMessages from "@/public/messages/vi.json";
import zhMessages from "@/public/messages/zh.json";

const messages = { en: enMessages, vi: viMessages, zh: zhMessages };

interface NavProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  locale?: string;
}

// Prefixes an internal path with the current locale so nav clicks don't fall through
// to the "/" root, which 307-redirects based on Accept-Language instead of staying put.
function localizeHref(href: string, locale?: string): string {
  if (!locale) return href;
  if (href === "/") return `/${locale}`;
  if (href.startsWith("/#")) return `/${locale}${href.slice(1)}`;
  return `/${locale}${href}`;
}

// Nav renders outside of the app's client-only NextIntlClientProvider (no server-side
// next-intl request config is wired up), so messages are read directly by locale instead.
function createTranslator(locale?: string) {
  const dict = messages[isValidLocale(locale ?? "") ? (locale as keyof typeof messages) : DEFAULT_LOCALE];
  return (key: string): string => {
    const value = key.split(".").reduce<unknown>((acc, part) => {
      return acc && typeof acc === "object" ? (acc as Record<string, unknown>)[part] : undefined;
    }, dict);
    return typeof value === "string" ? value : key;
  };
}

export function Nav({ className, children, id, locale }: NavProps) {
  const t = createTranslator(locale);
  return (
    <nav className={cn("sticky top-0 z-50 px-4 pt-4", className)} id={id}>
      <div
        id="nav-container"
        className="poster-card max-w-6xl mx-auto flex items-center justify-between rounded-full px-5 py-3 sm:px-7"
      >
        <Link
          className="hover:opacity-75 transition-all flex gap-4 items-center"
          href={localizeHref("/", locale)}
        >
          <Image
            src={Logo}
            alt="Logo"
            loading="eager"
            className="h-auto w-auto"
            style={{ maxHeight: "26.44px", maxWidth: "42px" }}
            width={42}
            height={26.44}
          />
          <h2 className="font-display text-lg leading-none tracking-tight text-[#2a2355]">{siteConfig.site_name}</h2>
        </Link>
        {children}
        <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex">
            {Object.entries(mainMenu).map(([key, href]) => (
              <Button key={href} asChild variant="ghost" size="sm">
                <Link href={localizeHref(href, locale)}>
                  {t(`nav.${key}`)}
                </Link>
              </Button>
            ))}
          </div>
          <LanguageSwitcher />
          <Button asChild className="hidden sm:flex rounded-full bg-[#6e59b1] px-5 hover:bg-[#5f4b9f]">
            <Link href={localizeHref("/#lead-form", locale)}>{t("nav.getStarted")}</Link>
          </Button>
          <MobileNav locale={locale} />
        </div>
      </div>
    </nav>
  );
}
