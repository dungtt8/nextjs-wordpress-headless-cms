"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { BlogTab } from "@/lib/home/types";
import type { Post } from "@/lib/wordpress.d";
import { MIN_BLOG_TAB_SKELETON_MS } from "@/lib/home/normalize";

interface HomeBlogTabsProps {
    tabs: BlogTab[];
    posts: Post[];
}

function parseText(html: string) {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function byTab(posts: Post[], tab: string) {
    if (tab === "all") return posts;
    const needle = tab.toLowerCase();
    return posts.filter((post) => {
        const title = post.title.rendered.toLowerCase();
        const excerpt = post.excerpt.rendered.toLowerCase();
        return title.includes(needle) || excerpt.includes(needle);
    });
}

export function HomeBlogTabs({ tabs, posts }: HomeBlogTabsProps) {
    const t = useTranslations();
    const firstTab = tabs[0]?.slug ?? "all";
    const [activeTab, setActiveTab] = useState(firstTab);
    const [displayTab, setDisplayTab] = useState(firstTab);
    const [isLoading, setIsLoading] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleTabChange = (nextTab: string) => {
        if (nextTab === activeTab) return;

        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
        }

        setActiveTab(nextTab);
        setIsLoading(true);

        timerRef.current = window.setTimeout(() => {
            setDisplayTab(nextTab);
            setIsLoading(false);
            timerRef.current = null;
        }, MIN_BLOG_TAB_SKELETON_MS);
    };

    const cards = useMemo(() => byTab(posts, displayTab).slice(0, 3), [posts, displayTab]);

    return (
        <section id="blog" className="space-y-6">
            <div className="space-y-3">
                <p className="poster-eyebrow">{t("blog.editorial")}</p>
                <h2 className="poster-title text-3xl font-semibold text-[#1F2937] lg:text-[2.2rem]">{t("blog.heading")}</h2>
            </div>

            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${activeTab === tab.slug
                            ? "border-[#7C3AED] bg-[#7C3AED] text-white"
                            : "border-slate-300 bg-white text-slate-700"
                            }`}
                        onClick={() => handleTabChange(tab.slug)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <div key={`skeleton-${index}`} className="skeleton-shimmer h-56 rounded-2xl border border-slate-200 bg-white" />
                    ))
                    : cards.map((post) => (
                        <article key={post.id} className="poster-card rounded-[24px] p-5 shadow-sm">
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                                {new Date(post.date).toLocaleDateString("en-US")}
                            </p>
                            <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-[#1F2937]">
                                {post.title.rendered}
                            </h3>
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                                {parseText(post.excerpt.rendered)}
                            </p>
                            <Link href={`/posts/${post.slug}`} className="mt-4 inline-block text-sm font-semibold text-[#7C3AED]">
                                Read more
                            </Link>
                        </article>
                    ))}
            </div>
        </section>
    );
}
