"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, FileWarning } from "lucide-react";
import { cn } from "@/lib/cn";

interface PdfViewerProps {
  url: string;
  title: string;
  className?: string;
}

/**
 * Reusable PDF viewer with a real loading state and a genuine fallback.
 *
 * Embeds the browser's own native PDF renderer via <iframe> rather than
 * a custom pdf.js-based page-by-page viewer. That native renderer
 * already provides its own zoom and page navigation inside the embed —
 * building a second, custom set of those controls on top would be
 * genuine duplicated functionality, not toolbar consistency. The one
 * thing the native renderer can't do is tell our own toolbar apart from
 * itself, so MediaViewer's shared toolbar only adds what the embed
 * doesn't already provide: Close, gallery navigation, and Download.
 *
 * There's no reliable way to detect "the PDF actually rendered" from JS
 * for cross-document content, so this is honest about that limit rather
 * than pretending otherwise: a spinner clears on the iframe's onLoad
 * (fires once loading finishes, success or not), and a timeout replaces
 * the embed with a clearer fallback if onLoad never fires at all. That
 * fallback's "open in a new tab" link is a genuine last resort for a
 * broken embed, not a routine escape hatch from the modal — the primary
 * flow never leaves it.
 *
 * Pass `key={url}` at the call site if url can change while mounted
 * (e.g. a gallery) — a fresh instance with fresh state, rather than
 * resetting state imperatively inside an effect.
 */
const LOAD_TIMEOUT_MS = 8000;

export function PdfViewer({ url, title, className }: PdfViewerProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "timedOut">(
    "loading"
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setStatus((current) => (current === "loading" ? "timedOut" : current));
    }, LOAD_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [url]);

  if (status === "timedOut") {
    return (
      <div
        className={cn(
          "border-border bg-surface flex h-[75vh] w-full max-w-4xl flex-col items-center justify-center gap-4 rounded-md border p-8 text-center",
          className
        )}
      >
        <FileWarning
          className="text-text-secondary h-10 w-10"
          aria-hidden="true"
        />
        <p className="text-body text-text-secondary max-w-sm">
          This PDF couldn&apos;t be displayed here. Your browser may not support
          inline PDF viewing.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-accent text-background hover:bg-accent-hover text-small inline-flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors"
        >
          Open PDF in new tab
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div
      className={cn("relative flex w-full max-w-4xl flex-col gap-2", className)}
    >
      <div className="relative h-[75vh] w-full">
        {status === "loading" && (
          <div className="bg-surface border-border absolute inset-0 flex items-center justify-center rounded-md border">
            <div
              role="status"
              aria-label="Loading PDF"
              className="border-border border-t-accent h-8 w-8 animate-spin rounded-full border-4"
            />
          </div>
        )}
        <iframe
          src={url}
          title={title}
          onLoad={() => setStatus("loaded")}
          className={cn(
            "border-border h-full w-full rounded-md border bg-white transition-opacity duration-200",
            status === "loading" ? "opacity-0" : "opacity-100"
          )}
        />
      </div>
    </div>
  );
}
