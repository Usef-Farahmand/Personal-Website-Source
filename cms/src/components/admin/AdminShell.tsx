"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

/**
 * The Admin Dashboard's page shell: sidebar + header + main content
 * (section 3). This is the one interactive piece of the layout — it
 * only exists to own the mobile-drawer open/closed state and hand it
 * down to the header (toggle button) and sidebar (drawer). Everything
 * rendered inside `children` stays a normal server component; wrapping
 * only the shell in a client boundary keeps data fetching on the server.
 */
export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
        toggleButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMobileNavOpen]);

  return (
    <div className="flex min-h-screen">
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      <AdminSidebar
        isMobileOpen={isMobileNavOpen}
        onNavigate={closeMobileNav}
      />

      {isMobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobileNav}
          className="fixed inset-0 z-30 bg-neutral-950/40 md:hidden"
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          isNavOpen={isMobileNavOpen}
          onToggleNav={() => setMobileNavOpen((open) => !open)}
          toggleButtonRef={toggleButtonRef}
        />
        <main
          id="admin-main-content"
          className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
