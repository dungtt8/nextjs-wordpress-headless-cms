// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
} from "./wordpress.d";
import type { MentorItem } from "@/lib/home/types";

// Single source of truth for WordPress configuration
const baseUrl = process.env.WORDPRESS_URL;
const isConfigured = Boolean(baseUrl);

if (!isConfigured) {
  console.warn(
    "WORDPRESS_URL environment variable is not defined - WordPress features will be unavailable"
  );
}

class WordPressAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// Pagination types
export interface WordPressPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: WordPressPaginationHeaders;
}

const USER_AGENT = "Next.js WordPress Client";
const CACHE_TTL = 3600; // 1 hour
const MENTOR_ENDPOINTS = ["/wp-json/wp/v2/mentor", "/wp-json/wp/v2/mentors"];

interface WPMentorRecord {
  id: number | string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  acf?: Record<string, unknown>;
  role?: string;
  profileLabel?: string;
  profile_label?: string;
  headline?: string;
  shortBio?: string;
  short_bio?: string;
  fullBio?: string;
  full_bio?: string;
  focusAreas?: unknown;
  focus_areas?: unknown;
  achievements?: unknown;
  quote?: string;
  avatar?: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
  };
}

function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function mapWPMentor(record: WPMentorRecord): MentorItem | null {
  const acf = record.acf ?? {};
  const name =
    readString(record.title?.rendered) ||
    readString(acf.name) ||
    `Mentor ${record.id}`;

  if (!name) return null;

  const shortBio =
    readString(record.shortBio) ||
    readString(record.short_bio) ||
    readString(acf.shortBio) ||
    readString(acf.short_bio) ||
    stripHtmlTags(readString(record.excerpt?.rendered));

  const fullBio =
    readString(record.fullBio) ||
    readString(record.full_bio) ||
    readString(acf.fullBio) ||
    readString(acf.full_bio) ||
    stripHtmlTags(readString(record.content?.rendered)) ||
    shortBio;

  const focusAreaCandidates = [
    readStringArray(record.focusAreas),
    readStringArray(record.focus_areas),
    readStringArray(acf.focusAreas),
    readStringArray(acf.focus_areas),
  ];
  const focusAreas =
    focusAreaCandidates.find((items) => items.length > 0) ?? [];

  const achievementCandidates = [
    readStringArray(record.achievements),
    readStringArray(acf.achievements),
  ];
  const achievements =
    achievementCandidates.find((items) => items.length > 0) ?? [];

  const avatar =
    readString(record.avatar) ||
    readString(acf.avatar) ||
    readString(acf.photo) ||
    readString(record._embedded?.["wp:featuredmedia"]?.[0]?.source_url);

  return {
    id: `wp-${record.id}`,
    name: stripHtmlTags(name),
    role:
      readString(record.role) || readString(acf.role) || "Mentor ChinaHack",
    avatar,
    profileLabel:
      readString(record.profileLabel) ||
      readString(record.profile_label) ||
      readString(acf.profileLabel) ||
      readString(acf.profile_label) ||
      "Our Expert",
    headline:
      readString(record.headline) ||
      readString(acf.headline) ||
      shortBio ||
      "Đồng hành xây dựng hồ sơ học bổng.",
    shortBio:
      shortBio || "Mentor đồng hành cùng bạn trong hành trình ứng tuyển học bổng.",
    fullBio,
    focusAreas: focusAreas.length > 0 ? focusAreas : ["Mentorship", "Scholarship strategy"],
    achievements:
      achievements.length > 0
        ? achievements
        : ["Đồng hành cùng mentee trong các mốc chuẩn bị hồ sơ học bổng."],
    quote:
      readString(record.quote) ||
      readString(acf.quote) ||
      "Mỗi bộ hồ sơ đều cần một chiến lược rõ ràng và phù hợp với mục tiêu của bạn.",
  };
}

async function getMentorsFromEndpoint(path: string): Promise<MentorItem[]> {
  const data = await wordpressFetchGraceful<WPMentorRecord[]>(
    path,
    [],
    { per_page: 20, _embed: true },
    ["wordpress", "mentors"]
  );

  return data
    .map((record) => mapWPMentor(record))
    .filter((mentor): mentor is MentorItem => Boolean(mentor));
}

