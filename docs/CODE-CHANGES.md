# Code Changes Required

Dưới đây là các code snippet cần thêm/thay đổi để integrate Success Stories & Universities từ WordPress.

---

## FILE 1: `lib/wordpress.ts`

### Bước 1: Thêm hàm fetch Success Stories & Universities

**Thêm vào cuối file (trước dòng `export { WordPressAPIError };`)**

```typescript
// Success Stories from WordPress
export async function getSuccessStories(): Promise<any[]> {
  const data = await wordpressFetchGraceful<any[]>(
    "/wp-json/wp/v2/success_stories",
    [],
    { per_page: 10, _embed: true },
    ["wordpress", "success_stories"]
  );
  return data;
}

// Universities from WordPress
export async function getUniversities(): Promise<any[]> {
  const data = await wordpressFetchGraceful<any[]>(
    "/wp-json/wp/v2/universities",
    [],
    { per_page: 20, _embed: true },
    ["wordpress", "universities"]
  );
  return data;
}
```

---

## FILE 2: `app/[locale]/page.tsx`

### Bước 1: Import thêm hàm mới

**Thay đoạn này:**
```typescript
import { getMentorProfiles, getRecentPosts } from '@/lib/wordpress';
```

**Bằng:**
```typescript
import { 
  getMentorProfiles, 
  getRecentPosts,
  getSuccessStories,
  getUniversities 
} from '@/lib/wordpress';
```

### Bước 2: Update hàm HomePage

**Thay toàn bộ hàm `export default async function HomePage()` từ:**

```typescript
export default async function HomePage() {
  // Fetch data from WordPress in parallel
  const [mentors, posts] = await Promise.all([
    getMentorProfiles(),
    getRecentPosts({ per_page: 6 }),
  ]);

  // Use WordPress data if available, otherwise fall back to default content
  const content = {
    ...fallbackHomeContent,
    mentors: mentors.length > 0 ? mentors : fallbackHomeContent.mentors,
  };
```

**Bằng:**

```typescript
export default async function HomePage() {
  // Fetch all data from WordPress in parallel
  const [mentors, posts, successStoriesData, universitiesData] = await Promise.all([
    getMentorProfiles(),
    getRecentPosts({ per_page: 6 }),
    getSuccessStories(),
    getUniversities(),
  ]);

  // Transform WordPress Success Stories to component format
  const successStories = successStoriesData.map((story: any) => ({
    id: story.id.toString(),
    mentee: story.acf?.mentee_name || story.title?.rendered || "Anonymous",
    company: story.acf?.mentee_company || "",
    story: story.acf?.testimonial || story.excerpt?.rendered || "",
    outcome: story.acf?.outcome || "",
    image: story.acf?.mentee_image || 
           story._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
           "",
  }));

  // Transform WordPress Universities to component format
  const universities = universitiesData.map((uni: any) => ({
    id: uni.id.toString(),
    name: uni.acf?.university_name || uni.title?.rendered || "University",
    logo: uni.acf?.logo || 
          uni._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
          "",
    link: uni.acf?.university_link || "",
  }));

  // Use WordPress data if available, otherwise fall back to default content
  const content = {
    ...fallbackHomeContent,
    mentors: mentors.length > 0 ? mentors : fallbackHomeContent.mentors,
    successStories: successStories.length > 0 ? successStories : fallbackHomeContent.successStories,
    universitiesMarquee: universities.length > 0 ? universities : fallbackHomeContent.universitiesMarquee,
  };
```

---

## Tóm Tắt Các Bước

### Step 1: WordPress Setup (1-2 ngày)
```
✅ Cài ACF plugin
✅ Register success_story custom post type
✅ Register university custom post type
✅ Create ACF field groups (use acf-export.php)
✅ Create sample content (3 success stories, 4-5 universities)
✅ Test API endpoints
```

### Step 2: Next.js Code Updates (30 phút)
```
✅ Add 2 functions to lib/wordpress.ts
✅ Update imports in app/[locale]/page.tsx
✅ Add data fetching + transformation
✅ Test locally
```

### Step 3: Testing & Deployment (1 ngày)
```
✅ Test all 3 locales
✅ Check data revalidation on webhook
✅ Deploy to production
✅ Monitor logs
```

---

## Verification Checklist

Sau khi code change, chạy commands này:

```bash
# 1. Check if code compiles
pnpm build

# 2. Run local dev server
pnpm dev

# 3. Check if data loads
curl http://localhost:3000/en 2>&1 | grep -o "Trần Minh Anh\|Tsinghua" | head -5

# 4. Check all locales
curl http://localhost:3000/vi 2>&1 | head -50
curl http://localhost:3000/zh 2>&1 | head -50

# 5. Check WordPress API directly
curl https://your-wp.com/wp-json/wp/v2/success_stories?per_page=1
curl https://your-wp.com/wp-json/wp/v2/universities?per_page=1
```

---

## Expected Output

Sau khi everything works:

```
Homepage hiển thị:
✅ Mentors: Từ WordPress
✅ Blog Posts: Từ WordPress
✅ Success Stories: Từ WordPress (NEW)
✅ Universities: Từ WordPress (NEW)

Dev Console:
[HomePage] Fetched X mentors and Y posts and Z success stories and W universities
```

---

## Rollback Plan

Nếu có issue, rollback dễ dàng:

```bash
# Revert page.tsx
git checkout app/[locale]/page.tsx

# Revert wordpress.ts
git checkout lib/wordpress.ts

# Restart dev server
pnpm dev
```

Fallback content sẽ tự động dùng hardcoded data như trước.

---

## Performance Notes

```
- Success Stories & Universities từ WP sẽ cache 1 giờ
- Khi publish trên WP → webhook trigger revalidate
- Homepage pre-render tại build time
- Static files served từ CDN after first request
```

---

## Files to Review

1. ✅ docs/WORDPRESS-SETUP-GUIDE.md - Hướng dẫn WordPress
2. ✅ docs/NEXTJS-INTEGRATION-GUIDE.md - Hướng dẫn Next.js
3. ✅ wordpress/acf-export.php - ACF field definitions
4. 📝 CODE CHANGES - Trên file này

Bây giờ ready to implement! 🚀
