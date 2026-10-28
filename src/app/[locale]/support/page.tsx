import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Heart } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SupportCrypto } from "@/components/sections/SupportCrypto";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/services/content/site.service";
import { SUPPORT_IMAGES, SUPPORT_NETWORKS } from "@/config/support";
import type { Locale } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "seo.support" });
  return buildPageMetadata({
    locale,
    path: "/support",
    title: t("title"),
    description: t("description"),
    siteName: getSiteContent(locale).hero.name,
  });
}

/**
 * Support: a short introduction with the character illustration, the
 * crypto donation section (read-only: public receiving addresses and QR
 * codes from config/support.ts — no wallet connection or transactions),
 * and a thank-you. Same page frame as the site's other section pages.
 */
export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: "support" });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* A. Introduction */}
      <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
        <PageHeader
          path="/support"
          title={t("title")}
          intro={t("intro")}
          className="mb-0"
        />
        <Image
          src={SUPPORT_IMAGES.character.src}
          width={SUPPORT_IMAGES.character.width}
          height={SUPPORT_IMAGES.character.height}
          alt={t("characterAlt")}
          priority
          sizes="(min-width: 1024px) 26rem, 90vw"
          className="mx-auto h-auto w-full max-w-sm object-contain lg:max-w-md"
        />
      </section>

      {/* B. Crypto */}
      <section aria-labelledby="support-crypto" className="mt-16">
        <h2
          id="support-crypto"
          className="text-text-primary text-2xl font-bold sm:text-3xl ltr:tracking-tight"
        >
          {t("cryptoTitle")}
        </h2>
        <p className="text-text-secondary mt-2 mb-6 max-w-2xl">
          {t("cryptoIntro")}
        </p>
        <SupportCrypto
          networks={SUPPORT_NETWORKS}
          labels={{
            tablist: t("tablist"),
            selected: t("selected"),
            address: t("address"),
            copy: t("copy"),
            copied: t("copied"),
            copyFailed: t("copyFailed"),
            // Placeholders are filled in on the client, per network.
            qrLabel: t("qrLabel", {
              network: "{network}",
              address: "{address}",
            }),
            notConfigured: t("notConfigured"),
            imageAlt: {
              ethereum: t("imageAlt.ethereum"),
              bnb: t("imageAlt.bnb"),
              bitcoin: t("imageAlt.bitcoin"),
            },
            safety: {
              ethereum: t("safety.ethereum"),
              bnb: t("safety.bnb"),
              bitcoin: t("safety.bitcoin"),
            },
          }}
        />
      </section>

      {/* C. Thank you */}
      <section className="border-border bg-surface/60 mt-16 flex items-start gap-4 rounded-2xl border p-6 sm:p-8">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f6b40e]/15 text-[#f6b40e]">
          <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-text-primary text-xl font-bold">
            {t("thanksTitle")}
          </h2>
          <p className="text-text-secondary mt-1 leading-relaxed">
            {t("thanksText")}
          </p>
        </div>
      </section>
    </div>
  );
}
