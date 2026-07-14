# CONTENT_STRATEGY.md

# Usef Farahmand Digital Experience

Version: 1.0

Status: Draft

---

# Purpose

This document defines what information the website presents, why each piece of content exists, and how it supports the visitor's journey.

It sits between the UX Strategy and wireframing. It does not define layout, visual hierarchy, or copy — it defines the *substance* those later phases will shape.

This document intentionally excludes UI, layout, and written copy.

---

# 1. Content Philosophy

Content on this site exists to demonstrate, not to declare.

Every section should answer an implicit visitor question with evidence rather than assertion. "I'm a skilled engineer" is a declaration; a case study explaining a real architectural trade-off is evidence. The site should contain almost no declarations that aren't immediately backed by evidence in the same breath.

Three rules govern all content on the site:

1. **Show the decision, not just the outcome.** Content should explain *why*, not only *what*.
2. **Honesty outperforms polish.** A described limitation or a "what I'd do differently" is more persuasive to this audience (engineers, founders, CTOs) than a flawless highlight reel.
3. **Every piece of content earns its place.** If a section can't currently meet its own credibility bar (see §14, §20), it should not ship empty or thin — better absent than half-hearted.

---

# 2. Content Hierarchy

Restating the IA's information hierarchy in content terms — this is the order in which content *value* is prioritized, not necessarily scroll order:

1. **Identity** — who is speaking, and in what voice.
2. **Products** — what has actually been built.
3. **Experience** — the track record behind the products.
4. **Knowledge** — what has been learned and taught along the way.
5. **Current Journey** — proof the work is ongoing.
6. **Trust** — third-party and contextual reinforcement.
7. **Contact** — the resolution point.

Content decisions at every level should be traceable back to one of these seven. If a proposed piece of content doesn't map cleanly to any of them, it likely doesn't belong on the site yet.

---

# 3. Homepage Storytelling Strategy

The homepage is a single narrative arc, not a list of unrelated sections. Its storytelling shape:

**Establish → Prove → Deepen → Verify → Reinforce → Signal Life → Resolve**

- **Establish** (Hero): who this is, in one confident beat.
- **Prove** (Featured Work): here is the evidence, immediately.
- **Deepen** (About Preview): here is the person and philosophy behind the evidence.
- **Verify** (Experience, Skills): here is the track record that makes the evidence credible.
- **Reinforce** (Recommendations): here is what others say, independent of self-description.
- **Signal Life** (Exploring, Now): here is what's still in motion.
- **Resolve** (Contact): here is what to do with everything you just learned.

Each beat should hand off cleanly to the next — a visitor moving through the page should always feel like the story is building toward something, not looping back over already-covered ground. Skills and Experience, in particular, must avoid restating what Featured Work already proved; they exist to *verify* the claim, not repeat it.

---

# 4. Section Goals

Every homepage and page-level section, restated as a single content goal each:

| Section | Content Goal |
|---|---|
| Hero | Establish identity and momentum in one statement |
| About Preview | Earn interest in the person, hand off to full story |
| Featured Work | Prove capability through selected evidence |
| Experience | Verify track record quickly |
| Skills | Support credibility without repeating Featured Work |
| Recommendations | Provide third-party validation |
| Exploring | Signal intellectual range and curiosity |
| Now | Prove the work is currently active |
| Contact | Convert interest into a relationship |
| About (full page) | Provide depth on philosophy, journey, and motivation |
| Projects (index) | Enable browsing of the full body of work |
| Project Detail | Provide a complete, honest case study |
| Articles (index) | Enable browsing of written knowledge |
| Article Detail | Deliver a complete piece of technical or reflective writing |

---

# 5. Information Priority

Within any given section, information should be layered so a visitor gets value at every depth they're willing to go:

- **Glance layer** (under 3 seconds): a title, a status, a single defining fact.
- **Scan layer** (10–20 seconds): enough context to decide whether to go deeper.
- **Commit layer** (full read): complete depth, for a visitor who has already decided this is worth their time.

This layering applies most directly to Projects and Articles, but the same discipline should govern Experience (glance: company + role; scan: headline achievement; commit: full responsibilities) and About (glance: preview blurb; commit: full `/about` page).

