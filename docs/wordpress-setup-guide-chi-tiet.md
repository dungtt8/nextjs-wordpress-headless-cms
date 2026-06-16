# Hướng Dẫn Thiết Lập WordPress Chi Tiết Cho Frontend ChinaHack

Ngày cập nhật: 2026-06-16
Mục tiêu: Chuẩn hóa cách nhập dữ liệu và upload ảnh trên WordPress để frontend hiển thị đúng, ổn định, dễ mở rộng.

## 1) Tổng quan kiến trúc hiện tại

Frontend Next.js đang có 2 luồng dữ liệu:
- Luồng bài viết và taxonomy: lấy trực tiếp từ WordPress REST API.
- Luồng nội dung homepage section: phần lớn vẫn dùng fallback local trong mã nguồn, riêng section Mentor đã lấy từ WordPress và có fallback tĩnh.

Ý nghĩa vận hành:
- Bạn có thể quản trị blog/post/category/tag hoàn toàn trong WordPress ngay.
- Bạn có thể quản trị dữ liệu Mentor từ WordPress ngay (nếu endpoint mentor hoạt động).
- Nếu muốn quản trị toàn bộ homepage bằng WordPress, cần thêm bước bridge ở frontend để đọc Home Content từ WordPress và map vào cấu trúc hiện có.

## 2) Checklist cài đặt WordPress bắt buộc

1. Vào Settings > Permalinks và chọn Post name.
2. Bảo đảm REST API truy cập được:
   - /wp-json/wp/v2/posts
   - /wp-json/wp/v2/pages
   - /wp-json/wp/v2/categories
   - /wp-json/wp/v2/tags
   - /wp-json/wp/v2/users
   - /wp-json/wp/v2/mentor hoặc /wp-json/wp/v2/mentors (cho section Mentor)

Chi tiết cách kiểm tra nhanh:
1. Xác nhận base endpoint chạy:
   - Mở: `https://your-wordpress-domain/wp-json/`
   - Kết quả đúng: trả về JSON có key `namespaces` và `routes`.
   - Nếu không ra JSON (404 hoặc HTML): kiểm tra lại permalink, `.htaccess` hoặc cấu hình web server rewrite.

2. Kiểm tra từng endpoint public bằng trình duyệt hoặc Postman:
   - `GET /wp-json/wp/v2/posts?per_page=1`
   - `GET /wp-json/wp/v2/pages?per_page=1`
   - `GET /wp-json/wp/v2/categories?per_page=1`
   - `GET /wp-json/wp/v2/tags?per_page=1`
   - `GET /wp-json/wp/v2/users?per_page=1`
   - `GET /wp-json/wp/v2/mentor?per_page=1` hoặc `GET /wp-json/wp/v2/mentors?per_page=1`

3. Tiêu chí pass/fail cho mỗi endpoint:
   - Pass:
     - HTTP status 200
     - Response là mảng JSON (`[]` hoặc `[{}]`)
     - Có header phân trang với endpoint danh sách lớn: `X-WP-Total`, `X-WP-TotalPages`
   - Fail:
     - 404: route không tồn tại (thường do CPT chưa `show_in_rest` hoặc sai slug endpoint)
     - 401/403: bị chặn quyền hoặc plugin security chặn REST
     - 5xx: lỗi server hoặc plugin/theme conflict

4. Kiểm tra riêng endpoint Mentor (quan trọng cho frontend hiện tại):
   - Frontend đang thử theo thứ tự: `mentor` rồi `mentors`.
   - Chỉ cần 1 endpoint hoạt động là đủ.
   - Nếu dùng Custom Post Type, cần bật:
     - `show_in_rest = true`
     - `public = true`
     - `rest_base` đúng với endpoint mong muốn (`mentor` hoặc `mentors`)

5. Kiểm tra ảnh mentor qua REST:
   - Test thêm query: `?_embed=true&per_page=1`
   - Kỳ vọng: object có `_embedded` và (nếu có featured image) có `_embedded["wp:featuredmedia"][0].source_url`.
   - Nếu không có ảnh: kiểm tra post đã set Featured Image hay chưa.

6. Ví dụ lệnh curl (dùng khi QA bằng terminal):
   - `curl -I "https://your-wordpress-domain/wp-json/wp/v2/posts?per_page=1"`
   - `curl "https://your-wordpress-domain/wp-json/wp/v2/mentor?_embed=true&per_page=1" | head`

7. Nếu endpoint vẫn lỗi sau khi đã cấu hình đúng:
   - Vào Settings > Permalinks và bấm Save lại 1 lần để flush rewrite rules.
   - Tạm tắt plugin security/cache để loại trừ chặn REST.
   - Kiểm tra WAF/CDN rule có chặn đường dẫn `/wp-json/` không.
   - Kiểm tra log error của server (Nginx/Apache/PHP-FPM).
