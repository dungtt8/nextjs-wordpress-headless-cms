"use client";

import { ArrowRight, Compass, Crown, Sparkle } from "@phosphor-icons/react";
import { useTranslations, useLocale } from "next-intl";
import { UploadReadyImage } from "@/components/home/upload-ready-image";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { extractLocalized } from "@/lib/home/localized";
import type { ServicePlan } from "@/lib/home/types";

interface HomeServicesProps {
    plans: ServicePlan[];
}

export function HomeServices({ plans }: HomeServicesProps) {
    const t = useTranslations();
    const locale = useLocale();
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();

    return (
        <section id="services" ref={ref} className={`space-y-6 scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="poster-eyebrow">{t("services.eyebrow")}</p>
                    <h2 className="poster-title mt-2 text-3xl font-semibold leading-tight text-[#1F2937] lg:text-[2.3rem]">{t("services.heading")}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                        {t("services.description")}
                    </p>
                </div>
                <span className="poster-ribbon w-fit">{t("services.chooseTrack")}</span>
            </div>

            <div className="grid gap-5 lg:grid-cols-3 lg:items-start">
                {plans.map((plan, index) => (
                    <article
                        key={plan.id}
                        className={[
                            "flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1",
                            plan.id === "sv1"
                                ? "rounded-[28px] border border-violet-100 bg-white p-6 shadow-sm"
                                : plan.id === "sv2"
                                    ? "poster-card rounded-[32px] p-7 shadow-[0_24px_60px_rgba(109,40,217,0.14)] lg:-translate-y-3"
                                    : "rounded-[32px] border border-violet-200 bg-[radial-gradient(circle_at_top_right,rgba(196,181,253,0.26),transparent_30%),linear-gradient(180deg,#faf7ff,#ffffff)] p-7 shadow-[0_26px_70px_rgba(91,33,182,0.12)]"
                        ].join(" ")}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span
                                    className={[
                                        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                                        plan.id === "sv1"
                                            ? "bg-violet-50 text-violet-700"
                                            : plan.id === "sv2"
                                                ? "bg-violet-700 text-white"
                                                : "bg-white/80 text-violet-800 ring-1 ring-violet-200"
                                    ].join(" ")}
                                >
                                    {extractLocalized(plan.supportLabel, locale)}
                                </span>
                                <h3 className="mt-4 text-2xl font-semibold text-[#1F2937]">{plan.name}</h3>
                            </div>

                            {plan.id === "sv1" ? (
                                <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
                                    <Compass weight="thin" className="h-5 w-5" />
                                </div>
                            ) : null}

                            {plan.id === "sv2" && plan.highlightLabel ? (
                                <div className="text-right">
                                    <span className="poster-badge">{extractLocalized(plan.highlightLabel, locale)}</span>
                                </div>
                            ) : null}

                            {plan.id === "sv3" ? (
                                <div className="rounded-2xl bg-white/80 p-3 text-violet-700 ring-1 ring-violet-200">
                                    <Crown weight="thin" className="h-5 w-5" />
                                </div>
                            ) : null}
                        </div>

                        <p className="mt-3 text-sm leading-7 text-slate-600">{extractLocalized(plan.description, locale)}</p>

                        <div className="mt-4">
                            <UploadReadyImage
                                image={plan.image}
                                title={`${plan.name} visual`}
                                subtitle={t("services.imagePlaceholder")}
                                ratioClassName="aspect-[16/10]"
                            />
                        </div>

                        <div
                            className={[
                                "mt-5 rounded-2xl",
                                plan.id === "sv1"
                                    ? "bg-slate-50 px-4 py-4"
                                    : plan.id === "sv2"
                                        ? "poster-panel px-4 py-4"
                                        : "border border-violet-200 bg-white/80 px-4 py-4"
                            ].join(" ")}
                        >
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t("services.suitableFor")}</p>
                            <p className="mt-2 text-sm leading-7 text-slate-700">{extractLocalized(plan.audience, locale)}</p>
                        </div>

                        <div className="mt-5 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t("services.included")}</p>
                            <ul className="mt-3 space-y-3 text-sm text-slate-700">
                                {plan.features.map((feature) => (
                                    <li key={extractLocalized(feature, locale)} className="flex items-start gap-3 border-b border-violet-100/70 pb-3 last:border-b-0 last:pb-0">
                                        <span
                                            className={[
                                                "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                                                plan.id === "sv1"
                                                    ? "bg-violet-100 text-violet-700"
                                                    : plan.id === "sv2"
                                                        ? "bg-violet-700 text-white"
                                                        : "bg-violet-200/70 text-violet-800"
                                            ].join(" ")}
                                        >
                                            <Sparkle weight="thin" className="h-3 w-3" />
                                        </span>
                                        <span className="leading-6">{extractLocalized(feature, locale)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div
                            className={[
                                "mt-6",
                                plan.id === "sv3" ? "rounded-[24px] border border-violet-200 bg-white/85 p-4" : ""
                            ].join(" ")}
                        >
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t("services.companionLevel")}</p>
                            <p className="mt-2 text-sm leading-7 text-slate-700">{extractLocalized(plan.supportNote, locale)}</p>

                            {plan.premiumNote ? (
                                <p className="mt-4 border-l-2 border-violet-300 pl-4 text-sm leading-7 text-violet-900">
                                    {extractLocalized(plan.premiumNote, locale)}
                                </p>
                            ) : null}
                        </div>

                        <a
                            href={plan.ctaHref}
                            className={[
                                "mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition active:scale-95",
                                plan.id === "sv1"
                                    ? "border border-violet-200 bg-white text-violet-700 hover:border-violet-300"
                                    : plan.id === "sv2"
                                        ? "bg-[#6D28D9] text-white shadow-[0_14px_30px_rgba(109,40,217,0.22)]"
                                        : "bg-[#1F1636] text-white shadow-[0_14px_30px_rgba(31,22,54,0.18)]"
                            ].join(" ")}
                        >
                            {extractLocalized(plan.ctaText, locale)}
                            <ArrowRight weight="thin" className="h-4 w-4" />
                        </a>

                        {plan.id === "sv2" && index === 1 ? (
                            <p className="mt-4 text-xs font-medium text-violet-700">
                                {t("services.balanceNote")}
                            </p>
                        ) : null}
                    </article>
                ))}
            </div>
        </section>
    );
}
