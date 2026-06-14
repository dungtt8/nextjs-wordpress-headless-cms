import { describe, expect, it } from "vitest";
import {
  buildHeroData,
  mergeHeroWithFallback,
  MIN_BLOG_TAB_SKELETON_MS,
  normalizeHomeContent,
  shouldAnimateStats,
} from "@/lib/home/normalize";
import { fallbackHomeContent } from "@/lib/home/content";

describe("home normalize helpers", () => {
  it("fills missing hero fields from fallback", () => {
    const result = mergeHeroWithFallback({ title: "Custom Title" });

    expect(result.title).toBe("Custom Title");
    expect(result.subtitle).toBe(fallbackHomeContent.hero.subtitle);
    expect(result.ctaText).toBe(fallbackHomeContent.hero.ctaText);
  });

  it("builds a complete hero object when input is empty", () => {
    const hero = buildHeroData();

    expect(hero.title.length).toBeGreaterThan(0);
    expect(hero.mentorImage.src.length).toBeGreaterThan(0);
  });

  it("keeps fallback arrays when upstream arrays are empty", () => {
    const result = normalizeHomeContent({ whyChoose: [] });

    expect(result.whyChoose.length).toBe(
      fallbackHomeContent.whyChoose.length
    );
  });

  it("uses at least 300ms for blog skeleton delay", () => {
    expect(MIN_BLOG_TAB_SKELETON_MS).toBeGreaterThanOrEqual(300);
  });

  it("runs stats only once", () => {
    expect(shouldAnimateStats(false)).toBe(true);
    expect(shouldAnimateStats(true)).toBe(false);
  });
});