3. Cài plugin revalidation tại plugin/next-revalidate.
4. Vào Settings > Next.js Revalidation:
   - Nhập Next.js URL (không có dấu / cuối).
   - Nhập Webhook secret trùng WORDPRESS_WEBHOOK_SECRET của frontend.
5. Lưu cấu hình và test bằng cách sửa 1 bài viết đã publish.

## 3) Biến môi trường cần đồng bộ

Tại frontend Next.js:
- WORDPRESS_URL: URL đầy đủ WordPress
- WORDPRESS_HOSTNAME: hostname WordPress (phục vụ ảnh)
- WORDPRESS_WEBHOOK_SECRET: secret trùng với plugin revalidation

Khuyến nghị:
- Dùng secret dài và ngẫu nhiên.
- Không dùng lại secret cũ sau khi chuyển môi trường staging/production.

## 4) Chuẩn ảnh để hiển thị đẹp và không vỡ layout

### 4.1 Tỉ lệ ảnh đề xuất
- Hero hoặc ảnh chân dung chính: 4:5 hoặc 3:4
- Ảnh card/section: 16:10 hoặc 16:9
- Ảnh chân dung mentor (card + detail modal): 3:4
- Avatar success story: 1:1
- Logo: nền trong suốt, khung vuông hoặc ngang ổn định

### 4.2 Kích thước tối thiểu
- Hero: chiều dài tối thiểu 1200px
- Ảnh section/card: chiều dài tối thiểu 960px
- Ảnh chân dung mentor 3:4: tối thiểu 900x1200
- Avatar vuông: 512x512 trở lên

### 4.3 Quy tắc upload
- Định dạng ưu tiên: WebP, JPG chất lượng cao
- Tên file: không dấu, có ý nghĩa, theo mẫu section-ten-noi-dung.webp
- Alt text: bắt buộc điền
- Tránh ảnh quá nặng > 1.5MB cho ảnh card

## 5) Cấu trúc dữ liệu WordPress đề xuất cho Homepage (ACF)

Khuyến nghị dùng ACF PRO để quản trị Home Content theo nhóm field.

### 5.1 Tạo trang nguồn dữ liệu
1. Tạo 1 Page: Home Content
2. Slug: home-content
3. Publish page
4. Gắn Field Group cho page này
5. Bật hiển thị field qua REST (show in REST)

### 5.2 Field group đề xuất theo section

#### Hero
- title (Text)
- subtitle (Textarea)
- ctaText (Text)
- ctaHref (Text)
- mentorImage (Image)

#### About
- heading (Text)
- body (Textarea)
- highlightQuote (Textarea)
- image (Image)
- imageCaption (Text)

#### Why Choose (Repeater)
- id (Text)
- title (Text)
- description (Text)
- icon (Select: book, medal, network, target)
- image (Image)

#### Mentors (Repeater)
- id (Text)
- name (Text)
- role (Text)
- avatar (Image)
- profileLabel (Text)
- headline (Text)
- shortBio (Textarea)
- fullBio (Textarea)
- focusAreas (Repeater text)
- achievements (Repeater text)
- quote (Textarea)

Ghi chú triển khai hiện tại:
- Frontend đang hỗ trợ lấy mentor từ custom post type qua endpoint `mentor` hoặc `mentors`.
- Mapping hiện hỗ trợ cả field top-level và field trong `acf` với các key thông dụng:
   - `role`, `profileLabel` hoặc `profile_label`, `headline`
   - `shortBio` hoặc `short_bio`, `fullBio` hoặc `full_bio`
   - `focusAreas` hoặc `focus_areas`, `achievements`, `quote`, `avatar`
- Nếu có featured image, frontend có thể lấy ảnh từ `_embedded.wp:featuredmedia[0].source_url`.
- Nếu endpoint lỗi/rỗng hoặc field thiếu, frontend tự fallback về dữ liệu tĩnh để không vỡ giao diện.

#### Stats (Repeater)
- id (Text)
- label (Text)
- value (Number)
- suffix (Text, optional)

#### Process (Repeater)
- id (Text)
- title (Text)
- description (Textarea)
- image (Image, optional)

#### Services (Repeater)
- id (Text)
- name (Text)
- description (Textarea)
- image (Image, optional)
- audience (Textarea)
- supportLabel (Text)
- supportNote (Textarea)
- features (Repeater text)
- ctaText (Text)
- ctaHref (Text)
- highlightLabel (Text, optional)
- isFeatured (True/False)
- premiumNote (Textarea, optional)

#### Universities (Repeater)
- id (Text)
- name (Text)
- logo (Image)

#### Success Stories (Repeater)
- id (Text)
- studentName (Text)
- quote (Textarea)
- outcome (Text)
- avatar (Image)

#### Blog Tabs (Repeater)
- id (Text)
- label (Text)
- slug (Text)

#### Community (Repeater)
- id (Text)
- name (Text)
- description (Textarea)
- href (URL)
- bannerImage (Image)

