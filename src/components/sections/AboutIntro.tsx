"use client";

import Image from "next/image";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";

interface AboutIntroProps {
  photoSrc: string;
  name: string;
  professionalTitle: string;
  introduction: string;
}

const PHOTO_DELAY = 0;
const NAME_DELAY = 250;
const TITLE_DELAY = 380;
const INTRODUCTION_DELAY = 520;
const INTRODUCTION_WORD_DELAY = 14;

/**
 * The page's visual anchor, per the requirement — the photo animates in
 * first (a plain fade + rise via useEntranceAnimation, mirroring Hero's
 * own cascade timing pattern), then name/title/introduction reveal in
 * sequence via AnimatedText. Centered and narrow, distinct from Hero's
 * left-aligned, wide layout — this is a quieter restatement of identity,
 * not a second hero.
 */
export function AboutIntro({
  photoSrc,
  name,
  professionalTitle,
  introduction,
}: AboutIntroProps) {
  const photoRef = useEntranceAnimation<HTMLDivElement>({
    trigger: "mount",
    startDelay: PHOTO_DELAY,
  });

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div ref={photoRef} className="relative">
        <div
          data-animate
          className="border-border relative h-32 w-32 overflow-hidden rounded-full border sm:h-40 sm:w-40"
        >
          <Image
            src={photoSrc}
            alt={name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <AnimatedText
          text={name}
          as="h1"
          trigger="mount"
          startDelay={NAME_DELAY}
          className="text-h1 text-text-primary font-semibold"
        />
        <AnimatedText
          text={professionalTitle}
          as="p"
          trigger="mount"
          startDelay={TITLE_DELAY}
          className="text-h4 text-text-secondary font-medium"
        />
      </div>

      <AnimatedText
        text={introduction}
        as="p"
        trigger="mount"
        wordDelay={INTRODUCTION_WORD_DELAY}
        startDelay={INTRODUCTION_DELAY}
        className="text-body-lg text-text-secondary max-w-xl"
      />
    </div>
  );
}
