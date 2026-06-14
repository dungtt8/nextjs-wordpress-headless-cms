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
    title: string;
    description: string;
    icon: "book" | "medal" | "network" | "target";
    image?: HomeImageAsset;
}

export interface MentorItem {
    id: string;
    name: string;
    role: string;
    avatar: string;
    profileLabel: string;
    headline: string;
    shortBio: string;
    fullBio: string;
    focusAreas: string[];
    achievements: string[];
    quote: string;
}

export interface StatsItem {
    id: string;
    label: string;
    value: number;
    suffix?: string;
}

export interface ProcessStep {
    id: string;
    title: string;
    description: string;
    image?: HomeImageAsset;
}

export interface ServicePlan {
    id: string;
    name: string;
    description: string;
    image?: HomeImageAsset;
    audience: string;
    supportLabel: string;
    supportNote: string;
    features: string[];
    ctaText: string;
    ctaHref: string;
    highlightLabel?: string;
    isFeatured?: boolean;
    premiumNote?: string;
}

export interface UniversityLogo {
    id: string;
    name: string;
    logo: string;
}

export interface SuccessStory {
    id: string;
    studentName: string;
    quote: string;
    outcome: string;
    avatar: string;
}

export interface BlogTab {
    id: string;
    label: string;
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
