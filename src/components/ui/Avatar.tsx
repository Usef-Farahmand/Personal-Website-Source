import Image from "next/image";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASS: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-caption",
  md: "h-12 w-12 text-small",
  lg: "h-16 w-16 text-body",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ src, name, size = "md" }: AvatarProps) {
  const sizeClass = SIZE_CLASS[size];

  if (src) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full ${sizeClass}`}
      >
        <Image src={src} alt="" fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={name}
      className={`bg-accent/10 text-accent flex shrink-0 items-center justify-center rounded-full font-medium ${sizeClass}`}
    >
      {getInitials(name)}
    </div>
  );
}
