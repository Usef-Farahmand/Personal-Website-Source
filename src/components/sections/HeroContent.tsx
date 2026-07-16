"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/layout/Section";
import { Cluster } from "@/components/layout/Cluster";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";

interface HeroContentProps {
  greeting: string;
  name: string;
  professionalTitle: string;
  introduction: string;
  availabilityStatus: string;
  isAvailable: boolean;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  scrollIndicatorLabel: string;
  /** Rendered server-side (SocialLinks is itself async) and passed down as
   *  a slot, since a Client Component can't import and instantiate an
   *  async Server Component directly. */
  socialLinks: ReactNode;
}

// Cascade timing for the four AnimatedText blocks above the trailing
// group. Tuned for the current placeholder content's approximate length
// (a ~25-30 word introduction).
//
// TRAILING_GROUP_DELAY was previously 1500ms — long enough that the
// primary/secondary CTAs and social links sat invisible for a full 1.5s
// on every mount. That's poor UX on its own regardless of any other
// cause, and it directly compounds the "elements missing after
// navigating back" symptom: if a visitor looks at the page in that
// window (including right after a fast return-navigation remount), the
// CTAs and social links genuinely aren't there yet. Tightened so the
// whole reveal completes well under a second.
const GREETING_DELAY = 0;
const NAME_DELAY = 100;
const TITLE_DELAY = 200;
const INTRODUCTION_DELAY = 320;
const INTRODUCTION_WORD_DELAY = 14;
const TRAILING_GROUP_DELAY = 750;

export function HeroContent({
  greeting,
  name,
  professionalTitle,
  introduction,
  availabilityStatus,
  isAvailable,
  ctaPrimaryLabel,
  ctaSecondaryLabel,
  scrollIndicatorLabel,
  socialLinks,
}: HeroContentProps) {
  const animateRef = useEntranceAnimation<HTMLDivElement>({
    staggerDelay: 80,
    startDelay: TRAILING_GROUP_DELAY,
  });

  return (
    <Section
      as="section"
      spacing="none"
      containerSize="wide"
      className="relative py-20 sm:py-28"
    >
      <div className="flex max-w-2xl flex-col gap-6">
        <AnimatedText
          text={greeting}
          as="p"
          trigger="mount"
          startDelay={GREETING_DELAY}
          className="text-small text-text-secondary font-medium"
        />

        <AnimatedText
          text={name}
          as="h1"
          trigger="mount"
          startDelay={NAME_DELAY}
          className="text-h1 sm:text-display text-text-primary font-semibold"
        />

        <AnimatedText
          text={professionalTitle}
          as="p"
          trigger="mount"
          startDelay={TITLE_DELAY}
          className="text-h4 text-text-secondary font-medium"
        />

        <AnimatedText
          text={introduction}
          as="p"
          trigger="mount"
          wordDelay={INTRODUCTION_WORD_DELAY}
          startDelay={INTRODUCTION_DELAY}
          className="text-body-lg text-text-secondary"
        />

        <div ref={animateRef} className="flex flex-col gap-6">
          <div data-animate className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {isAvailable && (
                <span className="bg-success absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isAvailable ? "bg-success" : "bg-disabled"
                }`}
              />
            </span>
            <span className="text-small text-text-secondary">
              {availabilityStatus}
            </span>
          </div>

          <Cluster data-animate gap="md">
            <Link
              href="/projects"
              className="bg-accent text-background hover:bg-accent-hover text-small rounded-md px-5 py-2.5 font-medium transition-colors"
            >
              {ctaPrimaryLabel}
            </Link>
            <Link
              href="/about"
              className="border-border text-text-primary hover:border-accent/50 text-small rounded-md border px-5 py-2.5 font-medium transition-colors"
            >
              {ctaSecondaryLabel}
            </Link>
          </Cluster>

          <div data-animate>{socialLinks}</div>
        </div>
      </div>

      {/* translate-x-1/2 is a physical transform (CSS has no logical
          equivalent), but centering at exactly 50% is symmetric — the
          same leftward shift completes centering correctly in both LTR
          and RTL, since inset-inline-start: 50% is the identical anchor
          point in either direction. */}
      <a
        href="#featured-work"
        aria-label={scrollIndicatorLabel}
        className="text-text-secondary hover:text-text-primary absolute start-1/2 bottom-0 hidden -translate-x-1/2 transition-colors sm:block"
      >
        <ChevronDown className="animate-bounce-subtle h-5 w-5" />
      </a>
    </Section>
  );
}
