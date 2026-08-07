# WIREFRAME_ARCHITECTURE.md

# Usef Farahmand Digital Experience

Version: 1.0

Status: Draft

---

# Purpose

This document defines the logical, structural specification for every MVP page.

It translates the UX Strategy and Content Strategy into ordered, purposeful structure — what exists on each page, in what order, and why.

This document intentionally excludes visual design, color, typography, copy, and imagery. It defines skeleton, not skin.

---

# How to Read This Document

Each page specification includes:

- Purpose, Primary User Goal, Primary CTA, Secondary CTA
- An ordered section list (top to bottom)
- Expected User Actions
- Navigation Behavior specific to that page
- Information Priority
- Relationships with other pages

Each section within a page is specified with: Section Name, Purpose, Content Type, Estimated Content Length, Primary CTA, Optional Secondary CTA.

"Estimated Content Length" is a structural sizing signal (short / medium / long, or a rough item count) — not a word count or copy spec.

---

# Global Structural Systems

These systems apply across every page and are defined once here rather than repeated per page.

## Sticky Navigation Behavior

- The primary navigation bar is sticky on all pages, homepage and routed pages alike.
- On the homepage, the sticky nav reflects scroll position via active-state highlighting synced to the currently visible section (scroll-spy behavior).
- On routed pages (Projects, Project Detail, Articles, Article Detail, About), the sticky nav reflects the current route, not a scroll position.
- The sticky nav always contains a persistent Contact entry point, regardless of page type — Contact must never be more than one action away.
- On scroll-down past a defined threshold, the nav may compress (reduced height) but must never fully hide — hiding navigation contradicts the "no hidden content" principle established in the Master Plan.

## Footer Structure

Present identically on every page. Ordered content:

1. Short identity restatement (name, role, one-line positioning — structural placeholder only, no copy defined here).
2. Footer navigation: GitHub, LinkedIn, X, Email (per IA); RSS reserved as a future slot.
3. Secondary link group: link back to primary routed pages (About, Projects, Articles) for crawlability and redundant wayfinding.
4. Legal/meta line: copyright, and a reserved (currently empty) slot for a future Privacy page link.

The footer is the final structural element on every page — it never appears mid-page and is not sticky.

## Mobile Navigation

- Collapses into a single trigger (menu icon) at the mobile breakpoint; this is the one place primary navigation is permitted to hide behind an interaction, per the Design System's responsive rules.
- Opening the mobile nav reveals: all primary nav items (Home, About, Projects, Articles, Experience-anchor, Contact-anchor), in the same order as desktop primary nav.
- Contact remains reachable within the mobile nav without additional scrolling inside the menu itself — it should not be the last item requiring a scroll to find.
- Closing behavior: tapping a nav item, tapping outside the menu, or tapping the trigger again all close the menu — no dead-end state where the menu can only be dismissed one specific way.
- Anchor-link taps from the mobile nav (e.g., Skills, Now) navigate home first (if not already there) then scroll to the target section, matching desktop hybrid nav behavior.

## Breadcrumb Usage

- Breadcrumbs appear only on content-rich, nested pages: Project Detail and Article Detail.
- Pattern: Home / Projects / [Project Title] and Home / Articles / [Article Title].
- Not used on Home, About, Projects (index), or Articles (index) — these are top-level or one-level-deep pages where breadcrumbs add no navigational value, consistent with the "keep navigation shallow" architecture rule.
- Breadcrumbs are structural navigation elements first, SEO (BreadcrumbList schema) second — both purposes are served by the same structure, no duplication needed.

## Empty States

Applies primarily to Projects, Articles, and any filtered view (e.g., a category filter returning zero results):

- Every empty state explains the situation plainly and suggests a next action (per Design System rule) — e.g., a filtered view with no matches should suggest clearing the filter, not just show blank space.
- Empty states must never appear for core unfiltered content (Projects index, Articles index) at launch, since MVP content volume guarantees non-empty defaults — empty-state design here is a defensive structural requirement for filtering, not a launch-content concern.

## Loading States

- Skeleton loading is used for any content that loads asynchronously (image-heavy galleries, future API-backed content post-Phase 9) — never a blank screen.
- Static MVP content (file-based, no runtime fetch) should render immediately server-side wherever possible, minimizing the need for loading states at all during MVP — this is a structural argument for Server Components First, not just a performance one.
- Where loading states are needed (e.g., Contact form submission), they must be scoped narrowly to the element in motion (the submit button, the form area) — never a full-page loading interruption for a partial-page action.

