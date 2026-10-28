import Image from "next/image";
import { ExternalLink } from "lucide-react";

const IMAGE = {
  src: "/about/studio-banner.webp",
  width: 2000,
  height: 667,
} as const;

/**
 * About page's studio card, in the same style as ResumeBanner: the
 * whole artwork is one link to the studio's
 * site, with the logo, name, role, blurb and CTA drawn over the empty
 * navy area to the left of the panda (who points at them). The art
 * doesn't mirror in RTL, so the text block stays on the physical left;
 * only its own text direction follows the locale.
 */
export function StudioBanner({
  name,
  url,
  logoSrc,
  role,
  description,
  ctaLabel,
  opensInNewTab,
}: {
  name: string;
  url: string;
  logoSrc: string;
  role: string;
  description: string;
  ctaLabel: string;
  opensInNewTab: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${ctaLabel} — ${name} ${opensInNewTab}`}
      className="group border-border [container-type:inline-size] relative block overflow-hidden rounded-2xl border shadow-[0_10px_30px_-18px_rgb(0_0_0/0.8)] transition-[box-shadow,transform] duration-300 hover:shadow-[0_12px_40px_-12px_rgb(249_115_22/0.5)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--color-accent) active:scale-[0.99] motion-reduce:transition-none"
    >
      {/* Image and overlay zoom together on hover, as one picture. */}
      <div className="relative transition-transform duration-500 ease-(--motion-ease-smooth) group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        <Image
          src={IMAGE.src}
          width={IMAGE.width}
          height={IMAGE.height}
          alt=""
          sizes="(min-width: 1024px) 976px, 100vw"
          draggable={false}
          className="aspect-[2000/667] h-auto w-full object-cover select-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-[46%] left-[7%] flex flex-col items-start justify-center gap-[2cqi] text-white"
        >
          <div className="flex items-center gap-[1.6cqi]">
            <Image
              src={logoSrc}
              alt=""
              width={80}
              height={80}
              className="h-[clamp(1.75rem,6.5cqi,4rem)] w-auto shrink-0 rounded-full ring-2 ring-orange-500/70"
            />
            <div className="flex flex-col gap-[0.6cqi]">
              <span className="text-[clamp(1rem,4.6cqi,2.5rem)] leading-[1.05] font-extrabold ltr:tracking-tight">
                {name}
              </span>
              <span className="self-start rounded-full bg-orange-500/20 px-[0.9em] py-[0.25em] text-[clamp(0.55rem,1.5cqi,0.8rem)] font-semibold text-orange-400">
                {role}
              </span>
            </div>
          </div>
          <span className="hidden max-w-[44ch] text-[clamp(0.7rem,1.75cqi,0.95rem)] leading-relaxed text-white/75 sm:block">
            {description}
          </span>
          <span className="mt-[0.5cqi] inline-flex items-center gap-[0.5em] rounded-full bg-[linear-gradient(180deg,#fb923c_0%,#ea580c_100%)] px-[1.15em] py-[0.65em] text-[clamp(0.62rem,1.8cqi,0.95rem)] font-extrabold whitespace-nowrap text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_8px_20px_-6px_rgb(0_0_0/0.7)] transition-[filter] duration-150 group-hover:brightness-110 motion-reduce:transition-none">
            {ctaLabel}
            <ExternalLink className="h-[1.15em] w-[1.15em]" />
          </span>
        </div>
      </div>
    </a>
  );
}
