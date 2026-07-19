import { getAllAuthors } from "@/lib/wordpress";
import { ArchiveList } from "@/components/archive-list";
import type { Author } from "@/lib/wordpress.d";
import type { Metadata } from "next";

export const revalidate = 3600;

// Legacy/duplicate route kept for reference — real content lives under /[locale]/posts.
export const metadata: Metadata = {
  title: "All Authors",
  description: "Browse all authors of our blog posts",
  alternates: {
    canonical: "/posts.backup/authors",
  },
  robots: { index: false, follow: false },
};

export default async function Page() {
  const authors = await getAllAuthors();

  return (
    <ArchiveList<Author>
      title="All Authors"
      items={authors}
      getItemHref={(a) => `/posts/?author=${a.id}`}
      getItemLabel={(a) => a.name}
      emptyMessage="No authors available yet."
    />
  );
}
