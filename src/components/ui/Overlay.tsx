"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { animate } from "animejs";
import { cn } from "@/lib/cn";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  /** Always required for Dialog.Title (semantic dialog role needs an
   *  accessible name) — visuallyHidden controls whether it's also shown
   *  on screen, since some overlays want a visible heading and some
   *  don't. */
  title: string;
  visuallyHiddenTitle?: boolean;
  children: ReactNode;
  /** Sizing/layout is per-use-case (a confirmation dialog and a media
   *  viewer need very different widths/padding), so it's left to the
   *  caller rather than baked into this shell. */
  contentClassName?: string;
  /** Forwarded to Dialog.Content — MediaViewer uses this for gallery
   *  arrow-key navigation. Radix auto-focuses Dialog.Content on open, so
   *  keydown events land here without the caller needing its own
   *  document-level listener. */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * The Overlay System's foundation — every dialog-like surface on this
 * site (RecommendationModal today; MediaViewer's own shell; a future
 * Search dialog, Settings panel, or Command Palette) builds on this one
 * component rather than reaching for Radix Dialog directly. That's what
 * makes "opening animation, closing animation, focus management,
 * keyboard shortcuts, backdrop behavior, accessibility, body scroll
 * locking" actually shared instead of independently reimplemented per
 * feature: Radix Dialog handles focus trapping, ESC-to-close, focus
 * restoration, body scroll locking, and dialog/aria-modal semantics
 * natively, so none of that is reimplemented here or in anything built
 * on this. What this adds on top is a real Anime.js exit animation, not
 * just an entrance one: Radix unmounts Dialog.Content the instant `open`
 * becomes false, which is fine for a CSS transition but not for a
 * JS-driven animation that needs to finish playing before the DOM node
 * disappears. So `open` here is `isOpen || isClosing` — a request to
 * close starts the exit animation while staying mounted, and only calls
 * the real `onClose` (unmounting for real) once that animation
 * completes.
 *
 * A new overlay need should extend this component (a new prop, if it
 * genuinely needs one — see `onKeyDown`, added for MediaViewer's gallery
 * navigation) rather than fork it. Forking would mean re-solving focus
 * trapping, exit-animation timing, and reduced-motion handling from
 * scratch for every new dialog — exactly the duplicated infrastructure
 * this system exists to avoid.
 */
export function Overlay({
  isOpen,
  onClose,
  title,
  visuallyHiddenTitle = true,
  children,
  contentClassName,
  onKeyDown,
}: OverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Entrance: overlay fade + content fade/scale, once Radix has mounted
  // the content (isOpen just became true).
  useEffect(() => {
    if (!isOpen || !contentRef.current || !overlayRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const styles = getComputedStyle(document.documentElement);
    const duration =
      parseFloat(styles.getPropertyValue("--motion-duration-base")) || 250;
    const ease =
      styles.getPropertyValue("--motion-ease-entrance").trim() ||
      "cubic-bezier(0, 0, 0.2, 1)";

    animate(overlayRef.current, { opacity: [0, 1], duration, ease });
    animate(contentRef.current, {
      opacity: [0, 1],
      scale: [0.96, 1],
      duration,
      ease,
    });
  }, [isOpen]);

  function requestClose() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !contentRef.current || !overlayRef.current) {
      onClose();
      return;
    }

    setIsClosing(true);
    const styles = getComputedStyle(document.documentElement);
    // Faster than the entrance — standard practice: something leaving
    // should feel snappier than something arriving.
    const duration =
      parseFloat(styles.getPropertyValue("--motion-duration-fast")) || 150;
    const ease =
      styles.getPropertyValue("--motion-ease-exit").trim() ||
      "cubic-bezier(0.4, 0, 1, 1)";

    animate(overlayRef.current, { opacity: [1, 0], duration, ease });
    animate(contentRef.current, {
      opacity: [1, 0],
      scale: [1, 0.96],
      duration,
      ease,
      onComplete: () => {
        setIsClosing(false);
        onClose();
      },
    });
  }

  return (
    <Dialog.Root
      open={isOpen || isClosing}
      onOpenChange={(next) => {
        if (!next) requestClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          ref={overlayRef}
          className="fixed inset-0 z-[var(--z-overlay)] bg-black/70"
        />
        {/* Full-viewport flex wrapper handles centering via flexbox, not
            transform — Anime.js drives `scale` on the actual card below,
            and a translate-based centering approach on the same element
            would fight that transform on every frame. */}
        <div
          ref={contentRef}
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
        >
          <Dialog.Content
            onKeyDown={onKeyDown}
            className={cn(
              // Bug fix: this element previously had no explicit position,
              // which defaults to `static`. Dialog.Close below is
              // `absolute`, so with no positioned ancestor here it was
              // resolving against the fixed, full-viewport wrapper div
              // instead — the close button rendered pinned to the actual
              // browser viewport corner, detached from the visible card,
              // on every screen size. `relative` makes this element the
              // positioning context Dialog.Close was always meant to use.
              //
              // Width is explicit per breakpoint rather than a single
              // min() value: near-full width with a small margin on
              // mobile, a fixed medium width from the tablet breakpoint
              // up, capped at a comfortable reading width on desktop —
              // it does not keep growing on larger screens.
              "border-border bg-surface relative max-h-[85vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border p-6 outline-none sm:w-[30rem] lg:w-[34rem]",
              contentClassName
            )}
          >
            <Dialog.Title
              className={
                visuallyHiddenTitle
                  ? "sr-only"
                  : "text-h4 text-text-primary mb-4 font-semibold"
              }
            >
              {title}
            </Dialog.Title>

            <Dialog.Close
              aria-label="Close"
              className="text-text-secondary hover:text-text-primary absolute end-4 top-4 transition-colors"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>

            {children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
