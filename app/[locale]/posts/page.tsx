import {
  getPostsPaginatedByLocale,
  getAllAuthors,
  getAllTags,
  getAllCategories,
  searchAuthors,
  searchTags,
  searchCategories,
} from "@/lib/wordpress";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { generateContentMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/i18n";
import { Section, Container, Prose } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import { FilterPosts } from "@/components/posts/filter";
import { SearchInput } from "@/components/posts/search-input";

import type { Metadata } from "next";

export const dynamic = "auto";
export const revalidate = 3600;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    author?: string;
    tag?: string;
    category?: string;
    page?: string;
    search?: string;
  }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { author, tag, category, page, search } = await searchParams;

  const title = locale === 'en' ? "Blog Posts" : locale === 'vi' ? "Bài Viết" : "博客文章";
  const description = locale === 'en' ? "Browse all our blog posts" : locale === 'vi' ? "Duyệt tất cả bài viết của chúng tôi" : "浏览我们所有的博客文章";

  const metadata = generateContentMetadata({
    title,
    description,
    path: "/posts",
    locale: locale as Locale,
    type: "website",
  });

  // Filtered/search result variants are thin, duplicate-content pages — keep them out of the index.
  const isFiltered = Boolean(author || tag || category || search || (page && page !== "1"));
  if (isFiltered) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

export default async function PostsArchivePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    author?: string;
    tag?: string;
    category?: string;
    page?: string;
    search?: string;
  }>;
}) {
  const { locale } = await params;
  const queryParams = await searchParams;
  const { author, tag, category, page: pageParam, search } = queryParams;

  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 9;

  const [postsResponse, authors, tags, categories] = await Promise.all([
    getPostsPaginatedByLocale({
      locale,
      page,
      perPage: postsPerPage,
    }),
    getAllAuthors(),
    getAllTags(),
    getAllCategories(),
  ]);

  const { data: posts, headers } = postsResponse;
  const { total, totalPages } = headers;

  const createPaginationUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (category) params.set("category", category);
    if (author) params.set("author", author);
    if (tag) params.set("tag", tag);
    if (search) params.set("search", search);
    return `/${locale}/posts${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <Section>
      <Container>
        <div className="space-y-8">
          <Prose>
            <h2>{locale === 'en' ? 'All Posts' : locale === 'vi' ? 'Tất cả bài viết' : '所有文章'}</h2>
            <p className="text-muted-foreground">
              {total} {total === 1 ? (locale === 'en' ? 'post' : locale === 'vi' ? 'bài viết' : '文章') : (locale === 'en' ? 'posts' : locale === 'vi' ? 'bài viết' : '文章')} found
              {search && (locale === 'en' ? ' matching your search' : locale === 'vi' ? ' phù hợp với tìm kiếm của bạn' : ' 与您的搜索匹配')}
            </p>
          </Prose>

          <div className="space-y-4">
            <SearchInput defaultValue={search} />
            <FilterPosts
              authors={authors}
              tags={tags}
              categories={categories}
              selectedAuthor={author}
              selectedTag={tag}
              selectedCategory={category}
            />
          </div>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="h-24 w-full border rounded-lg bg-accent/25 flex items-center justify-center">
              <p>{locale === 'en' ? 'No posts found' : locale === 'vi' ? 'Không tìm thấy bài viết nào' : '未找到任何文章'}</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center py-8">
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={createPaginationUrl(page - 1)} />
                    </PaginationItem>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                      return (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        Math.abs(pageNum - page) <= 1
                      );
                    })
                    .map((pageNum, index, array) => {
                      const showEllipsis =
                        index > 0 && pageNum - array[index - 1] > 1;
                      return (
                        <div key={pageNum} className="flex items-center">
                          {showEllipsis && <span className="px-2">...</span>}
                          <PaginationItem>
                            <PaginationLink
                              href={createPaginationUrl(pageNum)}
                              isActive={pageNum === page}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        </div>
                      );
                    })}

                  {page < totalPages && (
                    <PaginationItem>
                      <PaginationNext href={createPaginationUrl(page + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