## Error States

- Contact form errors are inline, field-specific, and appear without losing previously entered data.
- Route-level errors (broken internal link, missing project/article slug) resolve to the 404 page, which itself must explain the situation and offer a way back to Projects, Articles, or Home — never a dead end.
- Error states must never blame the visitor (per Design System rule) — copy tone is out of scope here, but the structural requirement (explanation + recovery action) is defined now so it isn't skipped later.

## Scroll Behavior

- Homepage: continuous scroll through all sections, standard document scroll — no scroll-jacking, no forced pacing (per UX Strategy §11).
- Anchor-link navigation (nav → homepage section) scrolls smoothly and lands precisely, accounting for sticky header offset.
- Routed pages (About, Projects, Articles, Project Detail, Article Detail): standard top-to-bottom document scroll, no homepage-style multi-section anchor navigation within the page itself, except Article Detail's optional in-page Table of Contents (see below).
- All scroll behavior must degrade gracefully under `prefers-reduced-motion` — the destination is reached either way; only the transition style changes.

## Section Transition Logic

- Section boundaries on the homepage are marked by content reveal (elements animate into view as they enter viewport) rather than hard visual breaks — this is a motion responsibility, but the structural requirement is that each section must be independently comprehensible without relying on transition context (per Content Strategy §7: "no section should require the previous section to make sense").
- Transitions between routed pages (e.g., Projects index → Project Detail) should structurally support a "scan → commit" pacing shift (per Content Strategy §10) — this is noted here as a structural handoff point, with actual motion treatment deferred to the Motion Design phase.

---

# 1. Home

**Purpose:** Establish identity, prove capability, and guide every visitor type toward the content or action that matches their intent.

**Primary User Goal:** Quickly understand who Usef is and what he builds, then choose a path (deeper project exploration, About, or Contact).

**Primary CTA:** Explore Projects (from Hero).

**Secondary CTA:** Read Articles (from Hero); additional section-specific CTAs are defined per section below.

## Sections (top to bottom)

**1. Hero**
- Purpose: Establish identity and momentum in one screen.
- Content Type: Short identity statement, positioning line, momentum signal (e.g., a current-status indicator).
- Estimated Content Length: Short — a few lines maximum, no paragraph-length copy.
- Primary CTA: Explore Projects.
- Secondary CTA: Read Articles.

**2. About Preview**
- Purpose: Earn interest in the person; hand off to the full `/about` page.
- Content Type: Distilled excerpt of the full About narrative (not independently authored).
- Estimated Content Length: Short — one short paragraph.
- Primary CTA: Read Full Story → `/about`.
- Secondary CTA: None.

**3. Featured Work**
- Purpose: Prove capability through selected evidence; the site's credibility engine.
- Content Type: Curated project cards, filtered from Projects collection (`featured: true`).
- Estimated Content Length: Medium — 3–5 featured items at MVP volume.
- Primary CTA: View All Projects → `/projects`.
- Secondary CTA: Individual card click → Project Detail.

**4. Experience**
- Purpose: Fast-scan verification of professional track record.
- Content Type: Compact timeline (company, role, dates, one headline achievement per entry).
- Estimated Content Length: Medium — reflects one professional timeline (per launch content scope).
- Primary CTA: None (verification section, not a conversion point).
- Secondary CTA: Link from individual entries to related Projects, where applicable.

**5. Skills**
- Purpose: Support credibility without repeating Featured Work; confirm technical fit.
- Content Type: Grouped skill categories (Frontend, Backend, Mobile, Game, AI, Cloud, DevOps, UI/UX).
- Estimated Content Length: Short-medium — a curated set per launch scope, not an exhaustive list.
- Primary CTA: None.
- Secondary CTA: None — intentionally low-interaction, per its "quiet, supporting" role.

**6. Recommendations**
- Purpose: Provide third-party validation.
- Content Type: Quote cards (author, position, company, message).
- Estimated Content Length: Short — only ships if the minimum credibility threshold (3+ strong quotes) is met; otherwise this section is omitted entirely for launch, per Content Strategy §14.
- Primary CTA: None.
- Secondary CTA: None.

**7. Exploring**
- Purpose: Signal intellectual range and durable curiosity.
- Content Type: Short list of current research/interest areas.
- Estimated Content Length: Short — a handful of specific entries, not an exhaustive list.
- Primary CTA: None.
- Secondary CTA: Occasional link to a related Article, where one exists.

