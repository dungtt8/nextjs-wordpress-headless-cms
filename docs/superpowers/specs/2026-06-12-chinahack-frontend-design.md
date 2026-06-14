# CHINAHACK Frontend Design Spec

Date: 2026-06-12
Status: Draft for review
Scope: Home page implementation for CHINAHACK using Server-first Hybrid approach

## 1. Context and Goals

This spec defines the frontend design for implementing the CHINAHACK home page based on approved requirements and interaction rules.

Primary goals:
- Deliver 12 sections with responsive behavior on mobile, tablet, and desktop.
- Keep strong SEO and Core Web Vitals by prioritizing server-side data preparation.
- Implement interaction-rich sections with robust client-side state handling.
- Ensure graceful degradation when WordPress data is incomplete or unavailable.

## 2. Confirmed Product Decisions

Confirmed through brainstorming:
- Overall strategy: Server-first Hybrid.
- Lead form submission: mock internal API route with random failure behavior for QA.
- Blog section data: load real data from existing WordPress API layer.
- Other 11 sections: fetch from WordPress where possible, fallback to static local data per field.
- Visual brainstorming mode: text-only.

## 3. Architecture

### 3.1 Rendering Model

- app/page.tsx stays a server component.
- app/page.tsx fetches and normalizes section data.
- Data is passed down to section components using strict typed props.
- Interactive sections are client components.

### 3.2 Server vs Client Responsibilities

Server-oriented sections:
- Hero
- About
- Why Choose Us
- Services
- Universities
- Community

Client-interactive sections:
- Team Mentor (modal + scroll lock + keyboard close)
- Stats (run-once counter)
- Process (scroll progress highlighting)
- Success Stories (carousel behavior)
- Blog (tab active state + skeleton delay)
- Lead Form (validation + API state machine)

### 3.3 Data Flow

1) app/page.tsx requests section content from WordPress adapters.
2) Normalization layer maps raw API shapes to UI-safe shapes.
3) Missing or failed fields fallback to static defaults.
4) Components render with complete and safe data contracts.
5) Lead form client submits to app/api/lead/route.ts.

## 4. File and Module Plan

## 4.1 Existing files to modify

- app/page.tsx
  - Replace starter content with CHINAHACK home composition.
  - Render all 12 sections in required order.

- app/globals.css
  - Add animation utilities for fade, marquee, spinner, skeleton shimmer.
  - Add helper styles for scroll snap and timeline visuals.

## 4.2 New component files

Create folder: components/home

Create files:
- home-hero.tsx
- home-about.tsx
- home-why-choose.tsx
- home-mentors.tsx
- home-stats.tsx
- home-process.tsx
- home-services.tsx
- home-universities-marquee.tsx
- home-success-stories.tsx
- home-blog-tabs.tsx
- home-community.tsx
- home-lead-form.tsx

## 4.3 New data and typing files

Create folder: lib/home

Create files:
- types.ts
- content.ts
- normalize.ts

Responsibilities:
- types.ts: section data interfaces and form payload contracts.
- content.ts: static fallback content for all sections.
- normalize.ts: WordPress-to-UI mapping and fallback merge logic.

## 5. Data Contracts

Required data contracts (minimum shape):
- HeroData
- AboutData
- WhyChooseItem
- MentorItem
- StatsItem
- ProcessStep
- ServicePlan
- UniversityLogo
- SuccessStory
- BlogTab
- CommunityChannel
- LeadFormPayload

Contract rules:
- No any types.
- Optional fields only when truly optional in UI.
- Every component receives a complete renderable object.

## 6. Section Interaction Design

## 6.1 Team Mentor

- Desktop: 3-column grid.
- Mobile/tablet: horizontal scroll snap list.
- Modal open by View details action.
- Modal close via backdrop click, close button, and Escape key.
- Body scroll lock when modal opens; always unlock on close/unmount.
- Focus management:
  - Move focus into modal on open.
  - Return focus to trigger element on close.

## 6.2 Stats

