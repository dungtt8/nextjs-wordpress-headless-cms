"use client";

import { GraduationCap, Medal, Quotes, Sparkle, X } from "@phosphor-icons/react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MentorItem, LocalizedString } from "@/lib/home/types";

interface HomeMentorsProps {
    mentors: MentorItem[];
}

function extractLocalized(value: LocalizedString | string, locale: string): string {
    if (typeof value === "string") return value;
    return value[locale as keyof LocalizedString] || value.en || "";
}

function getMentorInitials(name: string): string {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

interface MentorPortraitProps {
    mentor: MentorItem;
    className: string;
    initialsClassName: string;
    sizes?: string;
    locale: string;
}

function MentorPortrait({ mentor, className, initialsClassName, sizes = "(max-width: 1024px) 50vw, 160px", locale }: MentorPortraitProps) {
    const mentorName = extractLocalized(mentor.name, locale);
    return (
        <div className={`${className} relative overflow-hidden border border-violet-200/80 bg-violet-50/80 shadow-sm`}>
            {mentor.avatar ? (
                <Image
                    src={mentor.avatar}
                    alt={`Chân dung mentor ${mentorName}`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes={sizes}
                />
            ) : (
                <div className={`flex h-full w-full items-center justify-center bg-linear-to-br from-violet-600 to-fuchsia-600 ${initialsClassName}`}>
                    {getMentorInitials(mentorName)}
                </div>
            )}
            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/40" />
        </div>
    );
}

export function HomeMentors({ mentors }: HomeMentorsProps) {
    const t = useTranslations();
    const locale = useLocale();
    const [selectedMentor, setSelectedMentor] = useState<MentorItem | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!selectedMentor) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelectedMentor(null);
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = originalOverflow;
            triggerRef.current?.focus();
        };
    }, [selectedMentor]);

    return (
        <section id="mentors" className="space-y-6">
            <div className="space-y-4">
                <p className="poster-eyebrow">{t("mentors.profiles")}</p>
                <h2 className="poster-title text-3xl font-semibold leading-tight lg:text-[2.35rem]">{t("mentors.heading")}</h2>
                <p className="max-w-3xl text-sm leading-7 text-slate-600">
                    {t("mentors.description")}
                </p>
            </div>

            <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
                {mentors.map((mentor) => (
                    <article
                        key={mentor.id}
                        className="poster-card min-w-[82%] snap-start rounded-[28px] p-5 sm:min-w-[52%] lg:min-w-0"
                    >
                        <div className="space-y-4">
                            <MentorPortrait
                                mentor={mentor}
                                className="mx-auto aspect-[3/4] w-full max-w-[210px] rounded-[24px]"
                                initialsClassName="text-4xl font-semibold text-white"
                                sizes="(max-width: 640px) 60vw, (max-width: 1024px) 34vw, 210px"
                                locale={locale}
                            />
                            <div className="pointer-events-none -mt-16 mx-auto w-full max-w-[210px] rounded-b-[24px] bg-linear-to-t from-slate-950/80 via-slate-950/45 to-transparent px-4 pb-4 pt-8 text-white">
                                <h3 className="text-base font-semibold leading-tight">{extractLocalized(mentor.name, locale)}</h3>
                                <p className="mt-1 text-xs font-medium text-violet-100">{extractLocalized(mentor.role, locale)}</p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-500">
                                    {t("mentors.profileLabel")}
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-sm font-semibold leading-6 text-[#1F2937]">{extractLocalized(mentor.headline, locale)}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{extractLocalized(mentor.shortBio, locale)}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {mentor.focusAreas.map((area) => (
                                <span
                                    key={extractLocalized(area, locale)}
                                    className="rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-xs font-medium text-violet-700"
                                >
                                    {extractLocalized(area, locale)}
                                </span>
                            ))}
                        </div>

                        <div className="poster-quote-card mt-5 rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
                                <Medal weight="thin" className="h-4 w-4" />
                                {t("mentors.achievements")}
                            </div>
                            <ul className="mt-2 space-y-2">
                                {mentor.achievements.slice(0, 2).map((achievement) => (
                                    <li key={extractLocalized(achievement, locale)} className="poster-list-item text-sm leading-6 text-slate-600">
                                        {extractLocalized(achievement, locale)}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            type="button"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#7C3AED] px-4 py-2 text-sm font-medium text-[#7C3AED] transition hover:bg-[#7C3AED] hover:text-white"
                            onClick={(event) => {
                                triggerRef.current = event.currentTarget;
                                setSelectedMentor(mentor);
                            }}
                        >
                            <Sparkle weight="thin" className="h-4 w-4" />
                            {t("mentors.viewProfile")}
                        </button>
                    </article>
                ))}
            </div>

            {selectedMentor ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedMentor(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${extractLocalized(selectedMentor.name, locale)} details`}
                        className="poster-modal-surface w-full max-w-5xl rounded-[32px] p-6 shadow-2xl lg:p-8"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-500">
                                    {t("mentors.profileLabel")}
                                </p>
                                <h3 className="mt-2 text-2xl font-semibold text-[#1F2937] lg:text-3xl">
                                    {extractLocalized(selectedMentor.name, locale)}
                                </h3>
                                <p className="mt-1 text-sm font-medium text-violet-700">{extractLocalized(selectedMentor.role, locale)}</p>
                            </div>
                            <button
                                ref={closeButtonRef}
                                type="button"
                                aria-label="Close mentor modal"
                                className="rounded-xl border border-violet-200 bg-violet-50 p-2 text-violet-700 transition hover:bg-violet-100"
                                onClick={() => setSelectedMentor(null)}
                            >
                                <X weight="thin" className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                            <aside className="overflow-hidden rounded-[28px] bg-linear-to-br from-violet-700 via-violet-600 to-purple-700 p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">
                                            {t("mentors.profileLabel")}
                                        </p>
                                        <MentorPortrait
                                            mentor={selectedMentor}
                                            className="aspect-[3/4] w-[168px] rounded-3xl border-white/30"
                                            initialsClassName="text-3xl font-semibold text-white"
                                            sizes="168px"
                                            locale={locale}
                                        />
                                        <p className="mt-3 text-lg font-semibold leading-7">
                                            {extractLocalized(selectedMentor.headline, locale)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="flex items-start gap-3">
                                        <Quotes weight="thin" className="mt-0.5 h-5 w-5 shrink-0 text-violet-100" />
                                        <p className="text-sm leading-6 text-violet-50">{extractLocalized(selectedMentor.quote, locale)}</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-sm font-semibold text-white">{t("mentors.strengths")}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {selectedMentor.focusAreas.map((area) => (
                                            <span
                                                key={extractLocalized(area, locale)}
                                                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-violet-50"
                                            >
                                                {extractLocalized(area, locale)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </aside>

                            <div className="space-y-5">
                                <div className="poster-panel rounded-[28px] p-5">
                                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
                                        <GraduationCap weight="thin" className="h-4 w-4" />
                                        {t("mentors.overview")}
                                    </div>
                                    <p className="mt-3 text-sm leading-7 text-slate-700">{extractLocalized(selectedMentor.fullBio, locale)}</p>
                                </div>

                                <div className="poster-quote-card rounded-[28px] p-5">
                                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
                                        <Medal weight="thin" className="h-4 w-4" />
                                        {t("mentors.achievements")}
                                    </div>
                                    <ul className="mt-4 space-y-3">
                                        {selectedMentor.achievements.map((achievement) => (
                                            <li key={extractLocalized(achievement, locale)} className="flex gap-3 text-sm leading-6 text-slate-700">
                                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                                                <span>{extractLocalized(achievement, locale)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
