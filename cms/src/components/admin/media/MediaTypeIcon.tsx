import type { MediaType } from "@/lib/validation/shared";

export default function MediaTypeIcon({
  type,
  className,
}: {
  type: MediaType;
  className?: string;
}) {
  if (type === "IMAGE") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={className}
      >
        <rect x="3" y="4" width="14" height="12" rx="1.5" />
        <circle cx="7.5" cy="8.5" r="1.25" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m5 14 3.5-3.5L11 13l2-2 3 3"
        />
      </svg>
    );
  }

  if (type === "VIDEO") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={className}
      >
        <rect x="3" y="4" width="14" height="12" rx="1.5" />
        <path
          strokeLinejoin="round"
          fill="currentColor"
          stroke="none"
          d="M8.25 7.5v5l4.25-2.5-4.25-2.5Z"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path
        strokeLinejoin="round"
        d="M6 3h6l3 3v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
      />
      <path strokeLinejoin="round" d="M12 3v3h3" />
    </svg>
  );
}
