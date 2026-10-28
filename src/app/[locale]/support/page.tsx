import Image from "next/image";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { CreditCard, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SupportExperience } from "@/components/sections/SupportExperience";
import { buildPageMetadata } from "@/lib/seo";
import { SOCIAL_LINK_ICON, SOCIAL_PLATFORM_NAME } from "@/lib/socialPlatforms";
import { getSiteContent } from "@/services/content/site.service";
import {
  PAYMENT_METHODS,
  SUPPORT_IMAGES,
  SUPPORT_NETWORKS,
  SUPPORT_SOCIALS,
} from "@/config/support";
import { cn } from "@/lib/cn";
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

const METHOD_ICON = { paypal: CreditCard } as const;

/**
 * Support: a short header, then three tabs (SupportExperience) — Connect
 * (follow on YouTube, Instagram, Telegram), Crypto (ETH / BNB / BTC) and
 * Other payment methods — with an illustration that follows the tab, and
 * a closing thank-you. All links, addresses and images come from
 * config/support.ts and the site's social links.
 *
 * Payment methods limited to some countries (Blubank: Iran) use the
 * hosting platform's visitor-country header; without it (local dev) they
 * are shown.
 */
export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const [t, requestHeaders] = await Promise.all([
    getTranslations({ locale, namespace: "support" }),
    headers(),
  ]);
  const site = getSiteContent(locale);
  const country = requestHeaders.get("x-vercel-ip-country")?.toUpperCase();

  const socials = SUPPORT_SOCIALS.flatMap((platform) => {
    const link = site.socialLinks.find(
      (l) => l.platform === platform && l.enabled
    );
    return link ? [{ platform, url: link.url }] : [];
  });

  const methods = PAYMENT_METHODS.filter(
    (method) => !method.onlyIn || !country || method.onlyIn.includes(country)
  );

  const panelHeading = (title: string, text: string) => (
    <>
      <h2 className="text-text-primary text-2xl font-bold sm:text-3xl ltr:tracking-tight">
        {title}
      </h2>
      <p className="text-text-secondary mt-2 mb-6 max-w-2xl">{text}</p>
    </>
  );

  const connectPanel = (
    <>
      {panelHeading(t("connectTitle"), t("connectText"))}
      <ul className="flex flex-col gap-3">
        {socials.map(({ platform, url }) => {
          const Icon = SOCIAL_LINK_ICON[platform];
          return (
            <li key={platform}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group border-border bg-surface/60 flex items-center gap-4 rounded-xl border p-4 transition-colors hover:border-[#f6b40e]/60"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f6b40e]/10 text-[#f6b40e]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-text-primary font-semibold">
                    {SOCIAL_PLATFORM_NAME[platform]}
                  </span>
                  <span className="text-text-secondary text-sm">
                    {t(`social.${platform}`)}
                  </span>
                </span>
                <ExternalLink
                  className="text-text-secondary h-4 w-4 shrink-0 transition-colors group-hover:text-[#f6b40e]"
                  aria-hidden="true"
                />
                <span className="sr-only">{t("opensInNewTab")}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );

  const paymentsPanel = (
    <>
      {panelHeading(t("paymentsTitle"), t("paymentsIntro"))}
      <ul className="flex flex-col gap-3">
        {methods.map((method) => {
          const Icon = method.id === "blubank" ? null : METHOD_ICON[method.id];
          const audience = t(`methods.${method.id}.audience`);
          return (
            <li
              key={method.id}
              className={cn(
                "border-border bg-surface/60 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5",
                !method.url && "opacity-75"
              )}
            >
              <div className="flex min-w-0 flex-1 items-start gap-4">
                {method.logo ? (
                  <Image
                    src={method.logo}
                    width={256}
                    height={256}
                    alt={t("blubankLogoAlt")}
                    sizes="3rem"
                    className="h-12 w-12 shrink-0 rounded-xl"
                  />
                ) : (
                  Icon && (
                    <span className="bg-background text-text-secondary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-text-primary text-lg font-bold">
                      {t(`methods.${method.id}.name`)}
                    </h3>
                    {audience && (
                      <span className="border-border text-text-secondary rounded-full border px-2 py-0.5 text-[0.7rem] font-medium">
                        {audience}
                      </span>
                    )}
                  </div>
                  <p className="text-text-secondary mt-1 text-sm">
                    {t(`methods.${method.id}.text`)}
                  </p>
                </div>
              </div>
              {method.url ? (
                <a
                  href={method.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-end rounded-md bg-[#f6b40e] px-5 py-2.5 text-sm font-semibold text-[#0f1d3a] transition-[filter] hover:brightness-110 sm:self-center"
                >
                  {t(`methods.${method.id}.button`)}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{t("opensInNewTab")}</span>
                </a>
              ) : (
                <span className="border-border text-text-secondary shrink-0 self-end rounded-full border px-3 py-1 text-xs font-semibold sm:self-center">
                  {t("comingSoon")}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader
        path="/support"
        title={t("title")}
        intro={t("intro")}
        className="mb-10"
      />

      <SupportExperience
        networks={SUPPORT_NETWORKS}
        connectPanel={connectPanel}
        paymentsPanel={paymentsPanel}
        cryptoIntro={panelHeading(t("cryptoTitle"), t("cryptoIntro"))}
        labels={{
          tablist: t("mainTablist"),
          tabs: {
            connect: t("tabs.connect"),
            crypto: t("tabs.crypto"),
            payments: t("tabs.payments"),
          },
          imageAlt: {
            connect: t("imageAltConnect"),
            payments: t("imageAltPayments"),
            ethereum: t("imageAlt.ethereum"),
            bnb: t("imageAlt.bnb"),
            bitcoin: t("imageAlt.bitcoin"),
          },
        }}
        cryptoLabels={{
          tablist: t("tablist"),
          address: t("address"),
          copy: t("copy"),
          copied: t("copied"),
          copyFailed: t("copyFailed"),
          // Placeholders are filled in on the client, per network.
          qrLabel: t("qrLabel", { network: "{network}", address: "{address}" }),
          notConfigured: t("notConfigured"),
          safety: {
            ethereum: t("safety.ethereum"),
            bnb: t("safety.bnb"),
            bitcoin: t("safety.bitcoin"),
          },
        }}
      />

      {/* Thank you */}
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
