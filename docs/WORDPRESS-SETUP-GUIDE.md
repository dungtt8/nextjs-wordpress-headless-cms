# WordPress Setup Guide - Success Stories & Universities

Hướng dẫn cài đặt WordPress để quản lý Success Stories, Universities, Mentors, Blog Posts.

## Yêu Cầu

- ✅ WordPress 6.0+
- ✅ ACF Pro hoặc ACF Free
- ✅ Next.js Revalidation Plugin
- ✅ REST API enabled

---

## BƯỚC 1: Cài Đặt Plugins

### 1.1 Advanced Custom Fields (ACF)
```
WordPress Admin → Plugins → Add New
Tìm: "Advanced Custom Fields"
Chọn: ACF (Free version hoặc Pro)
Activate
```

### 1.2 Next Revalidation Plugin
```
1. Từ project Next.js, lấy file từ /plugin/next-revalidate/
2. Upload vào: /wp-content/plugins/next-revalidate/
3. WordPress Admin → Plugins
4. Activate "Next Revalidate"
5. Cấu hình: Settings → Next Revalidate
   - Next.js URL: https://your-nextjs-site.com
   - Webhook Secret: (copy từ .env WORDPRESS_WEBHOOK_SECRET)
```

---

## BƯỚC 2: Tạo Custom Post Types

### 2.1 Success Story Custom Post Type

Dán code này vào `wp-content/themes/your-theme/functions.php`:

```php
<?php
// Register Success Story Post Type
add_action('init', function() {
    register_post_type('success_story', array(
        'label' => 'Success Stories',
        'public' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'has_archive' => true,
        'rewrite' => array('slug' => 'success-stories'),
        'show_in_rest' => true,
        'rest_base' => 'success_stories',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'menu_icon' => 'dashicons-star-filled',
        'show_in_admin_all_items_list_parent_column' => true,
    ));
});
?>
```

**Hoặc dùng Plugin Generator:** https://generatewp.com/post-type/

### 2.2 University Custom Post Type

```php
<?php
add_action('init', function() {
    register_post_type('university', array(
        'label' => 'Universities',
        'public' => true,
        'supports' => array('title', 'thumbnail', 'custom-fields'),
        'has_archive' => true,
        'rewrite' => array('slug' => 'universities'),
        'show_in_rest' => true,
        'rest_base' => 'universities',
        'menu_icon' => 'dashicons-book',
    ));
});
?>
```

---

## BƯỚC 3: Tạo ACF Field Groups

### 3.1 Success Story Fields

WordPress Admin → ACF → Field Groups → Add New

**Field Group: Success Story Details**

| Field Name | Field Type | Field Key | Required | Notes |
|------------|-----------|-----------|----------|-------|
| Mentee Name | Text | mentee_name | Yes | Tên học sinh |
| Mentee Company/University | Text | mentee_company | Yes | Trường/Công ty |
| Story/Testimonial | Textarea | testimonial | Yes | Câu chuyện thành công |
| Outcome Results | Text | outcome | Yes | Kết quả đạt được |
| Mentee Image | Image | mentee_image | Yes | Ảnh đại diện |

**ACF JSON (nếu muốn copy):**
```json
{
  "key": "group_success_story",
  "title": "Success Story Details",
  "fields": [
    {
      "key": "field_mentee_name",
      "label": "Mentee Name",
      "name": "mentee_name",
      "type": "text",
      "required": 1
    },
    {
      "key": "field_mentee_company",
      "label": "Mentee Company/University",
      "name": "mentee_company",
      "type": "text"
    },
    {
      "key": "field_testimonial",
      "label": "Story/Testimonial",
      "name": "testimonial",
      "type": "textarea",
      "required": 1
    },
    {
      "key": "field_outcome",
      "label": "Outcome Results",
      "name": "outcome",
      "type": "text",
      "required": 1
    },
    {
      "key": "field_mentee_image",
      "label": "Mentee Image",
      "name": "mentee_image",
      "type": "image",
      "return_format": "url",
      "required": 1
    }
  ],
  "location": [
    [
      {
        "param": "post_type",
        "operator": "==",
        "value": "success_story"
      }
    ]
  ]
}
```

