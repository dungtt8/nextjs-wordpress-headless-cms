# Next.js Integration Guide - Fetch WordPress Data

Hướng dẫn lấy Success Stories, Universities từ WordPress và hiển thị trên Next.js homepage.

---

## Hiện Tại vs. Sau

```
TRƯỚC:
- Success Stories: Hardcoded
- Universities: Hardcoded
- Mentors: Lấy từ WP ✅
- Blog Posts: Lấy từ WP ✅

SAU:
- Success Stories: Lấy từ WP
- Universities: Lấy từ WP
- Mentors: Lấy từ WP ✅
- Blog Posts: Lấy từ WP ✅
```

---

## BƯỚC 1: Thêm WordPress Functions

File: `lib/wordpress.ts`

Thêm 2 hàm mới vào cuối file:

```typescript
// Get Success Stories from WordPress
export async function getSuccessStories(): Promise<Post[]> {
  return wordpressFetchGraceful<Post[]>(
    "/wp-json/wp/v2/success_stories",
    [],
    { per_page: 10, _embed: true },
    ["wordpress", "success_stories"]
  );
}

// Get Universities from WordPress
export async function getUniversities(): Promise<Post[]> {
  return wordpressFetchGraceful<Post[]>(
    "/wp-json/wp/v2/universities",
    [],
    { per_page: 20, _embed: true },
    ["wordpress", "universities"]
  );
}
```

---

## BƯỚC 2: Update Homepage Data Fetching

File: `app/[locale]/page.tsx`

Thay đoạn này:

```typescript
// TRƯỚC
export default async function HomePage() {
  const [mentors, posts] = await Promise.all([
    getMentorProfiles(),
    getRecentPosts({ per_page: 6 }),
  ]);

  const content = {
    ...fallbackHomeContent,
    mentors: mentors.length > 0 ? mentors : fallbackHomeContent.mentors,
  };
```

Bằng:

```typescript
// SAU
export default async function HomePage() {
  const [mentors, posts, successStories, universities] = await Promise.all([
    getMentorProfiles(),
    getRecentPosts({ per_page: 6 }),
    getSuccessStories(),           // ← Thêm
    getUniversities(),              // ← Thêm
  ]);

  // Transform WordPress data to component format
  const wpSuccessStories = successStories.map(story => ({
    id: story.id.toString(),
    mentee: story.acf?.mentee_name || story.title.rendered,
    company: story.acf?.mentee_company || "",
    story: story.acf?.testimonial || story.excerpt.rendered,
    outcome: story.acf?.outcome || "",
    image: story.acf?.mentee_image?.url || story._embedded?.['wp:featuredmedia']?.[0]?.source_url || "",
  }));

  const wpUniversities = universities.map(uni => ({
    id: uni.id.toString(),
    name: uni.acf?.university_name || uni.title.rendered,
    logo: uni.acf?.logo || uni._embedded?.['wp:featuredmedia']?.[0]?.source_url || "",
    link: uni.acf?.university_link || "",
  }));

  const content = {
    ...fallbackHomeContent,
    mentors: mentors.length > 0 ? mentors : fallbackHomeContent.mentors,
    successStories: wpSuccessStories.length > 0 ? wpSuccessStories : fallbackHomeContent.successStories,
    universitiesMarquee: wpUniversities.length > 0 ? wpUniversities : fallbackHomeContent.universitiesMarquee,
  };
```

---

## BƯỚC 3: Update Component Props

Kiểm tra các component nhận đúng format data:

### 3.1 HomeSuccessStories Component

File: `components/home/home-success-stories.tsx`

Component này đã hỗ trợ success story objects với:
- `id`
- `mentee` (hoặc `name`)
- `company`
- `story` (hoặc `testimonial`)
- `outcome`
- `image`

✅ Không cần thay đổi gì cả!

### 3.2 Universities Component (Nếu có)

Tìm component hiển thị universities marquee. Nếu component chưa tồn tại, nó sẽ được render từ fallback content. Để kiểm tra, search trong project:

```bash
grep -r "universitiesMarquee\|universities" components/home/
```

---

## BƯỚC 4: Type Definitions (Optional)

Để TypeScript strict mode hạnh phúc, có thể thêm vào `lib/home/types.ts`:

