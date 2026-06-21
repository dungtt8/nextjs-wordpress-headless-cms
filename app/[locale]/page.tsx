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
import { getMentorProfiles, getRecentPosts } from '@/lib/wordpress';

export default async function HomePage() {
  // Fetch data from WordPress in parallel
  const [mentors, posts] = await Promise.all([
    getMentorProfiles(),
    getRecentPosts(),
  ]);

  // Use WordPress data if available, otherwise fall back to default content
  const content = {
    ...fallbackHomeContent,
    mentors: mentors.length > 0 ? mentors : fallbackHomeContent.mentors,
  };

  return (
    <main className="space-y-0">
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

      {/* Process Section */}
      <Section className="bg-gray-50">
        <Container>
          <HomeProcess steps={content.process} />
        </Container>
      </Section>

      {/* Stats Section */}
      <Section>
        <Container>
          <HomeStats stats={content.stats} />
        </Container>
      </Section>

      {/* Mentors Section */}
      <Section className="bg-gray-50">
        <Container>
          <HomeMentors mentors={content.mentors} />
        </Container>
      </Section>

      {/* Universities Marquee */}
      {content.universities && content.universities.length > 0 && (
        <Section>
          <Container>
            <HomeUniversitiesMarquee items={content.universities} />
          </Container>
        </Section>
      )}

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
