"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { loaderConfig } from "@/config/loader";
import { waitForPageReady } from "@/lib/loader/readiness";

type Phase = "pending" | "boot" | "exit" | "done";

/**
 * Module-level, so it survives the [locale] layout remounting on a
 * language switch: the loader belongs to the first document load only,
 * never to a client-side navigation.
 */
let hasBooted = false;

/**
 * Runs the loading screen's lifecycle. The overlay markup is
 * server-rendered (so it's on screen at first paint) and an inline script
 * flips data-state from "pending" to "boot" or "skip" before that paint —
 * see SiteLoader. From hydration on, this component owns it:
 *
 *   boot → exit once fonts and above-the-fold images are ready AND the
 *          scene has been on screen for minVisibleMs — or at maxVisibleMs
 *          whatever is still loading, or the moment the visitor presses a
 *          key or clicks/taps (they can always skip it);
 *   exit → done after the fade-out, which unmounts the overlay.
 *
 * Times are measured from navigation start (performance.now()), so a slow
 * hydration counts towards the minimum instead of adding to it.
 */
export function SiteLoaderController({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>(() =>
    hasBooted ? "done" : "pending"
  );

  useEffect(() => {
    const element = ref.current;
    hasBooted = true;
    if (!element || element.getAttribute("data-state") !== "boot") {
      setPhase("done");
      return;
    }
    setPhase("boot");

    const controller = new AbortController();
    const timers: number[] = [];
    let exiting = false;

    const exit = () => {
      if (exiting) return;
      exiting = true;
      controller.abort();
      setPhase("exit");
      timers.push(
        window.setTimeout(() => setPhase("done"), loaderConfig.exitMs)
      );
    };

    const after = (ms: number) =>
      new Promise<void>((resolve) =>
        timers.push(
          window.setTimeout(resolve, Math.max(0, ms - performance.now()))
        )
      );

    for (const type of ["keydown", "pointerdown"]) {
      window.addEventListener(type, exit, { signal: controller.signal });
    }

    const content = document.getElementById("main-content") ?? document.body;
    const ready = waitForPageReady(
      content,
      loaderConfig.maxVisibleMs - performance.now()
    );
    const minimum = after(
      loaderConfig.sceneDelayMs + loaderConfig.minVisibleMs
    );
    Promise.race([
      Promise.all([ready, minimum]),
      after(loaderConfig.maxVisibleMs),
    ]).then(exit);

    return () => {
      exiting = true;
      controller.abort();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  if (phase === "done") return null;

  return (
    // suppressHydrationWarning: the inline script has already changed
    // data-state on the server-rendered element before React hydrates.
    <div
      ref={ref}
      id={loaderConfig.elementId}
      className="site-loader"
      data-state={phase}
      aria-hidden="true"
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