No section should force a visitor into the commit layer to get the glance-layer value — headlines and summaries must stand on their own.

---

# 6. User Questions Answered by Each Section

| Section | Primary Question Answered |
|---|---|
| Hero | "What kind of builder is this?" |
| About Preview | "Do I want to know more about this person?" |
| Featured Work | "What has this person actually built?" |
| Experience | "Has this person done this professionally, and for how long?" |
| Skills | "Do their practical skills match what I need?" |
| Recommendations | "Do other people vouch for this person?" |
| Exploring | "What is this person curious about right now?" |
| Now | "Is this person actively working, right now?" |
| Contact | "How do I reach them, and will they respond?" |
| About (full) | "What is their story, philosophy, and motivation?" |
| Projects (index) | "What is the full range of what they've built?" |
| Project Detail | "How did they solve this problem, and what did they learn?" |
| Articles (index) | "What can I learn from this person's writing?" |
| Article Detail | "What does this person actually know about this topic?" |

---

# 7. Content Flow from Top to Bottom

The homepage content flow is designed so each section's exit naturally motivates the next section's entry:

Hero (curiosity) → About Preview (interest in the person) → Featured Work (proof) → Experience (credibility) → Skills (supporting detail) → Recommendations (third-party trust) → Exploring (range and curiosity) → Now (currency) → Contact (resolution).

Two flow rules apply throughout:

1. **No section should require the previous section to make sense.** A visitor arriving via a deep link or shared section anchor should still understand what they're looking at without needing full page context.
2. **No section should dead-end.** Every section either leads naturally into the next or offers an explicit path elsewhere (a link to a full page, a related piece of content) — nothing should feel like a content cul-de-sac.

---

# 8. Featured Content Strategy

Featured Work is not a separate content type — it is a curated view into the Projects collection (`featured: true`), per the confirmed IA decision. Its content strategy is therefore a *selection* strategy, not an authoring strategy:

- Featured projects should represent range, not just quality — ideally spanning different domains (AI, web, game, tool) so a visitor's first impression of "what this person builds" isn't accidentally narrow.
- Featured status should be revisited periodically as new projects ship — "featured" should mean *currently most representative*, not *permanently pinned*. A featured set that never changes undermines the "living experience" premise as much as a stale Now section would.
- Each featured entry needs enough scan-layer information (title, one-line problem/outcome, status) to justify a click into the full case study — Featured Work is a *decision point*, not a preview of prose.

---

# 9. Project Content Structure

**Why it exists:** Projects are the primary evidence layer of the entire site — the single most persuasive content type for every visitor persona.

**What the visitor should learn:** What problem existed, what was built, why specific decisions were made, and what was learned — not just a feature list.

**What action the visitor should take next:** Explore the demo/repository, read a related article, or move to Contact if the project resonates with their own need.

