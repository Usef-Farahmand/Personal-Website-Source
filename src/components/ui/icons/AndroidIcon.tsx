import Image from "next/image";

/** Android robot logo — direct APK downloads. */
export function AndroidIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/stores/android.png"
      alt="Android logo"
      width={64}
      height={64}
      aria-hidden="true"
      className={className}
    />
  );
}
