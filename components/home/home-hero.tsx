"use client";

import { Quote, Sparkles, Star } from "lucide-react";
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
        <section id="hero" className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div ref={ref} className={`space-y-5 scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
                <span className="poster-badge">
                    <Sparkles className="h-3.5 w-3.5" />
                    ChinaHack Mentorship
                </span>
                <h1 className="text-4xl font-extrabold leading-tight text-[#1F2937] lg:text-6xl">
                    {data.title}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-600 lg:text-lg">{data.subtitle}</p>
                <div className="flex flex-wrap items-center gap-3">
                    <a href={data.ctaHref} className={HERO_CTA_CLASS}>
                        <Star className="h-4 w-4" />
                        {data.ctaText}
                    </a>
                    <span className="poster-ribbon">Mentorship & Scholarship</span>
                </div>

                <div className="poster-quote-card max-w-xl rounded-[28px] p-5">
                    <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-violet-100 p-2 text-violet-700">
                            <Quote className="h-4 w-4" />
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
                <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-r from-violet-200/45 via-fuchsia-100/40 to-transparent" />
                <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />
                <div className="relative flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <span className="poster-badge">Our Guidance</span>
                        <span className="poster-ribbon">Du học Trung Quốc</span>
                    </div>

                    <div className="poster-panel rounded-[28px] p-5">
                        <p className="poster-eyebrow">Let your profile tell a story</p>
                        <h2 className="mt-3 text-2xl font-extrabold leading-tight text-violet-950 lg:text-3xl">
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
                </div>
            </div>
        </section>
    );
}
