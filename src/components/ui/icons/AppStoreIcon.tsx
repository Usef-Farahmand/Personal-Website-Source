import Image from "next/image";

/** Apple App Store logo. */
export function AppStoreIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/stores/app-store.png"
      alt=""
      width={64}
      height={64}
      aria-hidden="true"
      className={className}
    />
  );
}
