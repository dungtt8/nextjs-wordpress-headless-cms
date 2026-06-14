"use client";

import { useEffect, useRef, useState } from "react";
import type { ProcessStep } from "@/lib/home/types";

interface HomeProcessProps {
    steps: ProcessStep[];
}

export function HomeProcess({ steps }: HomeProcessProps) {
    const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const index = Number((entry.target as HTMLDivElement).dataset.index ?? 0);
                    if (!Number.isNaN(index)) {
                        setActiveIndex((prev) => Math.max(prev, index));
                    }
                });
            },
            { threshold: 0.5 }
        );

        stepRefs.current.forEach((node) => {
            if (node) observer.observe(node);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section id="process" className="space-y-6">
            <h2 className="text-3xl font-bold text-[#1F2937]">Process</h2>

            <div className="hidden gap-4 lg:grid lg:grid-cols-6">
                {steps.map((step, index) => (
                    <article
                        key={step.id}
                        className={`rounded-2xl border p-5 transition-colors ${index <= activeIndex ? "border-[#7C3AED]/40 bg-[#7C3AED]/5" : "border-slate-200 bg-white"
                            }`}
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Step {index + 1}</p>
                        <h3 className="mt-2 text-lg font-semibold text-[#1F2937]">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                    </article>
                ))}
            </div>

            <div className="process-vertical space-y-6 lg:hidden">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        ref={(node) => {
                            stepRefs.current[index] = node;
                        }}
                        data-index={index}
                        className="relative pl-8"
                    >
                        <span
                            className={`absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 ${index <= activeIndex ? "border-[#7C3AED] bg-[#7C3AED]" : "border-slate-300 bg-white"
                                }`}
                        />
                        <h3 className="text-lg font-semibold text-[#1F2937]">{step.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
