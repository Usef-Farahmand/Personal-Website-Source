import Image from "next/image";
import { TelegramIcon } from "@/components/ui/icons";

/**
 * "Find out about new games/apps" — closes every project page. News goes
 * out through the Panda Radar Telegram bot (site.data.ts → newsBot); there
 * is no email list yet, so the only call to action is opening the bot.
 */
export function ProjectNewsSignup({
  title,
  text,
  buttonLabel,
  botUrl,
  imageAlt,
  opensInNewTab,
}: {
  title: string;
  text: string;
  buttonLabel: string;
  botUrl: string;
  imageAlt: string;
  opensInNewTab: string;
}) {
  return (
    <section className="border-border bg-surface/60 relative isolate overflow-hidden rounded-2xl border">
      <div
        aria-hidden="true"
        className="landing-grid absolute inset-0 -z-10 opacity-50"
      />
      <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="flex flex-col gap-4 p-6 sm:p-10">
          <h2 className="text-text-primary text-2xl font-bold sm:text-3xl ltr:tracking-tight">
            {title}
          </h2>
          <p className="text-text-secondary max-w-md text-sm leading-relaxed sm:text-base">
            {text}
          </p>
          <a
            href={botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-background hover:bg-accent-hover inline-flex items-center gap-2 self-start rounded-md px-5 py-2.5 text-sm font-semibold shadow-[0_8px_30px_-8px_rgb(249_115_22/0.6)] transition-colors"
          >
            <TelegramIcon className="h-4 w-4" aria-hidden="true" />
            {buttonLabel}
            <span className="sr-only">{opensInNewTab}</span>
          </a>
        </div>
        <Image
          src="/about/news-character.webp"
          alt={imageAlt}
          width={1536}
          height={1024}
          sizes="(min-width: 640px) 28rem, 100vw"
          className="h-auto w-full self-end"
        />
      </div>
    </section>
  );
}