```typescript
export interface SuccessStory {
  id: string;
  mentee: string;
  company: string;
  story: string;
  outcome: string;
  image: string;
}

export interface University {
  id: string;
  name: string;
  logo: string;
  link?: string;
}
```

Rồi update `HomeContent` interface:

```typescript
export interface HomeContent {
  // ... existing fields
  successStories: SuccessStory[];
  universitiesMarquee: University[];
}
```

---

## BƯỚC 5: Test Locally

```bash
# 1. Tắt dev server cũ
Ctrl + C

# 2. Xóa .next cache
rm -rf .next

# 3. Restart dev server
pnpm dev

# 4. Check console logs
curl http://localhost:3000/en 2>&1 | grep -o "Success\|Universit" | head -5
```

---

## BƯỚC 6: Verify Data

Mở browser DevTools → Network:

```
GET /en              (check kích thước, nên có dữ liệu từ WP)
GET /wp-json/wp/v2/success_stories
GET /wp-json/wp/v2/universities
```

---

## Troubleshooting

### ❌ Success Stories không hiển thị
```
1. Check WordPress API:
   curl "https://your-wp.com/wp-json/wp/v2/success_stories"
   
2. Kiểm tra ACF fields:
   - ACF → Field Groups → Success Story Details
   - Confirm "Show in REST" is ON

3. Check Next.js mapping:
   Thêm debug log trong page.tsx:
   console.log('[HomePage] Success Stories:', successStories.length);
```

### ❌ Universities không hiển thị
```
Tương tự như Success Stories:
1. Test API
2. Check ACF fields
3. Kiểm tra data mapping
```

### ❌ 404 errors trên endpoints
```
WordPress Settings → Permalinks → Post name → Save
Rồi refresh API endpoints
```

### ❌ Featured images không load
```
Thêm _embed=true param:
Per_page: 20,
_embed: true  ← Ensure this is set
```

---

## Performance Tips

### Cache Revalidation
```typescript
// Tự động revalidate khi WordPress webhook fires
// File: app/api/revalidate/route.ts (đã có)

// Manual revalidate commands:
revalidateTag("wordpress");
revalidateTag("success_stories");
revalidateTag("universities");
revalidatePath("/", "layout");
```

### Static Generation
```
Homepage được pre-render tại build time:
- Lần đầu: Fetch từ WordPress
- Lần sau: Serve cached HTML
- Khi publish trên WordPress: Webhook trigger revalidate
```

---

## Monitoring

Để track WordPress data fetching:

```typescript
// Thêm vào page.tsx
console.log({
  timestamp: new Date().toISOString(),
  mentors: mentors.length,
  posts: posts.length,
  successStories: successStories.length,
  universities: universities.length,
});
```

---

## Deployment Checklist

- [ ] WordPress setup complete (custom post types + ACF fields)
- [ ] Test API endpoints (curl commands)
- [ ] Created sample content (2-3 per type)
- [ ] Updated lib/wordpress.ts with new functions
- [ ] Updated app/[locale]/page.tsx with data fetching
- [ ] Tested locally (pnpm dev)
- [ ] Checked all 3 locales (/en, /vi, /zh)
- [ ] Verified webhook configuration
- [ ] Deploy to production

---

## Next Phase: Remove Hardcoded Content

Sau khi everything works, có thể xóa/simplify `fallbackHomeContent`:

```typescript
// lib/home/content.ts
// Chỉ giữ lại absolute minimum fallbacks
// Phần còn lại lấy từ WordPress
```

---

## Quick Summary

```typescript
// Add to lib/wordpress.ts
export async function getSuccessStories() { ... }
export async function getUniversities() { ... }

// Update app/[locale]/page.tsx
const [mentors, posts, successStories, universities] = await Promise.all([...])

// Map WordPress data to component format
const wpSuccessStories = successStories.map(story => ({ ... }))
const wpUniversities = universities.map(uni => ({ ... }))

// Pass to components
const content = {
  ...fallbackHomeContent,
  successStories: wpSuccessStories.length > 0 ? wpSuccessStories : fallback,
  universitiesMarquee: wpUniversities.length > 0 ? wpUniversities : fallback,
}
```

Done! 🚀
