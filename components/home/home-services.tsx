import type { ServicePlan } from "@/lib/home/types";

interface HomeServicesProps {
  plans: ServicePlan[];
}

export function HomeServices({ plans }: HomeServicesProps) {
  return (
    <section id="services" className="space-y-6">
      <h2 className="text-3xl font-bold text-[#1F2937]">Services</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <article
            key={plan.id}
            className={`rounded-xl border bg-white p-5 shadow-sm ${
              index === 1 ? "lg:scale-105" : ""
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
              className="mt-5 inline-flex rounded-md bg-[#D97706] px-4 py-2 text-sm font-medium text-white transition active:scale-95"
            >
              {plan.ctaText}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
