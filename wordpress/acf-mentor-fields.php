<?php
/**
 * ACF Field Group for Mentor Post Type
 * This file defines the ACF fields for mentor posts
 * 
 * Usage: Include this in functions.php or use ACF's built-in plugin import
 */

if ( function_exists( 'acf_add_local_field_group' ) ) {
    acf_add_local_field_group( array(
        'key' => 'group_mentor_fields',
        'title' => 'Mentor Information',
        'fields' => array(
            // SHARED FIELDS (Name & Avatar)
            array(
                'key' => 'field_mentor_name',
                'label' => 'Mentor Name',
                'name' => 'name',
                'type' => 'text',
                'instructions' => 'Full name of the mentor (shared across all languages)',
                'required' => 1,
            ),
            array(
                'key' => 'field_mentor_avatar',
                'label' => 'Avatar Image',
                'name' => 'avatar',
                'type' => 'image',
                'instructions' => 'Profile photo (shared across all languages)',
                'return_format' => 'url',
            ),
            // ENGLISH FIELDS
            array(
                'key' => 'field_mentor_role_en',
                'label' => 'Role (English)',
                'name' => 'role_en',
                'type' => 'text',
                'placeholder' => 'e.g., Academic Advisor',
            ),
            array(
                'key' => 'field_mentor_headline_en',
                'label' => 'Headline (English)',
                'name' => 'headline_en',
                'type' => 'text',
                'placeholder' => 'Brief specialty description',
            ),
            array(
                'key' => 'field_mentor_short_bio_en',
                'label' => 'Short Bio (English)',
                'name' => 'short_bio_en',
                'type' => 'textarea',
                'rows' => 3,
                'placeholder' => 'One sentence about the mentor',
            ),
            array(
                'key' => 'field_mentor_full_bio_en',
                'label' => 'Full Bio (English)',
                'name' => 'full_bio_en',
                'type' => 'textarea',
                'rows' => 5,
                'placeholder' => 'Detailed background and experience',
            ),
            array(
                'key' => 'field_mentor_quote_en',
                'label' => 'Quote (English)',
                'name' => 'quote_en',
                'type' => 'text',
                'placeholder' => 'Inspirational quote or philosophy',
            ),
            array(
                'key' => 'field_mentor_focus_areas_en',
                'label' => 'Focus Areas (English)',
                'name' => 'focus_areas_en',
                'type' => 'textarea',
                'rows' => 3,
                'instructions' => 'One per line',
                'placeholder' => "Area 1\nArea 2\nArea 3",
            ),
            array(
                'key' => 'field_mentor_achievements_en',
                'label' => 'Achievements (English)',
                'name' => 'achievements_en',
                'type' => 'textarea',
                'rows' => 4,
                'instructions' => 'One per line',
                'placeholder' => "Achievement 1\nAchievement 2\nAchievement 3\nAchievement 4",
            ),
            // VIETNAMESE FIELDS
            array(
                'key' => 'field_mentor_role_vi',
                'label' => 'Role (Vietnamese)',
                'name' => 'role_vi',
                'type' => 'text',
                'placeholder' => 'VD: Cố vấn học thuật',
            ),
            array(
                'key' => 'field_mentor_headline_vi',
                'label' => 'Headline (Vietnamese)',
                'name' => 'headline_vi',
                'type' => 'text',
                'placeholder' => 'Mô tả chuyên môn ngắn',
            ),
            array(
                'key' => 'field_mentor_short_bio_vi',
                'label' => 'Short Bio (Vietnamese)',
                'name' => 'short_bio_vi',
                'type' => 'textarea',
                'rows' => 3,
                'placeholder' => 'Một câu về mentor',
            ),
            array(
                'key' => 'field_mentor_full_bio_vi',
                'label' => 'Full Bio (Vietnamese)',
                'name' => 'full_bio_vi',
                'type' => 'textarea',
                'rows' => 5,
                'placeholder' => 'Chi tiết quá trình và kinh nghiệm',
            ),
            array(
                'key' => 'field_mentor_quote_vi',
                'label' => 'Quote (Vietnamese)',
                'name' => 'quote_vi',
                'type' => 'text',
                'placeholder' => 'Câu nói hoặc triết lý của mentor',
            ),
            array(
                'key' => 'field_mentor_focus_areas_vi',
                'label' => 'Focus Areas (Vietnamese)',
                'name' => 'focus_areas_vi',
                'type' => 'textarea',
                'rows' => 3,
                'instructions' => 'Một dòng một lĩnh vực',
                'placeholder' => "Lĩnh vực 1\nLĩnh vực 2\nLĩnh vực 3",
            ),
            array(
                'key' => 'field_mentor_achievements_vi',
                'label' => 'Achievements (Vietnamese)',
                'name' => 'achievements_vi',
                'type' => 'textarea',
                'rows' => 4,
                'instructions' => 'Một dòng một thành tích',
                'placeholder' => "Thành tích 1\nThành tích 2\nThành tích 3\nThành tích 4",
            ),
            // CHINESE FIELDS
            array(
                'key' => 'field_mentor_role_zh',
                'label' => 'Role (Chinese)',
                'name' => 'role_zh',
                'type' => 'text',
                'placeholder' => '例如：学术顾问',
            ),
            array(
                'key' => 'field_mentor_headline_zh',
                'label' => 'Headline (Chinese)',
                'name' => 'headline_zh',
                'type' => 'text',
                'placeholder' => '简短的专业描述',
            ),
            array(
                'key' => 'field_mentor_short_bio_zh',
                'label' => 'Short Bio (Chinese)',
                'name' => 'short_bio_zh',
                'type' => 'textarea',
                'rows' => 3,
                'placeholder' => '关于导师的一句话',
            ),
            array(
                'key' => 'field_mentor_full_bio_zh',
                'label' => 'Full Bio (Chinese)',
                'name' => 'full_bio_zh',
                'type' => 'textarea',
                'rows' => 5,
                'placeholder' => '详细的背景和经验',
            ),
            array(
                'key' => 'field_mentor_quote_zh',
                'label' => 'Quote (Chinese)',
                'name' => 'quote_zh',
                'type' => 'text',
                'placeholder' => '励志的引言或哲学',
            ),
            array(
                'key' => 'field_mentor_focus_areas_zh',
                'label' => 'Focus Areas (Chinese)',
                'name' => 'focus_areas_zh',
                'type' => 'textarea',
                'rows' => 3,
                'instructions' => '每行一个领域',
                'placeholder' => "领域 1\n领域 2\n领域 3",
            ),
            array(
                'key' => 'field_mentor_achievements_zh',
                'label' => 'Achievements (Chinese)',
                'name' => 'achievements_zh',
                'type' => 'textarea',
                'rows' => 4,
                'instructions' => '每行一个成就',
                'placeholder' => "成就 1\n成就 2\n成就 3\n成就 4",
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'mentor',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => array(),
        'active' => true,
        'description' => 'Multilingual mentor profile information with shared name and avatar',
    ) );
}
