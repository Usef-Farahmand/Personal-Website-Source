import Image from "next/image";

/** Google Play logo. */
export function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/stores/google-play.png"
      alt=""
      width={64}
      height={64}
      aria-hidden="true"
      className={className}
    />
  );
}
