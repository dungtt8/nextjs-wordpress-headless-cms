"use client";

import type { ComponentType } from "react";
import {
    ArrowRight,
    ChartLineUp,
    GraduationCap,
    Headset,
    Info,
    Microphone,
    NotePencil,
    ShieldCheck,
    XCircle,
} from "@phosphor-icons/react";
import { useTranslations, useLocale } from "next-intl";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { extractLocalized } from "@/lib/home/localized";
import type { ServicePlan, ServicePlanSectionIcon } from "@/lib/home/types";

interface HomeServicesProps {
    plans: ServicePlan[];
}

const SECTION_ICONS: Record<ServicePlanSectionIcon, ComponentType<{ weight?: "thin" | "regular" | "bold"; className?: string }>> = {
    profile: NotePencil,
    optimize: ChartLineUp,
    apply: GraduationCap,
    interview: Microphone,
    support: Headset,
};

function formatPrice(value: number, currency: string, locale: string): string {
    const grouped = value.toLocaleString(locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US");
    return `${grouped} ${currency}`;
}

export function HomeServices({ plans }: HomeServicesProps) {
    const t = useTranslations();
    const locale = useLocale();
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();

    return (
        <section id="services" ref={ref} className={`space-y-6 scroll-hidden ${isVisible ? "scroll-visible" : ""}`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="poster-eyebrow">{t("services.eyebrow")}</p>
                    <h2 className="poster-title mt-2 text-3xl font-semibold leading-tight text-[#1F2937] lg:text-[2.3rem]">{t("services.heading")}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{t("services.description")}</p>
                </div>
                <span className="poster-ribbon w-fit">{t("services.chooseTrack")}</span>
            </div>

            <div className="grid gap-5 lg:grid-cols-3 lg:items-start">
                {plans.map((plan) => {
                    const isFeatured = plan.id === "sv2";
                    const isPremium = plan.id === "sv3";

                    return (
                        <article
                            key={plan.id}
                            className={[
                                "flex h-full flex-col overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1 lg:p-7",
                                isFeatured
                                    ? "poster-card rounded-[32px] shadow-[0_24px_60px_rgba(109,40,217,0.14)] lg:-translate-y-3"
                                    : isPremium
                                        ? "rounded-[32px] border border-violet-200 bg-[radial-gradient(circle_at_top_right,rgba(196,181,253,0.26),transparent_30%),linear-gradient(180deg,#faf7ff,#ffffff)] shadow-[0_26px_70px_rgba(91,33,182,0.12)]"
                                        : "rounded-[28px] border border-violet-100 bg-white shadow-sm"
                            ].join(" ")}
                        >
                            <div className="border-b border-violet-100 pb-5">
                                <div className="flex items-center justify-between gap-3">
                                    <span
                                        className={[
                                            "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                                            isFeatured ? "bg-violet-700 text-white" : isPremium ? "bg-white/80 text-violet-800 ring-1 ring-violet-200" : "bg-violet-50 text-violet-700"
                                        ].join(" ")}
                                    >
                                        {extractLocalized(plan.packageLabel, locale)}
                                    </span>
                                </div>

                                <h3 className="poster-title mt-4 text-2xl font-semibold text-[#1F2937]">{extractLocalized(plan.name, locale)}</h3>

                                <p className="mt-3 text-3xl font-semibold tracking-tight text-violet-700">
                                    {formatPrice(plan.priceValue, plan.currency, locale)}
                                </p>
                            </div>

                            <div className="flex flex-1 flex-col pt-5">
                                <div className="flex-1 space-y-5">
                                    {plan.sections.map((section, sectionIndex) => {
                                        const Icon = SECTION_ICONS[section.icon];
                                        return (
                                            <div
                                                key={extractLocalized(section.title, locale)}
                                                className={sectionIndex === 0 ? "" : "border-t border-violet-100 pt-5"}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                                                        <Icon weight="thin" className="h-4 w-4" />
                                                    </span>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                                        {extractLocalized(section.title, locale)}
                                                    </p>
                                                </div>
                                                <ul className="mt-3 space-y-2 pl-9 text-sm leading-6 text-slate-700">
                                                    {section.items.map((item) => (
                                                        <li key={extractLocalized(item, locale)} className="list-disc marker:text-violet-300">
                                                            {extractLocalized(item, locale)}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>

                                {plan.note ? (
                                    <div className="mt-5 flex items-start gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                                        <Info weight="thin" className="mt-0.5 h-4 w-4 shrink-0" />
                                        <p>
                                            <span className="font-semibold uppercase tracking-[0.1em]">{t("services.note")}: </span>
                                            {extractLocalized(plan.note, locale)}
                                        </p>
                                    </div>
                                ) : null}

                                <div
                                    className={[
                                        "mt-5 rounded-2xl border px-4 py-4",
                                        plan.refundPolicy.type === "none" ? "border-slate-200 bg-slate-50" : "border-violet-200 bg-violet-50"
                                    ].join(" ")}
                                >
                                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                                        {plan.refundPolicy.type === "none" ? (
                                            <XCircle weight="bold" className="h-4 w-4 text-slate-400" />
                                        ) : (
                                            <ShieldCheck weight="bold" className="h-4 w-4 text-violet-700" />
                                        )}
                                        {t("services.refundPolicy")}
                                    </p>

                                    {plan.refundPolicy.type === "none" ? (
                                        <span className="mt-3 inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                                            {t("services.noRefund")}
                                        </span>
                                    ) : (
                                        <ul className="mt-3 space-y-2 text-sm font-medium leading-6 text-violet-900">
                                            {plan.refundPolicy.items.map((item) => (
                                                <li key={extractLocalized(item, locale)} className="list-disc pl-4 marker:text-violet-400">
                                                    {extractLocalized(item, locale)}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <a
                                    href={plan.ctaHref}
                                    className={[
                                        "mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition active:scale-95",
                                        isFeatured
                                            ? "bg-[#6D28D9] text-white shadow-[0_14px_30px_rgba(109,40,217,0.22)]"
                                            : isPremium
                                                ? "bg-[#1F1636] text-white shadow-[0_14px_30px_rgba(31,22,54,0.18)]"
                                                : "border border-violet-200 bg-white text-violet-700 hover:border-violet-300"
                                    ].join(" ")}
                                >
                                    {extractLocalized(plan.ctaText, locale)}
                                    <ArrowRight weight="thin" className="h-4 w-4" />
                                </a>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
