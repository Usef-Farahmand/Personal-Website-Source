# Commit Message

## Header

feat(content): migrate real content from previous site, CV, and LinkedIn

## Description

Full content migration and enrichment pass across all sections, replacing
fabricated placeholder content with verified information from the previous
useffarahmand.com (GitHub Pages export), the English CV PDF, and the
current project itself. Bilingual (EN/FA) throughout. No architecture,
routing, locale, domain, or EmailJS changes.

Files changed:
- src/content/experience/experience.data.ts — 8 real roles (was 3 fake)
- src/content/skills/skills.data.ts — 9 real skills (was 6 fake)
- src/content/achievements/achievements.data.ts — 3 real ICPC entries (was 3 fake)
- src/content/recommendations/recommendations.json — 2 real recommendations (was 5 fake)
- src/content/projects/projects.data.ts — 10 real shipped projects (was 3 fake)
- src/content/articles/articles.data.ts — 22 real Medium articles (was 4 fake)
- src/content/exploring/exploring.data.ts — real, source-backed entries
- src/content/site/site.data.ts — real hero/about copy + corrected social links, added fa
- src/content/documents/documents.data.ts — real CV; removed 3 unverified placeholder docs
- src/content/contact/contact.data.ts — softened unverified city claim; added fa
- src/components/ui/SkillChip.tsx — updated icon lookup table for new skill ids
- next.config.ts — added remotePattern for play-lh.googleusercontent.com (Mr. Bean Solitaire images)
- public/projects/, public/certificates/, public/documents/ — real assets from previous site
- public/profile/, public/articles/*.svg — removed unused placeholder assets
