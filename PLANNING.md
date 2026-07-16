# Unframed — Product Requirements Document
**Personalized Civic Dashboard + Ellipsis Chrome Extension Integration**

| Field | Details |
|-------|---------|
| Version | v0.1 (Draft) |
| Date | July 2026 |
| Author | Saanj |
| Status | For Review |
| Scope | Website (unframed.co) + Ellipsis Chrome Extension |

---

## 1. Overview

Unframed is a civic tech platform built around the belief that news has a frame, and people deserve to see it. The platform currently consists of two products: the Unframed website, which introduces the project and communicates its mission, and Ellipsis, a Chrome extension that surfaces bias scores, key perspectives, and article summaries as users read the news.

This PRD covers a new product layer: a personalized civic dashboard integrated into the Unframed website, connected to Ellipsis's reading activity. Together, they will give users a single place to understand how legislation personally affects them, track the media they consume, and develop a clearer picture of their own information diet over time.

> **North Star:** A user opens Unframed and immediately sees the bills being debated in their state that affect their housing situation, a summary of what types of sources they've been reading this week, and one piece of context they didn't have before. They feel informed, not surveilled.

---

## 2. Problem Statement

Most civic information tools fail users in one of two ways: they are either too generic (national news feeds that don't reflect local realities) or too dense (government websites that require users to already know what to look for). Meanwhile, people's media habits shape their worldview in ways they rarely see clearly.

Ellipsis addresses the second-by-second reading experience. But users currently have no longitudinal view of their reading patterns, and no connection between the news they consume and the real policy changes that affect their daily lives. The gap between "I read about healthcare" and "here is the specific Medicaid bill your state legislature is voting on next month" is exactly where Unframed can create genuine civic value.

---

## 3. Goals and Non-Goals

### Goals

- Give users a personalized dashboard that surfaces relevant legislation based on their demographics and self-selected interest areas.
- Connect Ellipsis reading activity to a weekly digest of the user's source habits and content interests, without tracking individual articles.
- Allow users to log in via Google SSO and maintain a persistent, editable civic profile.
- Make the onboarding experience feel like civic empowerment, not a data collection form.
- Pull legislative data from a public API (LegiScan or Congress.gov) and refresh it weekly.

### Non-Goals

- Ellipsis will not transmit article-level data to any server. The extension's analysis stays local; only aggregated stats are synced.
- The platform will not make political endorsements or recommend how users should feel about legislation.
- Real-time legislative tracking is out of scope for v1. Weekly updates are sufficient.
- The dashboard is not a news feed. It surfaces policy, not articles.
- Monetization is explicitly out of scope for this version.

---

## 4. Target Users

Unframed's primary users are civically curious people who want to be informed but feel overwhelmed by the volume and complexity of political news. Secondary users include educators, students, and community organizers who want to understand how specific policies affect specific populations.

**Primary Persona: The Informed Citizen**
- Age 18-35. May be a first-time voter, a college student, or a young professional.
- Reads news regularly but doesn't feel confident distinguishing credible sources from biased ones.
- Has personal stakes in policy areas like student loans, housing, healthcare, or immigration, but struggles to connect news to those specific issues.
- Willing to share demographic info if they trust the platform and can see clear personal value from it.

---

## 5. Feature Specifications

### 5.1 Authentication: Google SSO

Users sign in with their Google account. No separate password is created or stored. On first sign-in, users are routed to the onboarding flow before seeing the dashboard. Returning users land directly on their dashboard.

- Auth provider: Google OAuth 2.0
- Session persistence: stay logged in across browser sessions with a 30-day token refresh
- Users can sign out and delete their account and associated profile data at any time from Settings
- No personal data is shared with Google beyond what OAuth requires

### 5.2 Civic Profile Onboarding

The onboarding screen is the first impression of the dashboard. The copy and design should feel like the platform is learning about the user in order to serve them, not extracting data. The tone should be: "So we can show you what actually matters to you, tell us a little about yourself."

#### Required fields (cannot skip)

- State of residence
- City or county (text input with autocomplete)
- Interest areas (multi-select, minimum 1): housing, healthcare, education, immigration, environment, labor, criminal justice, taxation, reproductive rights, social security, veterans' affairs

#### Optional fields (can skip individually)

- Citizenship status (options: U.S. citizen, permanent resident, DACA/undocumented, visa holder, prefer not to say)
- Ethnicity / racial identity (multi-select with standard Census categories + prefer not to say)
- Education level (high school, some college, bachelor's, graduate, prefer not to say)
- Household income range (below $30k, $30k-$60k, $60k-$100k, $100k+, prefer not to say)
- Age range (under 18, 18-24, 25-34, 35-49, 50-64, 65+, prefer not to say)

> **Design Principle: Framing Sensitive Fields**
> Each sensitive field should be introduced with a one-line explanation of why it helps.
> Example for citizenship status: "Some federal programs and rights vary by immigration status. This helps us surface only what applies to you."
> A persistent footer note: "Your information is stored securely and used only to personalize your dashboard. You can update or delete it anytime."

After completing onboarding, users land on the main dashboard. The profile is always accessible and editable via a Settings panel. Users can broaden or narrow their interest areas at any time, which immediately refreshes their legislation feed.

### 5.3 Personalized Legislation Feed

The centerpiece of the dashboard. Surfaces bills and policy changes relevant to the user based on their state, interest areas, and demographic profile. Powered by LegiScan (primary) and Congress.gov (secondary for federal bills).

#### Feed logic

- Default view: bills in the user's state legislature, filtered by their selected interest areas
- Secondary layer: relevant federal legislation that would affect their state or demographic group
- Relevance is determined by: geographic match (state/local), topic match (interest areas), demographic applicability (e.g. a Medicaid expansion bill is flagged for users who selected healthcare and income below $60k)
- Users can toggle between: My State, Federal, and All
- Users can add or remove specific topic filters from the dashboard directly without going to Settings

#### Bill card design

- Bill name and ID
- One-sentence plain-language summary
- Status: In Committee, Passed Chamber, Signed into Law, Vetoed, etc.
- Why it's relevant to you (one line, generated from their profile)
- Last updated date
- Link to full bill text (opens external)
- Option to save or dismiss a bill

> **API Strategy: LegiScan**
> LegiScan provides a free tier with access to all 50 state legislatures and federal bills.
> Key endpoints: `getSearch` (filter by state + keyword), `getBill` (full bill data), `getMasterList` (all active bills by session).
> Congress.gov API (`api.congress.gov`) covers federal legislation with good subject tagging.
> Bills are cached and refreshed weekly. A "Last refreshed" timestamp is shown on the dashboard.

### 5.4 Ellipsis Reading Digest

Connects Ellipsis (the Chrome extension) to the dashboard. Ellipsis does not transmit article-level data. It aggregates anonymized reading stats locally and syncs a summary object to the user's dashboard account weekly.

#### What Ellipsis syncs (aggregated only)

- Number of articles analyzed this week
- Distribution of bias scores across analyzed articles (e.g. 40% center-left, 30% center, 20% right-leaning)
- Top topic categories detected across articles (e.g. 60% economy, 25% immigration, 15% climate)
- Source diversity score: how many distinct outlets were read (expressed as a metric, not individual outlet names)
- A weekly reading fingerprint: a short AI-generated insight such as "This week, most of your articles came from left-leaning sources and focused heavily on immigration policy."

#### Dashboard display: Reading Digest panel

- Shows current week's data by default; users can scroll back through previous weeks
- Bias distribution displayed as a horizontal bar spectrum (left to right)
- Topic breakdown shown as a proportional tag cloud or bar chart
- No individual articles are stored or displayed. The digest is always a summary.
- A soft prompt: "Want to diversify? Here are topics your selected interests cover that you haven't read about recently."

> **Privacy Architecture: How Ellipsis Syncs Without Exposing Articles**
> Ellipsis stores a local aggregate object in Chrome storage (not synced to any server).
> Once per week, when the user is logged in on the Unframed website, the extension pushes only the summary object to the Unframed backend via a secure POST endpoint.
> The backend stores only the summary, never individual article URLs, titles, or content.
> The user can clear their reading history from the dashboard at any time, which wipes both the local extension data and the backend summary.

### 5.5 Dashboard Layout

The dashboard has three primary sections, arranged as a single-page layout with a left navigation rail on desktop and a bottom tab bar on mobile.

#### Section 1: Legislation Feed
- Full-width card feed with filter controls at the top
- Sticky filter bar: toggle between state/federal, topic chips
- Empty state: if no bills match, show a message explaining why and suggest broadening topics

#### Section 2: Reading Digest
- Collapsible panel below the legislation feed or in a right sidebar on wide screens
- Defaults to current week; back-arrow to previous weeks
- If Ellipsis is not installed: show a prompt card explaining what it does and linking to the Chrome Web Store

#### Section 3: Profile and Settings
- Accessible via a gear icon or sidebar nav
- Displays current demographic profile with Edit button
- Account management: sign out, delete account
- Notification preferences (for future email digest feature)

---

## 6. Data Model (High Level)

### User
- `id`, `email` (from Google), `displayName`, `profilePhotoUrl`
- `createdAt`, `lastLoginAt`

### CivicProfile
- `userId` (FK), `state`, `city`, `interestAreas[]`
- `citizenshipStatus?`, `ethnicity[]?`, `educationLevel?`, `incomeRange?`, `ageRange?`
- All optional fields are nullable. Stored encrypted at rest.

### WeeklyReadingDigest
- `userId` (FK), `weekOf` (date), `articlesAnalyzed` (int), `biasDistribution` (JSON), `topTopics` (JSON), `sourceCount` (int), `insightText` (string)
- One record per user per week. Created/overwritten by Ellipsis sync.

### SavedBill
- `userId` (FK), `billId` (from LegiScan), `billTitle`, `savedAt`, `dismissed` (bool)

---

## 7. Ellipsis Extension Changes

The Ellipsis extension currently operates fully locally and does not communicate with any server. The following changes are required to support the dashboard integration. All changes are backward compatible: users who are not logged in continue to use Ellipsis exactly as before.

- Add a "Connect to Dashboard" prompt in the Ellipsis sidebar, shown once per week to non-connected users
- When connected (user is signed into Unframed in the same browser), begin accumulating a local weekly aggregate object in `chrome.storage.local`
- Aggregate object fields: `articlesAnalyzed` (counter), `biasScores` (array of numbers, not article refs), `topicsDetected` (frequency map), `uniqueSourceDomains` (count only, not list)
- On Sunday at midnight local time (or on next browser open after midnight), if the user is logged into Unframed, push the aggregate object to the Unframed API endpoint and reset local counters
- The extension must never store article URLs, titles, or any content in the aggregate object
- A sync status indicator in the extension sidebar: "Reading digest synced 3 days ago" or "Not connected to dashboard"

---

## 8. Technical Considerations

Recommendations based on the existing Unframed stack (React, Next.js, Tailwind, Framer Motion, deployed on Vercel). No stack changes required.

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Auth | NextAuth.js + Google provider | JWT cookie, 30-day refresh, no separate password |
| Database | Supabase (PostgreSQL) | Built-in row-level security, field-level encryption for sensitive profile data |
| State legislative data | LegiScan API | Covers all 50 state legislatures, free tier available |
| Federal legislative data | Congress.gov API | Good subject tagging, reliable uptime |
| Caching | Vercel Cron | Weekly bill refresh via scheduled serverless function |
| Ellipsis sync endpoint | `POST /api/digest` | Validates against expected schema, writes to Supabase |
| Field encryption | Supabase built-in or `@noble/ciphers` | For citizenship status, income, ethnicity fields |

All legislative API calls happen server-side via Next.js API routes to protect API keys. Cached results are served to all users; personalization filtering happens at query time.

---

## 9. Privacy and Trust Principles

These inform every copy, design, and product decision in this feature.

- **Transparency first:** every data field collected has a visible explanation of why it's collected and how it's used.
- **Minimal collection:** collect only what is necessary to produce personalized results. If a field doesn't change the output, don't collect it.
- **User control:** users can view, edit, export, and delete their profile and reading digest at any time with no friction.
- **No article tracking:** Ellipsis's privacy guarantee (no article-level data leaves the browser) must be preserved and prominently communicated.
- **No selling or sharing:** Unframed does not sell or share user data with third parties. This must be reflected in a clear, readable privacy policy linked from the onboarding screen.
- **Demographic sensitivity:** citizenship status and immigration-related data warrant extra care given the current political climate. These fields must be clearly optional and must never be used in any way other than personalizing the user's own dashboard.

---

## 10. Phased Rollout

### Phase 1: Foundation (Weeks 1-3)
- Google SSO integration
- Civic profile onboarding flow
- Basic legislation feed pulling from LegiScan (state bills only, filtered by interest area)
- Basic dashboard layout with legislation cards

### Phase 2: Personalization (Weeks 4-6)
- Demographic-based relevance scoring for legislation
- Federal bill integration via Congress.gov
- Toggle between state/federal/all
- Save and dismiss bill functionality

### Phase 3: Ellipsis Integration (Weeks 7-9)
- Ellipsis extension: local aggregate tracking
- Sync endpoint and backend storage
- Reading Digest panel on dashboard
- Bias distribution visualization

### Phase 4: Polish (Week 10)
- Onboarding copy and design refinement
- Mobile responsive audit
- Privacy policy page
- Accessibility audit (WCAG 2.1 AA)

---

## 11. Open Questions

- Should users receive notifications (email or browser) when a bill in their feed changes status? If so, what cadence and opt-in model?
- How should the bias distribution visualization look? An interactive breakdown (hover to see example sources in that bucket) could add real value.
- LegiScan's free tier has rate limits. As user volume grows, will we need to upgrade to a paid plan or implement more aggressive caching?
- Should the dashboard have a public-facing preview mode where non-logged-in users can explore with a default state and interest set, to reduce signup friction?
- How does the Reading Digest handle users who have Ellipsis installed but haven't read any articles that week?
- Is there interest in a future "Take Action" feature, where relevant bills link to contact info for state representatives?

---

## 12. Success Metrics

| Metric | Target |
|--------|--------|
| Onboarding completion rate | >70% of users who begin the flow complete at least required fields |
| Dashboard retention | >40% of users return within 7 days of first login |
| Ellipsis connection rate | >30% of active Ellipsis users connect within 30 days of launch |
| Profile edit rate | >20% of users update their profile at least once |
| User-reported trust | >80% of users report feeling their data is handled responsibly (future survey) |

---

*Unframed · News has a frame. We help you see it.*

---
---

# Unframed — Product Spec Sheet
**Civic Dashboard + Ellipsis Integration**

| Field | Details |
|-------|---------|
| Version | v0.1 |
| Date | July 2026 |
| Status | Draft |
| Stack | React · Next.js · Tailwind · Framer Motion · Vercel |
| Extension | Manifest V3 · React · TypeScript |

---

## What it is

| Component | Description | Type |
|-----------|-------------|------|
| Civic Dashboard | A personalized, login-gated dashboard that surfaces relevant legislation and policy changes based on the user's location, demographics, and interests. | New feature |
| Ellipsis Integration | Ellipsis's local bias analysis is aggregated weekly and synced to the dashboard, giving users a digest of their reading habits across sources and topics. | Extension update |
| Google SSO | Single sign-on via Google OAuth 2.0. No separate passwords. Profile is persistent, editable, and deletable by the user at any time. | New auth layer |

---

## User Flow

1. **Sign in** with Google on unframed.co. First-time users are routed to onboarding.
2. **Build a civic profile:** state, city, and at least one interest area are required. Citizenship status, income, ethnicity, education, and age are optional. Each sensitive field includes a one-line explanation of how it helps.
3. **Dashboard loads** with a personalized legislation feed, filtered by their state and interest areas. Bills are pulled from LegiScan (state) and Congress.gov (federal) and refreshed weekly.
4. **Ellipsis connects** when the user installs the extension and is logged into Unframed in the same browser. It accumulates an anonymous weekly reading aggregate locally, then syncs a summary to the dashboard each Sunday.
5. **Reading Digest panel** shows bias distribution, top topics, source diversity, and a one-line AI-generated insight about the week's reading. No individual articles are stored or shown.

---

## Civic Profile Fields

### Required

| Field | Input type |
|-------|------------|
| State | Dropdown |
| City / county | Text + autocomplete |
| Interest areas | Multi-select, minimum 1 |

### Optional (can skip individually)

| Field | Input type |
|-------|------------|
| Citizenship status | 5 options + prefer not to say |
| Ethnicity | Multi-select, Census categories |
| Education level | 5 options + prefer not to say |
| Household income | 4 ranges + prefer not to say |
| Age range | 6 brackets + prefer not to say |

**Interest area options:** housing · healthcare · education · immigration · environment · labor · criminal justice · taxation · reproductive rights · social security · veterans' affairs

---

## Legislation Feed Spec

| Property | Detail |
|----------|--------|
| Data sources | LegiScan (all 50 state legislatures) + Congress.gov (federal bills) |
| Refresh cadence | Weekly via cron job. "Last refreshed" timestamp shown on dashboard. |
| Relevance logic | Geographic match (state/local), topic match (interest areas), demographic applicability |
| Scope toggle | My State · Federal · All |
| Topic filter | Editable from dashboard directly, no Settings required |
| Bill card shows | Bill ID, plain-language summary, status, "why relevant to you" line, last updated, link to full text, save/dismiss |
| API calls | Server-side only via Next.js API routes (keys never exposed to client) |

---

## Ellipsis Reading Digest Spec

| Property | Detail |
|----------|--------|
| What syncs | Article count · bias score distribution · top topic categories · unique source count (no URLs, titles, or content) |
| Sync timing | Sunday midnight local time, or next browser open after midnight |
| Sync trigger | Only fires if user is logged into Unframed in the same browser |
| Dashboard shows | Bias distribution bar · topic breakdown · source diversity score · AI-generated weekly insight |
| History | Users can scroll back through previous weeks |
| No extension? | Prompt card shown linking to Chrome Web Store |
| Data deletion | Clearing from dashboard wipes both Chrome local storage and backend summary |

---

## Privacy Commitments

| Commitment | Detail |
|------------|--------|
| No article tracking | Ellipsis never transmits article URLs, titles, or content. Only anonymous aggregates leave the browser. |
| Encrypted at rest | Sensitive profile fields (citizenship, income, ethnicity) are field-level encrypted before storage. |
| Full user control | Users can view, edit, export, and delete their profile and reading digest at any time, no friction. |
| No data sharing | Unframed does not sell or share user data with third parties. |
| Demographic sensitivity | Citizenship and immigration data is clearly optional and used solely to personalize the user's own dashboard. |

---

## Phased Rollout

### Phase 1: Foundation (Weeks 1-3)
- Google SSO
- Civic profile onboarding
- Legislation feed (state only)
- Basic dashboard layout

### Phase 2: Personalization (Weeks 4-6)
- Demographic relevance scoring
- Federal bill integration
- Scope toggles and topic filters
- Save and dismiss bills

### Phase 3: Ellipsis Sync (Weeks 7-9)
- Local aggregate tracking in extension
- Sync endpoint and backend storage
- Reading Digest panel
- Bias and topic visualizations

### Phase 4: Polish (Week 10)
- Copy and design refinement
- Mobile responsive audit
- Privacy policy page
- WCAG 2.1 AA audit

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Auth | NextAuth.js + Google OAuth 2.0 |
| Database | Supabase (PostgreSQL with row-level security) |
| State legislative data | LegiScan API |
| Federal legislative data | Congress.gov API |
| Caching | Vercel Cron (weekly bill refresh) |
| Ellipsis sync | `POST /api/digest` endpoint |
| Field encryption | Supabase built-in or `@noble/ciphers` |

---

*Unframed · News has a frame. We help you see it. · v0.1 Draft · July 2026*
