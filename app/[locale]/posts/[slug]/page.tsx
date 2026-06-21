// app/[locale]/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import {
  getPostBySlugAndLocale,
  getAllPostSlugsForLocale,
} from '@/lib/wordpress';

export const dynamic = 'force-static';

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

  const baseUrl = process.env.WORDPRESS_URL || 'https://example.com';

  return {
    title: post.title.rendered,
    description: post.excerpt?.rendered || '',
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

  const t = await getTranslations({ locale, namespace: 'posts' });

  return (
    <article>
      <h1>{post.title.rendered}</h1>
      <p>{t('publishedOn')} {new Date(post.date).toLocaleDateString(locale)}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </article>
  );
}
