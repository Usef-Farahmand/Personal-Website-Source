"use client";

import { Overlay } from "@/components/ui/Overlay";
import {
  SocialUniverseOrbit,
  type SocialUniverseOrbitLabels,
} from "@/components/ui/SocialUniverseOrbit";
import type { SocialUniverseProfile } from "@/config/socialUniverse";

export interface SocialUniverseLabels extends SocialUniverseOrbitLabels {
  /** Dialog name (visually hidden) and the trigger's text. */
  title: string;
  close: string;
}

/**
 * The Social Universe dialog (opened under the Contact form): the orbit
 * scene in an Overlay, so focus trapping, Escape, backdrop click, focus
 * return and scroll lock are the shared ones. No card behind the scene:
 * it floats straight on a blurred backdrop (a darker plain dim where
 * backdrop-filter is unsupported).
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
      overlayClassName="bg-black/85 supports-[backdrop-filter]:bg-black/55 supports-[backdrop-filter]:backdrop-blur-lg"
      contentClassName="max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[42rem] rounded-none border-0 bg-transparent px-5 pt-12 pb-6 sm:w-[36rem] sm:px-8 sm:pt-10 sm:pb-4 lg:w-[42rem]"
    >
      <SocialUniverseOrbit profiles={profiles} labels={labels} />
    </Overlay>
  );
}
