import Image from "next/image";

/** Sib Store logo — the Iranian iOS app store. */
export function SibStoreIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/stores/sib-store.png"
      alt="Sib Store logo"
      width={64}
      height={64}
      aria-hidden="true"
      className={className}
    />
  );
}
