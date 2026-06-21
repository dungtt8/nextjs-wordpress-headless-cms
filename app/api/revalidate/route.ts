import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret');

  if (secret !== process.env.WORDPRESS_WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, type, lang } = body;

    // Determine which locales to revalidate
    const locales = lang ? [lang] : ['en', 'vi', 'zh'];

    // Revalidate cache tags for each locale
    locales.forEach(locale => {
      revalidateTag(`posts-${locale}`, 'default');
      revalidateTag(`pages-${locale}`, 'default');

      if (id) {
        revalidateTag(`post-${id}-${locale}`, 'default');
        revalidateTag(`page-${id}-${locale}`, 'default');
      }
    });

    // Full layout revalidation
    revalidatePath('/', 'layout');

    return Response.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      locales,
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return Response.json(
      {
        message: 'Revalidation failed',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