// Core fetch - throws on error (for functions that require data)
async function wordpressFetch<T>(
  path: string,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<T> {
  if (!baseUrl) {
    throw new Error("WordPress URL not configured");
  }

  const url = `${baseUrl}${path}${query ? `?${querystring.stringify(query, { sort: false })}` : ""}`;

  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    next: { tags, revalidate: CACHE_TTL },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

// Graceful fetch - returns fallback when WordPress unavailable or on error
async function wordpressFetchGraceful<T>(
  path: string,
  fallback: T,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<T> {
  if (!isConfigured) return fallback;

  try {
    return await wordpressFetch<T>(path, query, tags);
  } catch {
    console.warn(`WordPress fetch failed for ${path}`);
    return fallback;
  }
}

// Paginated fetch - returns response with headers
async function wordpressFetchPaginated<T>(
  path: string,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<WordPressResponse<T>> {
  if (!baseUrl) {
    throw new Error("WordPress URL not configured");
  }

  const url = `${baseUrl}${path}${query ? `?${querystring.stringify(query, { sort: false })}` : ""}`;

  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    next: { tags, revalidate: CACHE_TTL },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return {
    data: await response.json(),
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

// Graceful paginated fetch - returns empty response when unavailable
async function wordpressFetchPaginatedGraceful<T>(
  path: string,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<WordPressResponse<T[]>> {
  const emptyResponse: WordPressResponse<T[]> = {
    data: [],
    headers: { total: 0, totalPages: 0 },
  };

  if (!isConfigured) return emptyResponse;

  try {
    return await wordpressFetchPaginated<T[]>(path, query, tags);
  } catch {
    console.warn(`WordPress paginated fetch failed for ${path}`);
    return emptyResponse;
  }
}

// Paginated posts with filter support
export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  }
): Promise<WordPressResponse<Post[]>> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: perPage,
    page,
  };

  // Build cache tags based on filters
  const cacheTags = ["wordpress", "posts", `posts-page-${page}`];

  if (filterParams?.search) {
    query.search = filterParams.search;
    cacheTags.push("posts-search");
  }
  if (filterParams?.author) {
    query.author = filterParams.author;
    cacheTags.push(`posts-author-${filterParams.author}`);
  }
  if (filterParams?.tag) {
    query.tags = filterParams.tag;
    cacheTags.push(`posts-tag-${filterParams.tag}`);
  }
  if (filterParams?.category) {
    query.categories = filterParams.category;
    cacheTags.push(`posts-category-${filterParams.category}`);
  }

  return wordpressFetchPaginatedGraceful<Post>(
    "/wp-json/wp/v2/posts",
    query,
    cacheTags
  );
}

/**
 * Fetches recent posts (up to 100). For paginated access use getPostsPaginated().
 * For fetching ALL posts (e.g., sitemap), use getAllPostsForSitemap().
 */
export async function getRecentPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) query.search = filterParams.search;
  if (filterParams?.author) query.author = filterParams.author;
  if (filterParams?.tag) query.tags = filterParams.tag;
  if (filterParams?.category) query.categories = filterParams.category;

  return wordpressFetchGraceful<Post[]>("/wp-json/wp/v2/posts", [], query, [
    "wordpress",
    "posts",
  ]);
}

export async function getMentorProfiles(): Promise<MentorItem[]> {
  for (const endpoint of MENTOR_ENDPOINTS) {
    const mentors = await getMentorsFromEndpoint(endpoint);
    if (mentors.length > 0) {
      return mentors;
    }
  }

  return [];
}

export async function getPostById(id: number): Promise<Post> {
  return wordpressFetch<Post>(`/wp-json/wp/v2/posts/${id}`);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await wordpressFetchGraceful<Post[]>(
    "/wp-json/wp/v2/posts",
    [],
    { slug, _embed: true }
  );
  return posts[0];
}

export async function getAllCategories(): Promise<Category[]> {
  return wordpressFetchGraceful<Category[]>(
    "/wp-json/wp/v2/categories",
    [],
    { per_page: 100 },
    ["wordpress", "categories"]
  );
}

export async function getCategoryById(id: number): Promise<Category> {
  return wordpressFetch<Category>(`/wp-json/wp/v2/categories/${id}`);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", { slug }).then(
    (categories) => categories[0]
  );
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: categoryId,
  });
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tagId });
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { post: postId });
}

export async function getAllTags(): Promise<Tag[]> {
  return wordpressFetchGraceful<Tag[]>(
    "/wp-json/wp/v2/tags",
    [],
    { per_page: 100 },
    ["wordpress", "tags"]
  );
}

export async function getTagById(id: number): Promise<Tag> {
  return wordpressFetch<Tag>(`/wp-json/wp/v2/tags/${id}`);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { slug }).then(
    (tags) => tags[0]
  );
}

export async function getAllPages(): Promise<Page[]> {
  return wordpressFetchGraceful<Page[]>(
    "/wp-json/wp/v2/pages",
    [],
    { per_page: 100 },
    ["wordpress", "pages"]
  );
}

export async function getPageById(id: number): Promise<Page> {
  return wordpressFetch<Page>(`/wp-json/wp/v2/pages/${id}`);
}

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
  const pages = await wordpressFetchGraceful<Page[]>(
    "/wp-json/wp/v2/pages",
    [],
    { slug }
  );
  return pages[0];
}

export async function getAllAuthors(): Promise<Author[]> {
  return wordpressFetchGraceful<Author[]>(
    "/wp-json/wp/v2/users",
    [],
    { per_page: 100 },
    ["wordpress", "authors"]
  );
}

export async function getAuthorById(id: number): Promise<Author> {
  return wordpressFetch<Author>(`/wp-json/wp/v2/users/${id}`);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", { slug }).then(
    (users) => users[0]
  );
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: authorId });
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: author.id });
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: category.id,
  });
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tag.id });
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  return wordpressFetch<FeaturedMedia>(`/wp-json/wp/v2/media/${id}`);
}

