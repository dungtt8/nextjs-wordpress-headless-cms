import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import { truncateHtml } from "@/lib/metadata";
import { DEFAULT_LOCALE, isValidLocale } from "@/lib/i18n";

const DATE_LOCALES = { en: "en-US", vi: "vi-VN", zh: "zh-CN" } as const;

export async function PostCard({ post, locale }: { post: Post; locale?: string }) {
  const resolvedLocale = isValidLocale(locale ?? "") ? (locale as keyof typeof DATE_LOCALES) : DEFAULT_LOCALE;
  const t = await getTranslations({ locale: resolvedLocale, namespace: "postCard" });

  // Use embedded data instead of separate API calls
  const media = post._embedded?.["wp:featuredmedia"]?.[0] ?? null;
  const category = post._embedded?.["wp:term"]?.[0]?.[0] ?? null;
  const date = new Date(post.date).toLocaleDateString(DATE_LOCALES[resolvedLocale], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={locale ? `/${locale}/posts/${post.slug}` : `/posts/${post.slug}`}
      className={cn(
        "border p-4 bg-accent/30 rounded-lg group flex justify-between flex-col not-prose gap-8",
        "hover:bg-accent/75 transition-all"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="h-48 w-full overflow-hidden relative rounded-md border flex items-center justify-center bg-muted">
          {media?.source_url ? (
            <Image
              className="h-full w-full object-cover"
              src={media.source_url}
              alt={post.title?.rendered || t("noImage")}
              width={400}
              height={200}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              {t("noImage")}
            </div>
          )}
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: post.title?.rendered || t("untitled"),
          }}
          className="text-xl text-primary font-medium group-hover:underline decoration-muted-foreground underline-offset-4 decoration-dotted transition-all"
        ></div>
        <div className="text-sm">
          {post.excerpt?.rendered
            ? truncateHtml(post.excerpt.rendered, 12)
            : t("noExcerpt")}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <hr />
        <div className="flex justify-between items-center text-xs">
          <p>{category?.name || t("uncategorized")}</p>
          <p>{date}</p>
        </div>
      </div>
    </Link>
  );
}
