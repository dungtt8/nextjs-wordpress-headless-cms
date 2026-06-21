# Homepage Content Migration to WordPress

## Executive Summary
Currently, the homepage uses **~95% hardcoded/fallback content** from `lib/home/content.ts`. Only **mentors** are partially managed via WordPress. This document outlines a complete migration strategy to move all homepage sections to WordPress management using custom post types and ACF fields.

---

## Current State

### What's Currently Managed via WordPress
- **Mentors**: Partially fetched from `/wp-json/wp/v2/mentor` or `/wp-json/wp/v2/mentors` custom post type
  - Already has mapping logic in `mapWPMentor()` to extract ACF fields
  - Falls back to hardcoded mentors if endpoint unavailable

### What's 100% Hardcoded
- Hero section (title, subtitle, CTA, image)
- About section (heading, body, quote, image)
- Why Choose section (4 value propositions with icons)
- Process section (6 process steps)
- Services section (3 pricing tiers)
- Stats section (4 KPI metrics)
- Universities section (4 logos)
- Success Stories section (2 stories)
- Blog tab configuration
- Community channels (Facebook, TikTok, YouTube)
- Lead form labels/text

---

## Section-by-Section Breakdown

### 1. HERO Section
**Current Status**: 100% Hardcoded
**File**: `lib/home/content.ts` (lines 1-15)
**Component**: `components/home/home-hero.tsx`

#### Currently Hardcoded Data
```
- Title: "Chinh phục học bổng Trung Quốc cùng Mentor ChinaHack"
- Subtitle: "Lộ trình cá nhân hóa, từ hồ sơ đến phỏng vấn."
- CTA Text: "Nhận tư vấn miễn phí"
- CTA Href: "#lead-form"
- Hero Image: "/images/mentor-hero.webp" (640x860)
```

#### WordPress Solution
**Custom Post Type**: `hero` (single instance)
**ACF Fields**:
- `hero_title` (Text)
- `hero_subtitle` (Text)
- `hero_cta_text` (Text)
- `hero_cta_href` (Text) - default "#lead-form"
- `hero_image` (Image) - featured image
- `hero_image_width` (Number) - default 640
- `hero_image_height` (Number) - default 860

**Benefits**:
- Easily update hero messaging without code
- Upload hero image directly from WordPress
- Manage CTA target dynamically

**Priority**: ⭐⭐⭐⭐ ESSENTIAL
- Hero is the first impression; needs frequent updates
- Marketing team needs direct control

**API Endpoint**: `GET /wp-json/wp/v2/hero` → returns first published hero

---

### 2. ABOUT Section
**Current Status**: 100% Hardcoded
**File**: `lib/home/content.ts` (lines 16-24)
**Component**: `components/home/home-about.tsx`

#### Currently Hardcoded Data
```
- Heading: "Về chúng tôi"
- Body: "ChinaHack hỗ trợ học viên tối ưu hồ sơ..."
- Highlight Quote: "Đúng lộ trình đúng, cơ hội học bổng mở rộng hơn."
- Image: "/logo.svg" (placeholder)
- Image Caption: "Có thể thay bằng ảnh đội ngũ..."
```

#### WordPress Solution
**Custom Post Type**: `about` (single instance)
**ACF Fields**:
- `about_heading` (Text)
- `about_body` (Textarea/WYSIWYG)
- `about_quote` (Textarea)
- `about_image` (Image)
- `about_image_caption` (Text)

**Benefits**:
- Update company story/messaging without redeploy
- Marketing can change featured image quarterly
- Enable multilingual about sections (via WPML/Polylang)

**Priority**: ⭐⭐⭐ HIGH
- Often updated during rebranding or strategic shifts
- Image rotation for freshness

**API Endpoint**: `GET /wp-json/wp/v2/about` → returns first published about

---

### 3. WHY CHOOSE Section
**Current Status**: 100% Hardcoded (4 items)
**File**: `lib/home/content.ts` (lines 25-40)
**Component**: `components/home/home-why-choose.tsx`