export async function searchCategories(query: string): Promise<Category[]> {
  return wordpressFetchGraceful<Category[]>(
    "/wp-json/wp/v2/categories",
    [],
    { search: query, per_page: 100 }
  );
}

export async function searchTags(query: string): Promise<Tag[]> {
  return wordpressFetchGraceful<Tag[]>("/wp-json/wp/v2/tags", [], {
    search: query,
    per_page: 100,
  });
}

export async function searchAuthors(query: string): Promise<Author[]> {
  return wordpressFetchGraceful<Author[]>("/wp-json/wp/v2/users", [], {
    search: query,
    per_page: 100,
  });
}

// Fetches ALL post slugs for generateStaticParams
// Returns empty array if WordPress is unavailable (allows build to succeed)
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  if (!isConfigured) return [];

  try {
    const allSlugs: { slug: string }[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await wordpressFetchPaginated<Post[]>(
        "/wp-json/wp/v2/posts",
        { per_page: 100, page, _fields: "slug" }
      );

      allSlugs.push(...response.data.map((post) => ({ slug: post.slug })));
      hasMore = page < response.headers.totalPages;
      page++;
    }

    return allSlugs;
  } catch {
    console.warn("WordPress unavailable, skipping static generation for posts");
    return [];
  }
}

// Fetches ALL posts for sitemap generation (paginates through all pages)
// Returns slug and modified date for each post
export async function getAllPostsForSitemap(): Promise<
  { slug: string; modified: string }[]
> {
  if (!isConfigured) return [];

  try {
    const allPosts: { slug: string; modified: string }[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await wordpressFetchPaginated<Post[]>(
        "/wp-json/wp/v2/posts",
        { per_page: 100, page, _fields: "slug,modified" }
      );

      allPosts.push(
        ...response.data.map((post) => ({
          slug: post.slug,
          modified: post.modified,
        }))
      );
      hasMore = page < response.headers.totalPages;
      page++;
    }

    return allPosts;
  } catch {
    console.warn("WordPress unavailable, skipping sitemap generation");
    return [];
  }
}

// Enhanced pagination functions for specific queries
export async function getPostsByCategoryPaginated(
  categoryId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  return wordpressFetchPaginatedGraceful<Post>("/wp-json/wp/v2/posts", {
    _embed: true,
    per_page: perPage,
    page,
    categories: categoryId,
  });
}

export async function getPostsByTagPaginated(
  tagId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  return wordpressFetchPaginatedGraceful<Post>("/wp-json/wp/v2/posts", {
    _embed: true,
    per_page: perPage,
    page,
    tags: tagId,
  });
}

export async function getPostsByAuthorPaginated(
  authorId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  return wordpressFetchPaginatedGraceful<Post>("/wp-json/wp/v2/posts", {
    _embed: true,
    per_page: perPage,
    page,
    author: authorId,
  });
}

// Locale-aware functions for Polylang support
interface GetPostBySlugParams {
  slug: string;
  locale: string;
}

export async function getPostBySlugAndLocale({
  slug,
  locale,
}: GetPostBySlugParams): Promise<Post | undefined> {
  const posts = await wordpressFetch<Post[]>(
    "/wp-json/wp/v2/posts",
    { slug, lang: locale, _embed: true },
    [
      'wordpress',
      'posts',
      `posts-${locale}`,
      `post-slug-${slug}-${locale}`,
    ]
  );
  return posts[0];
}

interface GetPostsPaginatedParams {
  locale: string;
  page?: number;
  perPage?: number;
}

export async function getPostsPaginatedByLocale({
  locale,
  page = 1,
  perPage = 10,
}: GetPostsPaginatedParams): Promise<WordPressResponse<Post[]>> {
  return wordpressFetchPaginatedGraceful<Post>("/wp-json/wp/v2/posts", {
    _embed: true,
    lang: locale,
    per_page: perPage,
    page,
  });
}

export async function getAllPostSlugsForLocale(
  locale: string
): Promise<{ slug: string; locale: string }[]> {
  const posts = await wordpressFetch<Post[]>(
    "/wp-json/wp/v2/posts",
    { lang: locale, per_page: 100 },
    ['wordpress', 'posts', `posts-${locale}`]
  );
  return posts.map(post => ({ slug: post.slug, locale }));
}

export async function getAllPageSlugsForLocale(
  locale: string
): Promise<{ slug: string; locale: string }[]> {
  const pages = await wordpressFetch<Page[]>(
    "/wp-json/wp/v2/pages",
    { lang: locale, per_page: 100 },
    ['wordpress', 'pages', `pages-${locale}`]
  );
  return pages.map(page => ({ slug: page.slug, locale }));
}

export async function getPageBySlugAndLocale({
  slug,
  locale,
}: GetPostBySlugParams): Promise<Page | undefined> {
  const pages = await wordpressFetch<Page[]>(
    "/wp-json/wp/v2/pages",
    { slug, lang: locale, _embed: true },
    [
      'wordpress',
      'pages',
      `pages-${locale}`,
      `page-slug-${slug}-${locale}`,
    ]
  );
  return pages[0];
}

export { WordPressAPIError };
