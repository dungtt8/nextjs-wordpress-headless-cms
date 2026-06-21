"use client";

import { Quotes, Star } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import type { SuccessStory } from "@/lib/home/types";

interface HomeSuccessStoriesProps {
    stories: SuccessStory[];
}

export function HomeSuccessStories({ stories }: HomeSuccessStoriesProps) {
    const t = useTranslations();
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();

    const move = (direction: "left" | "right") => {
        const node = scrollRef.current;
        if (!node) return;
        const delta = direction === "left" ? -360 : 360;
        node.scrollBy({ left: delta, behavior: "smooth" });
    };

    return (
        <section id="success-stories" ref={ref} className={`space-y-6 scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="poster-eyebrow">{t("successStories.fromMentee")}</p>
                    <h2 className="poster-title mt-2 text-3xl font-semibold text-[#1F2937] lg:text-[2.3rem]">{t("successStories.heading")}</h2>
                </div>
                <div className="hidden gap-2 lg:flex">
                    <button
                        type="button"
                        aria-label="Previous story"
                        className="rounded-full border border-violet-200 bg-white/90 px-3 py-2 text-sm text-violet-700 shadow-sm transition hover:-translate-y-0.5"
                        onClick={() => move("left")}
                    >
                        ←
                    </button>
                    <button
                        type="button"
                        aria-label="Next story"
                        className="rounded-full border border-violet-200 bg-white/90 px-3 py-2 text-sm text-violet-700 shadow-sm transition hover:-translate-y-0.5"
                        onClick={() => move("right")}
                    >
                        →
                    </button>
                </div>
            </div>

            <div ref={scrollRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
                {stories.map((story) => (
                    <article
                        key={story.id}
                        className="poster-card min-w-[88%] snap-start rounded-[28px] p-6 sm:min-w-[55%] md:min-w-[360px]"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="poster-eyebrow">{t("successStories.fromMentee")}</p>
                                <h3 className="mt-2 text-xl font-semibold text-[#1F2937]">{story.studentName}</h3>
                            </div>
                            <div className="rounded-2xl bg-violet-100 p-2 text-violet-700">
                                <Quotes weight="thin" className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="poster-quote-card mt-5 rounded-[24px] p-5">
                            <p className="text-sm leading-7 text-slate-700">“{story.quote}”</p>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-violet-700">{t("successStories.outcome")}</p>
                                <p className="mt-1 text-lg font-semibold text-[#1F2937]">{story.outcome}</p>
                            </div>
                            <div className="poster-ribbon">
                                <Star weight="thin" className="mr-2 h-4 w-4" />
                                {t("successStories.story")}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
