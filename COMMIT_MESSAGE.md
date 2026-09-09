fix(dev): swallow known Turbopack negative-timestamp perf.measure bug

Add `src/instrumentation-client.ts`, loaded automatically by Next.js
before hydration, that wraps `performance.measure()` in development
only and swallows the specific "negative time stamp" / "end cannot be
negative" failure.

This works around an open upstream bug (vercel/next.js#86060) in React
19.2's dev-only "Performance Tracks" instrumentation under Turbopack:
a component's internal end-timestamp defaults to -Infinity and isn't
always updated before `performance.measure()` runs if the component's
render is interrupted by a fast, cascading state update — exactly what
the 404 terminal's boot "typing" animation does on every timer tick.
The browser then rejects the negative duration and Turbopack's dev
overlay surfaces it as an unhandled runtime error, even though nothing
is actually broken.

The patch is scoped tightly:
- Guarded behind `NODE_ENV === "development"`, so it's fully absent
  from the code path production builds ship (verified with a clean
  `next build`).
- Only catches errors matching the exact negative-timestamp wording;
  any other `performance.measure()` failure still throws normally.

No application logic changed. Delete this file once the upstream React
bug is fixed.
