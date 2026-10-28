"use client";

import { useEffect, useState } from "react";
import { ExternalLink, FileWarning } from "lucide-react";
import { cn } from "@/lib/cn";

const LOAD_TIMEOUT_MS = 8000;

/**
 * A PDF in the browser's own PDF viewer (an iframe), which already gives
 * page navigation, page count, zoom and its own download — re-building
 * those on PDF.js would add a large dependency for the same controls.
 * The page sits on white inside the dark viewer. A spinner shows while
 * it loads; if nothing loads in time (a browser without inline PDFs, a
 * network error), a message with an "open in a new tab" link instead.
 * The iframe captures its own pointer and keyboard input, so scrolling
 * the document never moves the gallery.
 */
export function PdfViewer({
  url,
  title,
  labels,
  className,
}: {
  url: string;
  title: string;
  labels: { loading: string; failed: string; openPdf: string };
  className?: string;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "timedOut">(
    "loading"
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatus((current) => (current === "loading" ? "timedOut" : current));
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [url]);

  if (status === "timedOut") {
    return (
      <div
        className={cn(
          "border-border bg-surface flex h-[calc(100dvh-15rem)] w-full max-w-4xl flex-col items-center justify-center gap-4 rounded-lg border p-8 text-center",
          className
        )}
      >
        <FileWarning
          className="text-text-secondary h-10 w-10"
          aria-hidden="true"
        />
        <p className="text-text-secondary max-w-sm text-sm">{labels.failed}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-accent text-background hover:bg-accent-hover inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors"
        >
          {labels.openPdf}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-[calc(100dvh-15rem)] w-full max-w-4xl",
        className
      )}
    >
      {status === "loading" && (
        <div className="bg-surface border-border absolute inset-0 flex items-center justify-center rounded-lg border">
          <div
            role="status"
            aria-label={labels.loading}
            className="border-border border-t-accent h-8 w-8 animate-spin rounded-full border-4"
          />
        </div>
      )}
      <iframe
        src={url}
        title={title}
        onLoad={() => setStatus("loaded")}
        className={cn(
          "h-full w-full rounded-lg bg-white transition-opacity duration-200",
          status === "loading" ? "opacity-0" : "opacity-100"
        )}
      />
    </div>
  );
}
