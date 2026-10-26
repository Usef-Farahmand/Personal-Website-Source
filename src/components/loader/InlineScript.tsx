/**
 * A script that runs synchronously while the HTML is parsed — before the
 * first paint — on full page loads. React warns when rendering produces a
 * <script> on the client, so it's emitted as executable on the server and
 * inert (text/plain) on the client, with suppressHydrationWarning covering
 * the type difference. Per Next's "Preventing flash before hydration"
 * guide.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
