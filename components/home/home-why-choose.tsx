import { BookOpen, Medal, Network, Target } from "lucide-react";
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
  return (
    <section id="why-choose" className="space-y-6">
      <h2 className="text-3xl font-bold text-[#1F2937]">Why Choose Us</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = iconFor(item.icon);
          return (
            <article
              key={item.id}
              className="group rounded-xl border bg-white p-5 transition duration-300 hover:bg-slate-50 hover:shadow-md"
            >
              <Icon className="mb-3 h-6 w-6 text-slate-500 transition duration-300 group-hover:text-[#9B1C1C]" />
              <h3 className="font-semibold text-[#1F2937]">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
