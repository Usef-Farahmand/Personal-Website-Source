"use client";

import { useState } from "react";
import { PROJECT_PLATFORMS } from "@/lib/validation/shared";

const PLATFORM_LABELS: Record<(typeof PROJECT_PLATFORMS)[number], string> = {
  web: "Web",
  ios: "iOS",
  android: "Android",
  desktop: "Desktop",
  "cross-platform": "Cross-platform",
};

export default function PlatformsPicker({
  name,
  initialValues,
}: {
  name: string;
  initialValues: string[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialValues));

  function toggle(platform: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(platform)) next.delete(platform);
      else next.add(platform);
      return next;
    });
  }

  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Platforms
      </legend>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {PROJECT_PLATFORMS.map((platform) => (
          <label
            key={platform}
            className="flex items-center gap-1.5 text-sm text-neutral-700 dark:text-neutral-300"
          >
            <input
              type="checkbox"
              checked={selected.has(platform)}
              onChange={() => toggle(platform)}
              className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-neutral-700"
            />
            {PLATFORM_LABELS[platform]}
          </label>
        ))}
      </div>
      <input type="hidden" name={name} value={JSON.stringify([...selected])} />
    </fieldset>
  );
}
