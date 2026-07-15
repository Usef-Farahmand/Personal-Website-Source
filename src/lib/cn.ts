import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names and resolves conflicting Tailwind utilities, keeping
 * the last one. Plain string concatenation can't do this reliably — a
 * consumer's className and a component's own default classes are ordered
 * by source position in the compiled stylesheet, not by argument order
 * here, so naive joins can silently lose the override the caller intended.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
