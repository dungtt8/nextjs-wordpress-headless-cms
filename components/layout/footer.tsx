import { Section, Container } from "@/components/craft";
import { ArrowUpRight, EnvelopeSimple, FacebookLogo, Phone, Sparkle } from "@phosphor-icons/react/ssr";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteConfig } from "@/site.config";
import { DEFAULT_LOCALE, isValidLocale } from "@/lib/i18n";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";

import enMessages from "@/public/messages/en.json";
import viMessages from "@/public/messages/vi.json";
import zhMessages from "@/public/messages/zh.json";

const messages = { en: enMessages, vi: viMessages, zh: zhMessages };

// Prefixes an internal path with the current locale so footer clicks don't fall through
// to the "/" root, which 307-redirects based on Accept-Language instead of staying put.
function localizeHref(href: string, locale?: string): string {
  if (!locale) return href;
  if (href === "/") return `/${locale}`;
  if (href.startsWith("/#")) return `/${locale}${href.slice(1)}`;
  return `/${locale}${href}`;
}

// Footer renders outside of the app's client-only NextIntlClientProvider (no server-side
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

export async function Footer({ locale }: { locale?: string }) {
  const t = createTranslator(locale);
  const seoLocale = isValidLocale(locale ?? "") ? (locale as keyof typeof siteConfig.seo) : DEFAULT_LOCALE;

  const footerSections = [
    { label: t("footer.about"), href: localizeHref("/#about", locale) },
    { label: t("footer.mentors"), href: localizeHref("/#mentors", locale) },
    { label: t("successStories.heading"), href: localizeHref("/#success-stories", locale) },
    { label: t("community.heading"), href: localizeHref("/#community", locale) },
  ];

  const footerResources = [
    { label: t("footer.blog"), href: localizeHref("/posts", locale) },
    // Categories/Tags archive pages don't exist under the locale-prefixed route tree yet.
    { label: t("footer.articles"), href: "/posts/categories" },
    { label: t("nav.tags"), href: "/posts/tags" },
    { label: t("footer.consulting"), href: localizeHref("/#lead-form", locale) },
  ];

  // Split the "{name}...{url}..." credit template so the site name and URL can stay live links.
  const [creditBeforeName, creditAfterName] = t("footer.credit").split("{name}");
  const [creditBetween, creditAfterUrl] = creditAfterName.split("{url}");

  return (
    <footer className="border-t border-violet-100 bg-violet-50/60">
      <Section>
        <Container className="grid gap-10 md:grid-cols-[1.25fr_0.8fr_0.8fr_1fr]">
          <div className="flex flex-col gap-6 not-prose">
            <div className="poster-card rounded-[28px] p-6">
              <Link href={localizeHref("/", locale)} className="flex items-center gap-4">
                <h3 className="sr-only">{siteConfig.site_name}</h3>
                <Image
                  src={Logo}
                  alt="Logo"
                  className="dark:invert"
                  width={42}
                  height={26.44}
                />
                <div>
                  <p className="poster-eyebrow">{siteConfig.site_name}</p>
                  <p className="font-display mt-1 text-xl font-semibold text-[#1F2937]">{t("footer.subtitle")}</p>
                </div>
              </Link>

              <p className="mt-5 text-sm leading-7 text-slate-600">{siteConfig.seo[seoLocale].description}</p>

              <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#6e59b1] px-4 py-2 text-sm font-semibold text-white shadow-sm">
                <Sparkle weight="thin" className="h-4 w-4" />
                {t("footer.tagline")}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <h5 className="text-base font-semibold text-[#1F2937]">{t("footer.explore")}</h5>
            {footerSections.map((item) => (
              <Link
                className="inline-flex items-center gap-2 text-slate-600 transition hover:text-violet-700"
                key={item.href}
                href={item.href}
              >
                <ArrowUpRight weight="thin" className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <h5 className="text-base font-semibold text-[#1F2937]">{t("footer.resources")}</h5>
            {footerResources.map((item) => (
              <Link
                className="inline-flex items-center gap-2 text-slate-600 transition hover:text-violet-700"
                key={item.href}
                href={item.href}
              >
                <ArrowUpRight weight="thin" className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <h5 className="text-base font-semibold text-[#1F2937]">{t("footer.contact")}</h5>
            <a
              className="inline-flex items-center gap-3 text-slate-600 transition hover:text-violet-700"
              href="https://facebook.com/chinahackduhoctq"
              target="_blank"
              rel="noreferrer"
            >
              <FacebookLogo weight="thin" className="h-4 w-4" />
              facebook.com/chinahackduhoctq
            </a>
            <a
              className="inline-flex items-center gap-3 text-slate-600 transition hover:text-violet-700"
              href="tel:0962094058"
            >
              <Phone weight="thin" className="h-4 w-4" />
              0962 094 058
            </a>
            <a
              className="inline-flex items-center gap-3 text-slate-600 transition hover:text-violet-700"
              href="mailto:hello@chinahack.vn"
            >
              <EnvelopeSimple weight="thin" className="h-4 w-4" />
              hello@chinahack.vn
            </a>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              {t("footer.description")}
            </p>
          </div>
        </Container>

        <Container className="mt-10 border-t border-violet-100 not-prose flex flex-col gap-6 pt-6 md:flex-row md:items-center md:justify-between md:gap-2">
          <ThemeToggle />
          <div className="flex flex-col gap-1 text-sm text-slate-500 md:items-end">
            <p>&copy; {siteConfig.site_name}. {t("footer.rights")} 2025-present.</p>
            <p>
              {creditBeforeName}
              <a
                href="https://revonexus.net"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-violet-700 transition hover:text-violet-800"
              >
                Revo Nexus
              </a>
              {creditBetween}
              <a
                href="https://revonexus.net"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-violet-700 transition hover:text-violet-800"
              >
                revonexus.net
              </a>
              {creditAfterUrl}
            </p>
          </div>
        </Container>
      </Section>
    </footer>
  );
}
