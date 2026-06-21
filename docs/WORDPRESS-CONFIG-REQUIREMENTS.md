# WordPress Configuration Requirements

Comprehensive guide for WordPress setup needed to support the Next.js headless CMS frontend.

## 1. Custom Post Types

### Primary Post Types Used

#### **Posts** (Built-in)
- **REST Endpoint**: `/wp-json/wp/v2/posts`
- **Usage**: Blog articles, content with taxonomy (categories, tags, authors)
- **Fields Consumed**:
  - `title.rendered` - Post title
  - `content.rendered` - Full post content (HTML)
  - `excerpt.rendered` - Post excerpt
  - `author` - Author ID
  - `featured_media` - Featured image ID
  - `categories` - Category IDs array
  - `tags` - Tag IDs array
  - `slug` - URL-friendly slug
  - `date` / `modified` - Publication & update dates
  - `status` - publish/draft/pending status
  - `_embedded` - Embedded relationships (author, featured media, terms)
- **Features**:
  - Paginated access (9 posts per page default)
  - Search support
  - Filter by category, tag, author
  - Multi-language support via Polylang (`lang` parameter)

#### **Pages** (Built-in)
- **REST Endpoint**: `/wp-json/wp/v2/pages`
- **Usage**: Static pages (About, Contact, etc.)
- **Fields Consumed**:
  - `title.rendered`
  - `content.rendered`
  - `excerpt.rendered`
  - `author`
  - `featured_media`
  - `slug`
  - `date` / `modified`
  - `status`
  - `menu_order` - Page hierarchy
  - `parent` - Parent page ID
  - `_embedded`
- **Features**:
  - Hierarchical (parent/child pages)
  - Static generation support

#### **Mentor** (Custom Post Type) ⭐ **REQUIRED**
- **REST Endpoints**: 
  - `/wp-json/wp/v2/mentor` (singular)
  - `/wp-json/wp/v2/mentors` (plural)
- **Status**: Tries both endpoints, returns first with data
- **Usage**: Team member/mentor profiles displayed on homepage
- **Fields Consumed** (flexible mapping):
  ```
  From REST response:
  - id
  - title.rendered → name
  - excerpt.rendered → shortBio (fallback)
  - content.rendered → fullBio (fallback)
  - _embedded["wp:featuredmedia"][0].source_url → avatar (fallback)
  
  From REST query params:
  - per_page: 20
  - _embed: true (for featured media)
  
  From ACF fields (preferred):
  - acf.name
  - acf.role
  - acf.profileLabel
  - acf.headline
  - acf.shortBio / acf.short_bio
  - acf.fullBio / acf.full_bio
  - acf.focusAreas / acf.focus_areas
  - acf.achievements
  - acf.quote
  - acf.avatar / acf.photo
  ```
- **Alternative Field Names** (camelCase or snake_case):
  - `shortBio` or `short_bio`
  - `fullBio` or `full_bio`
  - `focusAreas` or `focus_areas`
  - `profileLabel` or `profile_label`
- **Setup Required**:
  1. Create custom post type "Mentor"
  2. Register in REST API
  3. Optional: Add ACF fields for the fields above

---

## 2. Taxonomies (Built-in)

### Categories
- **REST Endpoint**: `/wp-json/wp/v2/categories`
- **Usage**: Post categorization
- **Fields**: `id`, `name`, `slug`, `description`, `link`, `parent`

### Tags
- **REST Endpoint**: `/wp-json/wp/v2/tags`
- **Usage**: Post tagging
- **Fields**: `id`, `name`, `slug`, `description`, `link`

### Authors (Users)
- **REST Endpoint**: `/wp-json/wp/v2/users`
- **Usage**: Post authors, mentor team members
- **Fields**: `id`, `name`, `slug`, `description`, `avatar_urls`, `link`

---

## 3. Advanced Custom Fields (ACF)

### ACF Integration

ACF fields are **optional but preferred** for the Mentor post type. The code gracefully falls back to REST post fields if ACF is not available.

#### **Mentor Post Type - ACF Field Group**

Recommended field configuration (can be added via ACF UI or code):