**8. Now**
- Purpose: Prove the work is currently active — the site's clearest "living experience" signal.
- Content Type: Structured snapshot (Building / Learning / Reading / Researching / Playing / Next Goal), with a visible last-updated date.
- Estimated Content Length: Short — a status-board format, not prose.
- Primary CTA: None.
- Secondary CTA: None.

**9. Contact**
- Purpose: Convert accumulated interest into a relationship — the resolution point of the homepage narrative.
- Content Type: Contact form, social/professional links, brief availability note, brief privacy note.
- Estimated Content Length: Short form (name, email, message) plus a short list of external links.
- Primary CTA: Send Message.
- Secondary CTA: Social/professional profile links (GitHub, LinkedIn, X, Email).

## Expected User Actions

Scroll through sections at self-directed pace; jump via nav to a specific section; click into Featured Work items; navigate to full About, Projects, or Articles; submit the Contact form; click outbound social links.

## Navigation Behavior

Scroll-spy active-state nav; smooth anchor scrolling with header-offset correction; nav remains sticky throughout.

## Information Priority

Featured Work and Contact carry the most structural and interactive weight; Skills and Exploring remain intentionally minimal, consistent with the Content Strategy's hierarchy (Identity → Products → Experience → Knowledge → Current Journey → Trust → Contact).

## Relationships with Other Pages

Hands off to `/about` (About Preview), `/projects` (Featured Work, primary nav), `/articles` (Hero secondary CTA, primary nav), and individual Project Detail pages (Featured Work cards).

---

# 2. About

**Revised** — redesigned to be intentionally minimal, superseding the Introduction/Mission/Philosophy/Journey/Interests structure originally described here (see Content Strategy §11). The page now answers one question — "who is Usef Farahmand?" — without duplicating Experience, Skills, Projects, Articles, or Achievements.

**Purpose:** Introduce the person quickly and hand off to the rest of the site — not a resume, not a biography.

**Primary User Goal:** Understand who Usef is, what he builds, and where to go next.

**Primary CTA:** Explore Projects.

**Secondary CTA:** Read Articles, Contact Me (return to homepage Contact section).

## Sections (top to bottom)

**1. Personal Introduction**
- Purpose: The page's visual anchor — profile photo, name, title, short intro.
- Content Type: Profile photo + short narrative opening (3–5 lines). Name and professional title are reused from Hero's identity fields, not re-authored.
- Estimated Content Length: Short paragraph.
- Primary CTA: None.
- Secondary CTA: None.

**2. About Me**
- Purpose: A short story — what Usef builds, why he enjoys building software, what motivates him.
- Content Type: 2–3 short paragraphs, rendered as flowing prose without subheadings (deliberately not resume-shaped).
- Estimated Content Length: Short.
- Primary CTA: None.
- Secondary CTA: None.

**3. What I Build**
- Purpose: A quick scan of the domains Usef works in.
- Content Type: Simple icon + title grid (e.g. Web Applications, Mobile Apps, Games, AI Tools, Automation, Websites). No descriptions.
- Estimated Content Length: Minimal.
- Primary CTA: None.
- Secondary CTA: None.

**4. Resume & Portfolio**
- Purpose: Give visitors who want a downloadable artifact a clean, direct path to it.
- Content Type: Compact document cards (Resume/Portfolio, English/Persian) with Preview (opens the Universal Media Viewer — never a new tab) and Download actions.
- Estimated Content Length: Minimal — metadata only (title, version, last updated).
- Primary CTA: Preview.
- Secondary CTA: Download.

**5. Current Focus**
- Purpose: A lightweight, current snapshot of what Usef is working on right now.
- Content Type: A few short phrases, shown as lightweight pills — not cards.
- Estimated Content Length: Minimal.
- Primary CTA: None.
- Secondary CTA: None.

**6. Page-End CTA Block**
- Purpose: Convert accumulated interest into an action, without aggressive marketing language.
- Content Type: Structural CTA group.
- Estimated Content Length: Minimal — CTA only, no additional content.
- Primary CTA: Explore Projects → `/projects`.
- Secondary CTA: Read Articles → `/articles`; Contact Me → homepage Contact section.

## Expected User Actions

Read top to bottom (this is a commit-layer, read-mode page per Content Strategy §10); optionally preview or download a document; reach the end-of-page CTA.

## Navigation Behavior

Standard sticky nav with route-based active state (About highlighted); no in-page anchor nav — this page is short enough not to need internal wayfinding.

