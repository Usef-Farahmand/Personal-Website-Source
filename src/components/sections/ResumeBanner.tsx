import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/types/content";

const IMAGE = {
  src: "/about/resume-banner.webp",
  width: 2000,
  height: 667,
} as const;

/**
 * About page's resume entry point, in the same style as the Videos page
 * SocialBanner: the whole artwork is one link to /resume, with the title,
 * blurb and CTA drawn over the empty navy area to the right of the
 * character. The art doesn't mirror in RTL, so the text block stays on
 * the physical right; only its own text direction follows the locale.
 * Sizes scale with the card's width (cqi) so the overlay keeps its place
 * on the art at every breakpoint.
 */
export async function ResumeBanner({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "about.resume" });

  return (
    <Link
      href="/resume"
      aria-label={`${t("view")} — ${t("title")}`}
      className="group border-border [container-type:inline-size] relative block overflow-hidden rounded-2xl border shadow-[0_10px_30px_-18px_rgb(0_0_0/0.8)] transition-[box-shadow,transform] duration-300 hover:shadow-[0_12px_40px_-12px_rgb(246_180_14/0.45)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--color-accent) active:scale-[0.99] motion-reduce:transition-none"
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
          className="absolute inset-y-0 right-[5%] left-[48%] flex flex-col items-start justify-center gap-[2.2cqi] text-white"
        >
          <span
            dir="ltr"
            className="text-[clamp(0.55rem,1.6cqi,0.8rem)] font-semibold text-[#f6b40e] ltr:tracking-[0.2em] ltr:uppercase"
          >
            ~/resume
          </span>
          <span className="text-[clamp(1.05rem,5cqi,2.75rem)] leading-[1.05] font-extrabold ltr:tracking-tight">
            {t("title")}
          </span>
          <span className="hidden max-w-[36ch] text-[clamp(0.7rem,1.9cqi,1rem)] leading-relaxed text-white/75 sm:block">
            {t("description")}
          </span>
          <span className="mt-[0.5cqi] inline-flex items-center gap-[0.5em] rounded-full bg-[#f6b40e] px-[1.15em] py-[0.65em] text-[clamp(0.62rem,1.8cqi,0.95rem)] font-extrabold whitespace-nowrap text-[#0f1d3a] shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_8px_20px_-6px_rgb(0_0_0/0.7)] transition-[filter] duration-150 group-hover:brightness-110 motion-reduce:transition-none">
            {t("view")}
            <ArrowRight className="h-[1.2em] w-[1.2em] transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