#### Currently Hardcoded Data
```
4 Value Propositions:
1. "Mentor thực chiến" + "Kinh nghiệm từ hồ sơ thật" + icon: book
2. "Lộ trình rõ ràng" + "Bám sát mốc thời gian" + icon: target
3. "Tài nguyên chất lượng" + "Mẫu bài và checklist" + icon: medal
4. "Cộng đồng hỗ trợ" + "Đồng hành xuyên suốt" + icon: network
```

#### WordPress Solution
**Custom Post Type**: `why_choose_item` (repeatable/multiple)
**Taxonomy**: `why_choose_category` (optional grouping)
**ACF Fields per Item**:
- `title` (Text)
- `description` (Text)
- `icon` (Select: book|target|medal|network)
- `display_order` (Number)
- `featured_image` (Image) - optional, for future expansion

**Benefits**:
- Add/remove value propositions without code
- Reorder items via drag-and-drop in WordPress
- Prepare for future image-based variant

**Priority**: ⭐⭐⭐⭐ ESSENTIAL
- Value propositions change with product updates
- Easy A/B testing of messaging

**API Endpoint**: `GET /wp-json/wp/v2/why_choose_item?per_page=100` → sorted by `display_order`

---

### 4. PROCESS Section
**Current Status**: 100% Hardcoded (6 steps)
**File**: `lib/home/content.ts` (lines 137-153)
**Component**: `components/home/home-process.tsx`

#### Currently Hardcoded Data
```
6 Process Steps:
1. "Nhận hồ sơ" + "Thu thập thông tin đầu vào..."
2. "Đánh giá" + "Phân tích profile, GPA..."
3. "Lập lộ trình" + "Xây dựng các mốc hạn..."
4. "Hoàn thiện hồ sơ" + "Essay, CV..."
5. "Nộp đơn" + "Canh mốc submit..."
6. "Phỏng vấn" + "Luyện tập và support..."
```

#### WordPress Solution
**Custom Post Type**: `process_step` (repeatable)
**Taxonomy**: `process_phase` (for grouping/filtering)
**ACF Fields per Step**:
- `step_number` (Number) - for ordering
- `title` (Text)
- `description` (Textarea)
- `icon_name` (Text) - for future icon management
- `display_order` (Number)
- `step_image` (Image) - optional, for visual variant

**Benefits**:
- Update process flow as business evolves
- Add/remove steps without code change
- Enable rich descriptions with WYSIWYG

**Priority**: ⭐⭐⭐⭐ ESSENTIAL
- Process changes as services evolve
- Marketing needs flexibility to test variants

**API Endpoint**: `GET /wp-json/wp/v2/process_step?per_page=100&orderby=display_order&order=asc`

---

### 5. SERVICES Section (Pricing Tiers)
**Current Status**: 100% Hardcoded (3 plans)
**File**: `lib/home/content.ts` (lines 154-185)
**Component**: `components/home/home-services.tsx`

#### Currently Hardcoded Data
```
3 Service Plans:
- Basic: features=[Phân tích profile, Gợi ý học bổng, 1 buổi tư vấn]
- Standard (FEATURED): features=[Essay review, Checklist nộp đơn, 2 buổi coaching]
- Premium: features=[1-1 mentor, Phỏng vấn thử, Theo dõi sau nộp]

Each includes:
- name, description, audience, supportLabel, supportNote
- features (array), ctaText, ctaHref
- highlightLabel, isFeatured, premiumNote (conditionals)
```

#### WordPress Solution
**Custom Post Type**: `service_plan` (repeatable)
**ACF Fields per Plan**:
- `plan_name` (Text)
- `plan_order` (Number)
- `is_featured` (True/False)
- `description` (Textarea)
- `audience` (Textarea)
- `support_label` (Text)
- `support_note` (Textarea)
- `features` (Repeater):
  - `feature_text` (Text)
- `cta_text` (Text)
- `cta_href` (Text) - default "#lead-form"
- `highlight_label` (Text) - optional, e.g., "Phổ biến nhất"
- `premium_note` (Textarea) - optional

