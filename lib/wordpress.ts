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
  Lead,
} from "./wordpress.d";
import type { MentorItem, SuccessStory, UniversityLogo, SiteSettings } from "@/lib/home/types";

// Single source of truth for WordPress configuration
const baseUrl = process.env.WORDPRESS_URL;
const isConfigured = Boolean(baseUrl);

// Basic Auth for non-public post types (e.g. leads) that require authenticated reads
const basicAuthUser = process.env.WORDPRESS_BASIC_AUTH_USER;
const basicAuthPassword = process.env.WORDPRESS_BASIC_AUTH_PASSWORD;

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

  // Extract SHARED name (same across all languages)
  const name = readString(record.title?.rendered) || readString(acf.name) || `Mentor ${record.id}`;

  if (!name) return null;

  // Extract SHARED avatar (same across all languages)
  const avatar =
    readString(acf.avatar) ||
    readString(record._embedded?.["wp:featuredmedia"]?.[0]?.source_url);

  // Extract multilingual role
  const roleEn = readString(acf.role_en) || "ChinaHack Mentor";
  const roleVi = readString(acf.role_vi) || roleEn;
  const roleZh = readString(acf.role_zh) || roleEn;

  // Extract multilingual headline
  const headlineEn = readString(acf.headline_en) || "Supporting your scholarship journey.";
  const headlineVi = readString(acf.headline_vi) || "Đồng hành xây dựng hồ sơ học bổng.";
  const headlineZh = readString(acf.headline_zh) || "支持您的奖学金之路。";

  // Extract multilingual short bio
  const shortBioEn = readString(acf.short_bio_en) || "Dedicated mentor at ChinaHack";
  const shortBioVi = readString(acf.short_bio_vi) || "Mentor đồng hành cùng bạn trong hành trình ứng tuyển học bổng.";
  const shortBioZh = readString(acf.short_bio_zh) || "与您一起申请奖学金的导师。";

  // Extract multilingual full bio
  const fullBioEn = readString(acf.full_bio_en) || shortBioEn;
  const fullBioVi = readString(acf.full_bio_vi) || shortBioVi;
  const fullBioZh = readString(acf.full_bio_zh) || shortBioZh;

  // Extract multilingual quote
  const quoteEn = readString(acf.quote_en) || "Every application needs a clear strategy aligned with your goals.";
  const quoteVi = readString(acf.quote_vi) || "Mỗi bộ hồ sơ đều cần một chiến lược rõ ràng và phù hợp với mục tiêu của bạn.";
  const quoteZh = readString(acf.quote_zh) || "每份申请都需要一个明确的战略。";

  // Extract focus areas (multilingual - one per line)
  const focusAreasEn = readStringArray(acf.focus_areas_en) || ["Mentorship", "Scholarship strategy"];
  const focusAreasVi = readStringArray(acf.focus_areas_vi) || focusAreasEn;
  const focusAreasZh = readStringArray(acf.focus_areas_zh) || focusAreasEn;

  // Extract achievements (multilingual - one per line)
  const achievementsEn = readStringArray(acf.achievements_en) || ["Supporting mentees through scholarship preparation"];
  const achievementsVi = readStringArray(acf.achievements_vi) || achievementsEn;
  const achievementsZh = readStringArray(acf.achievements_zh) || achievementsEn;

  return {
    id: `wp-${record.id}`,
    name: { en: stripHtmlTags(name), vi: stripHtmlTags(name), zh: stripHtmlTags(name) },
    role: { en: roleEn, vi: roleVi, zh: roleZh },
    avatar,
    headline: { en: headlineEn, vi: headlineVi, zh: headlineZh },
    shortBio: { en: shortBioEn, vi: shortBioVi, zh: shortBioZh },
    fullBio: { en: fullBioEn, vi: fullBioVi, zh: fullBioZh },
    focusAreas: focusAreasEn.map((area, idx) => ({
      en: area,
      vi: focusAreasVi[idx] || area,
      zh: focusAreasZh[idx] || area,
    })),
    achievements: achievementsEn.map((achievement, idx) => ({
      en: achievement,
      vi: achievementsVi[idx] || achievement,
      zh: achievementsZh[idx] || achievement,
    })),
    quote: { en: quoteEn, vi: quoteVi, zh: quoteZh },
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

// Authenticated fetch - for non-public post types (e.g. leads) that require Basic Auth to read
async function wordpressFetchAuthenticated<T>(
  path: string,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<T> {
  if (!baseUrl) {
    throw new Error("WordPress URL not configured");
  }

  if (!basicAuthUser || !basicAuthPassword) {
    throw new Error("WordPress Basic Auth credentials not configured");
  }

  const url = `${baseUrl}${path}${query ? `?${querystring.stringify(query, { sort: false })}` : ""}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Authorization: `Basic ${Buffer.from(`${basicAuthUser}:${basicAuthPassword}`).toString("base64")}`,
    },
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

// Authenticated paginated fetch - returns response with headers, throws on error
async function wordpressFetchAuthenticatedPaginated<T>(
  path: string,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<WordPressResponse<T>> {
  if (!baseUrl) {
    throw new Error("WordPress URL not configured");
  }

  if (!basicAuthUser || !basicAuthPassword) {
    throw new Error("WordPress Basic Auth credentials not configured");
  }

  const url = `${baseUrl}${path}${query ? `?${querystring.stringify(query, { sort: false })}` : ""}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Authorization: `Basic ${Buffer.from(`${basicAuthUser}:${basicAuthPassword}`).toString("base64")}`,
    },
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

// Graceful authenticated paginated fetch - returns empty response when unavailable
async function wordpressFetchAuthenticatedPaginatedGraceful<T>(
  path: string,
  query?: Record<string, any>,
  tags: string[] = ["wordpress"]
): Promise<WordPressResponse<T[]>> {
  const emptyResponse: WordPressResponse<T[]> = {
    data: [],
    headers: { total: 0, totalPages: 0 },
  };

  if (!isConfigured || !basicAuthUser || !basicAuthPassword) return emptyResponse;

  try {
    return await wordpressFetchAuthenticatedPaginated<T[]>(path, query, tags);
  } catch {
    console.warn(`WordPress authenticated paginated fetch failed for ${path}`);
    return emptyResponse;
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
// Returns slug and modified date for each post. Pass `locale` to scope to one language (Polylang `lang` param).
export async function getAllPostsForSitemap(
  locale?: string
): Promise<{ slug: string; modified: string }[]> {
  if (!isConfigured) return [];

  try {
    const allPosts: { slug: string; modified: string }[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await wordpressFetchPaginated<Post[]>(
        "/wp-json/wp/v2/posts",
        { per_page: 100, page, _fields: "slug,modified", ...(locale ? { lang: locale } : {}) }
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

// Fetches ALL pages for sitemap generation (paginates through all pages)
// Returns slug and modified date for each page. Pass `locale` to scope to one language (Polylang `lang` param).
export async function getAllPagesForSitemap(
  locale?: string
): Promise<{ slug: string; modified: string }[]> {
  if (!isConfigured) return [];

  try {
    const allPages: { slug: string; modified: string }[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await wordpressFetchPaginated<Page[]>(
        "/wp-json/wp/v2/pages",
        { per_page: 100, page, _fields: "slug,modified", ...(locale ? { lang: locale } : {}) }
      );

      allPages.push(
        ...response.data.map((p) => ({
          slug: p.slug,
          modified: p.modified,
        }))
      );
      hasMore = page < response.headers.totalPages;
      page++;
    }

    return allPages;
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

/**
 * Success Stories Custom Post Type Interface
 */
interface WPSuccessStoryRecord {
  id: number | string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  acf?: Record<string, unknown>;
  studentName?: string;
  student_name?: string;
  quote?: string;
  outcome?: string;
  avatar?: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
  };
}

function mapWPSuccessStory(record: WPSuccessStoryRecord): SuccessStory | null {
  const acf = record.acf ?? {};

  // Extract SHARED student name
  const studentName =
    readString(record.studentName) ||
    readString(record.student_name) ||
    readString(acf.student_name) ||
    readString(record.title?.rendered) ||
    `Student ${record.id}`;

  if (!studentName) return null;

  // Extract SHARED avatar
  const avatar =
    readString(acf.avatar) ||
    readString(record._embedded?.["wp:featuredmedia"]?.[0]?.source_url) ||
    "";

  // Extract multilingual quote
  const quoteEn = readString(acf.quote_en) || "";
  const quoteVi = readString(acf.quote_vi) || "";
  const quoteZh = readString(acf.quote_zh) || "";

  // Extract multilingual outcome
  const outcomeEn = readString(acf.outcome_en) || "";
  const outcomeVi = readString(acf.outcome_vi) || "";
  const outcomeZh = readString(acf.outcome_zh) || "";

  return {
    id: `wp-${record.id}`,
    studentName: stripHtmlTags(studentName),
    avatar,
    quote: {
      en: stripHtmlTags(quoteEn),
      vi: stripHtmlTags(quoteVi),
      zh: stripHtmlTags(quoteZh),
    },
    outcome: {
      en: stripHtmlTags(outcomeEn),
      vi: stripHtmlTags(outcomeVi),
      zh: stripHtmlTags(outcomeZh),
    },
  };
}

/**
 * Universities Custom Post Type Interface
 */
interface WPUniversityRecord {
  id: number | string;
  title?: { rendered?: string };
  acf?: Record<string, unknown>;
  name?: string;
  logo?: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
  };
}

function mapWPUniversity(record: WPUniversityRecord): UniversityLogo | null {
  const acf = record.acf ?? {};

  const name =
    readString(record.name) ||
    readString(acf.name) ||
    readString(record.title?.rendered) ||
    `University ${record.id}`;

  if (!name) return null;

  const logo =
    readString(record.logo) ||
    readString(acf.logo) ||
    readString(record._embedded?.["wp:featuredmedia"]?.[0]?.source_url) ||
    "";

  return {
    id: `wp-${record.id}`,
    name: stripHtmlTags(name),
    logo,
  };
}

/**
 * Fetch Success Stories from WordPress
 */
export async function getSuccessStories(): Promise<SuccessStory[]> {
  const data = await wordpressFetchGraceful<WPSuccessStoryRecord[]>(
    "/wp-json/wp/v2/success_story",
    [],
    { per_page: 20, _embed: true },
    ["wordpress", "success_stories"]
  );

  return data
    .map((record) => mapWPSuccessStory(record))
    .filter((story): story is SuccessStory => Boolean(story));
}

/**
 * Fetch Universities from WordPress
 */
export async function getUniversities(): Promise<UniversityLogo[]> {
  const data = await wordpressFetchGraceful<WPUniversityRecord[]>(
    "/wp-json/wp/v2/university",
    [],
    { per_page: 20, _embed: true },
    ["wordpress", "universities"]
  );

  return data
    .map((record) => mapWPUniversity(record))
    .filter((uni): uni is UniversityLogo => Boolean(uni));
}

/**
 * Fetch multilingual site settings from WordPress ACF Options Page
 */
interface WPACFOptionsRecord {
  id: string;
  acf?: {
    hero_title_en?: string;
    hero_title_vi?: string;
    hero_title_zh?: string;
    hero_subtitle_en?: string;
    hero_subtitle_vi?: string;
    hero_subtitle_zh?: string;
    hero_cta_text_en?: string;
    hero_cta_text_vi?: string;
    hero_cta_text_zh?: string;
    about_heading_en?: string;
    about_heading_vi?: string;
    about_heading_zh?: string;
    about_body_en?: string;
    about_body_vi?: string;
    about_body_zh?: string;
    about_quote_en?: string;
    about_quote_vi?: string;
    about_quote_zh?: string;
    lead_form_title_en?: string;
    lead_form_title_vi?: string;
    lead_form_title_zh?: string;
    lead_form_subtitle_en?: string;
    lead_form_subtitle_vi?: string;
    lead_form_subtitle_zh?: string;
    lead_form_submit_text_en?: string;
    lead_form_submit_text_vi?: string;
    lead_form_submit_text_zh?: string;
    [key: string]: unknown;
  };
}

function mapWPSiteSettings(record: WPACFOptionsRecord): SiteSettings {
  const acf = record.acf ?? {};

  return {
    hero: {
      title: {
        en: readString(acf.hero_title_en) || "Conquer China Scholarships with ChinaHack Mentors",
        vi: readString(acf.hero_title_vi) || "Chinh phục học bổng Trung Quốc cùng Mentor ChinaHack",
        zh: readString(acf.hero_title_zh) || "与 ChinaHack 导师一起征服中国奖学金",
      },
      subtitle: {
        en: readString(acf.hero_subtitle_en) || "Personalized roadmap from application to interview.",
        vi: readString(acf.hero_subtitle_vi) || "Lộ trình cá nhân hóa, từ hồ sơ đến phỏng vấn.",
        zh: readString(acf.hero_subtitle_zh) || "从申请到面试的个性化路线图。",
      },
      ctaText: {
        en: readString(acf.hero_cta_text_en) || "Get Free Consultation",
        vi: readString(acf.hero_cta_text_vi) || "Nhận tư vấn miễn phí",
        zh: readString(acf.hero_cta_text_zh) || "获得免费咨询",
      },
    },
    about: {
      heading: {
        en: readString(acf.about_heading_en) || "About Us",
        vi: readString(acf.about_heading_vi) || "Về chúng tôi",
        zh: readString(acf.about_heading_zh) || "关于我们",
      },
      body: {
        en: readString(acf.about_body_en) || "ChinaHack helps students optimize their applications and scholarship strategy.",
        vi: readString(acf.about_body_vi) || "ChinaHack hỗ trợ học viên tối ưu hồ sơ và chiến lược học bổng.",
        zh: readString(acf.about_body_zh) || "ChinaHack 帮助学生优化申请和奖学金策略。",
      },
      highlightQuote: {
        en: readString(acf.about_quote_en) || "Right roadmap, broader scholarship opportunities.",
        vi: readString(acf.about_quote_vi) || "Đúng lộ trình đúng, cơ hội học bổng mở rộng hơn.",
        zh: readString(acf.about_quote_zh) || "正确的路线图，更广泛的奖学金机会。",
      },
    },
    leadForm: {
      title: {
        en: readString(acf.lead_form_title_en) || "Apply for Profile Evaluation",
        vi: readString(acf.lead_form_title_vi) || "Đăng ký đánh giá hồ sơ",
        zh: readString(acf.lead_form_title_zh) || "申请档案评估",
      },
      subtitle: {
        en: readString(acf.lead_form_subtitle_en) || "Get personalized roadmap in 24h",
        vi: readString(acf.lead_form_subtitle_vi) || "Nhận lộ trình cá nhân hóa trong 24h",
        zh: readString(acf.lead_form_subtitle_zh) || "在 24 小时内获得个性化路线图",
      },
      submitText: {
        en: readString(acf.lead_form_submit_text_en) || "Get Free Profile Evaluation",
        vi: readString(acf.lead_form_submit_text_vi) || "Nhận đánh giá hồ sơ miễn phí",
        zh: readString(acf.lead_form_submit_text_zh) || "获得免费档案评估",
      },
    },
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  // Fetch from /wp-json/wp/v2/site_settings?per_page=1 (get first post)
  const data = await wordpressFetchGraceful<WPACFOptionsRecord[]>(
    "/wp-json/wp/v2/site_settings",
    [{}] as WPACFOptionsRecord[],
    { per_page: 1 },
    ["wordpress", "site-settings"]
  );

  // Get the first settings post, or fallback
  const settingsPost = data?.[0] ?? ({} as WPACFOptionsRecord);
  return mapWPSiteSettings(settingsPost);
}

// Leads are a non-public post type (submitted via the lead form); reads require Basic Auth
export async function getLeadsPaginated(
  page: number = 1,
  perPage: number = 20
): Promise<WordPressResponse<Lead[]>> {
  return wordpressFetchAuthenticatedPaginatedGraceful<Lead>(
    "/wp-json/wp/v2/leads",
    { page, per_page: perPage, orderby: "date", order: "desc" },
    ["wordpress", "leads"]
  );
}

export async function getLeadById(id: number): Promise<Lead> {
  return wordpressFetchAuthenticated<Lead>(`/wp-json/wp/v2/leads/${id}`, undefined, [
    "wordpress",
    "leads",
    `lead-${id}`,
  ]);
}

export { WordPressAPIError };