**How it connects to the rest of the site:** Links to related Articles, relevant Skills, and the Experience period during which it was built (per the IA's content relationship model).

**Structural content strategy:**

- Every project needs a minimum viable set of fields to ship at all: title, one-line summary, problem, solution, technologies, current status, and at least one honest reflection (what worked or didn't).
- Deeper fields (Research, Architecture, Implementation, Challenges) are additive, not mandatory — per the Product Review, uniform mandatory depth across 8–12 projects risks visible unevenness. A tiered structure (required core + optional depth) protects against this without lowering the bar on any single project.
- **Status must be a defined, consistently-used value** (e.g., Active, Shipped, Paused, Archived) — this is content infrastructure, not decoration, and it's what lets Featured Work and the Projects index communicate momentum at a glance.
- Every case study must include a genuine trade-off or limitation, not just what worked — this is a hard content requirement, not a stylistic suggestion, per the site's "honesty outperforms polish" principle.

---

# 10. Article Content Structure

**Why it exists:** Articles establish depth of thinking and technical credibility beyond what a finished project can demonstrate on its own — they show *how* Usef thinks, not just what he ships.

**What the visitor should learn:** A specific technical or product lesson, explained clearly enough to be useful to someone else facing the same problem.

**What action the visitor should take next:** Read a related article, explore the project the article discusses (if any), or move toward Contact if the writing itself demonstrates relevant expertise.

**How it connects to the rest of the site:** Links to the Project it discusses (if applicable), related Articles by category/tag, and back to About for readers who want to know who wrote it.

**Structural content strategy:**

- Every article needs a clear single takeaway stated early — readers should know within the first few lines whether this article addresses what they came for.
- Articles should be evergreen wherever possible (per SEO guidelines) — content strategy should favor durable lessons over time-bound announcements, since evergreen content compounds in value while announcement-style content depreciates immediately.
- Reading time and last-updated date must be visible up front — this is a trust and effort signal, not just metadata.
- Article categories should map cleanly onto Project categories (AI, Engineering, Design, Game Development, etc.) so cross-linking between the two content types feels natural rather than forced.

---

# 11. About Content Structure

**Why it exists:** About is where a visitor who is already interested goes to understand the person behind the work — motivation, philosophy, and journey, not just a résumé restated in prose.

**What the visitor should learn:** Why Usef builds what he builds, what he cares about, and how his path led here — enough to make his work feel intentional rather than incidental.

**What action the visitor should take next:** Move to Projects (to see the philosophy in practice) or Contact (if the story itself built enough trust).

**How it connects to the rest of the site:** The About Preview on the homepage hands off here; the full page should link forward into Experience and Projects rather than existing as a dead end.

**Structural content strategy:**

- The homepage About Preview and the full `/about` page should not be two independently authored pieces of content — the preview should function as a genuine excerpt or distillation of the full narrative, not a separately branded introduction. This keeps the two consistent as the full story evolves.
- Full About content should cover: Introduction, Mission, Philosophy, Journey, and Interests (per the IA) — but Journey should read as a narrative arc (why this path), not a duplicate timeline of Experience, which already covers the factual record.
- Jolly Panda Studio should appear here naturally, woven into the narrative of *why* Usef builds independent products — not as a separated, self-contained studio pitch (per the confirmed decision that Jolly Panda is not a competing brand within this site).

---

# 12. Experience Storytelling Strategy

**Why it exists:** Experience provides the fastest, most easily verified form of credibility — recruiters and hiring-adjacent visitors will often check this section first or exclusively.

**What the visitor should learn:** A clear, scannable record of where Usef has worked, what he was responsible for, and what he achieved — verifiable, specific, and free of vague self-praise.

**What action the visitor should take next:** Move to Projects to see the work behind the titles, or to Contact if the track record alone is sufficient.

**How it connects to the rest of the site:** Each experience entry should link forward to any Projects built during that period, closing the loop between "what I was responsible for" and "what I actually shipped."

**Structural content strategy:**

- Optimize for scan-layer legibility first — company, role, dates, and one headline achievement should be readable without any interaction. Full responsibilities live one layer deeper.
- Achievements should be specific and outcome-oriented, not duty-listing — "led X to Y outcome" outperforms "responsible for X" for every persona this site targets.
- Experience should feel like a factual record, distinct in tone from About's narrative reflection — the two should never feel like they're saying the same thing in different words.

---

# 13. Skills Presentation Strategy

**Why it exists:** Skills gives structure to what's implicitly demonstrated throughout Projects and Experience, letting a visitor quickly confirm specific technical fit.

**What the visitor should learn:** The practical domains Usef genuinely works in, grouped meaningfully rather than presented as an undifferentiated tag cloud.

**What action the visitor should take next:** Cross-reference against a specific Project or Experience entry, or move on — Skills is a supporting/verification section, not a destination in itself.

**How it connects to the rest of the site:** Every skill grouping should be traceable to real evidence elsewhere (a Project that used it, an Experience entry that required it) — skills without evidence are just a list of words and undermine the site's evidence-first philosophy.

**Structural content strategy:**

- Group by practical domain (Frontend, Backend, Mobile, Game, AI, Cloud, DevOps, UI/UX per the IA taxonomy) rather than an alphabetical or popularity-sorted list — grouping communicates range and specialization simultaneously.
- Depth signals (e.g., "primary," "working knowledge") are more useful than an undifferentiated flat list, but should be used sparingly and honestly — inflated skill claims are quickly disproven by a technical visitor cross-checking against Projects.
- This section should stay visually and informationally quiet relative to Featured Work, consistent with the UX Strategy's guidance that Skills supports rather than competes with the primary evidence layer.

---

# 14. Recommendations Strategy

**Why it exists:** Recommendations provide validation that doesn't come from Usef himself — the only content type on the site that isn't self-authored, which makes it disproportionately persuasive when done well and disproportionately damaging when done poorly.

**What the visitor should learn:** That people who have directly worked with Usef vouch for specific, credible qualities — not generic praise.

**What action the visitor should take next:** Move toward Contact, particularly for Client/Founder-type visitors for whom this section is most persuasive.

**How it connects to the rest of the site:** Each recommendation should be traceable to a specific Experience entry or Project where the relationship originated — an unanchored quote is far less credible than one with visible context.

**Structural content strategy:**

- This section carries a **launch threshold**: it should not ship with only one or two thin quotes. A sparse Recommendations section actively damages trust rather than remaining neutral (per the Product Review). If the bar isn't met at launch, fold a single strong quote into About instead of running an underpopulated dedicated section.
- Recommendations should specify person, position, company, and — where possible — the specific project or working relationship the quote refers to, giving the endorsement concrete grounding rather than generic praise.
- Manual entry only for MVP (confirmed decision) — no dependency on LinkedIn or other external sourcing.

---

# 15. Exploring Strategy

**Why it exists:** Exploring signals durable intellectual range — the topics, research areas, and experiments Usef is curious about over a longer time horizon, independent of any specific active task.

**What the visitor should learn:** The breadth and direction of Usef's curiosity — where his thinking is headed, not just where it currently is.

**What action the visitor should take next:** This is a low-pressure, low-CTA section — the expected action is simply forming an impression of range and curiosity, occasionally leading to Contact from visitors who share those interests (a notable secondary channel for AI Enthusiast and Developer personas).

**How it connects to the rest of the site:** Loosely connects to Articles (a research area may later become a written piece) and occasionally to future Projects — but should not be forced into tight cross-linking the way Projects and Articles are, since its content is intentionally more speculative and less concrete.

**Structural content strategy:**

- Content here should read as genuinely curious, not credential-building — a padded list of trendy keywords undermines the section's purpose. Fewer, more specific entries outperform a long generic list.
- This section should be distinguishable from Now at a glance (see §16) — Exploring entries describe ongoing interest areas, not current tasks, and should be written and structured accordingly.

---

# 16. Now Strategy

**Why it exists:** Now is the site's clearest, most direct proof of current activity — the strongest antidote to the "static portfolio" perception the whole project is trying to avoid.

**What the visitor should learn:** What Usef is actively building, learning, reading, and focused on, right now — a real-time snapshot, not an aspirational one.

**What action the visitor should take next:** Return later to see what's changed (this section is the primary engine behind the Returning Visitor journey), or move to Contact if current focus overlaps with a visitor's own need.

**How it connects to the rest of the site:** Loosely connects forward to Projects and Articles (today's "building" entry may become tomorrow's shipped project or published article) but functions independently as a standalone, frequently-updated content type.

**Structural content strategy:**

- **A visible last-updated date is mandatory**, not optional — recency is this section's entire value proposition, and without a timestamp a visitor cannot distinguish current from abandoned.
- Content structure should map directly to the defined fields: Building, Learning, Reading, Researching, Playing, Next Goal — kept short and current, not written as prose essays.
- This section has a real maintenance obligation (see §20) — of everything on the site, Now is the section most damaged by neglect and least forgivable if left stale.

---

# 17. Contact Strategy

**Why it exists:** Contact is the resolution point of every user journey on the site — the single action the entire content strategy is ultimately building toward.

**What the visitor should learn:** That reaching out is easy, low-friction, and likely to get a response.

**What action the visitor should take next:** Send a message, or use a social/professional link if that's a lower-friction path for that particular visitor.

**How it connects to the rest of the site:** Every other section should be able to hand off to Contact at a natural conclusion point (end of a case study, end of an article, end of the homepage scroll) — Contact should feel like an available exit from anywhere, not a single destination only reachable from the homepage.

**Structural content strategy:**

- Content here should set honest expectations — availability status, likely response time if known — rather than a generic "get in touch" with no signal of what happens next.
- A brief, honest privacy note about what happens to submitted contact information should accompany the form — flagged in the Product Review as a trust gap that shouldn't wait for a future Privacy page.
- Homepage-section-only for MVP (confirmed decision) — content structure should still be authored as if it may become a standalone page later, avoiding homepage-specific phrasing that would need rewriting if `/contact` is introduced.

---

# 18. Call-to-Action Strategy

Restating the UX Strategy's CTA hierarchy in content terms:

- **Primary CTA content (site-wide):** Contact — copy and framing should stay consistent wherever it appears, reinforcing a single, recognizable invitation rather than varying phrasing section to section.
- **Secondary CTA content (contextual):** each section's forward link should be worded specifically to what it leads to ("Explore Projects," "Read Full Story," "View All Projects") — never a generic "Learn More," which carries no information about what happens next.
- CTA content should always state the *value* of the next step, not just the mechanic — "Read Full Story" implies more depth is coming; "Explore Projects" implies proof is coming. This is a content decision, not a UI decision, and should be authored deliberately rather than left as an afterthought during copywriting.
- No section should contain more than one primary-weight call to action — consistent with the UX Strategy's "one primary action per screen" principle.

---

# 19. Internal Linking Strategy

Internal linking is the mechanism that makes the site's "everything is interconnected" ambition real rather than aspirational (per the Product Review's flag that this currently has no defined mechanism). At MVP content volume, linking is manually curated rather than tag-automated, but should still follow consistent rules:

- **Every Project links to:** related Articles (if any exist), the Experience period it was built during (if applicable), and relevant Skills.
- **Every Article links to:** the Project it discusses (if applicable), related Articles by category, and back to About.
- **Every Experience entry links to:** Projects built during that period.
- **Recommendations link to:** the Experience entry or Project the relationship originated from.
- Internal links should always appear at natural reading conclusion points (end of a case study, end of an article) — never interrupt the commit-layer reading experience with mid-content link clutter.
- As content volume grows past MVP scale, this manual curation model should evolve toward tag/category-driven automatic relationship surfacing — the content model should be structured now (consistent tagging, typed relationships) so that transition doesn't require restructuring existing content.

---

# 20. Content Maintenance Strategy

This is the strategy most portfolio sites skip, and the one most directly responsible for whether this site fulfills its "living experience" premise over time.

**Update cadence expectations:**

- **Now** — should be updated frequently enough that the visible last-updated date never reads as neglected (a matter of weeks, not months). This is the section most damaging to the entire site's credibility if left stale.
- **Exploring** — updated less frequently than Now, but should still shift over time as genuine interests evolve; a static Exploring list after a year undercuts the "curiosity" premise as much as a stale Now section undercuts "currently active."
- **Featured Work** — should be revisited whenever a new project ships or an older featured project no longer represents current capability (per §8).
- **Articles** — a stated, sustainable cadence (even a modest one) matters more than a burst of launch content followed by silence — consistency is what actually builds the returning-visitor audience this site is designed around, per the Product Review.
- **Recommendations, Experience, Skills, About** — updated as real events occur (new role, new endorsement, meaningfully new skill domain) rather than on a fixed schedule.

**Governing rule:** no section should exist that the site owner cannot realistically commit to maintaining at the cadence its content type implies. A Now section is a promise of currency; an Exploring section is a promise of evolving curiosity. Content types should be scoped at launch to match what's actually sustainable for a solo builder, rather than scoped to an ideal that quietly lapses within a few months — this was flagged as a top-level sustainability risk in the Product Review and the content strategy treats it as a first-class constraint, not an implementation detail.

---

# Guiding Principle

Every piece of content should make the next piece of content more credible — nothing should stand alone, and nothing should be present that the site can't keep true over time.