**Benefits**:
- Change pricing/features without deployment
- A/B test pricing messaging
- Add/remove service tiers dynamically
- Enable featured tier highlighting

**Priority**: ⭐⭐⭐⭐⭐ CRITICAL
- Pricing changes require zero-downtime updates
- Business team needs direct access
- Frequent A/B testing needs

**API Endpoint**: `GET /wp-json/wp/v2/service_plan?per_page=100&orderby=plan_order&order=asc`

---

### 6. STATS Section
**Current Status**: 100% Hardcoded (4 metrics)
**File**: `lib/home/content.ts` (lines 186-191)
**Component**: `components/home/home-stats.tsx`

#### Currently Hardcoded Data
```
4 KPI Metrics:
1. "Học viên" | value: 120 | suffix: "+"
2. "Học bổng" | value: 85 | suffix: "%"
3. "Đối tác" | value: 30 | suffix: "+"
4. "Năm kinh nghiệm" | value: 6 | suffix: "+"
```

#### WordPress Solution
**Custom Post Type**: `stat` (repeatable)
**ACF Fields per Stat**:
- `stat_label` (Text)
- `stat_value` (Number)
- `stat_suffix` (Text) - default "+", "%", etc.
- `display_order` (Number)

**Benefits**:
- Update KPIs without code deployment
- Easy quarterly updates
- Automated animation triggers on content load

**Priority**: ⭐⭐⭐ HIGH
- KPIs change regularly (quarterly/annually)
- Easy social proof management

**API Endpoint**: `GET /wp-json/wp/v2/stat?per_page=100&orderby=display_order&order=asc`

---

### 7. MENTORS Section
**Current Status**: ✅ PARTIALLY MANAGED (via WordPress)
**File**: `lib/wordpress.ts` (lines 50, 179-211, 362-369)
**Endpoints**: `/wp-json/wp/v2/mentor` or `/wp-json/wp/v2/mentors`
**Component**: `components/home/home-mentors.tsx`

#### Currently Managed Data
```
Fetches from WordPress, mapping:
- title → name
- acf.role → role
- acf.headline → headline
- acf.shortBio / excerpt → shortBio
- acf.fullBio / content → fullBio
- acf.focusAreas → focusAreas (string array)
- acf.achievements → achievements (string array)
- acf.quote → quote
- acf.avatar / featured image → avatar
- acf.profileLabel → profileLabel
```

#### What's Good
- ✅ Already has API integration
- ✅ ACF field mapping logic in place
- ✅ Fallback to hardcoded mentors works
- ✅ Handles missing endpoints gracefully

#### What Needs Improvement
- **Fallback mentors still hardcoded**: If endpoint unavailable, uses hardcoded list (lines 27-107 in content.ts)
- **Featured image handling**: Could be more robust for avatar fallback
- **Multilingual mentor profiles**: Not currently supported
- **Mentor categories/tags**: Could filter by expertise area (tech, business, etc.)

#### Enhanced WordPress Solution
**Custom Post Type**: `mentor` (already exists, extend it)
**ACF Fields** (enhance existing):
- `mentor_role` (Text)
- `mentor_headline` (Text)
- `mentor_short_bio` (Textarea)
- `mentor_full_bio` (WYSIWYG)
- `mentor_focus_areas` (Repeater or Multiselect):
  - `area_name` (Text)
- `mentor_achievements` (Repeater):
  - `achievement_text` (Text)
- `mentor_quote` (Textarea)
- `mentor_profile_label` (Text) - default "Our Expert"
- `mentor_display_order` (Number)
- `mentor_is_featured` (True/False)

**Benefits**:
- ✅ Already working, just needs enhancement
- Easy to add new mentors without code
- Profile image via featured image
- Sort by `mentor_display_order` for display priority

**Priority**: ⭐⭐⭐⭐ ESSENTIAL (Enhancement Phase 2)
- Mentors frequently added/updated
- Should be fully managed in WordPress

**API Endpoint**: Already working at `GET /wp-json/wp/v2/mentor?per_page=20&_embed=true`