```php
'fields' => [
    [
        'key' => 'field_mentor_name',
        'name' => 'name',
        'label' => 'Name',
        'type' => 'text',
    ],
    [
        'key' => 'field_mentor_role',
        'name' => 'role',
        'label' => 'Role/Title',
        'type' => 'text',
    ],
    [
        'key' => 'field_mentor_profile_label',
        'name' => 'profileLabel',
        'label' => 'Profile Label',
        'type' => 'text',
        'default_value' => 'Our Expert',
    ],
    [
        'key' => 'field_mentor_headline',
        'name' => 'headline',
        'label' => 'Headline',
        'type' => 'text',
    ],
    [
        'key' => 'field_mentor_short_bio',
        'name' => 'short_bio',
        'label' => 'Short Bio',
        'type' => 'textarea',
    ],
    [
        'key' => 'field_mentor_full_bio',
        'name' => 'full_bio',
        'label' => 'Full Bio',
        'type' => 'wysiwyg',
    ],
    [
        'key' => 'field_mentor_focus_areas',
        'name' => 'focus_areas',
        'label' => 'Focus Areas',
        'type' => 'textarea',
        'instructions' => 'One per line',
    ],
    [
        'key' => 'field_mentor_achievements',
        'name' => 'achievements',
        'label' => 'Achievements',
        'type' => 'textarea',
        'instructions' => 'One per line',
    ],
    [
        'key' => 'field_mentor_quote',
        'name' => 'quote',
        'label' => 'Quote',
        'type' => 'textarea',
    ],
    [
        'key' => 'field_mentor_avatar',
        'name' => 'avatar',
        'label' => 'Avatar/Photo',
        'type' => 'image',
        'return_format' => 'url',
    ],
    [
        'key' => 'field_mentor_photo',
        'name' => 'photo',
        'label' => 'Photo (alternative)',
        'type' => 'image',
        'return_format' => 'url',
    ],
]
```

---

## 4. Data Endpoints & API Routes

### WordPress REST API Endpoints (Consumed)

#### **Posts**
```
GET /wp-json/wp/v2/posts
GET /wp-json/wp/v2/posts/{id}
GET /wp-json/wp/v2/posts?slug={slug}
GET /wp-json/wp/v2/posts?per_page={n}&page={n}&_embed=true
GET /wp-json/wp/v2/posts?search={query}
GET /wp-json/wp/v2/posts?categories={id}
GET /wp-json/wp/v2/posts?tags={id}
GET /wp-json/wp/v2/posts?author={id}
GET /wp-json/wp/v2/posts?lang={locale}  # Polylang
```

#### **Pages**
```
GET /wp-json/wp/v2/pages
GET /wp-json/wp/v2/pages/{id}
GET /wp-json/wp/v2/pages?slug={slug}
GET /wp-json/wp/v2/pages?lang={locale}  # Polylang
```

#### **Mentor (Custom)**
```
GET /wp-json/wp/v2/mentor?per_page=20&_embed=true
GET /wp-json/wp/v2/mentors?per_page=20&_embed=true
```

#### **Categories**
```
GET /wp-json/wp/v2/categories
GET /wp-json/wp/v2/categories/{id}
GET /wp-json/wp/v2/categories?slug={slug}
GET /wp-json/wp/v2/categories?search={query}
```

#### **Tags**
```
GET /wp-json/wp/v2/tags
GET /wp-json/wp/v2/tags/{id}
GET /wp-json/wp/v2/tags?slug={slug}
GET /wp-json/wp/v2/tags?search={query}
GET /wp-json/wp/v2/tags?post={post_id}
```

#### **Authors/Users**
```
GET /wp-json/wp/v2/users
GET /wp-json/wp/v2/users/{id}
GET /wp-json/wp/v2/users?slug={slug}
GET /wp-json/wp/v2/users?search={query}
```

#### **Featured Media**
```
GET /wp-json/wp/v2/media/{id}
```

### Query Parameters Used

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `_embed` | Include embedded relationships | `_embed=true` |
| `per_page` | Pagination size | `per_page=100` |
| `page` | Page number | `page=1` |
| `slug` | Filter by slug | `slug=hello-world` |
| `search` | Full-text search | `search=mentor` |
| `categories` | Filter by category ID | `categories=5` |
| `tags` | Filter by tag ID | `tags=12` |
| `author` | Filter by author ID | `author=2` |
| `lang` | Polylang language filter | `lang=vi` |
| `_fields` | Sparse fieldset (optimization) | `_fields=slug,modified` |

