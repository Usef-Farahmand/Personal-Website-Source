"use client";

import { X } from "lucide-react";

export interface ActiveFilterChip {
  id: string;
  label: string;
  onRemove: () => void;
}

interface ActiveFiltersProps {
  chips: ActiveFilterChip[];
  onClearAll: () => void;
  clearAllLabel: string;
}

export function ActiveFilters({
  chips,
  onClearAll,
  clearAllLabel,
}: ActiveFiltersProps) {
  if (chips.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label={clearAllLabel}
    >
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.onRemove}
          className="bg-accent/10 text-accent text-caption hover:bg-accent/20 inline-flex items-center gap-1.5 rounded-full py-1 ps-3 pe-2 font-medium"
        >
          {chip.label}
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      ))}

      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-caption text-text-secondary hover:text-text-primary underline-offset-2 hover:underline"
        >
          {clearAllLabel}
        </button>
      )}
    </div>
  );
}
