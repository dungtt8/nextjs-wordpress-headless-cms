export interface HeroData {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
    mentorImage: {
        src: string;
        alt: string;
        width: number;
        height: number;
    };
}

export interface HomeImageAsset {
    src: string;
    alt: string;
}

export interface AboutData {
    heading: string;
    body: string;
    highlightQuote: string;
    image?: HomeImageAsset;
    imageCaption?: string;
}

export interface WhyChooseItem {
    id: string;
    title: LocalizedString;
    description: LocalizedString;
    icon: "book" | "medal" | "network" | "target";
    image?: HomeImageAsset;
}

export interface MentorItem {
    id: string;
    name: LocalizedString;
    role: LocalizedString;
    avatar: string;
    headline: LocalizedString;
    shortBio: LocalizedString;
    fullBio: LocalizedString;
    focusAreas: LocalizedString[];
    achievements: LocalizedString[];
    quote: LocalizedString;
}

export interface StatsItem {
    id: string;
    label: LocalizedString;
    value: number;
    suffix?: string;
}

export interface ProcessStep {
    id: string;
    title: LocalizedString;
    description: LocalizedString;
    image?: HomeImageAsset;
}

export interface ServicePlan {
    id: string;
    name: string;
    description: LocalizedString;
    image?: HomeImageAsset;
    audience: LocalizedString;
    supportLabel: LocalizedString;
    supportNote: LocalizedString;
    features: LocalizedString[];
    ctaText: LocalizedString;
    ctaHref: string;
    highlightLabel?: LocalizedString;
    isFeatured?: boolean;
    premiumNote?: LocalizedString;
}

export interface UniversityLogo {
    id: string;
    name: string;
    logo: string;
}

export interface SuccessStory {
    id: string;
    studentName: string;
    avatar: string;
    quote: LocalizedString;
    outcome: LocalizedString;
}

export interface BlogTab {
    id: string;
    label: LocalizedString;
    slug: string;
}

export interface CommunityChannel {
    id: string;
    name: string;
    description: string;
    href: string;
    bannerImage: string;
}

export interface LeadFormContent {
    title: string;
    subtitle: string;
    submitText: string;
    loadingText: string;
}

export interface LeadFormPayload {
    fullName: string;
    email: string;
    phone: string;
    gpa: string;
    note?: string;
}

export interface LocalizedString {
    en: string;
    vi: string;
    zh: string;
}

export interface LocalizedHeroData {
    title: LocalizedString;
    subtitle: LocalizedString;
    ctaText: LocalizedString;
}

export interface LocalizedAboutData {
    heading: LocalizedString;
    body: LocalizedString;
    highlightQuote: LocalizedString;
}

export interface LocalizedLeadFormContent {
    title: LocalizedString;
    subtitle: LocalizedString;
    submitText: LocalizedString;
}

export interface SiteSettings {
    hero: LocalizedHeroData;
    about: LocalizedAboutData;
    leadForm: LocalizedLeadFormContent;
}

export interface HomeContent {
    hero: HeroData;
    about: AboutData;
    whyChoose: WhyChooseItem[];
    mentors: MentorItem[];
    stats: StatsItem[];
    process: ProcessStep[];
    services: ServicePlan[];
    universities: UniversityLogo[];
    successStories: SuccessStory[];
    blogTabs: BlogTab[];
    community: CommunityChannel[];
    leadForm: LeadFormContent;
}
