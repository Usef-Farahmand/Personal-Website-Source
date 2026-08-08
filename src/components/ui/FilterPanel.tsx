"use client";

export interface FilterFacet {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface FilterPanelProps {
  facets: FilterFacet[];
  activeValues: Record<string, string[]>;
  onToggle: (key: string, value: string) => void;
}

/** Renders nothing for a facet with zero derived options — a filter
 *  group only ever appears when the data actually contains that facet's
 *  values, per the "only display filters that exist in the data"
 *  requirement. */
export function FilterPanel({
  facets,
  activeValues,
  onToggle,
}: FilterPanelProps) {
  const visibleFacets = facets.filter((facet) => facet.options.length > 0);
  if (visibleFacets.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {visibleFacets.map((facet) => (
        <fieldset key={facet.key} className="flex flex-col gap-2">
          <legend className="text-small text-text-primary mb-1 font-medium">
            {facet.label}
          </legend>
          <div className="flex flex-col gap-1.5">
            {facet.options.map((option) => {
              const checked = activeValues[facet.key]?.includes(
                option.value
              );
              return (
                <label
                  key={option.value}
                  className="text-small text-text-secondary hover:text-text-primary flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={checked ?? false}
                    onChange={() => onToggle(facet.key, option.value)}
                    className="border-border text-accent focus-visible:ring-accent h-4 w-4 rounded"
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
