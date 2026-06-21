# 📋 Hướng Dẫn Nhanh - Success Stories & Universities từ WordPress

## 🎯 Mục Tiêu
Hiển thị Success Stories, Universities, Mentors, Blog Posts từ WordPress trên homepage.

**Hiện tại:**
- ✅ Mentors - từ WordPress
- ✅ Blog Posts - từ WordPress
- ❌ Success Stories - hardcoded
- ❌ Universities - hardcoded

**Mục tiêu:**
- ✅ Mentors - từ WordPress
- ✅ Blog Posts - từ WordPress
- ✅ Success Stories - từ WordPress
- ✅ Universities - từ WordPress

---

## 📁 Các File Hướng Dẫn

| File | Nội Dung |
|------|---------|
| [WORDPRESS-SETUP-GUIDE.md](WORDPRESS-SETUP-GUIDE.md) | Cách cài đặt WordPress (Custom Post Types + ACF) |
| [NEXTJS-INTEGRATION-GUIDE.md](NEXTJS-INTEGRATION-GUIDE.md) | Cách integrate dữ liệu vào Next.js |
| [CODE-CHANGES.md](CODE-CHANGES.md) | Code cần thêm/sửa trong project |
| [../wordpress/acf-export.php](../wordpress/acf-export.php) | ACF field definitions để import |

---

## ⚡ Bước Thực Hiện

### PHASE 1: WordPress Setup (Day 1-2)

#### 1️⃣ Cài Plugins
```
WordPress Admin → Plugins → Add New
  ✅ Advanced Custom Fields (ACF)
  ✅ Next Revalidate (upload từ /plugin/next-revalidate/)
```

#### 2️⃣ Tạo Custom Post Types
```
Dán code vào: wp-content/themes/your-theme/functions.php
Xem chi tiết: WORDPRESS-SETUP-GUIDE.md → BƯỚC 2
```

#### 3️⃣ Tạo ACF Field Groups
```
WordPress Admin → ACF → Tools → Import
Copy-paste từ: wordpress/acf-export.php
Hoặc làm manual theo: WORDPRESS-SETUP-GUIDE.md → BƯỚC 3
```

#### 4️⃣ Tạo Content Mẫu
```
Success Stories:
  - Trần Minh Anh - Tsinghua University
  - Phạm Hồng Minh - Peking University
  - Lê Văn Hùng - Fudan University

Universities:
  - Tsinghua University
  - Peking University
  - Fudan University
  - Zhejiang University
  - Xiamen University
```

#### 5️⃣ Test API Endpoints
```bash
curl https://your-wp.com/wp-json/wp/v2/success_stories?per_page=1
curl https://your-wp.com/wp-json/wp/v2/universities?per_page=1

Kết quả: ✅ Nên thấy JSON data
```

---

### PHASE 2: Next.js Code Updates (30 minutes)

#### 1️⃣ Add WordPress Functions
```typescript
File: lib/wordpress.ts
→ Thêm vào cuối file (trước export { WordPressAPIError };):

export async function getSuccessStories() { ... }
export async function getUniversities() { ... }

Chi tiết: CODE-CHANGES.md → FILE 1
```

#### 2️⃣ Update Homepage
```typescript
File: app/[locale]/page.tsx
→ Import functions mới
→ Fetch dữ liệu từ WordPress
→ Transform data để phù hợp component format

Chi tiết: CODE-CHANGES.md → FILE 2
```

#### 3️⃣ Test Locally
```bash
pnpm dev

Truy cập:
  ✅ http://localhost:3000/en
  ✅ http://localhost:3000/vi
  ✅ http://localhost:3000/zh

Verify:
  - Success Stories hiển thị từ WordPress
  - Universities hiển thị từ WordPress
```

---

### PHASE 3: Deploy (Day 3)

#### 1️⃣ Final Testing
```bash
pnpm build
pnpm start

Test all routes
```

