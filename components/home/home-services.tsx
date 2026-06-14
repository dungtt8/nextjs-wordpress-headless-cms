"use client";

import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import type { ServicePlan } from "@/lib/home/types";

interface HomeServicesProps {
    plans: ServicePlan[];
}

export function HomeServices({ plans }: HomeServicesProps) {
    const { ref, isVisible } = useScrollAnimation<HTMLElement>();
    return (
        <section id="services" ref={ref} className={`space-y-6 scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
            <h2 className="text-3xl font-bold text-[#1F2937]">Services</h2>
            <div className="grid gap-4 lg:grid-cols-3">
                {plans.map((plan, index) => (
                    <article
                        key={plan.id}
                        className={`rounded-xl border border-violet-100 bg-violet-50 p-5 shadow-sm ${index === 1 ? "lg:scale-105" : ""
                            }`}
                    >
                        <h3 className="text-xl font-semibold text-[#1F2937]">{plan.name}</h3>
                        <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            {plan.features.map((feature) => (
                                <li key={feature}>- {feature}</li>
                            ))}
                        </ul>
                        <a
                            href={plan.ctaHref}
                            className="mt-5 inline-flex rounded-md bg-[#6D28D9] px-4 py-2 text-sm font-medium text-white transition active:scale-95"
                        >
                            {plan.ctaText}
                        </a>
                    </article>
                ))}
            </div>
        </section>
    );
}
