/**
 * Renders a JSON-LD `<script>` tag for the given structured-data object.
 * A tiny shared component rather than inlining `<script>` at each call
 * site, so every JSON-LD block gets the same `dangerouslySetInnerHTML` +
 * `type="application/ld+json"` treatment consistently.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
