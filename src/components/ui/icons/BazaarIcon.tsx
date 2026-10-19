import Image from "next/image";

/** Cafe Bazaar (cafebazaar.ir) logo — the official green bag mark. */
export function BazaarIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/stores/bazaar.png"
      alt=""
      width={64}
      height={64}
      aria-hidden="true"
      className={className}
    />
  );
}
