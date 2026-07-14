# CONTRIBUTING.md

# Contributing Guidelines

Thank you for your interest in this project.

Although this repository is primarily maintained by Usef Farahmand, every contribution—whether from a human collaborator or an AI assistant—should follow the same engineering standards.

The goal is long-term maintainability, consistency, and quality.

---

# Development Philosophy

Before writing code:

Understand the problem.

Understand the product.

Understand the architecture.

Code should always be the final step.

---

# Project Principles

Every contribution should prioritize:

- Simplicity
- Readability
- Maintainability
- Performance
- Accessibility
- Scalability
- Reusability

Never sacrifice long-term quality for short-term speed.

---

# Documentation First

Before implementing a major feature:

- Update documentation if necessary.
- Validate the architecture.
- Avoid making implementation decisions that contradict project documentation.

Documentation is the single source of truth.

---

# Branch Strategy

Main branches

```
main
develop
```

Feature branches

```
feature/project-page

feature/article-system

feature/navigation
```

Bug fixes

```
fix/mobile-navbar

fix/image-loading
```

Refactoring

```
refactor/project-card

refactor/api-layer
```

Documentation

```
docs/design-system

docs/seo
```

---

# Commit Convention

Use Conventional Commits.

Examples

```
feat: add project detail page

fix: improve mobile navigation

docs: update roadmap

refactor: simplify animation system

style: improve typography scale

perf: optimize image loading

chore: update dependencies
```

---

# Pull Request Rules

Every Pull Request should:

- Solve one problem.
- Have a clear title.
- Explain why the change exists.
- Avoid unrelated modifications.
- Keep changes focused.

---

# Coding Standards

Code should be:

- Clean
- Predictable
- Typed
- Modular
- Readable

Avoid clever code.

Prefer understandable code.

---

# TypeScript Rules

Always use strict typing.

Avoid:

```
any
```

Prefer:

- interfaces
- type aliases
- generics
- utility types

---

# Component Rules

Every component should have one responsibility.

Large components should be split into smaller reusable components.

Avoid deeply nested JSX.

---

# Folder Structure

Organize code by feature instead of file type whenever appropriate.

Keep related logic together.

---

# Naming Convention

Components

```
ProjectCard

ArticleCard

SectionTitle

SkillBadge
```

Hooks

```
useScrollReveal

useTheme

useMediaQuery
```

Utilities

```
formatDate

calculateReadingTime

slugify
```

---

# Styling

Use Tailwind CSS.

Avoid inline styles.

Avoid duplicated utility classes.

Create reusable UI components whenever possible.

---

# Animation Rules

Animation should support usability.

Avoid decorative motion.

Use:

- CSS transitions for simple interactions.
- Anime.js for meaningful motion.

Respect prefers-reduced-motion.

---

# Accessibility

Every feature should support:

- Keyboard navigation
- Screen readers
- Focus management
- Proper contrast
- Semantic HTML

Accessibility is never optional.

---

# Responsive Design

Design mobile-first.

Support:

- Mobile
- Tablet
- Laptop
- Desktop

Avoid desktop-only layouts.

---

# Performance

Optimize continuously.

Prioritize:

- Image optimization
- Lazy loading
- Code splitting
- Server Components
- Minimal JavaScript

Never introduce unnecessary dependencies.

---

# SEO

Every page must include:

- Meaningful title
- Meta description
- Semantic HTML
- Proper heading hierarchy

Avoid duplicate content.

---

# Testing

Every new feature should be verified on:

- Desktop
- Mobile
- Dark Theme

Check:

- Responsiveness
- Accessibility
- Performance
- Navigation
- Animations

---

# Dependencies

Before adding a dependency, ask:

- Is it really necessary?
- Can existing tools solve this?
- Does it increase bundle size significantly?
- Will it still be maintained in two years?

Prefer fewer dependencies.

---

# Refactoring

Improve code when necessary.

Do not refactor unrelated code during feature development.

Keep Pull Requests focused.

---

# AI Collaboration

AI assistants should:

- Follow all project documentation.
- Respect the architecture.
- Never invent requirements.
- Ask questions when requirements are unclear.
- Prefer maintainability over shortcuts.

Implementation must follow:

- MASTER_PLAN.md
- PRODUCT_REQUIREMENTS.md
- INFORMATION_ARCHITECTURE.md
- DESIGN_SYSTEM.md
- SEO_GUIDELINES.md
- ROADMAP.md

---

# Definition of Done

A task is complete only if:

- Requirements are satisfied.
- Code is clean.
- Types are correct.
- Responsive design works.
- Accessibility is verified.
- Performance is maintained.
- Documentation is updated when needed.
- No obvious technical debt is introduced.

---

# Guiding Principle

Build software that is easy to understand, easy to maintain, and enjoyable to improve over time.