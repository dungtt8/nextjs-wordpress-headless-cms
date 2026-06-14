import type { HeroData } from "@/lib/home/types";

interface HomeHeroProps {
  data: HeroData;
}

export const HERO_CTA_CLASS =
  "inline-flex rounded-md bg-[#D97706] px-5 py-3 font-medium text-white transition duration-300 hover:-translate-y-[2px] hover:shadow-lg";

export function HomeHero({ data }: HomeHeroProps) {
  return (
    <section id="hero" className="grid items-center gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#9B1C1C]">
          ChinaHack
        </p>
        <h1 className="text-4xl font-extrabold leading-tight text-[#1F2937] lg:text-5xl">
          {data.title}
        </h1>
        <p className="text-base text-slate-600 lg:text-lg">{data.subtitle}</p>
        <a href={data.ctaHref} className={HERO_CTA_CLASS}>
          {data.ctaText}
        </a>
      </div>

      <picture className="block overflow-hidden rounded-2xl bg-[#F9FAFB]">
        <source srcSet={data.mentorImage.src} type="image/webp" />
        <img
          src={data.mentorImage.src}
          alt={data.mentorImage.alt}
          width={data.mentorImage.width}
          height={data.mentorImage.height}
          loading="eager"
          fetchPriority="high"
          className="h-auto w-full object-cover"
        />
      </picture>
    </section>
  );
}
