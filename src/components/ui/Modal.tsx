"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { animate } from "animejs";
import { motionDuration, motionEase } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Always required for Dialog.Title (semantic dialog role needs an
   *  accessible name) — visuallyHidden controls whether it's also shown
   *  on screen, since some modals want a visible heading and some don't. */
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
 * Reusable modal shell — Radix Dialog handles focus trapping, ESC-to-close,
 * focus restoration on close, and the dialog/aria-modal semantics
 * natively, so none of that is reimplemented here. What this adds on top
 * is a blurred backdrop, a CSS entrance (.overlay-enter / .dialog-enter
 * in utilities.css) and a real Anime.js exit animation: Radix
 * unmounts Dialog.Content the instant `open` becomes false, which is fine
 * for a CSS transition but not for a JS-driven animation that needs to
 * finish playing before the DOM node disappears. So `open` here is
 * `isOpen || isClosing` — a request to close starts the exit animation
 * while staying mounted, and only calls the real `onClose` (unmounting
 * for real) once that animation completes.
 *
 * Any future modal need (confirmation dialogs, a settings panel, ...)
 * should build on this rather than reaching for Radix Dialog directly —
 * that's what keeps the open/close choreography in one place instead of
 * duplicated per feature.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  visuallyHiddenTitle = true,
  children,
  contentClassName,
  onKeyDown,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  function requestClose() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !contentRef.current || !overlayRef.current) {
      onClose();
      return;
    }

    setIsClosing(true);
    // Faster than the entrance — standard practice: something leaving
    // should feel snappier than something arriving.
    const duration = motionDuration("fast", 150);
    const ease = motionEase("exit");

    let closed = false;
    const finish = () => {
      if (closed) return;
      closed = true;
      setIsClosing(false);
      onClose();
    };

    animate(overlayRef.current, { opacity: [1, 0], duration, ease });
    animate(contentRef.current, {
      opacity: [1, 0],
      scale: [1, 0.96],
      duration,
      ease,
      onComplete: finish,
    });
    // Animations run on animation frames, which browsers pause in a
    // background tab; close anyway once the exit should have ended.
    window.setTimeout(finish, duration + 100);
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
          className="overlay-enter fixed inset-0 z-[var(--z-overlay)] bg-black/80 supports-[backdrop-filter]:bg-black/55 supports-[backdrop-filter]:backdrop-blur-md"
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
              "dialog-enter border-border bg-surface relative max-h-[85vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border p-6 outline-none sm:w-[30rem] lg:w-[34rem]",
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
