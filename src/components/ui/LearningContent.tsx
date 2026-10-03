import Image from "next/image";
import type { ReactNode } from "react";
import { toPublicSrc } from "@/lib/publicPath";
import type { LearningContentBlock } from "@/types/content";

/** Renders `code` spans written with backticks. Code is always LTR, even
 *  inside RTL (fa) text, so each span carries dir="ltr". */
function renderInline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, index) =>
    part.length > 2 && part.startsWith("`") && part.endsWith("`") ? (
      <code
        key={index}
        dir="ltr"
        className="bg-surface text-caption text-text-primary rounded px-1 py-0.5 font-mono"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    )
  );
}

export function LearningContent({
  blocks,
}: {
  blocks: LearningContentBlock[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => {
        const normalized =
          typeof block === "string"
            ? ({ type: "paragraph", text: block } as const)
            : block;

        switch (normalized.type) {
          case "paragraph":
            return (
              <p key={index} className="text-body text-text-secondary">
                {renderInline(normalized.text)}
              </p>
            );

          case "heading":
            return normalized.level === 3 ? (
              <h3
                key={index}
                className="text-body text-text-primary mt-2 font-semibold"
              >
                {renderInline(normalized.text)}
              </h3>
            ) : (
              <h2
                key={index}
                className="text-h4 text-text-primary mt-8 font-semibold"
              >
                {renderInline(normalized.text)}
              </h2>
            );

          case "list": {
            const ListTag = normalized.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={`text-body text-text-secondary flex flex-col gap-2 ps-6 ${
                  normalized.ordered ? "list-decimal" : "list-disc"
                }`}
              >
                {normalized.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{renderInline(item)}</li>
                ))}
              </ListTag>
            );
          }

          case "table":
            return (
              <div
                key={index}
                className="border-border overflow-x-auto rounded-lg border"
              >
                <table className="text-small w-full border-collapse text-start">
                  <thead className="bg-surface">
                    <tr>
                      {normalized.headers.map((header, headerIndex) => (
                        <th
                          key={headerIndex}
                          className="border-border text-text-primary border-b px-3 py-2 text-start font-semibold"
                        >
                          {renderInline(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {normalized.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="border-border text-text-secondary border-b px-3 py-2 align-top last:border-b-0"
                          >
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "image":
            return (
              <figure key={index} className="flex flex-col gap-2">
                <div className="border-border bg-surface relative aspect-video overflow-hidden rounded-lg border">
                  <Image
                    src={toPublicSrc(normalized.src)}
                    alt={normalized.alt}
                    fill
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="object-contain"
                  />
                </div>
                {normalized.caption && (
                  <figcaption className="text-caption text-text-secondary">
                    {normalized.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "video":
            return (
              <figure key={index} className="flex flex-col gap-2">
                {/* Native controls: no autoplay, and only metadata is
                    fetched until the visitor presses play. */}
                <video
                  src={toPublicSrc(normalized.src)}
                  poster={
                    normalized.poster ? toPublicSrc(normalized.poster) : undefined
                  }
                  controls
                  preload="metadata"
                  playsInline
                  className="border-border bg-surface w-full rounded-lg border"
                />
                {normalized.caption && (
                  <figcaption className="text-caption text-text-secondary">
                    {normalized.caption}
                  </figcaption>
                )}
              </figure>
            );
        }
      })}
    </div>
  );
}
