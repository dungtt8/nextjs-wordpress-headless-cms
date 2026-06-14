import type { UniversityLogo } from "@/lib/home/types";

interface HomeUniversitiesMarqueeProps {
  items: UniversityLogo[];
}

export const MARQUEE_ANIMATION_CLASS = "chinahack-marquee";

export function HomeUniversitiesMarquee({ items }: HomeUniversitiesMarqueeProps) {
  const repeated = [...items, ...items];

  return (
    <section id="universities" className="space-y-4">
      <h2 className="px-6 text-3xl font-bold text-[#1F2937] lg:px-10">Universities</h2>
      <div className="overflow-hidden border-y bg-[#F9FAFB] py-4">
        <div className={`${MARQUEE_ANIMATION_CLASS} flex w-max gap-3 px-4`}>
          {repeated.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="rounded-full border bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
