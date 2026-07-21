import { fallbackHomeContent } from '@/lib/home/content';
import { HomeHero } from '@/components/home/home-hero';
import { HomeAbout } from '@/components/home/home-about';
import { HomeWhyChoose } from '@/components/home/home-why-choose';
import { HomeServices } from '@/components/home/home-services';
import { HomeProcess } from '@/components/home/home-process';
import { HomeMentors } from '@/components/home/home-mentors';
import { HomeStats } from '@/components/home/home-stats';
import { HomeSuccessStories } from '@/components/home/home-success-stories';
import { HomeBlogTabs } from '@/components/home/home-blog-tabs';
import { HomeCommunity } from '@/components/home/home-community';
import { HomeLeadForm } from '@/components/home/home-lead-form';
import { HomeUniversitiesMarquee } from '@/components/home/home-universities-marquee';
import { Section, Container, Article } from '@/components/craft';
import { getMentorProfiles, getRecentPosts, getSuccessStories, getUniversities, getSiteSettings } from '@/lib/wordpress';
import { generateContentMetadata } from '@/lib/metadata';
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from '@/lib/json-ld';
import { JsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/site.config';
import type { Locale } from '@/lib/i18n';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const langCode = (locale === 'en' || locale === 'vi' || locale === 'zh') ? locale : 'en';
  const seo = siteConfig.seo[langCode];

  return generateContentMetadata({
    title: seo.title,
    description: seo.description,
    path: "",
    locale: locale as Locale,
    type: "website",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch data from WordPress in parallel
  const [mentors, posts, successStories, universities, siteSettings] = await Promise.all([
    getMentorProfiles(),
    getRecentPosts(),
    getSuccessStories(),
    getUniversities(),
    getSiteSettings(),
  ]);

  // Map locale to valid language code (en, vi, zh)
  const langCode = (locale === 'en' || locale === 'vi' || locale === 'zh') ? locale : 'en';

  // Use WordPress data if available, otherwise fall back to default content
  // For multilingual sections (hero, about, leadForm), use locale-specific content from WordPress
  const content = {
    ...fallbackHomeContent,
    hero: {
      ...fallbackHomeContent.hero,
      title: siteSettings.hero.title[langCode],
      subtitle: siteSettings.hero.subtitle[langCode],
      ctaText: siteSettings.hero.ctaText[langCode],
    },
    about: {
      ...fallbackHomeContent.about,
      heading: siteSettings.about.heading[langCode],
      body: siteSettings.about.body[langCode],
      highlightQuote: siteSettings.about.highlightQuote[langCode],
    },
    leadForm: {
      ...fallbackHomeContent.leadForm,
      title: siteSettings.leadForm.title[langCode],
      subtitle: siteSettings.leadForm.subtitle[langCode],
      submitText: siteSettings.leadForm.submitText[langCode],
    },
    mentors: mentors.length > 0 ? mentors : fallbackHomeContent.mentors,
    successStories: successStories.length > 0 ? successStories : fallbackHomeContent.successStories,
    universities: universities.length > 0 ? universities : fallbackHomeContent.universities,
  };

  console.log(`[HomePage] locale=${langCode} | Fetched ${mentors.length} mentors, ${posts.length} posts, ${successStories.length} success stories, ${universities.length} universities`);

  return (
    <main className="space-y-0">
      <JsonLd data={buildOrganizationJsonLd()} />
      <JsonLd data={buildWebsiteJsonLd(langCode)} />
      {/* Hero Section */}
      <Section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <Container>
          <HomeHero data={content.hero} />
        </Container>
      </Section>

      {/* About Section */}
      <Section>
        <Container>
          <HomeAbout data={content.about} />
        </Container>
      </Section>

      {/* Why Choose Section */}
      <Section className="bg-gray-50">
        <Container>
          <HomeWhyChoose items={content.whyChoose} />
        </Container>
      </Section>

      {/* Services Section */}
      <Section>
        <Container>
          <HomeServices plans={content.services} />
        </Container>
      </Section>

      {/* Mentors Section */}
      <Section className="bg-gray-50">
        <Container>
          <HomeMentors mentors={content.mentors} />
        </Container>
      </Section>

      {/* Process Section */}
      <Section>
        <Container>
          <HomeProcess steps={content.process} />
        </Container>
      </Section>

      {/* Universities Marquee */}
      {content.universities && content.universities.length > 0 && (
        <Section className="bg-gray-50">
          <Container>
            <HomeUniversitiesMarquee items={content.universities} />
          </Container>
        </Section>
      )}

      {/* Stats Section */}
      <Section>
        <Container>
          <HomeStats stats={content.stats} />
        </Container>
      </Section>

      {/* Success Stories Section */}
      {content.successStories && content.successStories.length > 0 && (
        <Section className="bg-gray-50">
          <Container>
            <HomeSuccessStories stories={content.successStories} />
          </Container>
        </Section>
      )}

      {/* Blog/Updates Section */}
      {content.blogTabs && (
        <Section>
          <Container>
            <HomeBlogTabs tabs={content.blogTabs} posts={posts} />
          </Container>
        </Section>
      )}

      {/* Community Section */}
      {content.community && (
        <Section className="bg-gray-50">
          <Container>
            <HomeCommunity channels={content.community} />
          </Container>
        </Section>
      )}

      {/* Lead Form Section */}
      <Section id="lead-form" className="bg-gradient-to-b from-white to-purple-50">
        <Container>
          <HomeLeadForm data={content.leadForm} />
        </Container>
      </Section>
    </main>
  );
}
