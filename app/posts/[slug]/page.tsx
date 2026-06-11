import { getPostBySlug, getAllPostSlugs } from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";

import { Section, Container, Article } from "@/components/craft";
// Đã lược bỏ component Prose mặc định để dễ tùy biến chiều rộng 100% bằng Tailwind
import { cn } from "@/lib/utils";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return await getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return generateContentMetadata({
    title: post.title.rendered,
    description: stripHtml(post.excerpt.rendered),
    slug: post.slug,
    basePath: "posts",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const author = post._embedded?.author?.[0];
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = post._embedded?.["wp:term"]?.[0]?.[0];
  
  // Đã chuyển định dạng ngày sang Tiếng Việt
  const date = new Date(post.date).toLocaleDateString("vi-VN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Section className="bg-gray-50/50 min-h-screen py-8">
      {/* Mở rộng max-width để trang trải đều đẹp hơn */}
      <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BẮT ĐẦU CHIA LƯỚI: 70% BÀI VIẾT - 30% SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* CỘT TRÁI: NỘI DUNG (CHIẾM 2 PHẦN) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            
            {/* 1. Khu vực Tiêu đề và Phân loại */}
            <div className="mb-8 border-b border-gray-100 pb-6">
              {category && (
                <Link
                  href={`/posts/?category=${category.id}`}
                  className="text-blue-600 text-sm font-semibold uppercase tracking-wider hover:text-blue-800 transition mb-3 inline-block"
                >
                  {category.name}
                </Link>
              )}

              <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
                <span dangerouslySetInnerHTML={{ __html: post.title.rendered }}></span>
              </h1>

              {/* 2. Khu vực Tác giả và Ngày tháng */}
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <span>Đăng ngày {date}</span>
                {author?.name && (
                  <>
                    <span>•</span>
                    <span>Bởi <a href={`/posts/?author=${author.id}`} className="hover:text-blue-600 font-medium">{author.name}</a></span>
                  </>
                )}
              </div>
            </div>

            {/* 3. Khu vực Ảnh đại diện */}
            {featuredMedia?.source_url && (
              <div className="w-full h-auto mb-8 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                {/* eslint-disable-next-line */}
                <img
                  className="w-full h-full object-cover max-h-[500px]"
                  src={featuredMedia.source_url}
                  alt={post.title.rendered}
                />
              </div>
            )}

            {/* 4. Nội dung bài viết WordPress đổ vào */}
            {/* Sử dụng Tailwind Typography (prose) để định dạng lại các thẻ h2, h3, p, img bên trong bài viết cho đẹp */}
            <div className="prose prose-blue max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-xl">
              <Article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
            </div>
          </div>

          {/* CỘT PHẢI: SIDEBAR GHIM CỐ ĐỊNH FORM (CHIẾM 1 PHẦN) */}
          <div className="lg:col-span-1 lg:sticky lg:top-8 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-50 relative overflow-hidden">
              
              {/* Điểm nhấn trang trí phía trên Form */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">
                Nhận tư vấn lộ trình
              </h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Để lại thông tin, chuyên viên tư vấn sẽ liên hệ hỗ trợ bạn định hướng trường và học bổng miễn phí.
              </p>

              {/* Form nhận dữ liệu */}
              <form action="#" method="POST" className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="Nguyễn Văn A" 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Số điện thoại / Zalo <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    placeholder="0912..." 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Hệ đào tạo quan tâm
                  </label>
                  <select 
                    name="program"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50/50 text-gray-600"
                  >
                    <option value="">-- Chọn hệ đào tạo --</option>
                    <option value="1-nam-tieng">Hệ 1 năm tiếng</option>
                    <option value="dai-hoc">Hệ Đại học</option>
                    <option value="thac-si">Hệ Thạc sĩ</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md active:scale-[0.98] transition duration-200 text-sm tracking-wide"
                  >
                    ĐĂNG KÝ NHẬN TƯ VẤN
                  </button>
                </div>
              </form>

              {/* Cam kết bảo mật */}
              <div className="mt-5 flex items-center justify-center space-x-1.5 text-[11px] text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Bảo mật thông tin tuyệt đối 100%</span>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </Section>
  );
}