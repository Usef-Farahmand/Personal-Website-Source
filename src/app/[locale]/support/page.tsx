import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SupportCrypto } from "@/components/sections/SupportCrypto";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/services/content/site.service";
import { BLUBANK, SUPPORT_IMAGES, SUPPORT_NETWORKS } from "@/config/support";
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
      <SupportCrypto
        networks={SUPPORT_NETWORKS}
        intro={
          <PageHeader
            path="/support"
            title={t("title")}
            intro={t("intro")}
            className="mb-0"
          />
        }
        cryptoHeading={
          <>
            <h2
              id="support-crypto"
              className="text-text-primary text-2xl font-bold sm:text-3xl ltr:tracking-tight"
            >
              {t("cryptoTitle")}
            </h2>
            <p className="text-text-secondary mt-2 mb-6 max-w-2xl">
              {t("cryptoIntro")}
            </p>
          </>
        }
        labels={{
          tablist: t("tablist"),
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

      {/* Support from Iran: a link to the owner's public Blubank payment
          page, where the supporter picks the amount. Nothing about the
          payment happens on this site. */}
      {BLUBANK.url && (
        <section aria-labelledby="support-iran" className="mt-16">
          <h2
            id="support-iran"
            className="text-text-primary text-2xl font-bold sm:text-3xl ltr:tracking-tight"
          >
            {t("iranTitle")}
          </h2>
          <p className="text-text-secondary mt-2 mb-6 max-w-2xl">
            {t("iranIntro")}
          </p>
          <div className="border-border bg-surface/60 flex flex-col gap-5 rounded-2xl border p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
            <Image
              src={BLUBANK.logo}
              width={256}
              height={256}
              alt={t("blubankLogoAlt")}
              sizes="4rem"
              className="h-14 w-14 shrink-0 rounded-2xl sm:h-16 sm:w-16"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <h3 className="text-text-primary text-xl font-bold">
                {t("blubankTitle")}
              </h3>
              <p className="text-text-secondary">{t("blubankText")}</p>
              <p className="text-text-secondary text-xs">
                {t("blubankAmount")}
              </p>
            </div>
            <a
              href={BLUBANK.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-end rounded-md bg-[#f6b40e] px-5 py-2.5 text-sm font-semibold text-[#0f1d3a] transition-[filter] hover:brightness-110 sm:self-center"
            >
              {t("blubankButton")}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">{t("opensInNewTab")}</span>
            </a>
          </div>
        </section>
      )}

      {/* C. Thank you */}
      <section className="border-border bg-surface/60 mt-16 flex items-center gap-5 rounded-2xl border p-6 sm:gap-8 sm:p-8">
        <Image
          src={SUPPORT_IMAGES.thanks.src}
          width={SUPPORT_IMAGES.thanks.width}
          height={SUPPORT_IMAGES.thanks.height}
          alt={t("thanksAlt")}
          sizes="8rem"
          className="h-auto w-20 shrink-0 object-contain sm:w-28"
        />
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
