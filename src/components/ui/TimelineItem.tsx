import { ExternalLink } from "lucide-react";
import { Cluster } from "@/components/layout/Cluster";
import { formatMonthYear } from "@/lib/date";
import type { Locale, ResolvedExperience } from "@/types/content";

interface TimelineItemProps {
  experience: ResolvedExperience;
  employmentTypeLabel: string;
  presentLabel: string;
  locale: Locale;
}

export function TimelineItem({
  experience,
  employmentTypeLabel,
  presentLabel,
  locale,
}: TimelineItemProps) {
  const dateRange = `${formatMonthYear(experience.startDate, locale)} – ${
    experience.endDate
      ? formatMonthYear(experience.endDate, locale)
      : presentLabel
  }`;

  return (
    <li data-animate className="relative ps-8 pb-10 last:pb-0">
      <span
        aria-hidden="true"
        className="bg-accent ring-background absolute start-0 top-1 h-3 w-3 rounded-full ring-4"
      />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-h4 text-text-primary font-semibold">
            {experience.role}
          </h3>
          <span className="text-small text-text-secondary shrink-0">
            {dateRange}
          </span>
        </div>

        <div className="text-small text-text-secondary flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-text-primary font-medium">
            {experience.companyName}
          </span>
          <span aria-hidden="true">&middot;</span>
          <span>{employmentTypeLabel}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{experience.location}</span>
        </div>

        <p className="text-body text-text-secondary">
          {experience.headlineAchievement}
        </p>

        <Cluster gap="sm" className="pt-1">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="bg-surface text-caption text-text-secondary rounded-md px-2 py-1"
            >
              {tech}
            </span>
          ))}
        </Cluster>

        {experience.relatedLinks && experience.relatedLinks.length > 0 && (
          <Cluster gap="sm" className="pt-1">
            {experience.relatedLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-small text-accent hover:text-accent-hover inline-flex items-center gap-1 transition-colors"
              >
                {link.label}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </Cluster>
        )}
      </div>
    </li>
  );
}
