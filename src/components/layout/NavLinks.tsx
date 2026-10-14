"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export interface NavLinkItem {
  href: string;
  label: string;
}

/** True when `pathname` is `href` itself or one of its child routes. */
export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The desktop link row of the site navigation. A Client Component only so
 * it can read the current path and mark the active page (underline +
 * `aria-current`); the links themselves come from SiteNav.
 */
export function NavLinks({
  links,
  label,
  className,
}: {
  links: NavLinkItem[];
  label: string;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className={cn("items-center gap-7", className)}>
      {links.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "after:bg-accent relative py-1 text-sm font-medium uppercase transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:transition-transform hover:after:scale-x-100 ltr:tracking-wider rtl:after:origin-right",
              active
                ? "text-text-primary after:scale-x-100"
                : "text-text-primary/75 hover:text-accent after:scale-x-0"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
