"use client";

import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
  label: string;
  className?: string;
}

export function SortSelect({
  value,
  onChange,
  options,
  label,
  className,
}: SortSelectProps) {
  return (
    <div className={cn("relative", className)}>
      <ArrowUpDown
        className="text-text-secondary pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-border bg-surface text-text-primary focus-visible:ring-accent w-full cursor-pointer appearance-none rounded-md border py-2 ps-9 pe-8 text-sm outline-none [-moz-appearance:none] [-webkit-appearance:none] focus-visible:ring-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
