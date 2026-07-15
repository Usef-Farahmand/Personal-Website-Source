import { getTranslations } from "next-intl/server";
import { getSiteContent } from "@/lib/content";
import type { Locale } from "@/content/types";

export async function Footer({ locale }: { locale: Locale }) {
  const site = getSiteContent(locale);
  const t = await getTranslations({ locale, namespace: "footer" });

  const socialLinks = [
    { key: "github", label: "GitHub", href: site.socialLinks.github },
    { key: "linkedin", label: "LinkedIn", href: site.socialLinks.linkedin },
    { key: "x", label: "X", href: site.socialLinks.x },
    { key: "email", label: "Email", href: site.socialLinks.email },
  ].filter((link) => Boolean(link.href));

  return (
    <footer className="border-border border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-small text-text-secondary">
          &copy; {new Date().getFullYear()} {site.hero.name}. {t("rights")}
        </p>

        <nav aria-label="Social links" className="flex gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-small text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