#### Lead Form
- title (Text)
- subtitle (Text)
- submitText (Text)
- loadingText (Text)

## 6) Quy chuẩn nhập liệu cho content team

1. id mỗi item phải ổn định và duy nhất, không đổi tùy tiện sau khi đã public.
2. Không để trống trường bắt buộc của section.
3. URL CTA dùng anchor đúng nếu điều hướng trong trang, ví dụ #lead-form.
4. Không copy nội dung có ký tự lạ hoặc xuống dòng không kiểm soát.
5. Icon của Why Choose chỉ dùng đúng 4 giá trị cho phép.

## 7) Quy trình publish chuẩn

1. Editor cập nhật nội dung hoặc ảnh trong WordPress.
2. Publish/Update bài hoặc page Home Content.
3. Plugin revalidation gửi webhook sang frontend.
4. Frontend revalidate cache theo content type.
5. QA kiểm tra nhanh trên desktop và mobile.

## 8) Checklist QA sau mỗi lần cập nhật dữ liệu

- Nội dung text hiển thị đúng dấu tiếng Việt
- Ảnh có alt text
- Ảnh không bị méo hoặc cắt sai chủ thể
- CTA hoạt động đúng
- Danh sách repeater không mất thứ tự
- Không có block trắng hoặc khung ảnh rỗng bất thường

Checklist bổ sung cho section Mentor:
- Ảnh chân dung hiển thị đúng tỉ lệ dọc 3:4 ở cả card và detail modal
- Chủ thể không bị cắt mất mặt ở card
- Tên + role đọc rõ trên card (overlay)
- Nếu thiếu ảnh từ WordPress, card vẫn hiển thị fallback chữ viết tắt (initials)

## 9) Xử lý lỗi thường gặp

### Lỗi 1: Sửa nội dung WordPress nhưng frontend chưa đổi
Nguyên nhân thường gặp:
- Secret không trùng giữa WordPress và frontend
- Next.js URL trong plugin sai hoặc có dấu / dư
- Webhook bị chặn mạng/firewall

Cách xử lý:
1. Kiểm tra lại settings plugin
2. So khớp WORDPRESS_WEBHOOK_SECRET
3. Kiểm tra log API revalidate
4. Thử manual revalidation trong admin plugin

### Lỗi 2: Ảnh không hiển thị
Nguyên nhân thường gặp:
- URL ảnh không hợp lệ
- Ảnh chưa được publish công khai
- Host ảnh chưa được cho phép trong cấu hình frontend

Cách xử lý:
1. Mở trực tiếp URL ảnh để kiểm tra
2. Kiểm tra media status trong WordPress
3. Kiểm tra WORDPRESS_HOSTNAME

### Lỗi 3: Layout section bị lệch khi thiếu ảnh
Hiện frontend đã có cơ chế placeholder upload-ready cho nhiều section.
Nếu chưa có ảnh thật, khung placeholder vẫn hiển thị để giữ bố cục ổn định.

### Lỗi 4: Mentor không lên dữ liệu từ WordPress
Nguyên nhân thường gặp:
- Chưa tạo đúng custom post type REST endpoint (`mentor` hoặc `mentors`)
- ACF field key không trùng naming frontend đang map
- Endpoint trả về rỗng hoặc không kèm ảnh `_embedded`

Cách xử lý:
1. Kiểm tra endpoint thực tế trong trình duyệt: `/wp-json/wp/v2/mentor` và `/wp-json/wp/v2/mentors`
2. Kiểm tra dữ liệu JSON đã có các field chính (name/title, role, bio, avatar)
3. Nếu dùng featured image, đảm bảo request hỗ trợ `_embed` và post đã có thumbnail
4. Nếu naming field khác chuẩn đang map, cập nhật mapping ở frontend

## 10) Khuyến nghị triển khai tiếp theo

Để WordPress điều khiển toàn bộ Homepage thay vì fallback local, thực hiện thêm:
1. Tạo endpoint hoặc cơ chế lấy Home Content từ ACF trong frontend.
2. Map dữ liệu ACF về đúng cấu trúc type hiện tại.
3. Truyền dữ liệu đó vào normalizeHomeContent(input) thay vì gọi rỗng.
4. Bổ sung test cho mapping và fallback khi field thiếu.

## 11) Phân quyền đề xuất trong team

- Admin: quản lý plugin và revalidation
- Editor: chỉnh nội dung text và CTA
- Media/Designer: upload ảnh đúng quy chuẩn
- QA: kiểm tra hiển thị và flow publish

## 12) Tài liệu nội bộ nên duy trì

- Danh sách field ACF chuẩn và mô tả ngắn cho từng field
- Bộ quy chuẩn đặt tên file ảnh
- Checklist QA trước publish
- Quy trình rollback khi nội dung hoặc ảnh gây lỗi hiển thị
