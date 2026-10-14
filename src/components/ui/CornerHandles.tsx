import { cn } from "@/lib/cn";

const CORNERS = [
  "-top-1.5 -start-1.5",
  "-top-1.5 -end-1.5",
  "-bottom-1.5 -start-1.5",
  "-bottom-1.5 -end-1.5",
] as const;

/**
 * Four small accent squares on the corners of the nearest positioned
 * parent — the "selected object in a game editor" look used by the hero's
 * role badge and the About page's photo card.
 */
export function CornerHandles({ className }: { className?: string }) {
  return (
    <>
      {CORNERS.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          className={cn("bg-accent absolute h-2.5 w-2.5", corner, className)}
        />
      ))}
    </>
  );
}
