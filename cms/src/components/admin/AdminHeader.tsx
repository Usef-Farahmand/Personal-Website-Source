"use client";

import type { RefObject } from "react";

export default function AdminHeader({
  isNavOpen,
  onToggleNav,
  toggleButtonRef,
}: {
  isNavOpen: boolean;
  onToggleNav: () => void;
  toggleButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-neutral-200 bg-white/80 px-4 backdrop-blur sm:px-6 dark:border-neutral-800 dark:bg-neutral-950/80">
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={onToggleNav}
        aria-expanded={isNavOpen}
        aria-controls="admin-sidebar"
        className="-ml-1 rounded-md p-2 text-neutral-600 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 md:hidden dark:text-neutral-300 dark:hover:bg-neutral-900"
      >
        <span className="sr-only">
          {isNavOpen ? "Close navigation" : "Open navigation"}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-5 w-5"
        >
          <path strokeLinecap="round" d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>
      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Local CMS
      </p>
    </header>
  );
}