---

### 8. UNIVERSITIES Section
**Current Status**: 100% Hardcoded (4 logos)
**File**: `lib/home/content.ts` (lines 192-197)
**Component**: `components/home/home-universities-marquee.tsx`

#### Currently Hardcoded Data
```
4 University Logos (marquee):
1. Tsinghua | logo: /images/university-1.webp
2. Peking University | logo: /images/university-2.webp
3. Fudan | logo: /images/university-3.webp
4. SJTU | logo: /images/university-4.webp
```

#### WordPress Solution
**Custom Post Type**: `university` (repeatable)
**Taxonomy**: `university_region` (China, etc.) - optional
**ACF Fields per University**:
- `university_name` (Text)
- `university_logo` (Image)
- `display_order` (Number)
- `is_active` (True/False) - toggle on/off without deleting
- `region` (Taxonomy) - for filtering

**Benefits**:
- Add/remove universities as partnerships expand
- Easy logo upload without file management
- Toggle visibility without deleting data
- Scale to 50+ universities as needed

**Priority**: ⭐⭐⭐ HIGH
- Partnerships expand frequently
- Logos need regular updates

**API Endpoint**: `GET /wp-json/wp/v2/university?per_page=100&orderby=display_order&order=asc`

---

### 9. SUCCESS STORIES Section
**Current Status**: 100% Hardcoded (2 stories)
**File**: `lib/home/content.ts` (lines 198-211)
**Component**: `components/home/home-success-stories.tsx`

#### Currently Hardcoded Data
```
2 Success Stories:
1. Student: "Minh Anh" | Quote: "Hồ sơ được tối ưu..." | Outcome: "Nhận học bổng 80%"
2. Student: "Quang Huy" | Quote: "Phỏng vấn giảm cảm giác..." | Outcome: "Trúng tuyển chương trình thạc sĩ"

Each includes:
- studentName, quote, outcome, avatar (image path)
```

#### WordPress Solution
**Custom Post Type**: `success_story` (repeatable)
**Taxonomy**: `outcome_category` (Scholarship, Admission, etc.)
**ACF Fields per Story**:
- `student_name` (Text)
- `student_quote` (Textarea)
- `outcome` (Textarea)
- `student_avatar` (Image)
- `featured_image` (Image) - optional background
- `display_order` (Number)
- `outcome_type` (Taxonomy) - Scholarship, Admission, etc.
- `achievement_rate` (Percentage) - optional
- `university_name` (Text) - optional

**Benefits**:
- Easy to add new success stories as they come in
- Showcase real student achievements
- Filter by outcome type (Scholarship vs. Admission)
- Enable social proof rotation

**Priority**: ⭐⭐⭐⭐ ESSENTIAL
- Real testimonials are powerful conversion tool
- Updated frequently as students succeed
- Should not require code changes

**API Endpoint**: `GET /wp-json/wp/v2/success_story?per_page=100&orderby=display_order&order=desc`

---

### 10. BLOG TABS Configuration
**Current Status**: 100% Hardcoded (3 tabs)
**File**: `lib/home/content.ts` (lines 212-214)
**Component**: `components/home/home-blog-tabs.tsx`

#### Currently Hardcoded Data
```
3 Blog Tabs:
1. Tab: "Tất cả" | slug: "all"
2. Tab: "Học bổng" | slug: "hoc-bong"
3. Tab: "Hướng dẫn" | slug: "huong-dan"
```

#### Current Implementation
- Tabs filter blog posts by keyword matching in title/excerpt
- No WordPress taxonomy actually manages this

#### WordPress Solution
**WordPress Feature**: Use existing post categories/tags
**Option A - Via Taxonomy** (Recommended):
- Define `post_category` or `post_tag` in WordPress
- Query: `GET /wp-json/wp/v2/posts?categories=CATEGORY_ID` or `?tags=TAG_ID`
- Dynamically build tabs from WordPress categories

**Option B - ACF Settings**:
- Create `blog_tab` custom post type
- ACF Fields:
  - `tab_label` (Text)
  - `tab_slug` (Text) - matches category slug
  - `tab_description` (Text)
  - `display_order` (Number)

