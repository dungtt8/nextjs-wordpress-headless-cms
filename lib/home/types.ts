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

export type ServicePlanSectionIcon = "profile" | "optimize" | "apply" | "interview" | "support";

export interface ServicePlanSection {
    icon: ServicePlanSectionIcon;
    title: LocalizedString;
    items: LocalizedString[];
}

export interface ServicePlanRefundPolicy {
    type: "none" | "conditional";
    items: LocalizedString[];
}

export interface ServicePlan {
    id: string;
    packageLabel: LocalizedString;
    name: LocalizedString;
    priceValue: number;
    currency: string;
    sections: ServicePlanSection[];
    note?: LocalizedString;
    refundPolicy: ServicePlanRefundPolicy;
    ctaText: LocalizedString;
    ctaHref: string;
    isFeatured?: boolean;
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
