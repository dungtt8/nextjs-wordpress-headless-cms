import { fallbackHomeContent } from "@/lib/home/content";
import type { HomeContent, HeroData } from "@/lib/home/types";

type PartialHomeInput = Partial<{
  [K in keyof HomeContent]: Partial<HomeContent[K]> | HomeContent[K];
}>;

export const MIN_BLOG_TAB_SKELETON_MS = 300;

export function mergeHeroWithFallback(partial?: Partial<HeroData>): HeroData {
  return {
    ...fallbackHomeContent.hero,
    ...(partial ?? {}),
    mentorImage: {
      ...fallbackHomeContent.hero.mentorImage,
      ...(partial?.mentorImage ?? {}),
    },
  };
}

export function shouldAnimateStats(hasAnimated: boolean) {
  return !hasAnimated;
}

export function buildHeroData(raw?: Partial<HeroData>) {
  return mergeHeroWithFallback(raw);
}

export function normalizeHomeContent(input?: PartialHomeInput): HomeContent {
  return {
    hero: mergeHeroWithFallback(input?.hero as Partial<HeroData> | undefined),
    about: {
      ...fallbackHomeContent.about,
      ...(input?.about ?? {}),
    },
    whyChoose:
      Array.isArray(input?.whyChoose) && input.whyChoose.length > 0
        ? (input.whyChoose as HomeContent["whyChoose"])
        : fallbackHomeContent.whyChoose,
    mentors:
      Array.isArray(input?.mentors) && input.mentors.length > 0
        ? (input.mentors as HomeContent["mentors"])
        : fallbackHomeContent.mentors,
    stats:
      Array.isArray(input?.stats) && input.stats.length > 0
        ? (input.stats as HomeContent["stats"])
        : fallbackHomeContent.stats,
    process:
      Array.isArray(input?.process) && input.process.length > 0
        ? (input.process as HomeContent["process"])
        : fallbackHomeContent.process,
    services:
      Array.isArray(input?.services) && input.services.length > 0
        ? (input.services as HomeContent["services"])
        : fallbackHomeContent.services,
    universities:
      Array.isArray(input?.universities) && input.universities.length > 0
        ? (input.universities as HomeContent["universities"])
        : fallbackHomeContent.universities,
    successStories:
      Array.isArray(input?.successStories) && input.successStories.length > 0
        ? (input.successStories as HomeContent["successStories"])
        : fallbackHomeContent.successStories,
    blogTabs:
      Array.isArray(input?.blogTabs) && input.blogTabs.length > 0
        ? (input.blogTabs as HomeContent["blogTabs"])
        : fallbackHomeContent.blogTabs,
    community:
      Array.isArray(input?.community) && input.community.length > 0
        ? (input.community as HomeContent["community"])
        : fallbackHomeContent.community,
    leadForm: {
      ...fallbackHomeContent.leadForm,
      ...(input?.leadForm ?? {}),
    },
  };
}
