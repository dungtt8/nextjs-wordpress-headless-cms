"use client";

import { Quotes, Sparkle, Star } from "@phosphor-icons/react";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import type { HeroData } from "@/lib/home/types";

interface HomeHeroProps {
    data: HeroData;
}

export const HERO_CTA_CLASS =
    "inline-flex items-center gap-2 rounded-full bg-[#6D28D9] px-5 py-3 font-semibold text-white transition duration-300 hover:-translate-y-[2px] hover:shadow-lg";

export function HomeHero({ data }: HomeHeroProps) {
    const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
    const { ref: imgRef, isVisible: imgVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1, delay: 200 });
    return (
        <section id="hero" className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <div ref={ref} className={`space-y-6 scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
                <span className="poster-badge">
                    <Sparkle weight="thin" className="h-3.5 w-3.5" />
                    ChinaHack Mentorship
                </span>

                <div className="space-y-4">
                    <h1 className="poster-title text-4xl font-semibold leading-[1.05] lg:text-[4.1rem]">
                        {data.title}
                    </h1>
                    <div className="poster-divider" />
                </div>

                <p className="max-w-2xl text-[0.98rem] leading-8 text-slate-600 lg:text-lg">{data.subtitle}</p>
                <div className="flex flex-wrap items-center gap-3">
                    <a href={data.ctaHref} className={HERO_CTA_CLASS}>
                        <Star weight="thin" className="h-4 w-4" />
                        {data.ctaText}
                    </a>
                    <span className="poster-ribbon">Mentorship & Scholarship</span>
                </div>

                <div className="poster-quote-card max-w-xl rounded-[28px] p-5">
                    <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-violet-100/70 p-2 text-violet-700">
                            <Quotes weight="thin" className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="poster-eyebrow">Application Direction</p>
                            <p className="mt-2 text-sm leading-7 text-slate-700">
                                Định hướng học thuật, xây dựng hồ sơ học bổng và đồng hành qua từng vòng ứng tuyển theo đúng nhịp độ của từng mentee.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                ref={imgRef}
                className={`poster-card relative overflow-hidden rounded-[34px] p-5 scroll-hidden-right ${imgVisible ? 'scroll-visible' : ''}`}
            >
                <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-r from-violet-200/40 via-fuchsia-100/35 to-transparent" />
                <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />
                <div className="relative flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <span className="poster-badge">Our Guidance</span>
                        <span className="poster-ribbon">Du học Trung Quốc</span>
                    </div>

                    <div className="poster-panel rounded-[28px] p-5">
                        <p className="poster-eyebrow">Let your profile tell a story</p>
                        <h2 className="poster-title mt-3 text-2xl font-semibold leading-tight text-violet-950 lg:text-[2.05rem]">
                            Học bổng không chỉ là điểm số, mà là cách hồ sơ của bạn được định vị.
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            ChinaHack giúp bạn đi từ chiến lược hồ sơ, essay, hoạt động ngoại khóa đến cách trả lời phỏng vấn, theo một lộ trình rõ ràng và có người đồng hành sát sao.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {[
                            "Định hướng học thuật",
                            "Xây hồ sơ học bổng",
                            "Luyện phỏng vấn",
                        ].map((item) => (
                            <div key={item} className="poster-panel rounded-2xl px-4 py-3 text-center text-sm font-semibold text-violet-900">
                                {item}
                            </div>
                        ))}
                    </div>

                    <ul className="grid gap-2 border-t border-violet-100/80 pt-4 text-sm text-slate-700">
                        {[
                            "Academic-first positioning for scholarship applications",
                            "Hồ sơ được chuẩn hóa theo từng mốc deadline",
                            "Mentor phản hồi theo từng vòng cải thiện",
                        ].map((item) => (
                            <li key={item} className="poster-list-item leading-7">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
