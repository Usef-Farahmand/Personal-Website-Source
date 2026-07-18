"use client";

import { useState } from "react";
import type { MediaItem } from "@/types/media";

export function useMediaViewer(items: MediaItem[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return {
    items,
    index,
    isOpen,
    setIndex,
    open: (startIndex = 0) => {
      setIndex(startIndex);
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
  };
}
