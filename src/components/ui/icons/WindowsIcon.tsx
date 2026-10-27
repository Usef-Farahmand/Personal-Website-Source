import Image from "next/image";

/** Windows 11 logo — direct Windows downloads. */
export function WindowsIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/stores/windows.png"
      alt="Windows logo"
      width={64}
      height={64}
      aria-hidden="true"
      className={className}
    />
  );
}