**Benefits**:
- Leverage existing WordPress category system
- Add/remove blog sections without code
- Align with editorial workflow

**Priority**: ⭐⭐ MEDIUM
- Currently works via keyword filtering
- Nice-to-have for full WordPress integration

**API Endpoint**: `GET /wp-json/wp/v2/categories` or custom `/wp-json/wp/v2/blog_tab`

---

### 11. COMMUNITY CHANNELS Section
**Current Status**: 100% Hardcoded (3 channels)
**File**: `lib/home/content.ts` (lines 215-231)
**Component**: `components/home/home-community.tsx`

#### Currently Hardcoded Data
```
3 Community Channels:
1. Facebook | "Cập nhật sàn học bổng..." | banner: /images/community-facebook.webp
2. TikTok | "Video ngắn về quy trình..." | banner: /images/community-tiktok.webp
3. YouTube | "Hướng dẫn chi tiết..." | banner: /images/community-youtube.webp

Each includes:
- name, description, href (link), bannerImage
```

#### WordPress Solution
**Custom Post Type**: `community_channel` (repeatable)
**ACF Fields per Channel**:
- `channel_name` (Text) - Facebook, TikTok, YouTube, etc.
- `channel_description` (Textarea)
- `channel_url` (Text)
- `channel_logo` (Image) - auto-inferred or uploaded
- `channel_banner` (Image) - background for card
- `channel_icon` (Select) - facebook|tiktok|youtube|instagram
- `display_order` (Number)
- `is_active` (True/False)

**Benefits**:
- Add new social channels (Instagram, LinkedIn, Discord) without code
- Update social URLs without deployment
- Easy banner image management
- Scale community presence dynamically

**Priority**: ⭐⭐⭐ HIGH
- Community channels expand as audience grows
- Banners need periodic updates for campaigns
- Easy way to test new channels

**API Endpoint**: `GET /wp-json/wp/v2/community_channel?per_page=100&orderby=display_order&order=asc`

---

### 12. LEAD FORM Content
**Current Status**: 100% Hardcoded (form labels)
**File**: `lib/home/content.ts` (lines 232-236)
**Component**: `components/home/home-lead-form.tsx`

#### Currently Hardcoded Data
```
Form Labels & Text:
- title: "Đăng ký đánh giá hồ sơ"
- subtitle: "Nhận lộ trình cá nhân hóa trong 24h"
- submitText: "Nhận đánh giá hồ sơ miễn phí"
- loadingText: "Đang xử lý..."
```

#### WordPress Solution
**Settings/Options Approach** (Best for forms):
- Store in WordPress Options table (wp_options)
- Create settings page in WordPress admin
- Use ACF to create settings page

**Option: ACF Options Page**:
```
ACF Options Page: "Lead Form Settings"
- form_title (Text)
- form_subtitle (Text)
- form_submit_text (Text)
- form_loading_text (Text)
- form_success_message (Text)
- form_error_message (Text)
- redirect_url (Text) - optional
```

**Benefits**:
- Update form messaging without redeploy
- A/B test CTA text
- Change success/error messages dynamically
- Centralize all form messaging

**Priority**: ⭐⭐ MEDIUM
- Form text changes less frequently than content
- Nice-to-have for full flexibility

**API Endpoint**: `GET /wp-json/wp/v2/settings` or custom ACF options endpoint

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
**Goal**: Set up WordPress infrastructure for homepage content

**Tasks**:
1. ✅ Create custom post types:
   - `hero` (single instance)
   - `about` (single instance)
   - `why_choose_item` (repeatable)
   - `process_step` (repeatable)
   - `service_plan` (repeatable)
   - `stat` (repeatable)
   - `university` (repeatable)
   - `success_story` (repeatable)
   - `community_channel` (repeatable)

2. ✅ Create custom taxonomies:
   - `why_choose_category` (optional grouping)
   - `university_region` (optional)
   - `outcome_category` (for success stories)

