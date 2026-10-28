"use client";

import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/cn";

export interface ViewOption<TView extends string> {
  value: TView;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

/**
 * Segmented icon buttons for switching a list's layout (e.g. Projects:
 * wide rows / cards / icons). Purely presentational — the owner keeps
 * the value and decides what each view looks like.
 */
export function ViewToggle<TView extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: TView;
  onChange: (value: TView) => void;
  options: ViewOption<TView>[];
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="border-text-secondary/45 bg-surface inline-flex shrink-0 items-center gap-0.5 rounded-md border p-0.5"
    >
      {options.map(({ value: optionValue, label: optionLabel, Icon }) => {
        const isActive = optionValue === value;
        return (
          <button
            key={optionValue}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={optionLabel}
            title={optionLabel}
            onClick={() => onChange(optionValue)}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded transition-colors",
              isActive
                ? "bg-accent/15 text-accent"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
