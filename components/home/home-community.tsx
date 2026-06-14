import type { CommunityChannel } from "@/lib/home/types";

interface HomeCommunityProps {
  channels: CommunityChannel[];
}

export function HomeCommunity({ channels }: HomeCommunityProps) {
  return (
    <section id="community" className="space-y-6">
      <h2 className="text-3xl font-bold text-[#1F2937]">Community</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {channels.map((channel) => (
          <a
            key={channel.id}
            href={channel.href}
            className="rounded-xl border bg-white p-5 transition hover:scale-[1.02]"
          >
            <h3 className="text-lg font-semibold text-[#1F2937]">{channel.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{channel.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
