/**
 * Numbered section title ("01  About Me ———") in the hero's visual
 * language, for long pages built from several sections (About).
 */
export function SectionHeading({
  index,
  title,
  id,
}: {
  index: number;
  title: string;
  id?: string;
}) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span dir="ltr" className="text-accent font-mono text-sm font-medium">
        {String(index).padStart(2, "0")}
      </span>
      <h2
        id={id}
        className="text-text-primary text-2xl font-bold sm:text-3xl ltr:tracking-tight"
      >
        {title}
      </h2>
      <span aria-hidden="true" className="bg-border h-px flex-1" />
    </div>
  );
}
