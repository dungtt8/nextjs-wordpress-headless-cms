"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { StatsItem } from "@/lib/home/types";
import { shouldAnimateStats } from "@/lib/home/normalize";

interface HomeStatsProps {
  stats: StatsItem[];
}

const DURATION_MS = 1500;

export function HomeStats({ stats }: HomeStatsProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [progress, setProgress] = useState(0);

  const displayValues = useMemo(
    () =>
      stats.map((stat) => ({
        ...stat,
        display: Math.round(stat.value * progress).toLocaleString("en-US"),
      })),
    [progress, stats]
  );

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !shouldAnimateStats(hasAnimated)) return;

        setHasAnimated(true);
        const start = performance.now();

        const tick = (now: number) => {
          const elapsed = now - start;
          const ratio = Math.min(elapsed / DURATION_MS, 1);
          setProgress(ratio);
          if (ratio < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="stats" ref={rootRef} className="space-y-6">
      <h2 className="text-3xl font-bold text-[#1F2937]">Stats</h2>
      <div className="grid grid-cols-2 gap-4 lg:flex lg:gap-6">
        {displayValues.map((stat) => (
          <article key={stat.id} className="flex-1 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-3xl font-bold text-[#9B1C1C] md:text-4xl">
              {stat.display}
              {stat.suffix ? <span className="ml-1 text-lg">{stat.suffix}</span> : null}
            </p>
            <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
