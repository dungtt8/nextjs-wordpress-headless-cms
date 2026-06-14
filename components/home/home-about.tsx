"use client";

import { useEffect, useRef, useState } from "react";
import { UploadReadyImage } from "@/components/home/upload-ready-image";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
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

    const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
    const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2, delay: 150 });
    return (
        <section id="about" ref={ref} className="grid gap-6 lg:grid-cols-2">
            <div ref={leftRef} className={`space-y-4 scroll-hidden-left ${leftVisible ? 'scroll-visible' : ''}`}>
                <h2 className="text-3xl font-bold text-[#1F2937]">{data.heading}</h2>
                <UploadReadyImage
                    image={data.image}
                    title="Ảnh giới thiệu"
                    subtitle={data.imageCaption ?? "Có thể upload ảnh hoạt động thật của đội ngũ"}
                    ratioClassName="aspect-[5/4]"
                />
            </div>
            <div ref={rightRef} className={`space-y-4 text-slate-600 scroll-hidden-right ${rightVisible ? 'scroll-visible' : ''}`}>
                <p>{data.body}</p>
                <blockquote
                    className={`rounded-xl border-l-4 border-[#7C3AED] bg-[#F5F3FF] p-4 text-[#1F2937] transition-opacity duration-700 ${visible ? "opacity-100 chinahack-fade-up" : "opacity-0"
                        }`}
                >
                    {data.highlightQuote}
                </blockquote>
            </div>
        </section>
    );
}
