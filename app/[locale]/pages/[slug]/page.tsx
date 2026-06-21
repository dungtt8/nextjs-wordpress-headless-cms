import { getPageBySlugAndLocale, getAllPageSlugsForLocale } from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";
import { Section, Container, Prose } from "@/components/craft";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  const locales = ['en', 'vi', 'zh'];
  const paramsList = await Promise.all(
    locales.map(locale => getAllPageSlugsForLocale(locale))
  );
  return paramsList.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getPageBySlugAndLocale({ slug, locale });

  if (!page) {
    return {};
  }

  const description = page.excerpt?.rendered
    ? stripHtml(page.excerpt.rendered)
    : stripHtml(page.content.rendered).slice(0, 200) + "...";

  return generateContentMetadata({
    title: page.title.rendered,
    description,
    slug: page.slug,
    basePath: "pages",
  });
}

export default async function PageBySlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = await getPageBySlugAndLocale({ slug, locale });

  if (!page) {
    notFound();
  }

  return (
    <Section>
      <Container>
        <Prose>
          <h2>{page.title.rendered}</h2>
          <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
        </Prose>
      </Container>
    </Section>
  );
}
