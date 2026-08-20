import type { NextConfig } from "next";

/**
 * Deliberately minimal: this app has no i18n routing, no public image
 * domains, and no deployment target — it is a local admin tool. Keeping
 * its config independent of the public website's next.config.ts is part
 * of the CMS/public-website boundary (see AGENTS.md / repo root
 * COMMIT_MESSAGE.md for the full rationale).
 */
const nextConfig: NextConfig = {};

export default nextConfig;
