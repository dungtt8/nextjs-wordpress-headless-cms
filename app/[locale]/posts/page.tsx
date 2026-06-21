import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { getPostsPaginatedByLocale } from '@/lib/wordpress';

export const dynamic = 'force-static';

export default async function PostsArchive({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page = '1' } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'posts' });

  const pageNum = Math.max(1, parseInt(page) || 1);
  const { data: posts, headers } = await getPostsPaginatedByLocale({
    locale,
    page: pageNum,
  });

  if (!posts || posts.length === 0) {
    return <p>{t('noPosts')}</p>;
  }

  return (
    <div>
      <h1>{t('archiveTitle')}</h1>
      <div className="grid gap-4">
        {posts.map(post => (
          <article key={post.id}>
            <h2>{post.title.rendered}</h2>
            <p>{post.excerpt.rendered}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
