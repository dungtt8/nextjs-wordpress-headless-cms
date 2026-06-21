"use client";

import { ArrowUpRight, Globe } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import type { CommunityChannel } from "@/lib/home/types";

interface HomeCommunityProps {
    channels: CommunityChannel[];
}

function getChannelLogo(name: string) {
    const normalizedName = name.toLowerCase();

    if (normalizedName.includes("facebook")) {
        return { src: "/facebook.svg", alt: "Facebook logo" };
    }

    if (normalizedName.includes("tiktok")) {
        return { src: "/tiktok.svg", alt: "TikTok logo" };
    }

    if (normalizedName.includes("youtube")) {
        return { src: "/youtube.svg", alt: "YouTube logo" };
    }

    return null;
}

export function HomeCommunity({ channels }: HomeCommunityProps) {
    const t = useTranslations();
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();
    return (
        <section id="community" ref={ref} className={`space-y-6 scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="poster-eyebrow">{t("community.heading")}</p>
                    <h2 className="poster-title mt-2 text-3xl font-semibold leading-tight text-[#1F2937] lg:text-[2.3rem]">{t("community.subtitle")}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                        {t("community.description")}
                    </p>
                </div>
                <span className="poster-ribbon w-fit">Join the community</span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {channels.map((channel) => (
                    <CommunityCard key={channel.id} channel={channel} />
                ))}
            </div>
        </section>
    );
}

function CommunityCard({ channel }: { channel: CommunityChannel }) {
    const logo = getChannelLogo(channel.name);

    return (
        <a
            href={channel.href}
            className="poster-card group rounded-[28px] p-5 transition duration-300 hover:-translate-y-1"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="rounded-2xl bg-violet-100 p-3 text-violet-700 transition duration-300 group-hover:bg-violet-600 group-hover:text-white">
                    {logo ? (
                        <Image
                            src={logo.src}
                            alt={logo.alt}
                            width={20}
                            height={20}
                            className="h-5 w-5"
                        />
                    ) : (
                        <Globe weight="thin" className="h-5 w-5" />
                    )}
                </div>
                <span className="poster-badge">Social channel</span>
            </div>

            <h3 className="poster-title mt-5 text-xl font-semibold text-[#1F2937]">{channel.name}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{channel.description}</p>

            <div className="mt-5 border-t border-violet-100/80 pt-4 flex items-center gap-2 text-sm font-semibold text-violet-700">
                Theo dõi ngay
                <ArrowUpRight weight="thin" className="h-4 w-4" />
            </div>
        </a>
    );
}
