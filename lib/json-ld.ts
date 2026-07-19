import { siteConfig } from "@/site.config";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.site_name,
    url: siteConfig.site_domain,
    logo: `${siteConfig.site_domain}/logo.svg`,
  };
}

export function buildWebsiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.site_name,
    url: `${siteConfig.site_domain}/${locale}`,
    inLanguage: locale,
  };
}

export function buildBlogPostingJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished,
    dateModified,
    ...(image ? { image } : {}),
    publisher: {
      "@type": "Organization",
      name: siteConfig.site_name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.site_domain}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
