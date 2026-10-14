"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface LandingMenuProps {
  links: { href: string; label: string }[];
  ctaHref: string;
  ctaLabel: string;
  openLabel: string;
  closeLabel: string;
  navLabel: string;
  /** Rendered server-side and passed in, like the hero's other slots. */
  languageSwitcher: ReactNode;
}

/**
 * The hero's navigation below `lg`, where the inline link row doesn't
 * fit: a toggle that drops a panel over the hero. Closes on Escape and
 * on choosing a link.
 */
export function LandingMenu({
  links,
  ctaHref,
  ctaLabel,
  openLabel,
  closeLabel,
  navLabel,
  languageSwitcher,
}: LandingMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
        className="border-border text-text-primary hover:border-accent relative z-[var(--z-dropdown)] flex h-10 w-10 items-center justify-center rounded-md border bg-black/40 backdrop-blur-sm transition-colors"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <nav
          id={panelId}
          aria-label={navLabel}
          className="border-border bg-background/95 absolute inset-x-4 top-20 z-[var(--z-dropdown)] flex flex-col gap-1 rounded-lg border p-3 shadow-lg backdrop-blur-md sm:inset-x-6"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-text-primary hover:bg-surface hover:text-accent rounded-md px-3 py-2.5 text-sm font-medium tracking-wider uppercase transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-border mt-2 flex items-center justify-between gap-3 border-t pt-3">
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
      )}
    </div>
  );
}
