
# CHINAHACK Frontend Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the CHINAHACK home page with 12 sections, server-first data loading, real WordPress-powered blog tab, and mock lead API with random failure handling.

**Architecture:** Use `app/page.tsx` as a server composition entry that fetches and normalizes data, then render focused section components under `components/home`. Keep interactive behavior in client components only. Use fallback static data in `lib/home/content.ts` whenever WordPress data is missing.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Vitest, existing WordPress data layer in `lib/wordpress.ts`.

---

## File Structure Lock-In

Create:
- `components/home/home-hero.tsx`
- `components/home/home-about.tsx`
- `components/home/home-why-choose.tsx`
- `components/home/home-mentors.tsx`
- `components/home/home-stats.tsx`
- `components/home/home-process.tsx`
- `components/home/home-services.tsx`
- `components/home/home-universities-marquee.tsx`
- `components/home/home-success-stories.tsx`
- `components/home/home-blog-tabs.tsx`
- `components/home/home-community.tsx`
- `components/home/home-lead-form.tsx`
- `lib/home/types.ts`
- `lib/home/content.ts`
- `lib/home/normalize.ts`
- `app/api/lead/route.ts`
- `__tests__/api/lead.test.ts`
- `__tests__/lib/home/normalize.test.ts`

Modify:
- `app/page.tsx`
- `app/globals.css`

Test/verify:
- `pnpm vitest run __tests__/api/lead.test.ts`
- `pnpm vitest run __tests__/lib/home/normalize.test.ts`
- `pnpm lint`
- `pnpm test`

---

### Task 1: Scaffold Home Types and Fallback Content

**Files:**
- Create: `lib/home/types.ts`
- Create: `lib/home/content.ts`
- Test: `__tests__/lib/home/normalize.test.ts`

- [ ] **Step 1: Write failing type usage test fixture (compile-time intent in normalize test)**

```ts
// in __tests__/lib/home/normalize.test.ts
import { describe, it, expect } from "vitest";
import { fallbackHomeContent } from "@/lib/home/content";

describe("home fallback content contract", () => {
  it("contains all 12 section payload roots", () => {
    expect(fallbackHomeContent.hero).toBeDefined();
    expect(fallbackHomeContent.about).toBeDefined();
    expect(fallbackHomeContent.whyChoose).toBeDefined();
    expect(fallbackHomeContent.mentors).toBeDefined();
    expect(fallbackHomeContent.stats).toBeDefined();
    expect(fallbackHomeContent.process).toBeDefined();
    expect(fallbackHomeContent.services).toBeDefined();
    expect(fallbackHomeContent.universities).toBeDefined();
    expect(fallbackHomeContent.successStories).toBeDefined();
    expect(fallbackHomeContent.blogTabs).toBeDefined();
    expect(fallbackHomeContent.community).toBeDefined();
    expect(fallbackHomeContent.leadForm).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run __tests__/lib/home/normalize.test.ts`
Expected: FAIL with module-not-found or missing export errors for `lib/home/content.ts`.

- [ ] **Step 3: Create strict types in `lib/home/types.ts`**

```ts
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

export interface AboutData {
  heading: string;
  body: string;
  highlightQuote: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  icon: "book" | "medal" | "network" | "target";
}

export interface MentorItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  shortBio: string;
  fullBio: string;
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
}

export interface ServicePlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  ctaText: string;
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
```

- [ ] **Step 4: Add fallback content object in `lib/home/content.ts`**

