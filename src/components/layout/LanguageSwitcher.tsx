"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/types/content";
import type { Locale } from "@/types/content";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const t = useTranslations("languageSwitcher");
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1" aria-label={t("label")}>
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => router.replace(pathname, { locale: code })}
          aria-current={code === locale ? "true" : undefined}
          className={`text-small rounded-md px-2 py-1 transition-colors ${
            code === locale
              ? "text-text-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {t(code)}
        </button>
      ))}
    </div>
  );
}
