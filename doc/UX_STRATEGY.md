# UX_STRATEGY.md

# Usef Farahmand Digital Experience

Version: 1.0

Status: Draft

---

# Purpose

This document defines the user experience strategy for the website.

It sits between the Information Architecture and the visual design phase.

It answers *how the experience should feel and behave*, before any wireframe or interface decision is made.

This document intentionally excludes layout, visual design, and code.

---

# 1. UX Vision

The experience should feel like watching someone think out loud while they build — not like reading a résumé that happens to have animations.

A visitor should leave with a mental model of Usef as a builder in motion, not a static list of accomplishments. The UX exists to make that motion visible: recent work, current focus, real decisions, real trade-offs.

The site succeeds when a visitor's internal narration shifts from *"this is a well-designed portfolio"* to *"this person is actively building things, and I want to see what's next."*

---

# 2. UX Principles

These principles govern every UX decision made from this point forward. When two principles conflict, resolve in the order listed.

1. **Clarity before cleverness.** A visitor should never have to think about how to use the site.
2. **Momentum over completeness.** Show that things are moving, not that everything is finished.
3. **One primary action per screen.** Every section has exactly one thing it wants the visitor to do next.
4. **Content leads, chrome follows.** Navigation, motion, and UI never compete with the work being shown.
5. **Respect the visitor's time.** Every scroll, click, and load should feel earned.
6. **Consistency builds trust.** Identical patterns behave identically everywhere, without exception.
7. **Depth is optional, never mandatory.** Casual visitors get the surface; interested visitors can go deep. Nobody is forced through either path.

---

# 3. First Impression Strategy

The first five seconds must answer three questions, in this order:

1. **What kind of person is this?** (identity + craft signal, not a job title alone)
2. **What have they built recently?** (proof, not promise)
3. **What should I do next?** (a single, obvious action)

The hero must avoid two common failure modes: the generic "Hi, I'm a Software Engineer" opener that says nothing distinctive, and the over-designed hero that prioritizes visual spectacle over immediate comprehension.

First impression success criteria:

- A visitor understands what Usef builds without scrolling.
- A visitor sees evidence of recent activity within the first screen (not buried below the fold).
- No visitor lands on the homepage and has to search for what to do next.

The hero should feel confident and understated rather than loud. Craftsmanship communicated through restraint is more credible to this audience (engineers, founders, CTOs) than craftsmanship communicated through spectacle.

---

# 4. Visitor Mental Model

Different visitors arrive with different existing mental models. The UX must accommodate all of them without designing separately for each.

| Visitor type | Arrives thinking | Needs the site to confirm |
|---|---|---|
| Recruiter | "Is this person hireable and credible?" | Real experience, real ownership, communicates clearly |
| Client / Founder | "Can this person solve my problem?" | Relevant project outcomes, working process, ease of contact |
| Developer | "Is this person technically serious?" | Real technical depth, honest trade-offs, not just marketing |
| Casual / returning visitor | "What's new since last time?" | Visible recency, low effort to catch up |

The site should never force a visitor to declare which type they are. Instead, the homepage structure (Featured Work → About → Experience → Now) should let each visitor self-select the path that matches their existing mental model through what they choose to engage with.

---

# 5. Primary User Goals

Ranked by how central they are to the site's purpose:

1. Understand who Usef is and what he builds, quickly.
2. Evaluate the quality and depth of his work.
3. Understand what he's currently doing (credibility of "still active").
4. Assess trustworthiness (via experience, recommendations).
5. Find a low-friction way to make contact.
6. Learn something (via articles), for developer/technical visitors.

Every homepage section maps to at least one of these goals. Sections that don't clearly serve one of these six goals should be reconsidered (per the Product Review, this is already a live question for Recommendations at launch).

---

# 6. Primary Conversion Goals

"Conversion" here does not mean a hard sale — it means a visitor taking an action that continues the relationship. In priority order:

1. **Contact initiated** (message sent, email opened) — the highest-value action.
2. **Project explored in depth** (Project Detail visited) — signals genuine interest, strong intent signal for recruiters/clients.
3. **Article read to completion** — signals technical trust-building, strongest for the Developer persona.
4. **Return visit** — signals the "living experience" premise is working.
5. **External follow-through** (GitHub, LinkedIn, X click) — lower intent but extends reach.

Each of these needs to be an observable, named event before analytics implementation (Phase 10) rather than defined retroactively. This document treats them as the canonical goal list; instrumentation should be built to measure exactly these five, not a generic pageview count.

---

# 7. User Journey Overview

Four journeys were defined at the IA stage. The UX strategy adds *intent* to each step so design decisions have a clear job to do at every stage.

