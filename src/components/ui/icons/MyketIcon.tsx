import Image from "next/image";

/** Myket (myket.ir) logo — the official blue "m" mark. */
export function MyketIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/stores/myket.png"
      alt=""
      width={64}
      height={64}
      aria-hidden="true"
      className={className}
    />
  );
}
