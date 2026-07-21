import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPostBySlugAndLocale, getAllPostSlugsForLocale } from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";
import { buildBlogPostingJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import type { Locale } from "@/lib/i18n";
import { siteConfig } from "@/site.config";
import { Section, Container, Prose } from "@/components/craft";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  const locales = ['en', 'vi', 'zh'];
  const paramsList = await Promise.all(
    locales.map(locale => getAllPostSlugsForLocale(locale))
  );
  return paramsList.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlugAndLocale({ slug, locale });

  if (!post) {
    return {};
  }

  const description = post.excerpt?.rendered
    ? stripHtml(post.excerpt.rendered)
    : stripHtml(post.content.rendered).slice(0, 200) + "...";

  return generateContentMetadata({
    title: stripHtml(post.title.rendered),
    description,
    path: `/posts/${slug}`,
    locale: locale as Locale,
    type: "article",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlugAndLocale({ slug, locale });

  if (!post) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "nav" });
  const postUrl = `${siteConfig.site_domain}/${locale}/posts/${slug}`;
  const description = post.excerpt?.rendered
    ? stripHtml(post.excerpt.rendered)
    : stripHtml(post.content.rendered).slice(0, 200) + "...";

  return (
    <Section>
      <JsonLd
        data={buildBlogPostingJsonLd({
          title: stripHtml(post.title.rendered),
          description,
          url: postUrl,
          datePublished: post.date,
          dateModified: post.modified,
          image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: siteConfig.site_name, url: `${siteConfig.site_domain}/${locale}` },
          { name: t("posts"), url: `${siteConfig.site_domain}/${locale}/posts` },
          { name: stripHtml(post.title.rendered), url: postUrl },
        ])}
      />
      <Container>
        <Prose>
          <h2>{post.title.rendered}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </Prose>
      </Container>
    </Section>
  );
}
