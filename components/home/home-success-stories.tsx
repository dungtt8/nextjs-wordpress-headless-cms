"use client";

import { useRef } from "react";
import type { SuccessStory } from "@/lib/home/types";

interface HomeSuccessStoriesProps {
  stories: SuccessStory[];
}

export function HomeSuccessStories({ stories }: HomeSuccessStoriesProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const move = (direction: "left" | "right") => {
    const node = scrollRef.current;
    if (!node) return;
    const delta = direction === "left" ? -360 : 360;
    node.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section id="success-stories" className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl font-bold text-[#1F2937]">Success Stories</h2>
        <div className="hidden gap-2 lg:flex">
          <button
            type="button"
            aria-label="Previous story"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            onClick={() => move("left")}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next story"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
            className="min-w-[88%] snap-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:min-w-[55%] md:min-w-[360px]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9B1C1C]">
              {story.studentName}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-[#1F2937]">{story.outcome}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{story.quote}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
