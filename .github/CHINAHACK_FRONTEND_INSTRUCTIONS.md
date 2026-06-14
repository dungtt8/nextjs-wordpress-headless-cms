# CHINAHACK Frontend Instructions

## 1) Mục tiêu tài liệu
Tài liệu này là bản instruction chính thức để đội UI/UX và Frontend triển khai trang chủ CHINAHACK theo đúng SRS đã thống nhất, đảm bảo:
- Hiển thị đồng bộ trên Mobile, Tablet, Desktop.
- Tối ưu Core Web Vitals (LCP, INP, CLS).
- Trạng thái tương tác rõ ràng, nhất quán.
- Khả năng maintain tốt, dễ kiểm thử.

## 2) Chuẩn công nghệ bắt buộc
- Framework giao diện: Tailwind CSS.
- Ưu tiên JS thuần cho tương tác đơn giản.
- Chỉ dùng thư viện ngoài khi thật sự cần và nhẹ.
- Carousel đề xuất: Swiper.js hoặc Splide.js (bản tối giản).
- Không import cả thư viện lớn nếu chỉ dùng 1 tính năng nhỏ.

## 3) Design System Tokens (Tailwind)
Cấu hình bắt buộc trong tailwind config/theme tokens:

### 3.1 Bảng màu
- `primary`: `#9B1C1C` (Đỏ Burgundy)
- `secondary`: `#D97706` (Vàng Hổ Phách/Gold)
- `neutral-dark`: `#1F2937` (Màu chữ chính)
- `neutral-light`: `#F9FAFB` (Nền phụ xen kẽ section)

### 3.2 Typography
- Heading (h1-h4): Montserrat hoặc Inter.
- Heading weight: 700 hoặc 800.
- Body: Be Vietnam Pro hoặc Roboto.
- Body weight: 400 và 500.

### 3.3 Breakpoints
- Mobile: `< 640px` (1 cột)
- Tablet: `640px -> 1024px` (2 cột)
- Desktop: `> 1024px` (grid tiêu chuẩn)

## 4) Đặc tả chi tiết 12 section trang chủ

### Section 1: Hero
- Desktop: 2 cột.
  - Trái: text + CTA.
  - Phải: ảnh mentor dáng đứng, cắt nền.
- Mobile: 1 cột, ảnh mentor xuống dưới text.
- Button hover:
  - `transform: translateY(-2px)`
  - tăng shadow (`shadow-lg`)

### Section 2: About Us
- Desktop split 50/50.
- Mobile 1 cột.
- Khối câu chốt:
  - Fade-in từ dưới lên khi vào viewport.
  - Dùng Intersection Observer API.

### Section 3: Why Choose Us
- Desktop: grid 4 cột.
- Tablet: grid 2 cột.
- Mobile: stack 1 cột.
- Card hover:
  - Nền trắng -> xám cực nhạt.
  - Icon SVG đổi sang màu `primary`.
  - Bo góc + shadow mượt.
  - `transition-duration: 300ms`.

### Section 4: Team Mentor
- Desktop: grid 3 cột cố định.
- Mobile/Tablet: CSS scroll snap vuốt ngang.
- Nút "Xem chi tiết": mở modal overlay.
- Modal rules:
  - Lock scroll nền (`body { overflow: hidden; }`).
  - Đóng khi click outside hoặc click nút X.

### Section 5: Stats
- Desktop: flex đan xen.
- Mobile: grid 2x2.
- Counter:
  - Số chạy từ 0 -> giá trị mục tiêu trong 1.5s.
  - Chỉ chạy 1 lần khi section vào viewport.

### Section 6: Process
- Desktop: horizontal step link.
- Mobile: vertical timeline, line chạy dọc bên trái.
- Khi cuộn:
  - Step đã đọc đổi màu xám -> `primary`.
  - Step chưa đọc giữ trạng thái mặc định.

### Section 7: Services
- Desktop: grid 3 cột.
- Mobile: stack 3 card dọc.
- Card giữa desktop: `scale-105`.
- CTA từng gói:
  - Có state `:active` rõ rệt khi nhấn.

### Section 8: Universities
- Khối full-width, không giới hạn container.
- CSS marquee logo chạy vô tận sang trái.
- Hover vào dải logo: `animation-play-state: paused`.

### Section 9: Success Stories
- Carousel bằng Swiper/Splide (tối giản).
- Mobile:
  - Vuốt chạm mượt (touch swipe).
  - Ẩn nút mũi tên.