3. ✅ Create ACF field groups for each post type
   - Document field structure in WordPress
   - Set sensible defaults/fallbacks

4. ✅ Update REST API permissions
   - Enable REST endpoints for all custom post types
   - Set appropriate capabilities for client access

### Phase 2: Hydration (Weeks 3-4)
**Goal**: Migrate hardcoded data to WordPress

**Tasks**:
1. Create WordPress posts for each section
   - Import fallback content from `lib/home/content.ts`
   - Populate ACF fields with existing data

2. Test data in WordPress:
   - Verify REST API returns correct data
   - Test image uploads and featured images

### Phase 3: Next.js Integration (Weeks 5-6)
**Goal**: Connect Next.js to WordPress data

**Tasks**:
1. Create data fetching functions in `lib/wordpress.ts`:
   - `getHeroData()`
   - `getAboutData()`
   - `getWhyChooseItems()`
   - `getProcessSteps()`
   - `getServicePlans()`
   - `getStats()`
   - `getUniversities()`
   - `getSuccessStories()`
   - `getCommunityChannels()`

2. Update `lib/home/content.ts`:
   - Keep fallback data but mark as "Fallback"
   - Functions merge WordPress + fallback

3. Update page `/app/[locale]/page.tsx`:
   - Fetch all homepage sections in parallel
   - Pass WordPress data to components
   - Components remain unchanged

4. Update `lib/home/normalize.ts`:
   - Add normalization functions for each section
   - Handle missing/invalid data gracefully

### Phase 4: Testing & Launch (Weeks 7-8)
**Goal**: Ensure reliability and zero-downtime migration

**Tasks**:
1. Test fallback behavior:
   - What happens if WordPress is down?
   - What if a section is missing?
   - Performance impact?

2. Performance tuning:
   - Benchmark API calls vs. static fallback
   - Implement caching strategy
   - Test ISR (Incremental Static Regeneration)

3. UAT with WordPress admins:
   - Marketing team updates content
   - Verify changes reflect on homepage
   - Test multilingual scenarios

4. Gradual rollout:
   - Deploy Phase 1-2 infrastructure
   - Run both (hardcoded + WordPress) in parallel
   - Switch to WordPress data with fallback
   - Monitor and adjust

---

## Data Fetching Strategy

### Current Pattern (WordPress Mentors)
```typescript
// lib/wordpress.ts
export async function getMentorProfiles(): Promise<MentorItem[]> {
  for (const endpoint of MENTOR_ENDPOINTS) {
    const mentors = await getMentorsFromEndpoint(endpoint);
    if (mentors.length > 0) return mentors;
  }
  return []; // Falls back to empty if no endpoint works
}

// app/[locale]/page.tsx
const [mentors] = await Promise.all([getMentorProfiles()]);
const content = {
  ...fallbackHomeContent,
  mentors: mentors.length > 0 ? mentors : fallbackHomeContent.mentors,
};
```

### Proposed Pattern for All Sections
```typescript
// lib/wordpress.ts
export async function getHeroData(): Promise<HeroData | null> {
  try {
    const [hero] = await wordpressFetchGraceful<HeroData[]>(
      "/wp-json/wp/v2/hero",
      [],
      { per_page: 1 },
      ["wordpress", "hero"]
    );
    return hero ?? null;
  } catch {
    return null; // Graceful fallback
  }
}

// app/[locale]/page.tsx
export default async function HomePage() {
  const [hero, about, whyChoose, services, ...rest] = await Promise.all([
    getHeroData(),
    getAboutData(),
    getWhyChooseItems(),
    getServicePlans(),
    // ... fetch all sections
  ]);

  const content = normalizeHomeContent({
    hero: hero ?? undefined,
    about: about ?? undefined,
    whyChoose: whyChoose.length > 0 ? whyChoose : undefined,
    // ... all sections
  });

  return (
    <main>
      <HomeHero data={content.hero} />
      <HomeAbout data={content.about} />
      {/* ... all sections unchanged */}
    </main>
  );
}
```

