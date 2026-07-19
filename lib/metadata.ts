import { siteConfig } from "@/site.config";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";

interface ContentMetadataOptions {
  title: string;
  description: string;
  /** Path relative to the domain, without locale prefix, e.g. `/posts/${slug}`, `/pages/${slug}`, `/posts`, or `` for the homepage. */
  path: string;
  /** When provided, emits a locale-prefixed canonical URL plus hreflang alternates for every locale. Omit for non-locale routes. */
  locale?: Locale;
  type?: "article" | "website";
}

export function generateContentMetadata({
  title,
  description,
  path,
  locale,
  type = "article",
}: ContentMetadataOptions): Metadata {
  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", title);
  ogUrl.searchParams.append("description", description);

  const canonicalPath = locale ? `/${locale}${path}` : path;

  const alternates: Metadata["alternates"] = locale
    ? {
        canonical: canonicalPath,
        languages: {
          ...Object.fromEntries(
            LOCALES.map((loc) => [loc, `${siteConfig.site_domain}/${loc}${path}`])
          ),
          "x-default": `${siteConfig.site_domain}/${DEFAULT_LOCALE}${path}`,
        },
      }
    : { canonical: canonicalPath };

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      type,
      url: `${siteConfig.site_domain}${canonicalPath}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
}

const HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  ldquo: "“",
  rdquo: "”",
  lsquo: "‘",
  rsquo: "’",
};

function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity[0] === "#") {
      const codePoint =
        entity[1] === "x" || entity[1] === "X"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }
    return HTML_ENTITIES[entity] ?? match;
  });
}

export function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, "")).trim();
}

export function truncateHtml(html: string, maxWords: number): string {
  const text = decodeHtmlEntities(html.replace(/<[^>]*>/g, "")).trim();
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
