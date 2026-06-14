"use client";

import { Award, GraduationCap, Quote, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MentorItem } from "@/lib/home/types";

interface HomeMentorsProps {
    mentors: MentorItem[];
}

export function HomeMentors({ mentors }: HomeMentorsProps) {
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
            <h2 className="text-3xl font-bold text-[#1F2937]">Team Mentors</h2>

            <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
                {mentors.map((mentor) => (
                    <article
                        key={mentor.id}
                        className="poster-card min-w-[82%] snap-start rounded-[28px] p-5 sm:min-w-[52%] lg:min-w-0"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-500">
                                    {mentor.profileLabel}
                                </p>
                                <h3 className="mt-2 text-xl font-semibold text-[#1F2937]">{mentor.name}</h3>
                                <p className="mt-1 text-sm font-medium text-violet-700">{mentor.role}</p>
                            </div>
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-base font-semibold text-white shadow-sm">
                                {mentor.name
                                    .split(" ")
                                    .map((part) => part[0])
                                    .slice(0, 2)
                                    .join("")}
                            </div>
                        </div>

                        <p className="mt-4 text-sm font-semibold leading-6 text-[#1F2937]">{mentor.headline}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{mentor.shortBio}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {mentor.focusAreas.map((area) => (
                                <span
                                    key={area}
                                    className="rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-xs font-medium text-violet-700"
                                >
                                    {area}
                                </span>
                            ))}
                        </div>

                        <div className="poster-quote-card mt-5 rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
                                <Award className="h-4 w-4" />
                                Thành tích nổi bật
                            </div>
                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                                {mentor.achievements[0]}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#7C3AED] px-4 py-2 text-sm font-medium text-[#7C3AED] transition hover:bg-[#7C3AED] hover:text-white"
                            onClick={(event) => {
                                triggerRef.current = event.currentTarget;
                                setSelectedMentor(mentor);
                            }}
                        >
                            <Sparkles className="h-4 w-4" />
                            Xem hồ sơ chi tiết
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
                        aria-label={`${selectedMentor.name} details`}
                        className="poster-modal-surface w-full max-w-5xl rounded-[32px] p-6 shadow-2xl lg:p-8"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-500">
                                    {selectedMentor.profileLabel}
                                </p>
                                <h3 className="mt-2 text-2xl font-semibold text-[#1F2937] lg:text-3xl">
                                    {selectedMentor.name}
                                </h3>
                                <p className="mt-1 text-sm font-medium text-violet-700">{selectedMentor.role}</p>
                            </div>
                            <button
                                ref={closeButtonRef}
                                type="button"
                                aria-label="Close mentor modal"
                                className="rounded-xl border border-violet-200 bg-violet-50 p-2 text-violet-700 transition hover:bg-violet-100"
                                onClick={() => setSelectedMentor(null)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                            <aside className="overflow-hidden rounded-[28px] bg-linear-to-br from-violet-700 via-violet-600 to-purple-700 p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">
                                            ChinaHack Mentor Profile
                                        </p>
                                        <p className="mt-3 text-lg font-semibold leading-7">
                                            {selectedMentor.headline}
                                        </p>
                                    </div>
                                    <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white/15 text-xl font-semibold text-white backdrop-blur-sm">
                                        {selectedMentor.name
                                            .split(" ")
                                            .map((part) => part[0])
                                            .slice(0, 2)
                                            .join("")}
                                    </div>
                                </div>

                                <div className="mt-6 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="flex items-start gap-3">
                                        <Quote className="mt-0.5 h-5 w-5 shrink-0 text-violet-100" />
                                        <p className="text-sm leading-6 text-violet-50">{selectedMentor.quote}</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-sm font-semibold text-white">Thế mạnh mentoring</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {selectedMentor.focusAreas.map((area) => (
                                            <span
                                                key={area}
                                                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-violet-50"
                                            >
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </aside>

                            <div className="space-y-5">
                                <div className="poster-panel rounded-[28px] p-5">
                                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
                                        <GraduationCap className="h-4 w-4" />
                                        Tổng quan hồ sơ
                                    </div>
                                    <p className="mt-3 text-sm leading-7 text-slate-700">{selectedMentor.fullBio}</p>
                                </div>

                                <div className="poster-quote-card rounded-[28px] p-5">
                                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
                                        <Award className="h-4 w-4" />
                                        Thành tích nổi bật
                                    </div>
                                    <ul className="mt-4 space-y-3">
                                        {selectedMentor.achievements.map((achievement) => (
                                            <li key={achievement} className="flex gap-3 text-sm leading-6 text-slate-700">
                                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                                                <span>{achievement}</span>
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
