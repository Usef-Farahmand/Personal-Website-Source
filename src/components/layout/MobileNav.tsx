"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { isActivePath, type NavLinkItem } from "@/components/layout/NavLinks";

interface MobileNavProps {
  links: NavLinkItem[];
  ctaHref: string;
  ctaLabel: string;
  openLabel: string;
  closeLabel: string;
  navLabel: string;
  /** Rendered server-side and passed in, like the hero's other slots. */
  languageSwitcher: ReactNode;
}

/**
 * The site navigation below `lg`, where the inline link row doesn't fit:
 * a toggle that drops a panel under the top bar with a short slide/fade
 * (links follow in a quick stagger). Closes on Escape, on choosing a
 * link, and on a tap outside it.
 */
export function MobileNav({
  links,
  ctaHref,
  ctaLabel,
  openLabel,
  closeLabel,
  navLabel,
  languageSwitcher,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    // A tap or click anywhere outside the button and panel closes it.
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "text-text-primary hover:border-accent relative z-[var(--z-dropdown)] flex h-10 w-10 items-center justify-center rounded-md border bg-black/40 backdrop-blur-sm transition-colors",
          open ? "border-accent text-accent" : "border-border"
        )}
      >
        {/* Both icons stay mounted and cross-fade with a quarter turn. */}
        <Menu
          aria-hidden="true"
          className={cn(
            "absolute h-5 w-5 transition-all duration-300 ease-[var(--motion-ease-smooth)]",
            open
              ? "scale-50 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          )}
        />
        <X
          aria-hidden="true"
          className={cn(
            "absolute h-5 w-5 transition-all duration-300 ease-[var(--motion-ease-smooth)]",
            open
              ? "scale-100 rotate-0 opacity-100"
              : "scale-50 -rotate-90 opacity-0"
          )}
        />
      </button>

      {/* Always mounted so it can animate both ways; `inert` keeps the
          closed panel out of the tab order and the accessibility tree. */}
      <nav
        id={panelId}
        aria-label={navLabel}
        inert={!open}
        className={cn(
          "border-border bg-background/95 absolute inset-x-4 top-full z-[var(--z-dropdown)] mt-1 flex origin-top flex-col gap-1 rounded-lg border p-3 shadow-lg backdrop-blur-md transition-[opacity,translate,scale,visibility] duration-300 ease-[var(--motion-ease-smooth)] sm:inset-x-6",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-3 scale-95 opacity-0"
        )}
      >
        {links.map((link, index) => {
          const active = isActivePath(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${60 + index * 35}ms` : "0ms" }}
              className={cn(
                "hover:bg-surface hover:text-accent rounded-md px-3 py-2.5 text-sm font-medium uppercase transition-[color,background-color,opacity,translate] duration-300 ease-[var(--motion-ease-smooth)] ltr:tracking-wider",
                active ? "bg-accent/10 text-accent" : "text-text-primary",
                open
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-3 opacity-0 rtl:translate-x-3"
              )}
            >
              {link.label}
            </Link>
          );
        })}
        <div
          style={{
            transitionDelay: open ? `${60 + links.length * 35}ms` : "0ms",
          }}
          className={cn(
            "border-border mt-2 flex items-center justify-between gap-3 border-t pt-3 transition-[opacity,translate] duration-300",
            open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          )}
        >
          {languageSwitcher}
          <Link
            href={ctaHref}
            onClick={() => setOpen(false)}
            className="bg-accent text-background hover:bg-accent-hover rounded-md px-4 py-2 text-sm font-semibold transition-colors"
          >
            {ctaLabel}
          </Link>
        </div>
      </nav>
    </div>
  );
}
