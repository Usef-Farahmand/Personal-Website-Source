"use client";

import { Check, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";

interface AboutPreviewContentProps {
  introduction: string;
  professionalSummary: string;
  highlights: string[];
  philosophy: string;
  ctaLabel: string;
}

export function AboutPreviewContent({
  introduction,
  professionalSummary,
  highlights,
  philosophy,
  ctaLabel,
}: AboutPreviewContentProps) {
  const animateRef = useEntranceAnimation<HTMLDivElement>({
    trigger: "inView",
    staggerDelay: 100,
    startDelay: 250,
  });

  return (
    <Section
      as="section"
      background="surface"
      containerSize="wide"
      className="border-border border-t"
    >
      <div className="flex max-w-2xl flex-col gap-6">
        <AnimatedText
          text={introduction}
          as="h2"
          trigger="inView"
          className="text-h2 text-text-primary font-semibold"
        />

        <div ref={animateRef} className="flex flex-col gap-6">
          <p data-animate className="text-body-lg text-text-secondary">
            {professionalSummary}
          </p>

          <Stack as="ul" data-animate gap="sm">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2">
                <Check className="text-accent mt-0.5 h-4 w-4 shrink-0" />
                <span className="text-body text-text-secondary">
                  {highlight}
                </span>
              </li>
            ))}
          </Stack>

          <blockquote
            data-animate
            className="border-accent text-text-primary text-body-lg border-s-2 ps-4 italic"
          >
            {philosophy}
          </blockquote>

          <div data-animate>
            <Link
              href="/about"
              className="text-accent hover:text-accent-hover text-small inline-flex items-center gap-1 font-medium transition-colors"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
