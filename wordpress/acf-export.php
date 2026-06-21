<?php
/**
 * ACF Field Groups JSON Export
 * 
 * Cách sử dụng:
 * 1. WordPress Admin → ACF → Tools → Import
 * 2. Copy toàn bộ JSON dưới
 * 3. Paste vào import field
 * 4. Click Import
 */

$acf_field_groups = array(
    // ============================================
    // SUCCESS STORY FIELD GROUP
    // ============================================
    array(
        'key' => 'group_success_story',
        'title' => 'Success Story Details',
        'fields' => array(
            array(
                'key' => 'field_mentee_name',
                'label' => 'Mentee Name',
                'name' => 'mentee_name',
                'type' => 'text',
                'required' => 1,
                'placeholder' => 'e.g., Trần Minh Anh',
                'wrapper' => array(
                    'width' => '50',
                ),
            ),
            array(
                'key' => 'field_mentee_company',
                'label' => 'Company / University',
                'name' => 'mentee_company',
                'type' => 'text',
                'placeholder' => 'e.g., Tsinghua University',
                'wrapper' => array(
                    'width' => '50',
                ),
            ),
            array(
                'key' => 'field_testimonial',
                'label' => 'Story / Testimonial',
                'name' => 'testimonial',
                'type' => 'textarea',
                'required' => 1,
                'rows' => 4,
                'placeholder' => 'Câu chuyện thành công của học sinh...',
            ),
            array(
                'key' => 'field_outcome',
                'label' => 'Outcome / Achievement',
                'name' => 'outcome',
                'type' => 'text',
                'required' => 1,
                'placeholder' => 'e.g., Full scholarship, GPA 3.9/4.0',
            ),
            array(
                'key' => 'field_mentee_image',
                'label' => 'Mentee Photo',
                'name' => 'mentee_image',
                'type' => 'image',
                'return_format' => 'url',
                'required' => 1,
                'instructions' => 'Upload ảnh đại diện của học sinh',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'success_story',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'active' => 1,
    ),

    // ============================================
    // UNIVERSITY FIELD GROUP
    // ============================================
    array(
        'key' => 'group_university',
        'title' => 'University Details',
        'fields' => array(
            array(
                'key' => 'field_university_name',
                'label' => 'University Name',
                'name' => 'university_name',
                'type' => 'text',
                'required' => 1,
                'placeholder' => 'e.g., Tsinghua University',
            ),
            array(
                'key' => 'field_university_logo',
                'label' => 'University Logo',
                'name' => 'logo',
                'type' => 'image',
                'return_format' => 'url',
                'required' => 1,
                'instructions' => 'Logo sẽ hiển thị trong marquee',
            ),
            array(
                'key' => 'field_university_link',
                'label' => 'University Website',
                'name' => 'university_link',
                'type' => 'url',
                'placeholder' => 'https://...',
            ),
            array(
                'key' => 'field_university_description',
                'label' => 'Description',
                'name' => 'description',
                'type' => 'text',
                'placeholder' => 'Brief description of the university',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'university',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'active' => 1,
    ),
);

// In JSON để export
echo json_encode($acf_field_groups, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