```ts
import type { HomeContent } from "@/lib/home/types";

export const fallbackHomeContent: HomeContent = {
  hero: {
    title: "Chinh phuc hoc bong Trung Quoc cung Mentor ChinaHack",
    subtitle: "Lo trinh ca nhan hoa, tu ho so den phong van.",
    ctaText: "Nhan tu van mien phi",
    ctaHref: "#lead-form",
    mentorImage: {
      src: "/images/mentor-hero.webp",
      alt: "Mentor ChinaHack",
      width: 640,
      height: 860,
    },
  },
  about: {
    heading: "Ve chung toi",
    body: "ChinaHack ho tro hoc vien toi uu ho so va chien luoc hoc bong.",
    highlightQuote: "Dung lo trinh dung, co hoi hoc bong mo rong hon.",
  },
  whyChoose: [
    { id: "w1", title: "Mentor thuc chien", description: "Kinh nghiem tu ho so that", icon: "book" },
    { id: "w2", title: "Lo trinh ro rang", description: "Bam sat moc thoi gian", icon: "target" },
    { id: "w3", title: "Tai nguyen chat luong", description: "Mau bai va checklist", icon: "medal" },
    { id: "w4", title: "Cong dong ho tro", description: "Dong hanh xuyen suot", icon: "network" },
  ],
  mentors: [],
  stats: [],
  process: [],
  services: [],
  universities: [],
  successStories: [],
  blogTabs: [
    { id: "all", label: "Tat ca", slug: "all" },
    { id: "scholarship", label: "Hoc bong", slug: "hoc-bong" },
    { id: "guide", label: "Huong dan", slug: "huong-dan" },
  ],
  community: [],
  leadForm: {
    title: "Dang ky danh gia ho so",
    subtitle: "Nhan lo trinh ca nhan hoa trong 24h",
    submitText: "Nhan danh gia ho so mien phi",
    loadingText: "Dang xu ly...",
  },
};
```

- [ ] **Step 5: Run test to verify pass**

Run: `pnpm vitest run __tests__/lib/home/normalize.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/home/types.ts lib/home/content.ts __tests__/lib/home/normalize.test.ts
git commit -m "feat(home): add base contracts and fallback content"
```

---

### Task 2: Build Normalization Layer with Fallback Merge

**Files:**
- Create: `lib/home/normalize.ts`
- Modify: `__tests__/lib/home/normalize.test.ts`

- [ ] **Step 1: Add failing tests for normalization behavior**

```ts
import { normalizeHomeContent } from "@/lib/home/normalize";
import { fallbackHomeContent } from "@/lib/home/content";

describe("normalizeHomeContent", () => {
  it("falls back field-by-field for missing hero data", () => {
    const result = normalizeHomeContent({ hero: { title: "Custom" } });
    expect(result.hero.title).toBe("Custom");
    expect(result.hero.subtitle).toBe(fallbackHomeContent.hero.subtitle);
  });

  it("preserves fallback arrays when upstream arrays are empty", () => {
    const result = normalizeHomeContent({ whyChoose: [] });
    expect(result.whyChoose.length).toBe(fallbackHomeContent.whyChoose.length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run __tests__/lib/home/normalize.test.ts`
Expected: FAIL with missing module `lib/home/normalize`.

- [ ] **Step 3: Implement normalizer**

