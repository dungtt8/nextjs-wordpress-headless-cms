import { MetadataRoute } from "next";
import { getAllPostsForSitemap, getAllPagesForSitemap } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";
import { LOCALES } from "@/lib/i18n";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    const [posts, pages] = await Promise.all([
      getAllPostsForSitemap(locale),
      getAllPagesForSitemap(locale),
    ]);

    entries.push(
      {
        url: `${siteConfig.site_domain}/${locale}`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 1,
      },
      {
        url: `${siteConfig.site_domain}/${locale}/posts`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      ...posts.map((post) => ({
        url: `${siteConfig.site_domain}/${locale}/posts/${post.slug}`,
        lastModified: new Date(post.modified),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })),
      ...pages.map((page) => ({
        url: `${siteConfig.site_domain}/${locale}/pages/${page.slug}`,
        lastModified: new Date(page.modified),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }))
    );
  }

  return entries;
}
