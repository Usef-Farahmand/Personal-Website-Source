import { redirect } from "next/navigation";

/**
 * The CMS root route has no purpose of its own now that the Admin
 * Dashboard exists — Task 01's "prove the app boots and can query its
 * own database" placeholder is superseded by /admin, which now owns the
 * real dashboard view (same stats, plus navigation and Recent Content).
 * Redirecting keeps a single entry point instead of two competing "home"
 * screens that would drift out of sync as CRUD is added in later tasks.
 */
export default function RootPage() {
  redirect("/admin");
}
