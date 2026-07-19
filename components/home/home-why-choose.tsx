"use client";

import { BookOpen, Medal, ShareNetwork, Target } from "@phosphor-icons/react";
import { useTranslations, useLocale } from "next-intl";
import { UploadReadyImage } from "@/components/home/upload-ready-image";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { extractLocalized } from "@/lib/home/localized";
import type { WhyChooseItem } from "@/lib/home/types";

interface HomeWhyChooseProps {
    items: WhyChooseItem[];
}

function iconFor(key: WhyChooseItem["icon"]) {
    if (key === "book") return BookOpen;
    if (key === "medal") return Medal;
    if (key === "network") return ShareNetwork;
    return Target;
}

export function HomeWhyChoose({ items }: HomeWhyChooseProps) {
    const t = useTranslations();
    const locale = useLocale();
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();
    return (
        <section id="why-choose" ref={ref} className={`space-y-6 scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
            <div className="space-y-4">
                <p className="poster-eyebrow">{t("whyChoose.eyebrow")}</p>
                <h2 className="poster-title text-3xl font-semibold leading-tight lg:text-[2.35rem]">
                    {t("whyChoose.heading")}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-slate-600">
                    {t("whyChoose.description")}
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {items.map((item) => {
                    const Icon = iconFor(item.icon);
                    return (
                        <article
                            key={item.id}
                            className="poster-card group space-y-4 rounded-[24px] p-5 transition duration-300 hover:-translate-y-1"
                        >
                            <UploadReadyImage
                                image={item.image}
                                title={t("whyChoose.illustration")}
                                subtitle={t("whyChoose.imagePlaceholder")}
                                ratioClassName="aspect-[16/10]"
                                className="border-violet-100"
                            />

                            <div className="flex items-center gap-3 border-b border-violet-100/80 pb-3">
                                <Icon weight="thin" className="h-5 w-5 text-violet-700 transition duration-300" />
                                <h3 className="text-base font-semibold text-[#1F2937]">{extractLocalized(item.title, locale)}</h3>
                            </div>
                            <p className="text-sm leading-7 text-slate-600">{extractLocalized(item.description, locale)}</p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
