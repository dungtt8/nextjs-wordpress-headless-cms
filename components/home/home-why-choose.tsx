"use client";

import { BookOpen, Medal, Network, Target } from "lucide-react";
import { UploadReadyImage } from "@/components/home/upload-ready-image";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import type { WhyChooseItem } from "@/lib/home/types";

interface HomeWhyChooseProps {
    items: WhyChooseItem[];
}

function iconFor(key: WhyChooseItem["icon"]) {
    if (key === "book") return BookOpen;
    if (key === "medal") return Medal;
    if (key === "network") return Network;
    return Target;
}

export function HomeWhyChoose({ items }: HomeWhyChooseProps) {
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();
    return (
        <section id="why-choose" ref={ref} className={`space-y-6 scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
            <h2 className="text-3xl font-bold text-[#1F2937]">Why Choose Us</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {items.map((item) => {
                    const Icon = iconFor(item.icon);
                    return (
                        <article
                            key={item.id}
                            className="group space-y-4 rounded-xl border border-violet-100 bg-violet-50 p-5 transition duration-300 hover:bg-violet-100 hover:shadow-md"
                        >
                            <UploadReadyImage
                                image={item.image}
                                title="Ảnh minh họa"
                                subtitle="Sẵn sàng nhận ảnh upload từ CMS"
                                ratioClassName="aspect-[16/10]"
                                className="border-violet-100"
                            />

                            <Icon className="h-6 w-6 text-slate-500 transition duration-300 group-hover:text-[#7C3AED]" />
                            <h3 className="font-semibold text-[#1F2937]">{item.title}</h3>
                            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
