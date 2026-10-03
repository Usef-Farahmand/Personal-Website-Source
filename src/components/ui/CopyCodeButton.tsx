"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyCodeButtonProps {
  code: string;
  copyLabel: string;
  copiedLabel: string;
}

export function CopyCodeButton({
  code,
  copyLabel,
  copiedLabel,
}: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission);
      // the code stays selectable, so failing silently is acceptable.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-caption text-text-secondary hover:text-text-primary inline-flex items-center gap-1 font-medium transition-colors"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
    </button>
  );
}
