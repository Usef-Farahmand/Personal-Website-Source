import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation primitives. `Link` and `useRouter` from here
 * automatically preserve the current locale segment and never change
 * domain — switching locale via these primitives keeps the visitor on
 * whichever domain they're already on, per the Domain and Locale
 * Independence decision in MULTILINGUAL_ARCHITECTURE.md.
 */
export const { Link, useRouter, usePathname, redirect } =
  createNavigation(routing);
