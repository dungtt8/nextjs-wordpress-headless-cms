"use client";

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
            className="min-w-[82%] snap-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:min-w-[52%] lg:min-w-0"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#9B1C1C]/10 text-sm font-semibold text-[#9B1C1C]">
              {mentor.name.slice(0, 2).toUpperCase()}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#1F2937]">{mentor.name}</h3>
            <p className="text-sm text-slate-500">{mentor.role}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{mentor.shortBio}</p>
            <button
              type="button"
              className="mt-4 rounded-lg border border-[#9B1C1C] px-4 py-2 text-sm font-medium text-[#9B1C1C] transition hover:bg-[#9B1C1C] hover:text-white"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setSelectedMentor(mentor);
              }}
            >
              View details
            </button>
          </article>
        ))}
      </div>

      {selectedMentor ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
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
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1F2937]">{selectedMentor.name}</h3>
                <p className="text-sm text-slate-500">{selectedMentor.role}</p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close mentor modal"
                className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-600"
                onClick={() => setSelectedMentor(null)}
              >
                X
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{selectedMentor.fullBio}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