**Recruiter**
Land → skim Hero for credibility → Featured Work (proof) → About (depth, hybrid page) → Experience (verification) → Contact.
UX job: minimize time-to-credibility, make Experience easy to scan, not read.

**Client / Founder**
Land → Featured Work → Project Detail (does this solve my kind of problem?) → Recommendations (social proof) → Contact.
UX job: make the problem/solution framing in case studies impossible to miss, surface Recommendations near the decision point.

**Developer**
Land → Projects (full list, technical filtering) → Articles (depth, opinion, technique) → GitHub (verification outside the site) → Contact (optional).
UX job: don't force this visitor through marketing framing; let them jump straight to substance.

**Returning Visitor**
Land → Now (what changed?) → Latest Articles → Latest Projects.
UX job: this journey currently has no re-entry mechanism (see §16) — the UX strategy must supply one, since a journey nothing points back to isn't a journey.

---

# 8. Navigation Strategy

Confirmed hybrid model:

- **Scroll-based (homepage sections):** Hero, About Preview, Featured Work, Experience, Skills, Recommendations, Exploring, Now, Contact.
- **Route-based (dedicated pages):** About, Projects, Project Detail, Articles, Article Detail.

Navigation rules:

1. The nav bar must communicate location correctly regardless of whether the visitor is scroll-tracking on the homepage or on a routed page — active-state logic must be unified, not two separate systems bolted together.
2. From any routed page (Projects, Article Detail, etc.), every homepage-only section (Skills, Now, Contact) must still be reachable in one action — by returning to the homepage and auto-scrolling to the target section, not by forcing the visitor to first land, then find, then scroll manually.
3. Navigation must never hide primary destinations behind a hamburger on desktop. Mobile collapse is expected; desktop collapse is not, per the "no hidden content" principle.
4. The nav should never contain more top-level items than a visitor can scan in under two seconds — this caps primary nav at roughly 5–6 items, consistent with the IA's existing primary nav list.
5. Contact, as a homepage-only section, still needs a persistent, always-reachable nav entry — it is a conversion goal and cannot be one scroll-position away from invisible when a visitor is deep in a routed page.

---

# 9. Homepage Strategy

The homepage carries more weight in this architecture than in a typical multi-page site, since eight of the eleven MVP sections live there. Its job is not to *contain* everything — it's to give every visitor type a fast, correct exit point toward the content that matches their intent.

Strategic role of each section, restated in UX terms (not IA terms):

- **Hero** — establish identity and momentum in one screen.
- **About Preview** — earn fifteen seconds of trust, then hand off to `/about` for visitors who want depth.
- **Featured Work** — the credibility engine; this is what most visitors actually came to see.
- **Experience** — fast-scan verification, not a full career narrative.
- **Skills** — supporting evidence, never the main event; must stay visually quiet relative to Featured Work.
- **Recommendations** — third-party trust signal, positioned close to where a Client-type visitor is making a decision.
- **Exploring** — signals intellectual range and curiosity; lower priority, later in scroll order.
- **Now** — the "this is alive" proof point; must feel distinct from Exploring, not redundant with it.
- **Contact** — the singular conversion endpoint; always the final beat.

The homepage should be treated as a **guided narrative with exits**, not a wall of equally-weighted sections. Visual and interaction weight should be intentionally uneven — Featured Work and Contact carry more design gravity than Skills or Exploring.

Because the homepage is long, **in-page wayfinding is a requirement, not an enhancement** — a visitor must always have a low-effort way to see how much is left and jump between sections without relying purely on scroll stamina.

---

# 10. Content Consumption Strategy

Two distinct content modes exist on this site, and they should be treated differently:

**Scan mode** (homepage sections, Projects grid, Articles grid): visitors are browsing, comparing, deciding what's worth deeper attention. Content here should be skimmable in seconds — strong visual hierarchy, short copy, clear status signals.

**Read mode** (Project Detail, Article Detail): visitors have already opted in to depth. Content here should optimize for sustained reading — comfortable line length, clear structure, minimal distraction, no competing CTAs mid-content.

The transition between modes (clicking from a card into a detail page) should feel like a deliberate shift in pace, not just a route change — this is a motion and layout responsibility carried forward into later phases, but the *strategic intent* (scan → commit → read) needs to be established here so it isn't lost.

Reading-mode content should always show effort signals up front: reading time, last updated date, and — critically per the Product Review — a required "what didn't work / what I'd do differently" element in every project case study, so depth reads as honest rather than curated.

---

# 11. Scroll Experience Strategy

Scroll is the primary interaction on this site, given the homepage-heavy IA. It must be treated as a designed system, not a default browser behavior.