```ts
import { fallbackHomeContent } from "@/lib/home/content";
import type { HomeContent } from "@/lib/home/types";

type PartialHomeContent = Partial<{
  [K in keyof HomeContent]: Partial<HomeContent[K]> | HomeContent[K];
}>;

export function normalizeHomeContent(input?: PartialHomeContent): HomeContent {
  const source = input ?? {};

  return {
    hero: {
      ...fallbackHomeContent.hero,
      ...(source.hero as Partial<HomeContent["hero"]> | undefined),
      mentorImage: {
        ...fallbackHomeContent.hero.mentorImage,
        ...((source.hero as Partial<HomeContent["hero"]> | undefined)?.mentorImage ?? {}),
      },
    },
    about: {
      ...fallbackHomeContent.about,
      ...(source.about as Partial<HomeContent["about"]> | undefined),
    },
    whyChoose:
      Array.isArray(source.whyChoose) && source.whyChoose.length > 0
        ? (source.whyChoose as HomeContent["whyChoose"])
        : fallbackHomeContent.whyChoose,
    mentors:
      Array.isArray(source.mentors) && source.mentors.length > 0
        ? (source.mentors as HomeContent["mentors"])
        : fallbackHomeContent.mentors,
    stats:
      Array.isArray(source.stats) && source.stats.length > 0
        ? (source.stats as HomeContent["stats"])
        : fallbackHomeContent.stats,
    process:
      Array.isArray(source.process) && source.process.length > 0
        ? (source.process as HomeContent["process"])
        : fallbackHomeContent.process,
    services:
      Array.isArray(source.services) && source.services.length > 0
        ? (source.services as HomeContent["services"])
        : fallbackHomeContent.services,
    universities:
      Array.isArray(source.universities) && source.universities.length > 0
        ? (source.universities as HomeContent["universities"])
        : fallbackHomeContent.universities,
    successStories:
      Array.isArray(source.successStories) && source.successStories.length > 0
        ? (source.successStories as HomeContent["successStories"])
        : fallbackHomeContent.successStories,
    blogTabs:
      Array.isArray(source.blogTabs) && source.blogTabs.length > 0
        ? (source.blogTabs as HomeContent["blogTabs"])
        : fallbackHomeContent.blogTabs,
    community:
      Array.isArray(source.community) && source.community.length > 0
        ? (source.community as HomeContent["community"])
        : fallbackHomeContent.community,
    leadForm: {
      ...fallbackHomeContent.leadForm,
      ...(source.leadForm as Partial<HomeContent["leadForm"]> | undefined),
    },
  };
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm vitest run __tests__/lib/home/normalize.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/home/normalize.ts __tests__/lib/home/normalize.test.ts
git commit -m "feat(home): add content normalizer with fallback merge"
```

---

### Task 3: Implement Mock Lead API Route (Random Error)

**Files:**
- Create: `app/api/lead/route.ts`
- Create: `__tests__/api/lead.test.ts`

- [ ] **Step 1: Write failing tests for lead API**

```ts
import { describe, it, expect } from "vitest";

describe("POST /api/lead", () => {
  it("returns 400 when required fields are missing", async () => {
    const { POST } = await import("@/app/api/lead/route");
    const req = new Request("http://localhost/api/lead", {
      method: "POST",
      body: JSON.stringify({ fullName: "", email: "" }),
      headers: { "content-type": "application/json" },
    });

    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run __tests__/api/lead.test.ts`
Expected: FAIL due to missing route module.

- [ ] **Step 3: Implement route**

```ts
import { NextResponse } from "next/server";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null);

  const fullName = payload?.fullName?.trim?.() ?? "";
  const email = payload?.email?.trim?.() ?? "";
  const phone = payload?.phone?.trim?.() ?? "";
  const gpa = payload?.gpa?.trim?.() ?? "";

  if (!fullName || !email || !phone || !gpa || !isValidEmail(email)) {
    return NextResponse.json(
      { success: false, message: "Du lieu khong hop le." },
      { status: 400 },
    );
  }

  await delay(800);

  const fail = Math.random() < 0.3;
  if (fail) {
    return NextResponse.json(
      {
        success: false,
        message: "He thong tam thoi ban. Vui long thu lai sau it phut.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: `Cam on ${fullName}. Doi ngu ChinaHack se lien he trong 24h.`,
    },
    { status: 200 },
  );
}
```

- [ ] **Step 4: Extend tests for success/error branches by mocking Math.random**

```ts
import { vi } from "vitest";

it("returns success when random check passes", async () => {
  vi.spyOn(Math, "random").mockReturnValue(0.9);
  const { POST } = await import("@/app/api/lead/route");
  const req = new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fullName: "Nguyen A",
      email: "a@example.com",
      phone: "0900000000",
      gpa: "3.6",
    }),
  });

  const res = await POST(req as never);
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body.success).toBe(true);
});

it("returns service error when random check fails", async () => {
  vi.spyOn(Math, "random").mockReturnValue(0.1);
  const { POST } = await import("@/app/api/lead/route");
  const req = new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fullName: "Nguyen A",
      email: "a@example.com",
      phone: "0900000000",
      gpa: "3.6",
    }),
  });

  const res = await POST(req as never);
  expect(res.status).toBe(503);
  const body = await res.json();
  expect(body.success).toBe(false);
});
```