### Next.js API Routes

#### **POST /api/revalidate**
- **Purpose**: Webhook endpoint for WordPress revalidation
- **Header Required**: `x-webhook-secret` (must match `WORDPRESS_WEBHOOK_SECRET`)
- **Body**:
  ```json
  {
    "id": 123,          // Post/page ID
    "type": "post",     // post, page, category, tag, user, media
    "lang": "en"        // Language code (optional)
  }
  ```
- **Response**:
  ```json
  {
    "revalidated": true,
    "timestamp": "2024-01-01T12:00:00Z",
    "locales": ["en", "vi", "zh"]
  }
  ```
- **Cache Tags Revalidated**: `posts-{locale}`, `pages-{locale}`, `post-{id}-{locale}`, `page-{id}-{locale}`

#### **POST /api/lead**
- **Purpose**: Lead form submission
- **Body**:
  ```json
  {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "gpa": "string",
    "note": "string (optional)"
  }
  ```
- **Validation**: Email format, required fields
- **Response**: Success/error with field-level validation

#### **GET /api/og**
- **Purpose**: Open Graph image generation
- **Parameters**: Page-specific metadata for social sharing

---

## 5. WordPress Plugins & Configuration Required

### ✅ **Must-Have Plugins**

#### 1. **Next.js Revalidation Plugin** (Provided in repo)
- **Location**: `/plugin/next-revalidate/`
- **Purpose**: Triggers webhooks to Next.js when content changes
- **Installation**:
  ```bash
  # Copy to WordPress
  cp -r plugin/next-revalidate /wp-content/plugins/
  
  # Or zip and upload via admin
  zip -r next-revalidate.zip plugin/next-revalidate/
  ```
- **Activation**: Go to WordPress Admin → Plugins → Activate "Next.js Revalidation"
- **Configuration**:
  1. Go to Settings → Next.js Revalidation
  2. Enter Next.js Site URL: `https://your-next-site.com`
  3. Generate webhook secret: `openssl rand -base64 32`
  4. Save in WordPress plugin settings
  5. Add to Next.js `.env.local`: `WORDPRESS_WEBHOOK_SECRET=...`

#### 2. **REST API Plugin** (Built-in WordPress)
- **Already enabled** in WordPress by default
- **Verify**: Check that REST API is accessible at `/wp-json/`

#### 3. **Advanced Custom Fields (ACF)** - **Optional but Recommended**
- **Purpose**: Enhanced Mentor fields
- **Installation**:
  ```bash
  # Via Composer
  composer require wpackagist-plugin/advanced-custom-fields
  
  # Or upload from WordPress plugin directory
  ```
- **Configuration**: Add ACF field group for Mentor post type
- **Note**: Code gracefully handles missing ACF (falls back to REST fields)

#### 4. **Polylang** - **Optional (For Multi-language)**
- **Purpose**: Handle `lang` parameter in API queries
- **Installation**: From WordPress plugin directory
- **Supports**: `en`, `vi`, `zh` languages (configurable)
- **Endpoints**: Supports `?lang={code}` parameter for filtered queries

### 🔧 **Theme Setup**

#### **Next.js Headless Theme** (Provided in repo)
- **Location**: `/wordpress/theme/`
- **File**: `functions.php`
- **Purpose**:
  1. Redirects frontend to Next.js (except admin, API, login)
  2. Removes unnecessary WordPress frontend features
  3. Maintains REST API access
  4. Allows WordPress admin fully functional
- **Installation**:
  ```bash
  cp -r wordpress/theme /wp-content/themes/nextjs-headless
  
  # Or create symlink during dev
  ln -s /path/to/theme /wp-content/themes/nextjs-headless
  ```
- **Activation**: Go to WordPress Admin → Appearance → Themes → Activate "Next.js Headless"

### Environment Variables (WordPress Side)

In WordPress environment (e.g., `.env` for Docker):

```bash
# Docker Compose or server .env
WORDPRESS_DB_HOST=db
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=password
WORDPRESS_DB_NAME=wordpress

# Optional: Redirect URL for headless
NEXTJS_URL=https://your-next-site.com
```

---

## 6. Custom Post Type Registration (PHP)

If ACF not installed, register Mentor post type manually:

