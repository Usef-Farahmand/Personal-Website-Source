const DURATION_MS = 450;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Scrolls `el` horizontally by `delta` px (positive = the view moves
 * right, in LTR and RTL alike) with an eased animation of its own,
 * rather than `behavior: "smooth"`, which can land at once with no
 * visible movement. Snapping and CSS smooth-scrolling (if any) are
 * switched off for the ride and restored at the end. With reduced
 * motion it simply jumps. Returns a cancel function.
 */
export function animateScrollBy(el: HTMLElement, delta: number): () => void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = el.scrollLeft;
  if (reduce || Math.abs(delta) < 1) {
    el.scrollLeft = start + delta;
    return () => {};
  }

  const { scrollSnapType, scrollBehavior } = el.style;
  el.style.scrollSnapType = "none";
  el.style.scrollBehavior = "auto";

  let frame = 0;
  const t0 = performance.now();
  const restore = () => {
    el.style.scrollSnapType = scrollSnapType;
    el.style.scrollBehavior = scrollBehavior;
  };
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / DURATION_MS);
    el.scrollLeft = start + delta * easeOutCubic(t);
    if (t < 1) frame = requestAnimationFrame(step);
    else restore();
  };
  frame = requestAnimationFrame(step);

  return () => {
    cancelAnimationFrame(frame);
    restore();
  };
}

/**
 * How far the track has to move (same sign convention as above) to line
 * `item` up with the track's starting edge — left in LTR, right in RTL.
 */
export function alignDelta(track: HTMLElement, item: HTMLElement): number {
  const t = track.getBoundingClientRect();
  const r = item.getBoundingClientRect();
  return getComputedStyle(track).direction === "rtl"
    ? r.right - t.right
    : r.left - t.left;
}
