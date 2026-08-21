import type { NextConfig } from "next";

/**
 * Deliberately minimal: this app has no i18n routing, no public image
 * domains, and no deployment target — it is a local admin tool. Keeping
 * its config independent of the public website's next.config.ts is part
 * of the CMS/public-website boundary (see AGENTS.md / repo root
 * COMMIT_MESSAGE.md for the full rationale).
 *
 * `turbopack.root` is pinned explicitly because this app lives as a
 * sibling folder one level under the public website's repo root, and
 * both have their own package-lock.json. Without this, Turbopack's
 * root-inference picks the parent folder (the public website) as the
 * workspace root — since it also has a lockfile one directory up — and
 * then resolves this app's own relative imports (e.g. `./src/...`)
 * against the *public site's* `src/` instead of this app's. That's what
 * produces a "Can't resolve '@/i18n/routing'" error pointing at a
 * middleware.ts this app doesn't have: Turbopack was reading the public
 * site's middleware.ts, not this project's.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
