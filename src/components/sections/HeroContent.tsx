"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/layout/Section";
import { Cluster } from "@/components/layout/Cluster";
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
  const animateRef = useEntranceAnimation<HTMLDivElement>({ staggerDelay: 80 });

  return (
    <Section
      as="section"
      spacing="none"
      containerSize="wide"
      className="relative py-20 sm:py-28"
    >
      <div ref={animateRef} className="flex max-w-2xl flex-col gap-6">
        <p data-animate className="text-small text-text-secondary font-medium">
          {greeting}
        </p>

        <h1
          data-animate
          className="text-h1 sm:text-display text-text-primary font-semibold"
        >
          {name}
        </h1>

        <p data-animate className="text-h4 text-text-secondary font-medium">
          {professionalTitle}
        </p>

        <p data-animate className="text-body-lg text-text-secondary">
          {introduction}
        </p>

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

        <div data-animate className="pt-2">
          {socialLinks}
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