- Intersection Observer triggers animation once.
- Counter runs from 0 to target in 1.5 seconds.
- hasAnimated guard prevents rerun on later scrolls.

## 6.3 Process

- Desktop: horizontal steps.
- Mobile: vertical timeline with left-side line.
- Active reading step is tracked by viewport intersection.
- Steps up to active index use primary color; remaining steps use neutral.

## 6.4 Success Stories

- Lightweight carousel implementation.
- Mobile: touch swipe, hidden arrow controls.
- Desktop: visible arrow controls.

## 6.5 Blog

- Real WordPress posts.
- Active tab styling:
  - Primary background
  - White text
- On tab switch:
  - Show skeleton for at least 300 ms.
  - Then render tab data.
- Skeleton dimensions mirror real cards to reduce layout shift.

## 6.6 Lead Form

State machine:
- idle
- validating
- loading
- success
- error

Field states:
- Default: neutral border + helper placeholder.
- Focus: primary border + ring.
- Error: red border + field error message.

Submit behavior:
1) Validate payload.
2) On valid payload, call POST app/api/lead.
3) While loading: disable CTA, reduce opacity, show spinner and processing text.
4) On success: fade out form, show success box with learner name.
5) On error: keep entered values and show retriable error message.

## 7. Mock Lead API Design

Route: app/api/lead/route.ts
Method: POST

Behavior:
- Add artificial response delay around 800 ms.
- Random failure mode with configured probability (example 30 percent).
- Success response includes confirmation message and learner name token.
- Error response includes user-friendly message.

Validation:
- Reject clearly invalid payload with 400-level response.
- Return normalized response shape for UI predictability.

## 8. Performance and Quality Requirements

Image and media:
- Hero image must load with high priority.
- All non-hero images should lazy-load.
- Prefer webp assets.
- Use inline SVG icons, avoid font icon libraries.

Core Web Vitals safeguards:
- Keep stable dimensions for cards, media, and skeletons.
- Minimize runtime work in scroll handlers.
- Use Intersection Observer over frequent manual measurements.

Dependency hygiene:
- Avoid adding heavy libraries for simple interactions.
- Use native browser APIs where practical.

## 9. Accessibility Requirements

- All icon-only controls require aria-label.
- Modal requires role dialog and aria-modal true.
- Modal open and close must preserve keyboard usability.
- Form errors must be linked with aria-describedby.
- Maintain WCAG AA contrast targets.
- Validate no typography overflow at 120 percent zoom.

## 10. Testing Strategy

Unit tests:
- Form validation rules and state transitions.
- Stats run-once counter guard.
- Blog tab switching state and loading delay behavior.

Integration tests:
- Mentor modal open and close using all supported triggers.
- Lead form success and error paths against mock API route.
- Blog rendering from WordPress data with fallback when unavailable.

Manual QA matrix:
- Safari on iOS
- Chrome on Android
- Chrome on desktop

Responsive checks:
- Mobile less than 640
- Tablet 640 to 1024
- Desktop above 1024

## 11. Definition of Done

Implementation is done when all conditions are met:
- All 12 sections are present and ordered correctly.
- Design tokens, responsive behavior, and interactions match requirements.
- Blog uses real WordPress data path.
- Lead form mock API path supports both success and random error flows.
- Lint and test commands pass.
- Manual QA across required devices and zoom condition passes.

## 12. Risks and Mitigations

Risk: inconsistent WordPress field availability across environments.
Mitigation: normalize layer with per-field fallback defaults.

Risk: interaction bugs in modal and scrolling sections.
Mitigation: explicit state model, cleanup guards, integration tests.

Risk: layout shifts during tab and async transitions.
Mitigation: fixed skeleton dimensions and stable container sizing.

## 13. Out of Scope for This Phase

- Full CMS customization in WordPress for all section content management.
- Production lead ingestion backend integration.
- Advanced analytics instrumentation and dashboarding.

## 14. Next Step

After user review and approval of this design spec:
- Invoke writing-plans skill to create implementation plan.
