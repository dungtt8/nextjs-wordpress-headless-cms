"use client";

import { Compass, GraduationCap, Sparkle, Star, UsersThree } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import type { HeroData } from "@/lib/home/types";

interface HomeHeroProps {
    data: HeroData;
}

export const HERO_CTA_CLASS =
    "inline-flex items-center gap-2 rounded-full bg-[#6D28D9] px-5 py-3 font-semibold text-white transition duration-300 hover:-translate-y-[2px] hover:shadow-lg";

export function HomeHero({ data }: HomeHeroProps) {
    const t = useTranslations();
    const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
    const { ref: imgRef, isVisible: imgVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1, delay: 200 });
    return (
        <section id="hero" className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div ref={ref} className={`space-y-7 scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
                <span className="poster-badge">
                    <Sparkle weight="thin" className="h-3.5 w-3.5" />
                    {t("hero.badge")}
                </span>

                <div className="space-y-4">
                    <h1 className="poster-title text-4xl font-semibold leading-[1.12] lg:text-5xl xl:text-[3.2rem]">
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
                    <span className="poster-ribbon">{t("hero.expertise")}</span>
                </div>
            </div>

            <div
                ref={imgRef}
                className={`poster-card relative overflow-hidden rounded-[34px] p-6 scroll-hidden-right ${imgVisible ? 'scroll-visible' : ''}`}
            >
                <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-r from-violet-200/40 via-fuchsia-100/35 to-transparent" />
                <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />
                <div className="relative flex flex-col gap-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="poster-badge whitespace-nowrap">{t("hero.guidance")}</span>
                        <span className="poster-ribbon whitespace-nowrap">{t("hero.title")}</span>
                    </div>

                    <div className="poster-panel rounded-[28px] p-6">
                        <p className="poster-eyebrow">{t("hero.storyPrompt")}</p>
                        <h2 className="poster-title mt-3 text-2xl font-semibold leading-tight text-violet-950 lg:text-[2.05rem]">
                            {t("hero.highlight")}
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            {t("hero.description")}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {[
                            { text: t("hero.applicationDirection"), icon: GraduationCap },
                            { text: t("whyChoose.medal"), icon: Compass },
                            { text: t("whyChoose.network"), icon: UsersThree },
                        ].map(({ text, icon: Icon }) => (
                            <div
                                key={text}
                                className="group flex items-center gap-3 rounded-2xl border border-violet-100/80 bg-white/70 px-4 py-3.5 transition-all duration-300 hover:border-violet-200 hover:bg-white hover:shadow-[0_8px_20px_rgba(109,40,217,0.08)]"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-[0_6px_14px_rgba(109,40,217,0.28)] transition-transform duration-300 group-hover:scale-105">
                                    <Icon weight="fill" className="h-4 w-4" />
                                </span>
                                <span className="text-left text-sm font-semibold leading-snug text-violet-950">
                                    {text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
