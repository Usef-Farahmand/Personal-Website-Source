"use client";

import { useEffect, useState, type RefObject } from "react";

// Fire once the element's top edge is ~10% of the viewport up from the
// bottom. A fractional threshold (e.g. 0.2 of the element) fires late for
// tall grids and never for ones taller than 1/threshold viewports.
const DEFAULT_OPTIONS: IntersectionObserverInit = {
  threshold: 0,
  rootMargin: "0px 0px -10% 0px",
};

/**
 * Reports whether the given element has entered the viewport. Fires once —
 * the observer disconnects after the first intersection, since entrance
 * reveals shouldn't re-trigger on scroll back up. The caller owns the ref
 * so it can attach it to whichever real DOM node it's already rendering,
 * rather than this hook creating a wrapper element.
 */
export function useInView<T extends Element>(ref: RefObject<T | null>) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (isInView) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, DEFAULT_OPTIONS);

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, isInView]);

  return isInView;
}
