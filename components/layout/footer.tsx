import { Section, Container } from "@/components/craft";
import { ArrowUpRight, EnvelopeSimple, FacebookLogo, Phone, Sparkle } from "@phosphor-icons/react/ssr";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteConfig } from "@/site.config";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const footerSections = [
    { label: "Giới thiệu", href: "/#about" },
    { label: "Mentors", href: "/#mentors" },
    { label: "Mentee stories", href: "/#success-stories" },
    { label: "Cộng đồng", href: "/#community" },
  ];

  const footerResources = [
    { label: "Blog học bổng", href: "/posts" },
    { label: "Danh mục bài viết", href: "/posts/categories" },
    { label: "Tags", href: "/posts/tags" },
    { label: "Đăng ký tư vấn", href: "/#lead-form" },
  ];

  return (
    <footer className="border-t border-violet-100 bg-violet-50/60">
      <Section>
        <Container className="grid gap-10 md:grid-cols-[1.25fr_0.8fr_0.8fr_1fr]">
          <div className="flex flex-col gap-6 not-prose">
            <div className="poster-card rounded-[28px] p-6">
              <Link href="/" className="flex items-center gap-4">
                <h3 className="sr-only">{siteConfig.site_name}</h3>
                <Image
                  src={Logo}
                  alt="Logo"
                  className="dark:invert"
                  width={42}
                  height={26.44}
                />
                <div>
                  <p className="poster-eyebrow">ChinaHack</p>
                  <p className="font-display mt-1 text-xl font-semibold text-[#1F2937]">Mentorship & Scholarship Application</p>
                </div>
              </Link>

              <p className="mt-5 text-sm leading-7 text-slate-600">{siteConfig.site_description}</p>

              <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#6e59b1] px-4 py-2 text-sm font-semibold text-white shadow-sm">
                <Sparkle weight="thin" className="h-4 w-4" />
                Du học Trung Quốc cùng lộ trình cá nhân hóa
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <h5 className="text-base font-semibold text-[#1F2937]">Khám phá</h5>
            {footerSections.map((item) => (
              <Link
                className="inline-flex items-center gap-2 text-slate-600 transition hover:text-violet-700"
                key={item.href}
                href={item.href}
              >
                <ArrowUpRight weight="thin" className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <h5 className="text-base font-semibold text-[#1F2937]">Tài nguyên</h5>
            {footerResources.map((item) => (
              <Link
                className="inline-flex items-center gap-2 text-slate-600 transition hover:text-violet-700"
                key={item.href}
                href={item.href}
              >
                <ArrowUpRight weight="thin" className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <h5 className="text-base font-semibold text-[#1F2937]">Liên hệ</h5>
            <a
              className="inline-flex items-center gap-3 text-slate-600 transition hover:text-violet-700"
              href="https://facebook.com/chinahackduhoctq"
              target="_blank"
              rel="noreferrer"
            >
              <FacebookLogo weight="thin" className="h-4 w-4" />
              facebook.com/chinahackduhoctq
            </a>
            <a
              className="inline-flex items-center gap-3 text-slate-600 transition hover:text-violet-700"
              href="tel:0962094058"
            >
              <Phone weight="thin" className="h-4 w-4" />
              0962 094 058
            </a>
            <a
              className="inline-flex items-center gap-3 text-slate-600 transition hover:text-violet-700"
              href="mailto:hello@chinahack.vn"
            >
              <EnvelopeSimple weight="thin" className="h-4 w-4" />
              hello@chinahack.vn
            </a>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Đồng hành cùng học sinh, sinh viên trong hành trình định hướng học thuật, xây hồ sơ học bổng và nộp đơn du học Trung Quốc.
            </p>
          </div>
        </Container>

        <Container className="mt-10 border-t border-violet-100 not-prose flex flex-col gap-6 pt-6 md:flex-row md:items-center md:justify-between md:gap-2">
          <ThemeToggle />
          <div className="flex flex-col gap-1 text-sm text-slate-500 md:items-end">
            <p>&copy; {siteConfig.site_name}. All rights reserved. 2025-present.</p>
            <p>
              Website được xây dựng bởi{" "}
              <a
                href="https://revonexus.net"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-violet-700 transition hover:text-violet-800"
              >
                revonexus.net
              </a>
            </p>
          </div>
        </Container>
      </Section>
    </footer>
  );
}