- Desktop:
  - Hiện nút mũi tên điều hướng.

### Section 10: Blog (SEO)
- Desktop: grid 3 bài.
- Mobile: stack 1 bài + nút "Xem thêm".
- Tab filter:
  - Tab active: nền `primary`, chữ trắng.
  - Khi chuyển tab:
    - Hiện skeleton loader 300ms.
    - Sau đó render dữ liệu mới.

### Section 11: Community
- Grid 3 cột cho 3 kênh social.
- Hover banner social: `scale-102`.

### Section 12: Lead Form
- Layout căn giữa.
- `max-width: 768px`.
- Chi tiết logic form bắt buộc theo mục 5.

## 5) Đặc tả logic và UI form đăng ký (Section 12)

### 5.1 Input states
- Default:
  - `border-gray-300`
  - Có placeholder hướng dẫn rõ.
  - Ví dụ GPA: "Nhập điểm GPA hệ 4 hoặc hệ 10".
- Focus:
  - Border đổi sang `primary`.
  - Có ring nhẹ để tăng nhận biết focus.
- Error:
  - `border-red-500`
  - Dòng lỗi nhỏ bên dưới field.
  - Ví dụ: "Vui lòng nhập đúng định dạng Email".

### 5.2 Submit button states
- Trước khi submit:
  - Nền `secondary`.
  - Text: "Nhận đánh giá hồ sơ miễn phí".
- Loading:
  - Disable tương tác (`pointer-events-none`, `opacity-50`).
  - Text: "Đang xử lý...".
  - Có spinner xoay 360 độ bằng CSS.
- Success:
  - Form fade-out mượt.
  - Hiện success box nền xanh lá nhạt, chữ xanh đậm:
    - "Cảm ơn [Tên_Học_Viên]. Đội ngũ Mentor ChinaHack đã nhận được hồ sơ và sẽ liên hệ lộ trình cá nhân hóa qua Email/Số điện thoại của bạn trong vòng 24 giờ."

## 6) Quy tắc tối ưu hiệu suất và chất lượng

### 6.1 Hình ảnh và đồ họa
- Dùng SVG inline cho icon.
- Không dùng font icon (ví dụ FontAwesome).
- Ảnh mentor, ảnh trường dùng `picture` + `webp`.
- Mặc định `loading="lazy"`, trừ ảnh Hero phải tải ngay.

### 6.2 CSS/JS optimization
- Không import toàn thư viện lớn cho một tính năng nhỏ.
- Ưu tiên vanilla JS cho modal, tab, intersection states.
- Mỗi section chỉ tải logic cần thiết.

### 6.3 Tương thích thiết bị
- Kiểm thử bắt buộc:
  - Safari trên iOS.
  - Chrome trên Android.
  - Chrome desktop.
- Đảm bảo không vỡ khung chữ khi zoom 120%.

## 7) Acceptance Checklist (Definition of Done)
Một hạng mục chỉ được nghiệm thu khi đạt đủ:
- Đúng màu, font, breakpoint theo token.
- Đúng layout và interaction của cả 12 section.
- Form có đủ default/focus/error/loading/success states.
- Hero image không lazy load; ảnh còn lại lazy đúng chuẩn.
- Không có layout shift đáng kể khi tải trang.
- Tab Blog có skeleton 300ms khi đổi tab.
- Modal Team Mentor lock scroll nền và đóng đúng trigger.
- Stats counter chạy đúng 1 lần khi vào viewport.
- Pass kiểm thử hiển thị Safari iOS + Chrome Android/Desktop.

## 8) Gợi ý cấu trúc component triển khai
- `HomeHero`
- `HomeAbout`
- `HomeWhyChoose`
- `HomeMentors`
- `HomeStats`
- `HomeProcess`
- `HomeServices`
- `HomeUniversitiesMarquee`
- `HomeSuccessStories`
- `HomeBlogTabs`
- `HomeCommunity`
- `HomeLeadForm`

Mỗi component nên tự quản lý state cục bộ, chỉ nâng state lên parent khi cần đồng bộ dữ liệu liên section.

## 9) Quy ước QA handoff
Mỗi section cần có:
- Ảnh chụp trạng thái desktop/tablet/mobile.
- Ghi chú state tương tác (hover, active, loading, success, error).
- Checklist performance đã kiểm tra.

---
Tài liệu này là chuẩn triển khai frontend chính thức cho landing page CHINAHACK. Mọi thay đổi cần cập nhật lại tài liệu trước khi release.

## 10) Mapping theo cấu trúc repo hiện tại