- Scroll should never feel hijacked — no scroll-jacking, no forced pacing. Visitors control speed entirely.
- Section transitions should use reveal, not relocation — content arrives into view; the page never jumps or snaps unexpectedly.
- Long scroll needs **progress legibility** — a visitor should always have a sense of where they are in the homepage and how much remains, without needing to guess from scrollbar position alone.
- Anchor-linking (nav → section) must land precisely and predictably, accounting for sticky header offset — this is a common, easily-missed correctness bug in scroll-based navigation and should be treated as a hard requirement, not a polish item.
- Scroll behavior must degrade gracefully under `prefers-reduced-motion` — content still reveals, just without animated transition.

---

# 12. Interaction Philosophy

Every interactive element should communicate three things: that it's interactive, what will happen, and that the action registered.

- Hover states exist to invite, not decorate — if hovering doesn't change a visitor's understanding of what a click will do, it isn't earning its place.
- Feedback must be immediate. No interaction should leave a visitor unsure whether their action was received (clicks, form submission, filters).
- Interaction cost should scale with content value — a Project card invites a light hover; a case study's "what didn't work" section might invite a longer, more deliberate expand-to-read interaction. Not everything deserves the same interaction weight.
- Playful interaction is welcome in low-stakes areas (a 404 page, a mascot detail) and should be avoided in high-stakes areas (Contact form, primary CTAs) where friction-free execution matters more than delight.

---

# 13. Call-to-Action Strategy

CTAs are deliberately scarce and hierarchical, not distributed evenly across the page.

**Primary CTA (site-wide):** Contact — this is the only action the site truly wants from every visitor type eventually.

**Secondary CTAs (contextual, one per section):**
- Hero → Explore Projects
- About Preview → Read Full Story (`/about`)
- Featured Work → View All Projects
- Project Detail → Read Case Study / View Demo / View Repository
- Article Detail → Related Articles / Next Article

Rules:

1. No section should present more than one primary-weight CTA. Secondary links (View Repository, View Demo) are allowed but must be visually subordinate.
2. CTA copy must be specific to the action ("Explore Projects," not "Learn More") — vague CTA copy is a recurring failure mode in portfolio sites and directly undermines the "clarity before cleverness" principle.
3. Contact should be reachable from every page, not just presented once on the homepage — but it should never feel inserted mid-content; it belongs at natural conclusion points (end of a case study, end of an article, nav bar).

---

# 14. Trust Building Strategy

Trust is built cumulatively, not from a single "About" statement. The strategy relies on layered proof:

1. **Competence proof** — Featured Work and Project Detail depth (real problems, real trade-offs, real decisions explained).
2. **Consistency proof** — Experience timeline showing sustained, credible history.
3. **Third-party proof** — Recommendations (only once genuinely strong; see Product Review §4).
4. **Currency proof** — Now section demonstrating active, present-tense work.
5. **Transparency proof** — honest "what didn't work" content, avoiding the highlight-reel trap that makes most portfolios feel curated rather than credible.

Trust erodes fastest through inconsistency (see Product Review): a sparse Recommendations section, uneven case study depth, or a stale Now page each actively damage trust rather than being neutral. The UX strategy treats **all-or-nothing thresholds** as a governing rule — a section should not ship until it can meet a minimum credibility bar, per the Product Review's "ship only once there are 3+ strong quotes" guidance for Recommendations.

---

# 15. Content Discovery Strategy

At MVP volume (8–12 projects, 5–10 articles), discovery is simple by necessity — visitors can reasonably browse the entire catalog without search or heavy filtering.

- Projects and Articles should support lightweight filtering (by category/technology) even at MVP volume, since it costs little and establishes the pattern for scale.
- Cross-linking is the primary discovery mechanism at this stage: every Project Detail should surface related Articles, and vice versa, per the IA's content relationship model. This should feel like a natural byproduct of reading, not a bolted-on "related content" widget.
- Full-text search is explicitly out of scope for MVP (per IA) — discovery relies on structure and cross-linking instead, which is appropriate at this content volume and should not be second-guessed prematurely.
- As content volume grows, discovery should evolve toward tag-driven browsing and eventually search — the content model (see Product Review, §7 scalability) should already support this transition without restructuring.

---

# 16. Returning Visitor Strategy

This is the weakest link in the current experience, flagged directly in the Product Review, and the UX strategy must address it rather than assume it away.

A returning visitor currently has no active reason to know something changed. The strategy:

