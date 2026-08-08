"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  clearLabel: string;
  className?: string;
}

/**
 * Debounces keystrokes (200ms) before calling `onChange`, which is what
 * actually pushes a URL update — typing "next.js" shouldn't create five
 * history entries. Keeps its own local `draft` state so the input never
 * feels laggy while the debounce is pending.
 *
 * Resyncs `draft` when `value` changes for a reason OTHER than this
 * component's own debounced call (e.g. "Clear All" resetting the URL) by
 * comparing against the last external value seen, adjusted directly
 * during render per React's documented pattern — not inside a
 * useEffect, which would cause an extra render pass for every keystroke.
 */
export function SearchInput({
  value,
  onChange,
  label,
  placeholder,
  clearLabel,
  className,
}: SearchInputProps) {
  const [draft, setDraft] = useState(value);
  const [lastExternalValue, setLastExternalValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (value !== lastExternalValue) {
    setLastExternalValue(value);
    setDraft(value);
  }

  const handleChange = (next: string) => {
    setDraft(next);
    setLastExternalValue(next);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onChange(next), 200);
  };

  const handleClear = () => {
    clearTimeout(timeoutRef.current);
    setDraft("");
    setLastExternalValue("");
    onChange("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search
        className="text-text-secondary pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <input
        type="search"
        role="searchbox"
        aria-label={label}
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="border-border bg-surface text-text-primary placeholder:text-text-secondary focus-visible:ring-accent w-full rounded-md border py-2 ps-9 pe-9 text-sm outline-none focus-visible:ring-2"
      />
      {draft && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={clearLabel}
          className="text-text-secondary hover:text-text-primary absolute end-2 top-1/2 -translate-y-1/2 rounded p-1"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