### 10.1 File cần chỉnh sửa trực tiếp
- `app/page.tsx`
  - Thay toàn bộ nội dung demo hiện tại bằng landing page CHINAHACK.
  - Render lần lượt 12 section theo thứ tự trong mục 4.
- `app/globals.css`
  - Khai báo thêm utility animation cho fade-in, marquee, spinner, skeleton.
  - Khai báo class hỗ trợ scroll-snap cho Team Mentor trên mobile/tablet.

### 10.2 File component cần tạo mới
Tạo thư mục mới: `components/home/`

Trong `components/home/`, tạo các file:
- `home-hero.tsx`
- `home-about.tsx`
- `home-why-choose.tsx`
- `home-mentors.tsx`
- `home-stats.tsx`
- `home-process.tsx`
- `home-services.tsx`
- `home-universities-marquee.tsx`
- `home-success-stories.tsx`
- `home-blog-tabs.tsx`
- `home-community.tsx`
- `home-lead-form.tsx`

### 10.3 File dữ liệu đề xuất
Tạo thư mục mới: `lib/home/`

Trong `lib/home/`, tạo:
- `content.ts`
  - Chứa dữ liệu tĩnh của 12 section (hero text, stats, services, community links...).
- `types.ts`
  - Định nghĩa type cho Mentor, ServicePlan, StorySlide, BlogCategory, LeadFormPayload.

## 11) Yêu cầu triển khai theo section (chi tiết kỹ thuật)

### 11.1 Hero image và media
- Hero image phải ưu tiên tải sớm:
  - Dùng `next/image` với thuộc tính `priority`.
  - Không lazy-load ảnh Hero.
- Các ảnh section khác:
  - Dùng lazy loading mặc định.
  - Ưu tiên nguồn `webp`.

### 11.2 Modal Team Mentor
- Mở modal bằng state cục bộ trong `home-mentors.tsx`.
- Khi modal mở:
  - Gắn class vào `document.body` để lock scroll.
- Khi modal đóng/unmount:
  - Luôn xóa class lock scroll.
- Trigger đóng modal:
  - Click backdrop.
  - Click nút X.
  - Nhấn phím `Escape`.

### 11.3 Counter Stats
- Dùng Intersection Observer để kích hoạt.
- Khi đã chạy xong lần đầu, set cờ `hasAnimated = true`.
- Không chạy lại khi user scroll qua lại.

### 11.4 Blog Tabs với Skeleton 300ms
- Khi đổi tab:
  - Đặt `isLoading = true`.
  - Delay 300ms rồi cập nhật data và set `isLoading = false`.
- Tránh layout shift:
  - Skeleton phải giữ chiều cao gần bằng card thật.

### 11.5 Lead Form State Machine
State tối thiểu:
- `idle`
- `validating`
- `loading`
- `success`
- `error`

Luồng xử lý:
1. Submit từ `idle` -> `validating`.
2. Nếu invalid -> `error` (show lỗi từng field).
3. Nếu valid -> `loading` (disable nút + spinner).
4. API success -> `success` (fade-out form + success box).
5. API fail -> `error` (show lỗi tổng quát + mở lại thao tác form).

## 12) Quy chuẩn truy cập (Accessibility)
- Tất cả button/icon button phải có `aria-label` rõ ràng.
- Modal phải có:
  - `role="dialog"`
  - `aria-modal="true"`
  - Focus trap cơ bản (focus vào nút đóng hoặc heading khi mở).
- Input error phải liên kết bằng `aria-describedby` tới dòng lỗi.
- Tương phản màu chữ/nền đạt tối thiểu WCAG AA.

## 13) QA checklist theo file
- `app/page.tsx`
  - Đủ 12 section theo đúng thứ tự.
- `components/home/home-mentors.tsx`
  - Modal đóng mở đúng 3 trigger.
  - Body scroll lock/unlock đúng.
- `components/home/home-stats.tsx`
  - Counter chỉ chạy 1 lần.
- `components/home/home-blog-tabs.tsx`
  - Có skeleton 300ms khi đổi tab.
- `components/home/home-lead-form.tsx`
  - Đủ default/focus/error/loading/success states.
- `app/globals.css`
  - Có class animation cần thiết (fade, marquee, spinner, skeleton).

Khi hoàn tất, bắt buộc chạy tối thiểu:
- `pnpm lint`
- `pnpm test`
- Kiểm tra responsive thủ công ở 3 breakpoint: mobile, tablet, desktop.
