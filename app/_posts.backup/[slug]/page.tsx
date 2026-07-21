import { getPostBySlug, getAllPostSlugs } from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";

import { Section, Container, Article } from "@/components/craft";
import { ArrowUpRight, CalendarBlank, Clock, Notebook, Sparkle, User } from "@phosphor-icons/react/ssr";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return await getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    ...generateContentMetadata({
      title: stripHtml(post.title.rendered),
      description: stripHtml(post.excerpt.rendered),
      path: `/posts.backup/${post.slug}`,
    }),
    // Legacy/duplicate route kept for reference — real content lives under /[locale]/posts.
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const author = post._embedded?.author?.[0];
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = post._embedded?.["wp:term"]?.[0]?.[0];

  const plainContent = stripHtml(post.content.rendered);
  const readingMinutes = Math.max(
    3,
    Math.round(
      plainContent
        .split(/\s+/)
        .filter(Boolean).length / 220,
    ),
  );

  const date = new Date(post.date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Section className="relative overflow-hidden bg-[linear-gradient(180deg,#fdfbff_0%,#f6f2ff_52%,#f9f7ff_100%)] py-12 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(196,181,253,0.36),transparent_38%),radial-gradient(circle_at_90%_18%,rgba(217,190,123,0.16),transparent_32%)]" />

      <Container className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/85 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-violet-700">
            <Notebook weight="thin" className="h-3.5 w-3.5" />
            Editorial Blog
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
            <Link href="/" className="transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-violet-700">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/posts" className="transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-violet-700">
              Blog
            </Link>
            <span>/</span>
            <span className="max-w-[220px] truncate text-slate-700">Chi tiết bài viết</span>
          </div>

          <header className="rounded-[2rem] border border-violet-200/70 bg-violet-50/45 p-2 shadow-[0_30px_70px_rgba(76,29,149,0.08)]">
            <div className="rounded-[calc(2rem-0.5rem)] border border-white/70 bg-white/95 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-violet-700">
                {category ? (
                  <Link
                    href={`/posts/?category=${category.id}`}
                    className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 font-semibold transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-violet-300 hover:bg-violet-100"
                  >
                    {category.name}
                  </Link>
                ) : null}

                <span className="inline-flex items-center gap-1.5 text-slate-500">
                  <Clock weight="thin" className="h-4 w-4" />
                  {readingMinutes} phút đọc
                </span>
              </div>

              <h1
                className="mt-5 max-w-5xl font-display text-3xl leading-tight text-[#21194b] sm:text-4xl lg:text-[3.3rem] lg:leading-[1.06]"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />

              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-violet-100 pt-5 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-xs font-semibold text-violet-700">
                    {author?.name ? author.name.charAt(0).toUpperCase() : "C"}
                  </span>
                  <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                    <User weight="thin" className="h-4 w-4 text-violet-700" />
                    {author?.name ?? "ChinaHack Editorial"}
                  </span>
                </span>

                <span className="inline-flex items-center gap-2 text-slate-500">
                  <CalendarBlank weight="thin" className="h-4 w-4 text-violet-700" />
                  Cập nhật {date}
                </span>
              </div>
            </div>
          </header>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-[2rem] border border-violet-200/70 bg-violet-50/40 p-2 shadow-[0_24px_55px_rgba(76,29,149,0.09)]">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(2rem-0.5rem)] border border-white/75 bg-gradient-to-br from-violet-100 via-violet-50 to-slate-50">
                {featuredMedia?.source_url ? (
                  <img
                    src={featuredMedia.source_url}
                    alt={stripHtml(post.title.rendered)}
                    className="h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-200/30 to-slate-100/40">
                    <div className="text-center">
                      <Notebook weight="thin" className="h-16 w-16 mx-auto text-violet-300/60 mb-3" />
                      <p className="text-sm font-medium text-violet-600/70">Blog thumbnail</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-violet-200/70 bg-violet-50/40 p-2 shadow-[0_24px_55px_rgba(76,29,149,0.08)]">
              <div className="rounded-[calc(2rem-0.5rem)] border border-white/75 bg-white/96 p-6 sm:p-8 lg:p-10">
                <Article
                  className="max-w-none [&_h2]:font-display [&_h2]:text-[2rem] [&_h2]:leading-tight [&_h2]:text-[#20194b] [&_h2]:mt-14 [&_h2]:mb-5 [&_h3]:text-[1.35rem] [&_h3]:font-semibold [&_h3]:text-[#2a235f] [&_h3]:mt-9 [&_h3]:mb-4 [&_p]:text-[1.03rem] [&_p]:leading-8 [&_p]:text-slate-700 [&_a]:text-violet-700 [&_a]:decoration-violet-300 hover:[&_a]:text-violet-800 [&_blockquote]:border-violet-300 [&_blockquote]:bg-violet-50/55 [&_blockquote]:rounded-r-2xl [&_blockquote]:pr-4 [&_blockquote]:text-slate-700 [&_ul_li]:before:bg-violet-500 [&_img]:rounded-2xl [&_img]:border-violet-100"
                  dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-8 h-fit space-y-5">
            <div className="rounded-[2rem] border border-violet-200/70 bg-violet-50/40 p-2 shadow-[0_24px_55px_rgba(76,29,149,0.08)]">
              <div className="rounded-[calc(2rem-0.5rem)] border border-white/80 bg-white/95 p-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-violet-700">
                  <Sparkle weight="thin" className="h-3.5 w-3.5" />
                  Admissions Desk
                </div>

                <h3 className="mt-4 font-display text-[1.7rem] leading-tight text-[#231b50]">
                  Nhận tư vấn học bổng theo hồ sơ thật của bạn
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Đội ngũ mentor giúp bạn chẩn đoán hồ sơ, xác định học bổng phù hợp và xây chiến lược nộp hồ sơ theo deadline.
                </p>

                <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
                  {["Review nhanh trong 24h", "Roadmap cá nhân hóa theo mục tiêu", "Đồng hành viết hồ sơ và luyện phỏng vấn"].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 leading-6">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Link
                    href="/#lead-form"
                    className="group inline-flex w-full items-center justify-between rounded-full border border-violet-700 bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1px] hover:bg-violet-800"
                  >
                    <span>Đăng ký tư vấn miễn phí</span>
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                      <ArrowUpRight weight="thin" className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </Container>
    </Section>
  );
}