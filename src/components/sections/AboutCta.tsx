import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Cluster } from "@/components/layout/Cluster";

interface AboutCtaLink {
  href: string;
  label: string;
}

/**
 * Three quiet, equally-weighted links — deliberately not a hard-sell
 * button row, per "do not use aggressive marketing language". Contact
 * points at the homepage's `#contact` section (Contact is homepage-only
 * for MVP — see Contact.tsx — there is no dedicated /contact route yet).
 */
export function AboutCta({ links }: { links: AboutCtaLink[] }) {
  return (
    <Cluster gap="lg" justify="center">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-small text-accent hover:text-accent-hover inline-flex items-center gap-1 font-medium transition-colors"
        >
          {link.label}
          <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
        </Link>
      ))}
    </Cluster>
  );
}
