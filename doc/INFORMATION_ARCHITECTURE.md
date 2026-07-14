# INFORMATION_ARCHITECTURE.md

# Usef Farahmand Digital Experience

Version: 1.0

Status: Draft

---

# Purpose

This document defines the information architecture of the website.

It focuses on:

- Content organization
- Navigation
- User flows
- Page hierarchy
- Relationships between content
- Scalability for future features

This document intentionally excludes visual design decisions.

---

# Information Architecture Principles

The website should be:

- Easy to understand
- Easy to navigate
- Easy to expand
- Content-first
- Story-driven
- SEO-friendly
- Future-proof

---

# Website Structure

```
Website
│
├── Home
├── About
├── Featured Work
├── Projects
│   └── Project Details
├── Articles
│   └── Article Details
├── Experience
├── Skills
├── Recommendations
├── Exploring
├── Now
├── Contact
│
├── 404
└── Privacy (Future)
```

---

# Future Structure

```
Website
│
├── Portfolio
│
├── Interactive World
│
├── Admin
│
└── CMS API
```

The current MVP only includes the Portfolio.

The architecture should allow future expansion without restructuring.

---

# Navigation

## Primary Navigation

- Home
- About
- Projects
- Articles
- Experience
- Contact

---

## Secondary Navigation

Accessible through page sections.

- Skills
- Recommendations
- Exploring
- Now

---

## Footer Navigation

- GitHub
- LinkedIn
- X
- Email
- RSS (Future)

---

# Homepage Structure

```
Home

↓

Hero

↓

Featured Projects

↓

About Preview

↓

Current Focus

↓

Latest Article

↓

Experience Preview

↓

Skills Preview

↓

Recommendations Preview

↓

Contact CTA
```

The homepage should introduce the visitor before presenting detailed content.

---

# Page Definitions

---

## Home

Purpose

Introduce the personal brand.

Primary Goal

Encourage exploration.

Primary CTA

Explore Projects

Secondary CTA

Read Articles

---

## About

Purpose

Explain who I am.

Sections

- Introduction
- Mission
- Philosophy
- Journey
- Interests

Primary CTA

View Projects

---

## Featured Work

Purpose

Highlight the most important projects.

Content

- Featured Projects
- Selected Case Studies

Primary CTA

View All Projects

---

## Projects

Purpose

Present software products.

Each project should contain

- Overview
- Problem
- Solution
- Technologies
- Gallery
- Demo
- Repository
- Lessons Learned
- Status

Primary CTA

Read Case Study

---

## Project Detail

Purpose

Provide an in-depth case study.

Content

- Hero
- Summary
- Problem
- Research
- Design
- Architecture
- Implementation
- Challenges
- Lessons Learned
- Technologies
- Gallery
- Links

---

## Articles

Purpose

Share knowledge.

Categories

- Software Engineering
- AI
- Web Development
- Mobile Development
- Game Development
- Product Development
- Design
- Personal Journey

---

## Article Detail

Content

- Cover
- Reading Time
- Tags
- Table of Contents
- Article Body
- Related Articles
- Next Article

---

## Experience

Purpose

Present career timeline.

Structure

Timeline

↓

Company

↓

Role

↓

Responsibilities

↓

Achievements

---

## Skills

Purpose

Show practical expertise.

Group skills by domain.

Example

- Frontend
- Backend
- Mobile
- Game Development
- AI
- Cloud
- DevOps
- UI/UX

---

## Recommendations

Purpose

Build trust.

Each recommendation includes

- Author
- Position
- Company
- Message

---

## Exploring

Purpose

Show current interests.

Examples

- AI Research
- New Technologies
- Experiments
- Ideas

---

## Now

Purpose

Show current activities.

Content

- Building
- Learning
- Reading
- Researching
- Playing
- Next Goal

---

## Contact

Purpose

Enable communication.

Content

- Contact Form
- Social Links
- Email
- Availability

---

# Content Relationships

Projects relate to

- Articles
- Skills
- Technologies
- Experience

Articles relate to

- Projects
- Skills
- Technologies

Skills relate to

- Projects
- Experience

Experience relates to

- Projects
- Skills

Recommendations relate to

- Experience

Everything should be interconnected.

---

# Content Taxonomy

## Project Categories

- AI
- Web
- Mobile
- Game
- Tool
- Automation

---

## Article Categories

- AI
- Engineering
- Architecture
- Design
- Game Development
- Product Development

---

## Skill Categories

- Frontend
- Backend
- Mobile
- Game
- AI
- Cloud
- DevOps
- Database
- UI/UX

---

# URL Structure

```
/

about

projects

projects/[slug]

articles

articles/[slug]

experience

skills

recommendations

exploring

now

contact
```

URLs should remain short, semantic and SEO-friendly.

---

# User Journeys

## Recruiter

```
Landing

↓

About

↓

Experience

↓

Projects

↓

Contact
```

---

## Client

```
Landing

↓

Projects

↓

Case Study

↓

Recommendations

↓

Contact
```

---

## Developer

```
Landing

↓

Projects

↓

Technical Articles

↓

GitHub

↓

Contact
```

---

## Returning Visitor

```
Landing

↓

Now

↓

Latest Articles

↓

Latest Projects
```

---

# Search Scope (Future)

Search should include

- Projects
- Articles
- Technologies
- Skills

Search should not include

- Navigation
- Static Pages

---

# Data Dependencies

Future backend should provide data for

- Hero
- Projects
- Articles
- Experience
- Skills
- Recommendations
- Exploring
- Now
- Contact

The frontend should not depend on hardcoded content.

---

# SEO Architecture

Every page should have

- Unique Title
- Meta Description
- Canonical URL
- Open Graph
- Structured Data
- Breadcrumbs (where applicable)

---

# Accessibility Architecture

Every page must support

- Keyboard Navigation
- Screen Readers
- Focus Management
- Reduced Motion
- Semantic Structure

---

# Future Expansion

The architecture must support

```
Portfolio

↓

Interactive World

↓

CMS

↓

Admin Dashboard

↓

Analytics

↓

Media Library
```

without changing the navigation hierarchy.

---

# Information Hierarchy

Priority order

1. Identity
2. Products
3. Experience
4. Knowledge
5. Current Journey
6. Trust
7. Contact

The website should always prioritize the work before the person.

---

# Architecture Rules

- Keep navigation shallow.
- Avoid unnecessary nesting.
- Every page should have one primary goal.
- Every section should have one primary action.
- Related content should always be connected.
- Minimize the number of clicks required to reach important content.
- Design for future scalability.

---

# Success Criteria

The information architecture is successful when users can:

- Understand the website quickly.
- Find information easily.
- Discover related content naturally.
- Navigate without confusion.
- Reach important content within a few interactions.
- Return for new content over time.

---

# Guiding Principle

Organize information around the visitor's goals, not around the site's internal structure.