#### 2️⃣ Deploy to Production
```bash
git add .
git commit -m "chore: enable success stories and universities from wp"
git push origin main
```

#### 3️⃣ Monitor
```
- Check webhook: WordPress Admin → Next Revalidate
- Monitor homepage loads
- Check console for errors
```

---

## 📊 Data Flow Diagram

```
WordPress Admin
    ↓
Create/Update Success Stories & Universities
    ↓
WordPress REST API
    ↓
Next.js App (app/[locale]/page.tsx)
    ↓
Fetch functions (lib/wordpress.ts)
    ↓
Transform data
    ↓
Components (HomeSuccessStories, Universities)
    ↓
Render on homepage
    ↓
Browser (en, vi, zh)
```

---

## 🔧 Cấu Hình WordPress

### Custom Post Types

```
success_story
  - URL: /wp-json/wp/v2/success_stories
  - Fields: mentee_name, mentee_company, testimonial, outcome, mentee_image
  
university
  - URL: /wp-json/wp/v2/universities
  - Fields: university_name, logo, university_link, description
```

### REST API Status

```
Tất cả post types nên show_in_rest: true

Test:
curl https://your-wp.com/wp-json/wp/v2
→ Nên thấy success_stories & universities trong list
```

---

## ✅ Verification Checklist

### WordPress
- [ ] ACF plugin installed & activated
- [ ] Custom post types registered (success_story, university)
- [ ] ACF field groups created
- [ ] Sample content created (3+ success stories, 4+ universities)
- [ ] REST API endpoints working (curl test passed)
- [ ] Webhook configured

### Next.js
- [ ] Functions added to lib/wordpress.ts
- [ ] Imports updated in app/[locale]/page.tsx
- [ ] Data fetching implemented
- [ ] Data transformation correct
- [ ] Local build successful (pnpm build)
- [ ] All 3 locales working

### Production
- [ ] Deployed to production
- [ ] Homepage loads without errors
- [ ] WordPress data displays correctly
- [ ] Fallback content shows if WordPress unavailable
- [ ] Webhook trigger revalidates homepage

---

## 🚨 Troubleshooting

### Success Stories không hiển thị?
```
1. Check WordPress: curl https://wp.com/wp-json/wp/v2/success_stories
2. Check ACF: ACF → Field Groups → "Show in REST" = ON
3. Check Next.js: pnpm dev → console logs
4. Check components: HomeSuccessStories có nhận đúng props?
```

### Universities không hiển thị?
```
Tương tự như Success Stories
```

### API 404 errors?
```
WordPress Settings → Permalinks → "Post name" → Save
Refresh endpoint
```

### Images không load?
```
ACF field: Return Format = URL
Hoặc check ACF field trong REST API response
```

---

## 📞 Quick Help

| Vấn đề | Giải Pháp |
|-------|----------|
| ACF plugin không có | Install từ WordPress Plugins marketplace |
| Custom post type không show | Check functions.php (show_in_rest = true) |
| REST API 404 | WordPress Settings → Permalinks → Save |
| Images không hiển thị | Check ACF return format = URL |
| Data không update | Check webhook configuration |
| Fallback content hiển thị | WordPress API đang offline hoặc chưa có content |

---

## 📈 Performance

```
Caching:
- Success Stories cache: 1 giờ
- Universities cache: 1 giờ
- Revalidate on webhook: tức thì (< 5s)

Static Generation:
- Homepage pre-render tại build time
- Incremental Static Regeneration (ISR) on webhook
```

---

## 🎓 Learning Resources

- [ACF Documentation](https://www.advancedcustomfields.com/resources/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating)

---

## 📝 Notes

- Tất cả fallback content sẽ tự động backup
- Nếu WordPress offline, homepage vẫn load từ fallback
- Webhooks tự động revalidate homepage khi thay đổi content
- Có thể rollback bất kỳ lúc nào bằng git

---

**Ready to implement? Start with WORDPRESS-SETUP-GUIDE.md! 🚀**
