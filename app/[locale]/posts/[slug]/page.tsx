import { notFound } from "next/navigation";
import { getPostBySlugAndLocale, getAllPostSlugsForLocale } from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";
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

  const baseUrl = process.env.WORDPRESS_URL || "https://example.com";

  return {
    ...generateContentMetadata({
      title: post.title.rendered,
      description,
      slug: post.slug,
      basePath: "posts",
    }),
    alternates: {
      languages: {
        en: `${baseUrl}/en/posts/${slug}`,
        vi: `${baseUrl}/vi/posts/${slug}`,
        zh: `${baseUrl}/zh/posts/${slug}`,
      },
    },
  };
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

  return (
    <Section>
      <Container>
        <Prose>
          <h2>{post.title.rendered}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </Prose>
      </Container>
    </Section>
  );
}
