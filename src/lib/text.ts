/**
 * Truncates text to at most `maxLength` characters, breaking at the last
 * whole word rather than mid-word, and appending an ellipsis only when
 * truncation actually happened. Pure function — no UI, no content
 * knowledge — so it's reusable anywhere a preview/excerpt is needed, not
 * just RecommendationCard.
 */
export function truncateAtWordBoundary(
  text: string,
  maxLength: number
): { text: string; wasTruncated: boolean } {
  if (text.length <= maxLength) {
    return { text, wasTruncated: false };
  }

  const slice = text.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  // If there's no space at all in the slice (one very long word), falling
  // back to a hard cut is still better than returning nothing.
  const safeSlice = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;

  return { text: `${safeSlice.trimEnd()}…`, wasTruncated: true };
}
