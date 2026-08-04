"use client";

import { useState } from "react";

/** Mirrors useMediaViewer's {isOpen, open, close} shape, minus the
 *  item/index concerns that hook needs and a single modal doesn't. Any
 *  future single-item modal (not just RecommendationModal) can reuse
 *  this instead of hand-rolling its own open/close state. */
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
