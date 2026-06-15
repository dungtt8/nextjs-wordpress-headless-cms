import { HomeAbout } from "@/components/home/home-about";
import { HomeBlogTabs } from "@/components/home/home-blog-tabs";
import { HomeCommunity } from "@/components/home/home-community";
import { HomeHero } from "@/components/home/home-hero";
import { HomeLeadForm } from "@/components/home/home-lead-form";
import { HomeMentors } from "@/components/home/home-mentors";
import { HomeProcess } from "@/components/home/home-process";
import { HomeServices } from "@/components/home/home-services";
import { HomeStats } from "@/components/home/home-stats";
import { HomeSuccessStories } from "@/components/home/home-success-stories";
import { HomeUniversitiesMarquee } from "@/components/home/home-universities-marquee";
import { HomeWhyChoose } from "@/components/home/home-why-choose";
import { normalizeHomeContent } from "@/lib/home/normalize";
import { getMentorProfiles, getPostsPaginated } from "@/lib/wordpress";

export const HOME_SECTION_IDS = [
  "hero",
  "about",
  "why-choose",
  "mentors",
  "stats",
  "process",
  "services",
  "universities",
  "success-stories",
  "blog",
  "community",
  "lead-form",
] as const;

export default async function HomePage() {
  const [postsResponse, mentorProfiles] = await Promise.all([
    getPostsPaginated(1, 9).catch(() => ({
      data: [],
      headers: { total: 0, totalPages: 0 },
    })),
    getMentorProfiles(),
  ]);

  const content = normalizeHomeContent({ mentors: mentorProfiles });

  return (
    <main className="home-stage px-5 py-12 sm:px-7 lg:px-10 lg:py-16">
      <HomeHero data={content.hero} />
      <HomeAbout data={content.about} />
      <HomeWhyChoose items={content.whyChoose} />
      <HomeMentors mentors={content.mentors} />
      <HomeStats stats={content.stats} />
      <HomeProcess steps={content.process} />
      <HomeServices plans={content.services} />
      <HomeUniversitiesMarquee items={content.universities} />
      <HomeSuccessStories stories={content.successStories} />
      <HomeBlogTabs tabs={content.blogTabs} posts={postsResponse.data} />
      <HomeCommunity channels={content.community} />
      <HomeLeadForm data={content.leadForm} />
    </main>
  );
}
