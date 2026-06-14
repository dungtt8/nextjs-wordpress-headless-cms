"use client";

import { ArrowDown, Sparkles } from "lucide-react";
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
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="poster-eyebrow">Lộ trình đồng hành</p>
                    <h2 className="mt-2 text-3xl font-bold text-[#1F2937]">Từng bước rõ ràng, theo đúng flow của hồ sơ học bổng</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                        Mỗi giai đoạn đều có đầu ra cụ thể để mentee biết mình đang ở đâu, cần chuẩn bị gì tiếp theo và khi nào nên chuyển sang bước kế tiếp.
                    </p>
                </div>
                <span className="poster-ribbon w-fit">Editorial flow</span>
            </div>

            <div className="relative hidden lg:block">
                <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-linear-to-b from-violet-200 via-violet-300 to-violet-200" />

                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        ref={(node) => {
                            stepRefs.current[index] = node;
                        }}
                        data-index={index}
                        className="grid min-h-[220px] grid-cols-[minmax(0,1fr)_84px_minmax(0,1fr)] items-center gap-6"
                    >
                        <div className={index % 2 === 0 ? "col-start-1" : "col-start-3"}>
                            <article
                                className={`rounded-[28px] p-6 transition-all ${index <= activeIndex
                                        ? "poster-card border-violet-300 shadow-[0_20px_50px_rgba(124,58,237,0.14)]"
                                        : "border border-slate-200 bg-white shadow-sm"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <span className="poster-badge">Step {index + 1}</span>
                                    {index < steps.length - 1 ? <ArrowDown className="h-4 w-4 text-violet-400" /> : null}
                                </div>
                                <h3 className="mt-4 text-xl font-semibold text-[#1F2937]">{step.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                                <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-700">
                                    <Sparkles className="h-4 w-4" />
                                    {index <= activeIndex ? "Đang kích hoạt" : "Bước kế tiếp"}
                                </div>
                            </article>
                        </div>

                        <div className="col-start-2 flex flex-col items-center justify-center">
                            <div
                                className={`flex h-14 w-14 items-center justify-center rounded-full border-4 bg-white text-sm font-bold transition-colors ${index <= activeIndex
                                        ? "border-violet-500 text-violet-700 shadow-[0_0_0_8px_rgba(167,139,250,0.18)]"
                                        : "border-slate-300 text-slate-500"
                                    }`}
                            >
                                0{index + 1}
                            </div>
                        </div>
                    </div>
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