### 3.2 University Fields

WordPress Admin → ACF → Field Groups → Add New

**Field Group: University Details**

| Field Name | Field Type | Field Key | Required |
|------------|-----------|-----------|----------|
| University Name | Text | university_name | Yes |
| University Logo | Image | logo | Yes |
| University Link | URL | university_link | No |
| Description | Text | description | No |

**ACF JSON:**
```json
{
  "key": "group_university",
  "title": "University Details",
  "fields": [
    {
      "key": "field_uni_name",
      "label": "University Name",
      "name": "university_name",
      "type": "text",
      "required": 1
    },
    {
      "key": "field_logo",
      "label": "Logo",
      "name": "logo",
      "type": "image",
      "return_format": "url",
      "required": 1
    },
    {
      "key": "field_uni_link",
      "label": "University Link",
      "name": "university_link",
      "type": "url"
    },
    {
      "key": "field_description",
      "label": "Description",
      "name": "description",
      "type": "text"
    }
  ],
  "location": [
    [
      {
        "param": "post_type",
        "operator": "==",
        "value": "university"
      }
    ]
  ]
}
```

---

## BƯỚC 4: Tạo Content trên WordPress

### 4.1 Tạo Success Story

WordPress Admin → Success Stories → Add New

```
Title: "Trần Minh Anh - Nhân học bổng Tsinghua"
Mentee Name: Trần Minh Anh
Company/University: Tsinghua University
Story: [Dán câu chuyện dài]
Outcome: "Nhận học bổng đầy đủ, GPA 3.9/4.0"
Image: [Upload ảnh]
Publish
```

### 4.2 Tạo University

WordPress Admin → Universities → Add New

```
Title: Tsinghua University
Logo: [Upload logo]
Link: https://tsinghua.edu.cn
Description: Top university in China
Publish
```

---

## BƯỚC 5: Xác Minh REST API Endpoints

Kiểm tra endpoints hoạt động:

```bash
# Success Stories
curl "https://your-wordpress.com/wp-json/wp/v2/success_stories?_embed=true"

# Universities  
curl "https://your-wordpress.com/wp-json/wp/v2/universities?_embed=true"

# Mentors (đã có)
curl "https://your-wordpress.com/wp-json/wp/v2/mentor?_embed=true"

# Posts (đã có)
curl "https://your-wordpress.com/wp-json/wp/v2/posts?_embed=true"
```

---

## BƯỚC 6: Cấu Hình Export ACF as REST

Trong ACF field group settings:
1. Show in REST: ✅ ON
2. REST Base: `success_story` (tự động)

---

## Troubleshooting

### ❌ 404 Error trên endpoints
```
Giải pháp:
1. WordPress Admin → Settings → Permalinks
2. Chọn: "Post name"
3. Save Changes
4. Refresh WordPress
```

### ❌ ACF fields không hiển thị trong REST
```
Giải pháp:
1. ACF → Field Groups → Edit Group
2. Scroll xuống "Show in REST"
3. ✅ Enable
4. Save
```

### ❌ Image URLs không đúng
```
Giải pháp:
1. ACF → Field Edit → Return Format: URL
2. Hoặc trong Next.js, normalize image URLs:
   image.src || image.url || image
```

---

## Next Steps

Sau khi setup xong WordPress:
1. ✅ Tạo 2-3 Success Stories
2. ✅ Tạo 4-5 Universities
3. ✅ Test API endpoints
4. ✅ Update Next.js code (xem file tiếp theo)
5. ✅ Deploy

---

## Thông Tin Thêm

- **ACF Documentation**: https://www.advancedcustomfields.com/resources/
- **WordPress REST API**: https://developer.wordpress.org/rest-api/
- **Custom Post Types**: https://developer.wordpress.org/plugins/post-types/
