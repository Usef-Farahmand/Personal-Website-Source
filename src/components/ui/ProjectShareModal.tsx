"use client";

import Image from "next/image";
import { useId, useRef, useState, type ComponentType } from "react";
import { Check, Link2 } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { BrandLogo } from "@/components/ui/BrandLogo";
import {
  FacebookIcon,
  LinkedInIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/ui/icons";
import { shareUrl, type SharePlatform } from "@/lib/projectShare";
import { cn } from "@/lib/cn";

const PLATFORMS: {
  id: SharePlatform;
  name: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { id: "x", name: "X", Icon: XIcon },
  { id: "linkedin", name: "LinkedIn", Icon: LinkedInIcon },
  { id: "telegram", name: "Telegram", Icon: TelegramIcon },
  { id: "whatsapp", name: "WhatsApp", Icon: WhatsAppIcon },
  { id: "facebook", name: "Facebook", Icon: FacebookIcon },
];

export interface ProjectShareLabels {
  title: string;
  close: string;
  messageLabel: string;
  messageHint: string;
  copyLink: string;
  copied: string;
  copyFailed: string;
  /** "{platform}" is replaced with the platform name. */
  shareOn: string;
  opensInNewTab: string;
}

export interface ProjectShareData {
  title: string;
  /** Canonical, absolute project URL (current locale). */
  url: string;
  domain: string;
  imageUrl?: string;
  /** Default message, already localized for this project. */
  message: string;
}

/**
 * "Share this project" dialog: a small preview (cover, title, domain), an
 * editable message, and links to share on X, LinkedIn, Telegram,
 * WhatsApp and Facebook, plus Copy link. Built on Overlay (focus trap,
 * Escape, backdrop click, focus return). The body only exists while the
 * dialog is open, so reopening starts again from the default message.
 */
export function ProjectShareModal({
  isOpen,
  onClose,
  project,
  labels,
}: {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectShareData;
  labels: ProjectShareLabels;
}) {
  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      title={labels.title}
      visuallyHiddenTitle={false}
      closeLabel={labels.close}
      contentClassName="max-h-[calc(100dvh-2rem)] rounded-2xl sm:w-[32rem] lg:w-[34rem]"
    >
      <ShareBody project={project} labels={labels} />
    </Overlay>
  );
}

type CopyState = "idle" | "copied" | "failed";

function ShareBody({
  project,
  labels,
}: {
  project: ProjectShareData;
  labels: ProjectShareLabels;
}) {
  const [message, setMessage] = useState(project.message);
  const [copy, setCopy] = useState<CopyState>("idle");
  const bodyRef = useRef<HTMLDivElement>(null);
  const messageId = useId();

  async function copyLink() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(project.url);
      ok = true;
    } catch {
      // Clipboard API blocked: copy from a temporary, off-screen field
      // (inside the dialog, so the focus trap allows it).
      const field = document.createElement("textarea");
      field.value = project.url;
      field.setAttribute("readonly", "");
      field.className = "sr-only";
      (bodyRef.current ?? document.body).appendChild(field);
      field.select();
      ok = document.execCommand("copy");
      field.remove();
    }
    setCopy(ok ? "copied" : "failed");
    if (ok) window.setTimeout(() => setCopy("idle"), 2500);
  }

  return (
    <div ref={bodyRef} className="flex flex-col gap-5">
      {/* Preview */}
      <div className="border-border bg-background/60 flex items-center gap-4 rounded-xl border p-3">
        <div className="bg-surface relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt=""
              fill
              sizes="7rem"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center">
              <BrandLogo size={28} className="opacity-30" />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-text-primary truncate font-semibold">
            {project.title}
          </p>
          <p
            dir="ltr"
            className="text-text-secondary truncate text-sm rtl:text-right"
          >
            {project.domain}
          </p>
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor={messageId}
          className="text-text-primary text-sm font-semibold"
        >
          {labels.messageLabel}
        </label>
        <textarea
          id={messageId}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          dir="auto"
          className="border-border bg-background text-text-primary focus:border-accent/60 w-full resize-y rounded-lg border px-3 py-2.5 text-sm leading-relaxed outline-none"
        />
        <p className="text-text-secondary text-xs">{labels.messageHint}</p>
      </div>

      {/* Actions */}
      <ul className="grid grid-cols-3 gap-2">
        {PLATFORMS.map(({ id, name, Icon }) => (
          <li key={id}>
            <a
              href={shareUrl(id, project.url, message)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${labels.shareOn.replace("{platform}", name)} (${labels.opensInNewTab})`}
              className="border-border bg-surface hover:border-accent/60 hover:text-accent text-text-primary flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-medium transition-colors"
            >
              <Icon className="h-5 w-5" />
              {name}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={copyLink}
            className={cn(
              "flex min-h-16 w-full flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-medium transition-colors",
              copy === "copied"
                ? "border-accent/60 bg-accent/10 text-accent"
                : "border-border bg-surface text-text-primary hover:border-accent/60 hover:text-accent"
            )}
          >
            {copy === "copied" ? (
              <Check className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Link2 className="h-5 w-5" aria-hidden="true" />
            )}
            {copy === "copied" ? labels.copied : labels.copyLink}
          </button>
        </li>
      </ul>

      <p
        role="status"
        className={cn(
          "text-xs",
          copy === "failed" ? "text-red-400" : "sr-only"
        )}
      >
        {copy === "copied"
          ? labels.copied
          : copy === "failed"
            ? labels.copyFailed
            : ""}
      </p>

      {/* When copying failed: the link, ready to select and copy by hand. */}
      {copy === "failed" && (
        <input
          readOnly
          dir="ltr"
          value={project.url}
          aria-label={labels.copyLink}
          onFocus={(e) => e.currentTarget.select()}
          className="border-border bg-background text-text-primary w-full rounded-lg border px-3 py-2 font-mono text-xs"
        />
      )}
    </div>
  );
}
