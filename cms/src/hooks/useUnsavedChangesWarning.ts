"use client";

import { useEffect } from "react";

/**
 * `getIsDirty` is read fresh on every event (not captured once), so the
 * caller can pass a closure over a ref/state without this hook needing
 * to re-subscribe every time dirtiness changes.
 */
export function useUnsavedChangesWarning(getIsDirty: () => boolean) {
  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!getIsDirty()) return;
      event.preventDefault();
      // Chrome requires returnValue to be set for the native prompt.
      event.returnValue = "";
    }

    function handleClick(event: MouseEvent) {
      if (!getIsDirty()) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const confirmed = window.confirm(
        "You have unsaved changes. Leave this page without saving?"
      );
      if (!confirmed) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClick, true);
    };
  }, [getIsDirty]);
}
