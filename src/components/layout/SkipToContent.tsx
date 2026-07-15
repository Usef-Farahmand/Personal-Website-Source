interface SkipToContentProps {
  /** Localized label. Passed in rather than imported here, since this is a
   *  presentational component and message resolution belongs to the layout
   *  that renders it. */
  label: string;
}

/**
 * Skip link, per the accessibility foundation requirement. Hidden off-screen
 * until it receives keyboard focus, at which point it becomes visible and
 * lets keyboard/screen-reader users jump directly to #main-content —
 * skipping the header on every single page load, which matters most for
 * repeat keyboard users.
 */
export function SkipToContent({ label }: SkipToContentProps) {
  return (
    <a
      href="#main-content"
      className="bg-accent text-background focus:ring-accent text-small sr-only rounded-md px-4 py-2 font-medium focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[var(--z-toast)] focus:ring-2 focus:outline-none"
    >
      {label}
    </a>
  );
}