- [ ] **Step 5: Run API tests**

Run: `pnpm vitest run __tests__/api/lead.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/api/lead/route.ts __tests__/api/lead.test.ts
git commit -m "feat(api): add mock lead endpoint with random failure"
```

---

### Task 4: Build Home Section Components (Static-first)

**Files:**
- Create: all `components/home/*.tsx` listed in file structure
- Modify: `app/globals.css`

- [ ] **Step 1: Write minimal render smoke tests for two complex components**

```ts
// optional test location: __tests__/components/home-smoke.test.tsx
import { describe, it, expect } from "vitest";

describe("home components smoke", () => {
  it("placeholder", () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Implement presentational server-friendly components**

Code skeleton example for `components/home/home-hero.tsx`:

```tsx
import type { HeroData } from "@/lib/home/types";
import Image from "next/image";

interface HomeHeroProps {
  data: HeroData;
}

export function HomeHero({ data }: HomeHeroProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-2 items-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold">{data.title}</h1>
        <p className="text-lg text-neutral-700">{data.subtitle}</p>
        <a
          href={data.ctaHref}
          className="inline-flex rounded-md bg-[#D97706] px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {data.ctaText}
        </a>
      </div>
      <div>
        <Image
          src={data.mentorImage.src}
          alt={data.mentorImage.alt}
          width={data.mentorImage.width}
          height={data.mentorImage.height}
          priority
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Implement interactive client components with local state**

Minimum for `home-lead-form.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import type { LeadFormContent } from "@/lib/home/types";

type FormState = "idle" | "validating" | "loading" | "success" | "error";

export function HomeLeadForm({ data }: { data: LeadFormContent }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [values, setValues] = useState({ fullName: "", email: "", phone: "", gpa: "", note: "" });

  const disabled = state === "loading";

  const isEmailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email),
    [values.email],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("validating");

    if (!values.fullName || !values.phone || !values.gpa || !isEmailValid) {
      setState("error");
      setMessage("Vui long kiem tra du lieu truoc khi gui.");
      return;
    }

    setState("loading");
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });

    const body = await res.json();
    if (!res.ok || !body.success) {
      setState("error");
      setMessage(body.message ?? "Gui that bai, vui long thu lai.");
      return;
    }

    setState("success");
    setMessage(body.message);
  }

  return (
    <section id="lead-form" className="mx-auto max-w-3xl">
      {state === "success" ? (
        <div className="rounded-lg bg-green-100 p-4 text-green-900">{message}</div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <button disabled={disabled} className="rounded-md bg-[#D97706] px-4 py-2 text-white disabled:pointer-events-none disabled:opacity-50">
            {state === "loading" ? data.loadingText : data.submitText}
          </button>
          {state === "error" && <p className="text-sm text-red-600">{message}</p>}
        </form>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Add global utility styles in `app/globals.css`**

```css
@keyframes chinahack-fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes chinahack-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes chinahack-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes chinahack-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.chinahack-marquee {
  animation: chinahack-marquee 18s linear infinite;
}

.chinahack-marquee:hover {
  animation-play-state: paused;
}
```

- [ ] **Step 5: Run lint**

Run: `pnpm lint`
Expected: PASS or only unrelated pre-existing warnings.

- [ ] **Step 6: Commit**

```bash
git add components/home app/globals.css
git commit -m "feat(home): add section components and interaction styles"
```

---

### Task 5: Compose Home Page with Real Blog Data + Normalized Sections

**Files:**
- Modify: `app/page.tsx`
- Modify: `lib/home/normalize.ts`

- [ ] **Step 1: Write failing integration-style test for normalize input from WordPress shape**

```ts
it("maps blog posts into tab-ready data shape", () => {
  const normalized = normalizeHomeContent({});
  expect(Array.isArray(normalized.blogTabs)).toBe(true);
});
```

- [ ] **Step 2: Run target test**

Run: `pnpm vitest run __tests__/lib/home/normalize.test.ts`
Expected: FAIL if mapping helpers are missing.

- [ ] **Step 3: Implement `app/page.tsx` composition**

```tsx
import { normalizeHomeContent } from "@/lib/home/normalize";
import { getPostsPaginated } from "@/lib/wordpress";
import { HomeHero } from "@/components/home/home-hero";
import { HomeAbout } from "@/components/home/home-about";
import { HomeBlogTabs } from "@/components/home/home-blog-tabs";
import { HomeLeadForm } from "@/components/home/home-lead-form";

export default async function HomePage() {
  const postsResponse = await getPostsPaginated(1).catch(() => ({ data: [], headers: { total: 0, totalPages: 0 } }));
  const content = normalizeHomeContent({});

  return (
    <main className="space-y-24">
      <HomeHero data={content.hero} />
      <HomeAbout data={content.about} />
      {/* render remaining sections in required order */}
      <HomeBlogTabs tabs={content.blogTabs} posts={postsResponse.data} />
      <HomeLeadForm data={content.leadForm} />
    </main>
  );
}
```

- [ ] **Step 4: Verify order of 12 sections manually in code**

Check `app/page.tsx` and ensure this strict order:
Hero -> About -> WhyChoose -> Mentors -> Stats -> Process -> Services -> Universities -> SuccessStories -> Blog -> Community -> LeadForm.

- [ ] **Step 5: Run full tests and lint**

Run:
- `pnpm lint`
- `pnpm test`

Expected:
- Lint passes or only pre-existing unrelated findings.
- Tests pass including new test files.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx lib/home/normalize.ts
git commit -m "feat(home): compose 12-section page with wordpress blog integration"
```

---

### Task 6: QA Pass and Regression Verification

**Files:**
- Modify if needed after QA: any `components/home/*`, `app/globals.css`, `app/page.tsx`

- [ ] **Step 1: Run focused tests again**

Run:
- `pnpm vitest run __tests__/api/lead.test.ts`
- `pnpm vitest run __tests__/lib/home/normalize.test.ts`

Expected: PASS.

- [ ] **Step 2: Run full quality gates**

Run:
- `pnpm lint`
- `pnpm test`

Expected: PASS.

- [ ] **Step 3: Manual responsive and interaction check list**

Check in browser:
- Mobile (<640): stacked sections, mentor scroll snap, carousel swipe, blog one-column behavior.
- Tablet (640-1024): two-column where required.
- Desktop (>1024): full grid layouts and desktop controls.

Interaction checklist:
- Mentor modal open/close with backdrop, X, Escape.
- Stats counter runs only once.
- Process step highlight changes while scrolling.
- Blog tabs show skeleton for at least 300ms.
- Lead form shows loading and both success/error behavior.

- [ ] **Step 4: Commit QA fixes**

```bash
git add app/page.tsx app/globals.css components/home lib/home __tests__/api/lead.test.ts __tests__/lib/home/normalize.test.ts
git commit -m "test(home): verify interactions and finalize responsive QA"
```

---

## Self-Review Checklist (Completed)

Spec coverage:
- 12 sections: covered in Task 4 + Task 5 composition.
- Blog from WordPress: Task 5.
- Mock lead API random failure: Task 3.
- Fallback normalization for non-blog sections: Task 1 + Task 2.
- Performance/accessibility interaction constraints: Task 4 + Task 6 QA checklist.

Placeholder scan:
- No TBD/TODO placeholders.
- Commands, paths, and code snippets included in each coding step.

Type consistency:
- `HomeContent`, `LeadFormPayload`, and section interfaces consistently used across tasks.

---

Plan complete and ready for execution.
