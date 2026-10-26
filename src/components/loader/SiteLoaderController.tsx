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

/** CSS animation that fades the scene in (styles/loader.css). */
const SCENE_ANIMATION = "loader-scene-in";

/**
 * Runs the loading screen's lifecycle. The overlay markup is
 * server-rendered (so it's on screen at first paint) and an inline script
 * flips data-state from "pending" to "boot" or "skip" before that paint —
 * see SiteLoader. From hydration on, this component owns it:
 *
 *   boot → exit once fonts and above-the-fold images are ready (or after
 *          maxWaitMs, or the moment the visitor presses a key, clicks,
 *          scrolls or touches — the loader never stands between them and
 *          the page);
 *   exit → done after the exit transition, which unmounts the overlay.
 *
 * If the page is ready before the scene's fade-in has started, the scene
 * never appears; if it has started, it stays at least minSceneVisibleMs
 * so it doesn't flash.
 */
export function SiteLoaderController({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>(() =>
    hasBooted ? "done" : "pending"
  );
  const [sceneShown, setSceneShown] = useState(true);

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

    const exit = (immediate: boolean) => {
      if (exiting) return;
      exiting = true;
      controller.abort();

      const scene = element
        .getAnimations({ subtree: true })
        .find(
          (animation) =>
            animation instanceof CSSAnimation &&
            animation.animationName === SCENE_ANIMATION
        );
      // currentTime counts from the start of the animation's delay.
      const visibleFor = scene
        ? Number(scene.currentTime ?? 0) - loaderConfig.sceneDelayMs
        : performance.now() - loaderConfig.sceneDelayMs;
      const shown = visibleFor > 0;
      const hold =
        shown && !immediate
          ? Math.max(0, loaderConfig.minSceneVisibleMs - visibleFor)
          : 0;

      timers.push(
        window.setTimeout(() => {
          setSceneShown(shown);
          setPhase("exit");
          timers.push(
            window.setTimeout(() => setPhase("done"), loaderConfig.exitMs)
          );
        }, hold)
      );
    };

    const onInteract = () => exit(true);
    const listenerOptions = { signal: controller.signal, passive: true };
    for (const type of ["keydown", "pointerdown", "wheel", "touchstart"]) {
      window.addEventListener(type, onInteract, listenerOptions);
    }

    const content = document.getElementById("main-content") ?? document.body;
    waitForPageReady(content, loaderConfig.maxWaitMs - performance.now()).then(
      () => exit(false)
    );

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
      data-scene={sceneShown ? "shown" : "hidden"}
      aria-hidden="true"
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