### Caching Strategy
```typescript
// All functions use cache tags for ISR
export async function getHeroData(): Promise<HeroData | null> {
  return wordpressFetchGraceful(
    "/wp-json/wp/v2/hero",
    null,
    { per_page: 1 },
    ["wordpress", "hero", "homepage"] // ← cache tags for revalidateTag()
  );
}

// Webhook invalidates cache when content changes
// api/revalidate → revalidatePath("/", "layout") + revalidateTag("homepage")
```

---

## Multilingual Support

### Current State
- Pages use i18n for translations (next-intl)
- WordPress content is single-language (Vietnamese)

### Future Multilingual Strategy
**Option A: WordPress WPML/Polylang**
- Each content piece has translations
- `/wp-json/wp/v2/hero?lang=en` fetches English version
- WordPress handles translation management

**Option B: Fallback to i18n
- WordPress Vietnamese content only
- Use next-intl for English/Chinese translations
- Hybrid approach until full translation budget available

**Recommended**: Implement Option B initially, migrate to Option A when ready

---

## Risk Assessment

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| WordPress downtime during fetch | Medium | Graceful fallback to hardcoded content; cache aggressively |
| Slow API responses | Medium | Implement Next.js ISR; cache for 1 hour; pre-generate at build |
| Wrong data structure from WordPress | High | Strict TypeScript types; normalize at fetch layer; test extensively |
| Concurrent updates creating conflicts | Low | WordPress versioning handles this; use draft → publish workflow |
| Marketing team deletes critical content | Medium | Backups; version history; never delete, just unpublish |
| API rate limiting | Low | Cache heavily; batch requests; self-hosted WordPress no limits |

---

## Success Metrics

### Technical
- ✅ Zero fallback content on normal requests (>99% uptime)
- ✅ Homepage build time < 5 seconds
- ✅ ISR revalidation < 2 seconds
- ✅ No TypeScript errors from WordPress data

### Business
- ✅ Marketing team can update content without developer
- ✅ 50% faster content updates (hours vs. days)
- ✅ A/B testing homepage sections via WordPress
- ✅ 0 downtime deployments for content changes

---

## Summary Table

| Section | Status | Priority | Est. Effort | WordPress Ready |
|---------|--------|----------|-------------|-----------------|
| Hero | ❌ Hardcoded | ⭐⭐⭐⭐ | 2 hrs | No, needs custom post type |
| About | ❌ Hardcoded | ⭐⭐⭐ | 2 hrs | No |
| Why Choose | ❌ Hardcoded | ⭐⭐⭐⭐ | 3 hrs | No |
| Services | ❌ Hardcoded | ⭐⭐⭐⭐⭐ | 4 hrs | No |
| Process | ❌ Hardcoded | ⭐⭐⭐⭐ | 3 hrs | No |
| Stats | ❌ Hardcoded | ⭐⭐⭐ | 2 hrs | No |
| Mentors | ✅ Partial | ⭐⭐⭐⭐ | 2 hrs (enhance) | Mostly ready |
| Universities | ❌ Hardcoded | ⭐⭐⭐ | 2 hrs | No |
| Success Stories | ❌ Hardcoded | ⭐⭐⭐⭐ | 3 hrs | No |
| Blog Tabs | ⚠️ Keyword Search | ⭐⭐ | 1 hr | Partial (use categories) |
| Community | ❌ Hardcoded | ⭐⭐⭐ | 2 hrs | No |
| Lead Form | ❌ Hardcoded | ⭐⭐ | 1 hr | Optional (ACF options) |

**Total WordPress Setup Effort**: ~3-5 days of development
**Total Data Migration**: ~2-3 days
**Total Testing & Launch**: ~3-4 days

---

## Recommended Next Steps

1. **Approval**: Confirm this migration aligns with product roadmap
2. **WordPress Setup**: Brief session with WordPress admin to create post types & ACF fields
3. **Phase 1 Planning**: Create detailed task board for Phase 1 (Foundation)
4. **Timeline**: Allocate 2-3 weeks for full rollout if dedicated resource available