```php
<?php
// Add to functions.php or custom plugin

add_action('init', function() {
    register_post_type('mentor', array(
        'label' => 'Mentors',
        'public' => true,
        'show_in_rest' => true,  // CRITICAL: Enable REST API
        'rest_base' => 'mentors', // Customize REST endpoint
        'supports' => array(
            'title',
            'editor',
            'excerpt',
            'thumbnail',
            'author',
        ),
        'menu_icon' => 'dashicons-id-alt',
        'has_archive' => true,
        'rewrite' => array('slug' => 'mentor'),
    ));
});

// Optional: Register custom REST fields
add_action('rest_api_init', function() {
    register_rest_field('mentor', 'role', array(
        'get_callback' => function($post) {
            return get_post_meta($post['id'], 'role', true);
        },
        'update_callback' => function($value, $post) {
            return update_post_meta($post->ID, 'role', $value);
        },
        'schema' => array('type' => 'string'),
    ));
});
```

---

## 7. Data Flow Summary

```
WordPress Admin
    ↓ (create/edit/delete)
    ↓
Custom Hooks (save_post, delete_post, etc.)
    ↓
Next.js Revalidation Plugin
    ↓
POST /api/revalidate webhook
    ↓
Next.js revalidateTag() → ISR triggered
    ↓
Fresh data fetched from /wp-json/**
    ↓
Frontend re-renders with new content
```

---

## 8. Testing Checklist

- [ ] WordPress REST API accessible at `https://your-site.com/wp-json/`
- [ ] Posts endpoint returns data: `GET /wp-json/wp/v2/posts`
- [ ] Mentor endpoint returns data: `GET /wp-json/wp/v2/mentors`
- [ ] Next.js Revalidation plugin installed and activated
- [ ] Webhook secret configured in plugin
- [ ] `WORDPRESS_WEBHOOK_SECRET` set in Next.js `.env.local`
- [ ] Manual revalidation test via plugin admin page
- [ ] Create/update post in WordPress → Check Next.js site auto-updates
- [ ] Multi-language test (if using Polylang): `?lang=vi`, `?lang=zh`
- [ ] Featured images loading correctly (Remote Patterns configured)

---

## 9. Database Schema Requirements

### Posts Table
- Standard WordPress `wp_posts` table
- `post_type` = 'post' or 'page' or 'mentor'
- `post_status` = 'publish' (for frontend visibility)

### Taxonomies
- `wp_terms` - category/tag names
- `wp_term_taxonomy` - relationships
- `wp_term_relationships` - post associations

### ACF (If Used)
- `wp_postmeta` - stores ACF field values
- `wp_posts` - postmeta post references

### Polylang (If Multi-language)
- `wp_term_relationships` - language associations
- `wp_termmeta` - language slugs

---

## 10. Security Considerations

1. **Webhook Secret**: Use strong, random secret
   ```bash
   openssl rand -base64 32  # Generate secure secret
   ```

2. **CORS**: REST API allows read-only access by default
   - No modifications needed for GET requests
   - POST/PUT/DELETE require authentication

3. **Frontend-only**: WordPress admin completely separate from Next.js frontend
   - Admin URL: `https://your-site.com/wp-admin/`
   - Frontend: `https://your-next-site.com/`

4. **Rate Limiting**: Consider adding rate limits to revalidation endpoint:
   ```typescript
   // In /api/revalidate/route.ts
   const rateLimit = 10; // requests per minute
   ```

---

## 11. Deployment Checklist

### WordPress Setup
- [ ] Database configured and running
- [ ] WordPress installed
- [ ] Theme activated (Next.js Headless)
- [ ] Revalidation plugin installed and configured
- [ ] REST API endpoints tested
- [ ] Mentor custom post type created
- [ ] ACF fields configured (optional)
- [ ] Polylang configured with languages (if multi-language)

### Next.js Configuration
- [ ] `WORDPRESS_URL` set in `.env`
- [ ] `WORDPRESS_HOSTNAME` set (for image optimization)
- [ ] `WORDPRESS_WEBHOOK_SECRET` set and matches plugin
- [ ] Remote Patterns configured for WordPress images
- [ ] Revalidation endpoint tested with webhook

### Content
- [ ] Sample posts created
- [ ] Sample pages created
- [ ] Mentor profiles created
- [ ] Featured images set
- [ ] Categories/Tags assigned
- [ ] All languages published (if multi-language)

