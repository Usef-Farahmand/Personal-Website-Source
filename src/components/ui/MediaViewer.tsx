"use client";

import { useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { animate } from "animejs";
import { PdfViewer } from "@/components/ui/PdfViewer";
import type { MediaItem } from "@/types/media";

interface MediaViewerProps {
  items: MediaItem[];
  index: number;
  onIndexChange: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Fullscreen modal/lightbox for images and PDFs. Accepts an item array +
 * index rather than a single item, so the same component serves both a
 * single achievement's certificate today and a future multi-image gallery
 * without a different API — arrow-key navigation and prev/next controls
 * only render when there's more than one item.
 *
 * Video is not implemented (see types/media.ts) — adding it later is one
 * new render branch here, no other architecture change.
 */
export function MediaViewer({
  items,
  index,
  onIndexChange,
  isOpen,
  onClose,
}: MediaViewerProps) {
  const item = items[index];
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isZoomedRef = useRef(false);

  const hasMultiple = items.length > 1;

  // Reset zoom whenever the active item changes.
  useEffect(() => {
    isZoomedRef.current = false;
    if (imageRef.current) {
      imageRef.current.style.transform = "scale(1)";
    }
  }, [index]);

  // Entrance animation. Radix has already mounted the content by the time
  // this runs (isOpen just became true), which is the standard pattern for
  // animating a just-mounted node rather than fighting the mount itself.
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

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

    animate(contentRef.current, {
      opacity: [0, 1],
      scale: [0.96, 1],
      duration,
      ease,
    });
  }, [isOpen, index]);

  const goNext = () => onIndexChange((index + 1) % items.length);
  const goPrev = () => onIndexChange((index - 1 + items.length) % items.length);

  const toggleZoom = () => {
    if (!imageRef.current) return;
    isZoomedRef.current = !isZoomedRef.current;
    imageRef.current.style.transform = isZoomedRef.current
      ? "scale(2)"
      : "scale(1)";
  };

  if (!item) return null;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-overlay)] bg-black/85 transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
        <Dialog.Content
          ref={contentRef}
          className="fixed inset-0 z-[var(--z-modal)] flex flex-col items-center justify-center p-4 transition-opacity duration-200 outline-none data-[state=closed]:opacity-0"
          onKeyDown={(event) => {
            if (!hasMultiple) return;
            if (event.key === "ArrowRight") goNext();
            if (event.key === "ArrowLeft") goPrev();
          }}
        >
          <Dialog.Title className="sr-only">
            {item.title ?? item.alt ?? "Media viewer"}
          </Dialog.Title>

          <Dialog.Close
            aria-label="Close"
            className="text-text-primary hover:text-accent absolute end-4 top-4 transition-colors"
          >
            <X className="h-6 w-6" />
          </Dialog.Close>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous"
                className="text-text-primary hover:text-accent absolute start-4 top-1/2 -translate-y-1/2 transition-colors"
              >
                <ChevronLeft className="h-8 w-8 rtl:-scale-x-100" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next"
                className="text-text-primary hover:text-accent absolute end-4 top-1/2 -translate-y-1/2 transition-colors"
              >
                <ChevronRight className="h-8 w-8 rtl:-scale-x-100" />
              </button>
            </>
          )}

          {item.type === "image" ? (
            <div className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center gap-3">
              <div className="overflow-hidden rounded-md">
                {/* eslint-disable-next-line @next/next/no-img-element --
                    next/image's LCP optimization is for initial page load;
                    this only renders inside a closed-by-default modal, so
                    it's never part of LCP. next/image also requires known
                    dimensions or `fill`, neither of which fits a lightbox
                    showing variable-aspect-ratio images at "as large as
                    the viewport allows" — and the zoom toggle needs a
                    direct imperative ref to the actual <img> element. */}
                <img
                  ref={imageRef}
                  src={item.url}
                  alt={item.alt ?? ""}
                  className="max-h-[80vh] max-w-[90vw] object-contain transition-transform duration-300 ease-out"
                />
              </div>
              <button
                type="button"
                onClick={toggleZoom}
                aria-label="Toggle zoom"
                className="border-border text-text-primary hover:border-accent/50 bg-surface/80 text-small inline-flex items-center gap-2 rounded-md border px-3 py-1.5"
              >
                <ZoomIn className="h-4 w-4" aria-hidden="true" />
                Zoom
              </button>
            </div>
          ) : (
            <PdfViewer
              key={item.url}
              url={item.url}
              title={item.title ?? "PDF document"}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
