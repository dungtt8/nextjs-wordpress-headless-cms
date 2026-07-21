import { getAllTags } from "@/lib/wordpress";
import { ArchiveList } from "@/components/archive-list";
import type { Tag } from "@/lib/wordpress.d";
import type { Metadata } from "next";

export const revalidate = 3600;

// Legacy/duplicate route kept for reference — real content lives under /[locale]/posts.
export const metadata: Metadata = {
  title: "All Tags",
  description: "Browse all tags of our blog posts",
  alternates: {
    canonical: "/posts.backup/tags",
  },
  robots: { index: false, follow: false },
};

export default async function Page() {
  const tags = await getAllTags();

  return (
    <ArchiveList<Tag>
      title="All Tags"
      items={tags}
      getItemHref={(t) => `/posts/?tag=${t.id}`}
      getItemLabel={(t) => t.name}
      emptyMessage="No tags available yet."
    />
  );
}
