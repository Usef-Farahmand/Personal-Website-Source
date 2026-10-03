import { CopyCodeButton } from "@/components/ui/CopyCodeButton";
import type { LearningCodeSnippet } from "@/types/content";

interface CodeBlockProps {
  snippet: LearningCodeSnippet;
  copyLabel: string;
  copiedLabel: string;
}

/**
 * Plain, dependency-free code block. Code is always left-to-right, even
 * inside the RTL (fa) layout, so `dir="ltr"` is forced on the whole figure.
 */
export function CodeBlock({ snippet, copyLabel, copiedLabel }: CodeBlockProps) {
  return (
    <figure
      dir="ltr"
      className="border-border bg-surface overflow-hidden rounded-lg border"
    >
      <figcaption className="border-border flex items-center justify-between gap-4 border-b px-4 py-2">
        <span className="text-caption text-text-secondary font-mono">
          {snippet.filename ?? snippet.language}
        </span>
        <span className="flex items-center gap-4">
          {snippet.filename && (
            <span className="text-caption text-text-secondary">
              {snippet.language}
            </span>
          )}
          <CopyCodeButton
            code={snippet.code}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
          />
        </span>
      </figcaption>
      <pre className="text-small text-text-primary overflow-x-auto p-4 leading-relaxed">
        <code className="font-mono">{snippet.code}</code>
      </pre>
    </figure>
  );
}
