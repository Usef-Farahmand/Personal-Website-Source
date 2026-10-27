import Image from "next/image";

/** Linux Tux logo — direct Linux downloads. */
export function LinuxIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/stores/linux.png"
      alt="Linux logo"
      width={64}
      height={64}
      aria-hidden="true"
      className={className}
    />
  );
}
