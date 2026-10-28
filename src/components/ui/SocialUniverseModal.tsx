"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Overlay } from "@/components/ui/Overlay";
import { SOCIAL_PLATFORM_NAME } from "@/lib/socialPlatforms";
import {
  SOCIAL_UNIVERSE_CHARACTER,
  type SocialUniverseProfile,
} from "@/config/socialUniverse";
import { cn } from "@/lib/cn";
import styles from "./SocialUniverse.module.css";

export interface SocialUniverseLabels {
  /** Dialog name (visually hidden) and the trigger's text. */
  title: string;
  close: string;
  characterAlt: string;
  /** "{name}" is replaced with the platform name. */
  openProfile: string;
  unavailable: string;
}

/**
 * The Social Universe dialog: the character in the middle with the six
 * profile icons floating around it (on phones, a 3 × 2 grid under the
 * character, with names). Built on Overlay, so focus trapping, Escape,
 * backdrop click, focus return and scroll lock are the shared ones; this
 * only adds a lighter, blurred backdrop (plain dim where backdrop-filter
 * is unsupported). Each configured profile is its own link; a missing one
 * is shown faded and is not a link.
 */
export function SocialUniverseModal({
  isOpen,
  onClose,
  profiles,
  labels,
}: {
  isOpen: boolean;
  onClose: () => void;
  profiles: SocialUniverseProfile[];
  labels: SocialUniverseLabels;
}) {
  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      title={labels.title}
      closeLabel={labels.close}
      overlayClassName="bg-black/80 supports-[backdrop-filter]:bg-black/45 supports-[backdrop-filter]:backdrop-blur-md"
      contentClassName="max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[42rem] rounded-2xl px-5 pt-12 pb-6 sm:w-[36rem] sm:px-8 sm:pt-10 sm:pb-4 lg:w-[42rem]"
    >
      <div className="relative flex flex-col items-center gap-6 sm:block sm:aspect-[5/4]">
        {/* Faint orbit path (tablet and up). */}
        <span
          aria-hidden="true"
          className="border-border absolute inset-[6%_3%] hidden rounded-[50%] border border-dashed sm:block"
        />

        <Image
          src={SOCIAL_UNIVERSE_CHARACTER.src}
          width={SOCIAL_UNIVERSE_CHARACTER.width}
          height={SOCIAL_UNIVERSE_CHARACTER.height}
          alt={labels.characterAlt}
          sizes="(min-width: 640px) 22rem, 12rem"
          className="h-auto w-[55%] max-w-[12rem] sm:absolute sm:top-1/2 sm:left-1/2 sm:h-[78%] sm:w-auto sm:max-w-none sm:-translate-x-1/2 sm:-translate-y-1/2"
        />

        <ul className="grid w-full grid-cols-3 gap-x-3 gap-y-5 sm:absolute sm:inset-0 sm:block">
          {profiles.map((profile) => {
            const name = SOCIAL_PLATFORM_NAME[profile.id];
            const floatStyle = {
              "--float-duration": `${profile.float.duration}s`,
              "--float-delay": `${profile.float.delay}s`,
              "--float-dx": `${profile.float.dx}px`,
              "--float-dy": `${profile.float.dy}px`,
            } as CSSProperties;
            const icon = (
              <>
                <Image
                  src={profile.icon}
                  width={192}
                  height={192}
                  alt=""
                  sizes="(min-width: 640px) 6rem, 4rem"
                  className="h-16 w-16 drop-shadow-md transition-[transform,filter] duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:brightness-110 group-focus-visible:-translate-y-1 group-focus-visible:scale-105 sm:h-auto sm:w-full"
                />
                <span className="text-caption text-text-secondary sm:sr-only">
                  {name}
                </span>
              </>
            );

            return (
              <li
                key={profile.id}
                // Orbit position applies only once the list is absolute
                // (sm and up); on phones the item sits in the grid.
                style={{ left: `${profile.x}%`, top: `${profile.y}%` }}
                className="flex justify-center sm:absolute sm:w-[14%] sm:-translate-x-1/2 sm:-translate-y-1/2"
              >
                {profile.url ? (
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={labels.openProfile.replace("{name}", name)}
                    title={name}
                    style={floatStyle}
                    className={cn(
                      "group flex flex-col items-center gap-1.5 rounded-2xl p-1",
                      styles.float
                    )}
                  >
                    {icon}
                  </a>
                ) : (
                  <span
                    role="img"
                    aria-label={labels.unavailable.replace("{name}", name)}
                    title={labels.unavailable.replace("{name}", name)}
                    className="flex cursor-not-allowed flex-col items-center gap-1.5 p-1 opacity-40 grayscale"
                  >
                    {icon}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Overlay>
  );
}
