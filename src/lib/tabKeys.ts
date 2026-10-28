import type { KeyboardEvent } from "react";

/**
 * Index of the tab to move to for a key press in an ARIA tablist —
 * Left/Right arrows (mirrored in RTL) wrap around, Home/End jump to the
 * ends — or `null` for any other key. Calls preventDefault when handled.
 */
export function nextTabIndex(
  event: KeyboardEvent,
  index: number,
  count: number
): number | null {
  const rtl = document.documentElement.dir === "rtl";
  let next: number;
  if (event.key === "ArrowRight") next = index + (rtl ? -1 : 1);
  else if (event.key === "ArrowLeft") next = index + (rtl ? 1 : -1);
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = count - 1;
  else return null;
  event.preventDefault();
  return (next + count) % count;
}
