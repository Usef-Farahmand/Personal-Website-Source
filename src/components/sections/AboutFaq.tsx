import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Short, self-contained question/answer pairs about Usef — the kind of
 * question people type into search and AI assistants verbatim. Native
 * <details>/<summary>, so it's keyboard-accessible with no JavaScript and
 * every answer stays in the server-rendered HTML even while collapsed.
 * The <details> share one `name`, so opening a question closes the one
 * that was open (native exclusive accordion; older browsers simply allow
 * several open at once). Answers slide open and closed (.faq-item in
 * utilities.css).
 * The same items feed the page's FAQPage JSON-LD, keeping the visible
 * text and the structured data identical.
 */
export function AboutFaq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-border bg-surface/60 divide-y divide-[var(--color-border)] rounded-xl border">
      {items.map((item, index) => (
        <details
          key={item.question}
          name="about-faq"
          className="faq-item group px-5 py-4 sm:px-6"
          open={index === 0}
        >
          <summary className="text-text-primary hover:text-accent flex cursor-pointer list-none items-center justify-between gap-4 font-semibold transition-colors [&::-webkit-details-marker]:hidden">
            <h3 className="text-base">{item.question}</h3>
            <ChevronDown
              aria-hidden="true"
              className="text-accent h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
            />
          </summary>
          <p className="text-text-secondary mt-3 text-sm leading-relaxed sm:text-base">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
