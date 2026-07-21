import { getAllCategories } from "@/lib/wordpress";
import { ArchiveList } from "@/components/archive-list";
import type { Category } from "@/lib/wordpress.d";
import type { Metadata } from "next";

export const revalidate = 3600;

// Legacy/duplicate route kept for reference — real content lives under /[locale]/posts.
export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse all categories of our blog posts",
  alternates: {
    canonical: "/posts.backup/categories",
  },
  robots: { index: false, follow: false },
};

export default async function Page() {
  const categories = await getAllCategories();

  return (
    <ArchiveList<Category>
      title="All Categories"
      items={categories}
      getItemHref={(c) => `/posts/?category=${c.id}`}
      getItemLabel={(c) => c.name}
      emptyMessage="No categories available yet."
    />
  );
}
