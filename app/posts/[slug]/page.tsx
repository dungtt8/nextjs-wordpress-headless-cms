import { getPostBySlug, getAllPostSlugs } from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";

import { Section, Container, Article, Prose } from "@/components/craft";
import { badgeVariants } from "@/components/ui/badge";
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
  
  // Định dạng ngày tháng Tiếng Việt chuẩn hóa
  const date = new Date(post.date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Section className="bg-[#f8fafc] min-h-screen py-10 font-sans antialiased">
      <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ĐƯỜNG DẪN BREADCRUMB NHỎ PHÍA TRÊN TIÊU ĐỀ */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 mb-4 tracking-wide uppercase">
          <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
          <span>/</span>
          <Link href="/posts" className="hover:text-blue-600 transition">Bài viết</Link>
          <span>/</span>
          <span className="text-slate-600 truncate max-w-[200px]">Chi tiết</span>
        </div>

        {/* BỐ CỤC CHIA GRID: 72% NỘI DUNG - 28% SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= CỘT TRÁI: KHU VỰC BÀI VIẾT (CHIẾM 8 CỘT) ================= */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/80">
            
            {/* 1. Phần phân loại và Badge */}
            <div className="flex items-center justify-between gap-4 mb-5">
              {category && (
                <Link
                  href={`/posts/?category=${category.id}`}
                  className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg tracking-wider uppercase hover:bg-blue-100/80 transition"
                >
                  {category.name}
                </Link>
              )}
              <div className="text-xs text-slate-400 flex items-center space-x-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>5 phút đọc</span>
              </div>
            </div>

            {/* 2. Tiêu đề bài viết kích thước lớn, tương phản cao */}
            <h1 className="text-2xl sm:text-3.5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }}></span>
            </h1>

            {/* 3. Khối thông tin tác giả nhỏ gọn tinh tế */}
            <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-6 text-sm text-slate-500">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-blue-600 border border-slate-200">
                {author?.name ? author.name.charAt(0).toUpperCase() : "R"}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-xs sm:text-sm">
                  {author?.name ? (
                    <a href={`/posts/?author=${author.id}`} className="hover:text-blue-600 transition">{author.name}</a>
                  ) : (
                    "Ban Biên Tập Riba"
                  )}
                </p>
                <p className="text-[11px] text-slate-400">Cập nhật ngày {date}</p>
              </div>
            </div>

            {/* 4. Ảnh đại diện bo góc lớn, đổ bóng nhẹ */}
            {featuredMedia?.source_url && (
              <div className="w-full mb-8 overflow-hidden rounded-2xl shadow-sm border border-slate-100">
                {/* eslint-disable-next-line */}
                <img
                  className="w-full h-full object-cover max-h-[460px] hover:scale-[1.01] transition duration-500"
                  src={featuredMedia.source_url}
                  alt={post.title.rendered}
                />
              </div>
            )}

            {/* 5. Khối nội dung chính được định dạng chi tiết đến từng thẻ HTML từ WordPress */}
            <div className="prose prose-slate max-w-none 
              prose-headings:text-slate-950 prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-[22px] sm:prose-h2:text-[24px] prose-h2:border-l-4 prose-h2:border-blue-600 prose-h2:pl-3.5 prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-[18px] sm:prose-h3:text-[20px] prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-slate-600 prose-p:text-[15.5px] sm:prose-p:text-[16.5px] prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-strong:text-slate-900 prose-strong:font-semibold
              prose-ol:list-decimal prose-ul:list-disc prose-li:text-slate-600 prose-li:text-[15.5px] prose-li:mb-2
              prose-img:rounded-2xl prose-img:shadow-sm prose-img:my-6"
            >
              <Article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
            </div>
          </div>

          {/* ================= CỘT PHẢI: SIDEBAR FORM TƯ VẤN (CHIẾM 4 CỘT) ================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)] border border-slate-100 relative overflow-hidden">
              
              {/* Dải màu Gradient thương hiệu ở đỉnh Card */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500"></div>
              
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs tracking-wider uppercase mt-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span>Hỗ trợ trực tuyến</span>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 leading-tight mb-2">
                Đăng Ký Tư Vấn Học Bổng
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Riba hỗ trợ kết nối, thẩm định hồ sơ và tối ưu tỷ lệ đỗ học bổng các trường hàng đầu Trung Quốc hoàn toàn miễn phí.
              </p>

              {/* Form dữ liệu với thiết kế Input tối giản hiện đại */}
              <form action="#" method="POST" className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Họ và tên của bạn <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="Ví dụ: Trần Văn Minh" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-slate-50/50 text-slate-800 placeholder-slate-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Số điện thoại / Zalo <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    placeholder="Ví dụ: 0987xxxxxx" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-slate-50/50 text-slate-800 placeholder-slate-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bậc học bạn muốn ứng tuyển
                  </label>
                  <select 
                    name="program"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-slate-50/50 text-slate-700 font-medium appearance-none cursor-pointer"
                  >
                    <option value="1-nam-tieng">Hệ 1 năm tiếng ngắn hạn</option>
                    <option value="dai-hoc">Hệ Đại học (Cử nhân)</option>
                    <option value="thac-si">Hệ Thạc sĩ / Tiến sĩ</option>
                  </select>
                </div>

                <div className="pt-3">
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/10 active:scale-[0.99] hover:shadow-blue-600/20 transition duration-200 text-xs sm:text-sm uppercase tracking-wider text-center"
                  >
                    Gửi yêu cầu chuyên viên liên hệ
                  </button>
                </div>
              </form>

              {/* Chân thẻ tăng độ tin cậy (Trust badge) */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center space-x-2 text-[11px] text-slate-400 font-medium">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Hệ thống bảo mật thông tin Riba mã hóa 256-bit</span>
              </div>

            </div>
          </div>

        </div>
      </Container>
    </Section>
  );
}