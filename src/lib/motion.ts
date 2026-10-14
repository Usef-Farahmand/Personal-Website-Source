import { cubicBezier, type EasingFunction } from "animejs";

/**
 * Bridges the CSS motion tokens (styles/tokens/motion.css) into Anime.js.
 *
 * Anime.js v4 no longer parses CSS `cubic-bezier(...)` strings — passing
 * one as `ease` silently falls back to linear (it only logs a warning for
 * its own camelCase `cubicBezier(` spelling). These helpers read a token
 * and hand Anime.js a real easing function instead, so every JS-driven
 * animation actually gets the curve the token describes.
 */

const CUBIC_BEZIER = /cubic-bezier\(\s*([^)]+)\)/;

function readToken(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/** `--motion-ease-<name>` as an Anime.js easing function. */
export function motionEase(
  name: "standard" | "entrance" | "exit" | "smooth" | "spring"
): EasingFunction {
  const match = CUBIC_BEZIER.exec(readToken(`--motion-ease-${name}`));
  const points = match?.[1].split(",").map(Number);
  if (points?.length === 4 && points.every(Number.isFinite)) {
    return cubicBezier(points[0], points[1], points[2], points[3]);
  }
  return cubicBezier(0.16, 1, 0.3, 1);
}

/**
 * `--motion-duration-<name>` in ms. Handles both units: the production CSS
 * minifier rewrites `400ms` as `.4s`, which a bare parseFloat would read
 * as 0.4ms — an animation that finishes before its first frame.
 */
export function motionDuration(
  name: "fast" | "base" | "slow" | "reveal",
  fallback: number
) {
  const raw = readToken(`--motion-duration-${name}`);
  const value = parseFloat(raw);
  if (!Number.isFinite(value)) return fallback;
  return raw.endsWith("ms") ? value : raw.endsWith("s") ? value * 1000 : value;
}

/** `--motion-distance-<name>` as a CSS length string. */
export function motionDistance(name: "sm" | "md" | "lg", fallback: string) {
  return readToken(`--motion-distance-${name}`) || fallback;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