## Information Priority

No single section dominates — the page is deliberately shallow and evenly weighted, favoring whitespace and a fast read over depth (per the minimal design philosophy this redesign follows).

## Relationships with Other Pages

Received from Home (About Preview hand-off) and primary nav; links forward to Projects, Articles, and to homepage Contact.

---

# 3. Projects (Index)

**Purpose:** Enable browsing of the full body of work beyond the curated Featured Work selection.

**Primary User Goal:** Find a project relevant to the visitor's own interest or need, or assess the full range of work.

**Primary CTA:** Click into a Project Detail page.

**Secondary CTA:** Lightweight category/technology filter.

## Sections (top to bottom)

**1. Page Header**
- Purpose: Orient the visitor; establish this as the full catalog (distinct from the homepage's curated subset).
- Content Type: Short title/intro line.
- Estimated Content Length: Minimal.
- Primary CTA: None.
- Secondary CTA: None.

**2. Filter Controls**
- Purpose: Allow lightweight narrowing by category/technology, even at MVP volume (per Content Strategy §15).
- Content Type: Structural filter control (category/technology tags).
- Estimated Content Length: N/A — control, not content.
- Primary CTA: None.
- Secondary CTA: None.

**3. Project Grid**
- Purpose: Present the full catalog in scan-mode (per Content Strategy §10).
- Content Type: Project cards — title, one-line summary, status, technology tags.
- Estimated Content Length: 8–12 items at MVP launch volume.
- Primary CTA: Individual card click → Project Detail.
- Secondary CTA: None.

**4. Page-End CTA Block**
- Purpose: Redirect visitors who've browsed without finding a specific fit toward a direct relationship path.
- Content Type: Structural CTA.
- Estimated Content Length: Minimal.
- Primary CTA: Contact.
- Secondary CTA: None.

## Expected User Actions

Scan the grid; optionally filter; click into one or more Project Detail pages; reach page-end Contact CTA if browsing without a specific target.

## Navigation Behavior

Standard sticky nav, route-based active state (Projects highlighted); filter interaction does not change the URL route structurally beyond optional query-based filter state (implementation detail deferred).

## Information Priority

The grid is the entire page's reason to exist; header and filter controls are structurally minimal in comparison, and the page-end CTA is a low-emphasis fallback, not a primary element.

## Relationships with Other Pages

Received from Home (Featured Work "View All," primary nav) and About (page-end CTA); links forward to every Project Detail page; connects laterally to Articles via shared category taxonomy (future cross-filtering potential, not required at MVP).

---

# 4. Project Detail

**Purpose:** Provide a complete, honest case study for a single project — the site's primary evidence artifact.

**Primary User Goal:** Understand the problem, the solution, the reasoning behind key decisions, and what was learned.

**Primary CTA:** View Demo or View Repository (project-dependent).

**Secondary CTA:** Read a related Article; return to full Projects index.

## Sections (top to bottom)

**1. Breadcrumb**
- Purpose: Orient the visitor within the site hierarchy (Home / Projects / [Title]).
- Content Type: Structural navigation element.
- Estimated Content Length: N/A.
- Primary CTA: None (navigational).
- Secondary CTA: None.

**2. Hero / Header**
- Purpose: Establish the project identity and current status immediately.
- Content Type: Title, one-line summary, status badge, primary technology tags.
- Estimated Content Length: Short.
- Primary CTA: View Demo (if applicable).
- Secondary CTA: View Repository (if applicable).

**3. Summary**
- Purpose: Scan-layer overview before the visitor commits to full reading (per Content Strategy §5 layering).
- Content Type: Short paragraph.
- Estimated Content Length: Short.
- Primary CTA: None.
- Secondary CTA: None.

**4. Problem**
- Purpose: Establish what challenge existed before the project began.
- Content Type: Narrative.
- Estimated Content Length: Short-medium. Required field (per Content Strategy §9 minimum viable set).
- Primary CTA: None.
- Secondary CTA: None.

**5. Solution**
- Purpose: Explain what was built and why it addresses the stated problem.
- Content Type: Narrative.
- Estimated Content Length: Medium. Required field.
- Primary CTA: None.
- Secondary CTA: None.

**6. Research / Design / Architecture / Implementation / Challenges** *(optional, tiered depth)*
- Purpose: Provide deeper technical narrative for visitors who want it — per Content Strategy §9, these are additive, not mandatory for every project.
- Content Type: Narrative, potentially with supporting diagrams/screenshots (structural placeholder only).
- Estimated Content Length: Variable, project-dependent — this is where uneven depth across projects is expected and accepted, provided the required fields (Problem, Solution, Lessons Learned) are consistently present.
- Primary CTA: None.
- Secondary CTA: None.

**7. Lessons Learned**
- Purpose: Deliver the honesty signal central to the site's content philosophy — a genuine trade-off, limitation, or "what I'd do differently."
- Content Type: Narrative.
- Estimated Content Length: Short-medium. Required field — this section cannot be omitted (per Content Strategy §9).
- Primary CTA: None.
- Secondary CTA: None.

**8. Technologies**
- Purpose: Enable quick technical fit assessment; supports cross-linking to Skills.
- Content Type: Tag list.
- Estimated Content Length: Short.
- Primary CTA: None.
- Secondary CTA: None.

**9. Gallery**
- Purpose: Visual evidence of the finished product.
- Content Type: Image set (structural placeholder — no visual treatment defined here).
- Estimated Content Length: Variable, project-dependent.
- Primary CTA: None.
- Secondary CTA: None.

**10. Related Content**
- Purpose: Close the internal linking loop (per Content Strategy §19).
- Content Type: Links to related Articles, relevant Experience entry (if applicable), relevant Skills.
- Estimated Content Length: Short — a small set of related links, not exhaustive.
- Primary CTA: None.
- Secondary CTA: Individual link clicks to related content.

**11. Page-End CTA Block**
- Purpose: Convert reading engagement into next action.
- Content Type: Structural CTA.
- Estimated Content Length: Minimal.
- Primary CTA: Contact.
- Secondary CTA: Back to All Projects.

## Expected User Actions

Read top to bottom or skim via Summary first; click external Demo/Repository links; click into related Articles; return to Projects index or move to Contact at page end.

## Navigation Behavior

Standard sticky nav with route-based state (Projects section of nav remains highlighted, since this is a nested route); breadcrumb provides the specific in-hierarchy location.

## Information Priority

Problem, Solution, and Lessons Learned are the non-negotiable structural core; everything between them (Research/Design/Architecture/Implementation/Challenges) is depth that scales with what each project actually has to say — consistent with the tiered content structure defined in the Content Strategy.

## Relationships with Other Pages

Received from Projects index and Featured Work; links forward to related Articles, back to Projects index, and to Contact; may reference a specific Experience entry.

---

# 5. Articles (Index)

**Purpose:** Enable browsing of the full body of written work.

**Primary User Goal:** Find an article relevant to the visitor's own technical interest or current problem.

**Primary CTA:** Click into an Article Detail page.

**Secondary CTA:** Lightweight category filter.

## Sections (top to bottom)

**1. Page Header**
- Purpose: Orient the visitor to the full article catalog.
- Content Type: Short title/intro line.
- Estimated Content Length: Minimal.
- Primary CTA: None.
- Secondary CTA: None.

**2. Filter Controls**
- Purpose: Allow narrowing by category (Software Engineering, AI, Web Development, Mobile, Game Development, Product Development, Design, Personal Journey).
- Content Type: Structural filter control.
- Estimated Content Length: N/A.
- Primary CTA: None.
- Secondary CTA: None.

**3. Article Grid / List**
- Purpose: Present the full catalog in scan-mode.
- Content Type: Article cards — title, one-line summary, category tag, reading time, last-updated date.
- Estimated Content Length: 5–10 items at MVP launch volume.
- Primary CTA: Individual card click → Article Detail.
- Secondary CTA: None.

**4. Page-End CTA Block**
- Purpose: Provide a path forward for visitors who've browsed without finding a specific fit.
- Content Type: Structural CTA.
- Estimated Content Length: Minimal.
- Primary CTA: Contact.
- Secondary CTA: View Projects (cross-sell into the other primary content type).

## Expected User Actions

Scan the list; optionally filter by category; click into one or more Article Detail pages.

## Navigation Behavior

Standard sticky nav, route-based active state (Articles highlighted).

## Information Priority

The list is the page's core reason to exist; reading time and last-updated date are structurally required per-card metadata (not optional), since they directly serve the site's effort/currency signaling principle.

## Relationships with Other Pages

Received from Home (Hero secondary CTA, primary nav) and Project Detail (Related Content links); links forward to every Article Detail page; connects laterally to Projects via shared category taxonomy.

---

# 6. Article Detail

**Purpose:** Deliver a complete piece of technical or reflective writing.

**Primary User Goal:** Learn something specific and useful, and assess Usef's depth of thinking in the process.

**Primary CTA:** Read the Next Article or a Related Article.

**Secondary CTA:** View the related Project (if one exists); Contact.

## Sections (top to bottom)

**1. Breadcrumb**
- Purpose: Orient the visitor within the site hierarchy (Home / Articles / [Title]).
- Content Type: Structural navigation element.
- Estimated Content Length: N/A.
- Primary CTA: None.
- Secondary CTA: None.

**2. Cover / Header**
- Purpose: Establish the article's identity and key metadata immediately.
- Content Type: Title, cover image (structural placeholder), category tag, reading time, last-updated date.
- Estimated Content Length: Short.
- Primary CTA: None.
- Secondary CTA: None.

**3. Table of Contents** *(conditional — long-form articles only)*
- Purpose: Support in-page wayfinding for longer pieces; also reinforces heading structure for SEO/accessibility.
- Content Type: Auto-derived list of headings.
- Estimated Content Length: N/A — structural, length scales with article length.
- Primary CTA: None (navigational, jumps within page).
- Secondary CTA: None.

**4. Article Body**
- Purpose: Deliver the core content — the primary reason the page exists.
- Content Type: Long-form structured text (headings, paragraphs, code blocks, images as needed).
- Estimated Content Length: Medium-long; this is the page's dominant content block.
- Primary CTA: None (embedded contextual links may appear within body content per internal linking strategy).
- Secondary CTA: None.

**5. Related Content**
- Purpose: Close the internal linking loop — link to the Project it discusses (if applicable) and related Articles by category.
- Content Type: Link list/cards.
- Estimated Content Length: Short — a small set, not exhaustive.
- Primary CTA: None.
- Secondary CTA: Individual link clicks.

**6. Next Article**
- Purpose: Encourage continued reading, supporting the returning/engaged-visitor behavior.
- Content Type: Single next-item link/card.
- Estimated Content Length: Minimal.
- Primary CTA: Read Next Article.
- Secondary CTA: None.

**7. Page-End CTA Block**
- Purpose: Convert reading engagement into next action.
- Content Type: Structural CTA.
- Estimated Content Length: Minimal.
- Primary CTA: Contact.
- Secondary CTA: Back to All Articles.

## Expected User Actions

Read the article body (optionally via Table of Contents for longer pieces); click contextual in-body links; explore Related Content or Next Article; reach page-end Contact CTA.

## Navigation Behavior

Standard sticky nav with route-based state (Articles section remains highlighted, nested route); breadcrumb provides specific in-hierarchy location; Table of Contents (when present) provides in-page anchor navigation distinct from the site-wide nav.

## Information Priority

Article Body is the dominant structural element by a wide margin; all surrounding sections (header metadata, TOC, related content, next article) are supporting structure that frames the reading experience without competing with it — consistent with the "read mode" principle from the Content Strategy.

## Relationships with Other Pages

Received from Articles index, Home (indirectly, via Articles nav), and Project Detail (Related Content links); links forward to related Projects, related Articles, the next Article in sequence, and Contact.

---

# Cross-Page Consistency Rules

These rules apply across all six page specifications to keep the structure coherent as a system, not six independently designed pages:

1. **Every routed content page (Project Detail, Article Detail) ends with the same structural pattern:** Related Content → (Next Article, Project Detail only) → Page-End CTA Block. This consistency is deliberate — a visitor who finishes reading anything on the site should always land in a familiar, predictable structural position.
2. **Every index page (Projects, Articles) follows the same structural pattern:** Page Header → Filter Controls → Grid/List → Page-End CTA Block.
3. **Breadcrumbs appear only two levels deep** (Home / [Index] / [Detail Title]) — the architecture intentionally avoids deeper nesting, consistent with the "keep navigation shallow" rule.
4. **Contact is structurally present, in some form, on every page** — either as the page-end CTA (routed pages) or as the terminal homepage section — reinforcing that Contact is always reachable, never more than one page-end away.
5. **No page other than Home contains more than one "index/browse" pattern** — Project Detail and Article Detail are single-item, read-mode pages by structural design; they do not re-introduce grid/list browsing mid-page, keeping the scan-mode/read-mode distinction structurally clean.

---

# Guiding Principle

Structure should make the site's story impossible to get lost in — every page should know where it came from, what it's for, and where it leads next.