- **Now and Exploring must visibly display their last-updated date** — recency is the entire value proposition of these sections, and without a visible timestamp a visitor cannot tell whether they're looking at something current or forgotten.
- **A lightweight, low-commitment follow mechanism should exist** (email capture or RSS) so the "Returning Visitor" journey isn't purely dependent on a visitor remembering to come back unprompted. This was flagged as a genuine product gap and the UX strategy treats it as a requirement to design for, not an optional nice-to-have.
- **Recently-updated content should be surfaced prominently**, not require a visitor to hunt for what's new — this could be as simple as sort-by-date defaults on Projects/Articles, combined with visible "updated" badges.

Until a follow mechanism exists, the "Returning Visitor" journey documented in the IA is aspirational rather than real. This should be treated as a launch-blocking gap for that specific journey, even if the rest of MVP ships without it.

---

# 17. Mobile UX Strategy

Given the audience (recruiters and clients frequently browsing on mobile between other tasks) and the mobile-first requirement already established, mobile is not a secondary consideration.

- The long homepage scroll is more demanding on mobile — section wayfinding (§9, §11) matters even more here, since mobile visitors have less patience for undifferentiated scrolling.
- Touch targets for nav, CTAs, and project cards must be comfortably tappable without precision — no interaction should require zooming or careful aiming.
- Motion should be more conservative on mobile by default — battery, performance variance across devices, and one-handed usage context all argue for restraint, independent of the `prefers-reduced-motion` fallback.
- Contact must be trivially reachable on mobile in one or two taps from anywhere — this is the highest-value conversion action and mobile friction here is the most costly place for friction to exist.
- Galleries and case study media (images, embeds) need a mobile-native consumption pattern (swipe, not hover-dependent interaction) since Project Detail pages are read-mode content likely to be consumed on any device.

---

# 18. Accessibility Strategy

Accessibility is treated as a baseline requirement, not a checklist run at the end — consistent with the existing project documentation, but stated here in UX terms specifically:

- Every interactive element must be reachable and operable via keyboard alone, with a visible focus state at every step — this includes scroll-triggered reveals, which must not depend on hover or pointer-only triggers to become visible/usable.
- Scroll-based navigation (anchor links) must remain fully functional for screen reader and keyboard users, including correct focus management when jumping to a section.
- Motion-based content reveals must have a non-animated equivalent path — content must never be gated behind an animation completing; if JavaScript or motion fails, content is still present and accessible.
- Color must never be the only signal for meaning (e.g., project status, form validation state) — pair color with text or iconography.
- Reading-mode content (articles, case studies) must maintain heading hierarchy and semantic structure suitable for screen reader navigation, not just visual hierarchy.

Accessibility and SEO reinforce each other throughout this document (semantic structure, focus management, meaningful text) — this is treated as one strategy, not two overlapping ones.

---

# 19. Motion Philosophy

Motion's job in this UX strategy is narrower and more disciplined than "make it feel alive":

- Motion should **confirm**, not **decorate** — every animation should answer "did that work," "where did that go," or "what's related to what," never exist purely for visual flourish.
- Motion intensity should be proportional to significance — a hover state gets a subtle transition; a page-level transition gets more weight; nothing in between should compete with either.
- The homepage's section reveals exist specifically to support the scroll wayfinding strategy (§11) — motion here is functional (indicating progression through content) as much as it is aesthetic.
- Motion should never introduce a delay between visitor intent and content availability — a scroll-triggered reveal must not gate reading; if a visitor scrolls fast, content should already be legible, not still animating in.
- One deliberate, memorable motion moment (per the Product Review's "one genuinely memorable interactive moment" recommendation) is a strategic asset, not a violation of restraint — the discipline elsewhere on the site is what makes one distinctive moment land, rather than get lost among many.

---

# 20. Success Metrics

Tied directly to the Primary Conversion Goals (§6), not generic analytics vanity metrics:

| Metric | What it validates |
|---|---|
| Contact initiated (rate, volume) | Whether the site actually converts interest into relationship |
| Project Detail engagement (time on page, scroll depth) | Whether case studies are credible enough to hold attention |
| Article completion rate | Whether technical trust-building content is working |
| Return visit rate | Whether the "living experience" premise is real to visitors |
| Follow/subscribe conversions (once built, §16) | Whether the returning-visitor gap has actually been closed |
| Homepage scroll depth to Contact | Whether the homepage narrative successfully carries visitors to the primary CTA rather than losing them mid-scroll |

Vanity metrics (raw pageviews, generic session count) are explicitly deprioritized — they don't validate any of the primary user or conversion goals defined in this document and shouldn't drive UX decisions.

---

# Guiding Principle

Design the experience so a visitor's understanding deepens with every scroll and every click — never so it merely continues.
