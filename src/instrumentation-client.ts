/**
 * Dev-only workaround for a known upstream bug: React 19.2's internal
 * "Performance Tracks" dev instrumentation initializes a component's end
 * timestamp to -Infinity and doesn't always update it before calling
 * `performance.measure()`, if a component's render is interrupted by a
 * fast, cascading state update (exactly what our 404 terminal's boot
 * "typing" animation does on every timer tick). That produces a negative
 * duration, which the browser rejects and Turbopack's dev overlay
 * surfaces as an unhandled runtime error:
 *
 *   Performance.measure: Given attribute end cannot be negative
 *
 * Tracked upstream at https://github.com/vercel/next.js/issues/86060
 * (open as of this writing). It is purely a dev-time instrumentation
 * artifact — the throwing code lives in the `*.development.js` bundle,
 * which production builds exclude entirely, so this never reaches real
 * users and never runs in `next build` / `next start`.
 *
 * This patch only swallows that exact failure mode; any other
 * `performance.measure()` error (a real bug in our own instrumentation,
 * if we ever add any) still throws normally. Delete this file once the
 * upstream issue is fixed.
 */
if (process.env.NODE_ENV === "development") {
  const originalMeasure = performance.measure.bind(performance);

  performance.measure = ((...args: Parameters<typeof originalMeasure>) => {
    try {
      return originalMeasure(...args);
    } catch (error) {
      const isNegativeTimestampBug =
        error instanceof Error &&
        /negative/i.test(error.message) &&
        /time.?stamp|end/i.test(error.message);

      if (isNegativeTimestampBug) {
        return undefined as unknown as PerformanceMeasure;
      }

      throw error;
    }
  }) as typeof performance.measure;
}
