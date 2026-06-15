"use client";

import { GraduationCap, Sparkle } from "@phosphor-icons/react";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import type { UniversityLogo } from "@/lib/home/types";

interface HomeUniversitiesMarqueeProps {
    items: UniversityLogo[];
}

export const MARQUEE_ANIMATION_CLASS = "chinahack-marquee";

export function HomeUniversitiesMarquee({ items }: HomeUniversitiesMarqueeProps) {
    const repeated = [...items, ...items];
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();

    return (
        <section id="universities" ref={ref} className={`space-y-4 scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
            <div className="flex flex-col gap-3">
                <p className="poster-eyebrow">Một số trường tiêu biểu</p>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 className="poster-title text-3xl font-semibold leading-tight text-[#1F2937] lg:text-[2.3rem]">Mentee ChinaHack đang theo học tại đâu?</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                            Từ các trường top đầu đến những lựa chọn phù hợp học bổng ngành học, ChinaHack định hướng lộ trình dựa trên mức độ phù hợp thay vì chỉ chạy theo danh sách trường nổi tiếng.
                        </p>
                    </div>
                    <span className="poster-ribbon w-fit">Scholarship destinations</span>
                </div>
            </div>

            <div className="poster-card overflow-hidden rounded-[32px] px-2 py-5">
                <div className={`${MARQUEE_ANIMATION_CLASS} flex w-max gap-3 px-4`}>
                    {repeated.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="poster-panel flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium text-slate-700"
                        >
                            <span className="rounded-full bg-violet-100 p-2 text-violet-700">
                                {index % 2 === 0 ? <GraduationCap weight="thin" className="h-4 w-4" /> : <Sparkle weight="thin" className="h-4 w-4" />}
                            </span>
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
