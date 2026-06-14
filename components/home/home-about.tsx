"use client";

import { useEffect, useRef, useState } from "react";
import type { AboutData } from "@/lib/home/types";

interface HomeAboutProps {
  data: AboutData;
}

export function HomeAbout({ data }: HomeAboutProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="grid gap-6 lg:grid-cols-2">
      <div>
        <h2 className="text-3xl font-bold text-[#1F2937]">{data.heading}</h2>
      </div>
      <div className="space-y-4 text-slate-600">
        <p>{data.body}</p>
        <blockquote
          className={`rounded-xl border-l-4 border-[#9B1C1C] bg-[#F9FAFB] p-4 text-[#1F2937] transition-opacity duration-700 ${
            visible ? "opacity-100 chinahack-fade-up" : "opacity-0"
          }`}
        >
          {data.highlightQuote}
        </blockquote>
      </div>
    </section>
  );
}
