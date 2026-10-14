"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 85;
const DELETE_MS = 45;
const HOLD_MS = 1800;
const GAP_MS = 350;

/**
 * Types each role out, holds it, deletes it, and moves on to the next —
 * the "I'M A DEVELOPER|" badge from the hero reference. The animated text
 * is aria-hidden; screen readers get the full list once via `srLabel`
 * instead of hearing every keystroke. With reduced motion it simply shows
 * the first role, no typing.
 */
export function TypingRole({
  roles,
  srLabel,
}: {
  roles: string[];
  srLabel: string;
}) {
  const [text, setText] = useState(roles[0] ?? "");

  useEffect(() => {
    if (roles.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let roleIndex = 0;
    let length = roles[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const role = roles[roleIndex];
      if (deleting) {
        length -= 1;
        if (length <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setText("");
          timer = setTimeout(tick, GAP_MS);
          return;
        }
        setText(role.slice(0, length));
        timer = setTimeout(tick, DELETE_MS);
        return;
      }

      length += 1;
      setText(role.slice(0, length));
      if (length >= role.length) {
        deleting = true;
        timer = setTimeout(tick, HOLD_MS);
        return;
      }
      timer = setTimeout(tick, TYPE_MS);
    };

    // Start by holding the server-rendered first role, then delete it.
    timer = setTimeout(tick, HOLD_MS);
    return () => clearTimeout(timer);
  }, [roles]);

  return (
    <>
      <span className="sr-only">{srLabel}</span>
      <span aria-hidden="true" className="whitespace-nowrap">
        {text}
        <span className="landing-caret ms-0.5 inline-block h-[0.9em] w-[0.12em] translate-y-[0.1em] bg-current" />
      </span>
    </>
  );
}
