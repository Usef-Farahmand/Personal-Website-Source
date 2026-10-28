"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import { LineChart } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { ScrollFade } from "@/components/ui/ScrollFade";
import { cn } from "@/lib/cn";
import type { Locale } from "@/types/content";

export interface ChartPoint {
  date: string;
  installs: number | null;
  installsBelow?: number;
  rating: number | null;
  ratingCount: number | null;
}

export interface ChartSeries {
  store: string;
  label: string;
  points: ChartPoint[];
}

type Metric = "installs" | "ratings" | "rating";

/** Fixed per store, never by rank — a filter must not repaint the
 *  survivors. Validated pair (dataviz palette, dark surface #141416). */
const STORE_COLOR: Record<string, string> = {
  googlePlay: "#3987e5",
  bazaar: "#d95926",
};
const FALLBACK_COLOR = "#199e70";

const W = 640;
const H = 260;
const PAD = { top: 16, right: 16, bottom: 32, left: 48 };

function valueOf(point: ChartPoint, metric: Metric): number | null {
  if (metric === "installs") return point.installs;
  if (metric === "ratings") return point.ratingCount;
  return point.rating;
}

/** Snapshots are change points: a value holds until the next one. */
function valueAt(points: ChartPoint[], time: number) {
  let found: ChartPoint | null = null;
  for (const point of points) {
    if (Date.parse(point.date) <= time) found = point;
    else break;
  }
  return found;
}

function niceMax(max: number): number {
  if (max <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(max)));
  const step = [1, 2, 2.5, 5, 10].find((m) => m * exp >= max) ?? 10;
  return step * exp;
}

/**
 * "Store charts" button + popup on project pages: growth over time from
 * the daily snapshot history (store-history.json), per store or all
 * stores together, for installs, number of ratings or average rating.
 * Step lines, because a snapshot is only written when a number changes —
 * the value holds flat until the next one (and up to today).
 */
export function StoreChartsDialog({
  series,
  today,
  locale,
  labels,
}: {
  series: ChartSeries[];
  today: string;
  locale: Locale;
  labels: {
    button: string;
    title: string;
    allStores: string;
    installs: string;
    ratings: string;
    rating: string;
    showTable: string;
    hideTable: string;
    date: string;
    start: string;
    noData: string;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [store, setStore] = useState<string>("all");
  const [metric, setMetric] = useState<Metric>("installs");
  const [showTable, setShowTable] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const number = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        notation: metric === "rating" ? "standard" : "compact",
        maximumFractionDigits: metric === "rating" ? 1 : 1,
      }),
    [locale, metric]
  );
  const dateFormat = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [locale]
  );

  const visible = series.filter(
    (s) => (store === "all" || s.store === store) && s.points.length > 0
  );
  const allDates = visible.flatMap((s) => s.points.map((p) => p.date));
  const firstDate = allDates.length
    ? allDates.reduce((a, b) => (a < b ? a : b))
    : today;

  const end = Date.parse(today);
  let start = Date.parse(firstDate);
  if (end - start < 86400000) start = end - 86400000;

  const maxValue =
    metric === "rating"
      ? 5
      : niceMax(
          Math.max(
            0,
            ...visible.flatMap((s) =>
              s.points.map((p) => valueOf(p, metric) ?? 0)
            )
          )
        );

  const x = (time: number) =>
    PAD.left + ((time - start) / (end - start)) * (W - PAD.left - PAD.right);
  const y = (value: number) =>
    H - PAD.bottom - (value / maxValue) * (H - PAD.top - PAD.bottom);

  const paths = visible.map((s) => {
    const pts = s.points
      .map((p) => ({ time: Date.parse(p.date), value: valueOf(p, metric) }))
      .filter((p): p is { time: number; value: number } => p.value !== null);
    let d = "";
    pts.forEach((p, i) => {
      d +=
        i === 0 ? `M${x(p.time)},${y(p.value)}` : `H${x(p.time)}V${y(p.value)}`;
    });
    if (pts.length) d += `H${x(end)}`;
    return { series: s, d, pts };
  });

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxValue);

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((event.clientX - rect.left) / rect.width) * W;
    const ratio = (px - PAD.left) / (W - PAD.left - PAD.right);
    if (ratio < 0 || ratio > 1) return setHoverTime(null);
    setHoverTime(start + ratio * (end - start));
  }

  const formatValue = (point: ChartPoint | null) => {
    if (!point) return "—";
    if (metric === "installs" && point.installsBelow)
      return `< ${number.format(point.installsBelow)}`;
    const v = valueOf(point, metric);
    return v === null
      ? "—"
      : number.format(v) + (metric === "installs" ? "+" : "");
  };

  const metrics: { key: Metric; label: string }[] = [
    { key: "installs", label: labels.installs },
    { key: "ratings", label: labels.ratings },
    { key: "rating", label: labels.rating },
  ];
  const tableDates = [...new Set(allDates)].sort();

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
        className="border-accent/60 text-text-primary hover:border-accent hover:text-accent inline-flex w-full items-center justify-center gap-2 rounded-md border bg-black/30 px-4 py-2.5 text-sm font-semibold transition-colors"
      >
        <LineChart className="h-4 w-4" aria-hidden="true" />
        {labels.button}
      </button>

      <Overlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={labels.title}
        visuallyHiddenTitle={false}
        contentClassName="max-h-[90vh] w-[calc(100vw-2rem)] p-5 sm:w-[44rem] sm:p-7"
      >
        {/* Filters: one row above the chart. */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {[{ store: "all", label: labels.allStores }, ...series].map((s) => (
            <button
              key={s.store}
              type="button"
              aria-pressed={store === s.store}
              onClick={() => setStore(s.store)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                store === s.store
                  ? "border-accent bg-accent/15 text-text-primary"
                  : "border-border text-text-secondary hover:text-text-primary"
              )}
            >
              {s.store !== "all" && (
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ background: STORE_COLOR[s.store] ?? FALLBACK_COLOR }}
                />
              )}
              {s.label}
            </button>
          ))}
          <span className="bg-border mx-1 hidden h-5 w-px sm:block" />
          {metrics.map((m) => (
            <button
              key={m.key}
              type="button"
              aria-pressed={metric === m.key}
              onClick={() => setMetric(m.key)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                metric === m.key
                  ? "bg-accent/15 text-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="text-text-secondary py-10 text-center text-sm">
            {labels.noData}
          </p>
        ) : (
          <div className="relative" dir="ltr">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="h-auto w-full touch-none"
              role="img"
              aria-label={`${labels.title}: ${metrics.find((m) => m.key === metric)?.label}`}
              onPointerMove={onPointerMove}
              onPointerLeave={() => setHoverTime(null)}
            >
              {ticks.map((t) => (
                <g key={t}>
                  <line
                    x1={PAD.left}
                    x2={W - PAD.right}
                    y1={y(t)}
                    y2={y(t)}
                    stroke="var(--color-border)"
                    strokeWidth={1}
                  />
                  <text
                    x={PAD.left - 8}
                    y={y(t) + 4}
                    textAnchor="end"
                    fontSize={11}
                    fill="var(--color-text-secondary)"
                  >
                    {number.format(t)}
                  </text>
                </g>
              ))}
              {[start, end].map((t, i) => (
                <text
                  key={t}
                  x={x(t)}
                  y={H - 10}
                  textAnchor={i === 0 ? "start" : "end"}
                  fontSize={11}
                  fill="var(--color-text-secondary)"
                >
                  {dateFormat.format(new Date(t))}
                </text>
              ))}
              {paths.map(({ series: s, d, pts }) => {
                const color = STORE_COLOR[s.store] ?? FALLBACK_COLOR;
                return (
                  <g key={s.store}>
                    <path
                      d={d}
                      fill="none"
                      stroke={color}
                      strokeWidth={2}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {pts.map((p) => (
                      <circle
                        key={p.time}
                        cx={x(p.time)}
                        cy={y(p.value)}
                        r={4}
                        fill={color}
                        stroke="var(--color-surface)"
                        strokeWidth={2}
                      />
                    ))}
                  </g>
                );
              })}
              {hoverTime !== null && (
                <line
                  x1={x(hoverTime)}
                  x2={x(hoverTime)}
                  y1={PAD.top}
                  y2={H - PAD.bottom}
                  stroke="var(--color-text-secondary)"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              )}
            </svg>

            {hoverTime !== null && (
              <div
                className="border-border bg-background/95 pointer-events-none absolute top-2 rounded-md border px-3 py-2 text-xs shadow-lg"
                style={{
                  left: `${(x(hoverTime) / W) * 100}%`,
                  transform:
                    x(hoverTime) > W / 2
                      ? "translateX(calc(-100% - 8px))"
                      : "translateX(8px)",
                }}
              >
                <p className="text-text-secondary mb-1">
                  {dateFormat.format(new Date(hoverTime))}
                </p>
                {visible.map((s) => (
                  <p key={s.store} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{
                        background: STORE_COLOR[s.store] ?? FALLBACK_COLOR,
                      }}
                    />
                    <strong className="text-text-primary">
                      {formatValue(valueAt(s.points, hoverTime))}
                    </strong>
                    <span className="text-text-secondary">{s.label}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Legend for two or more series; one series is named by the filter. */}
        {visible.length > 1 && (
          <ul className="mt-3 flex flex-wrap gap-4 text-xs">
            {visible.map((s) => (
              <li
                key={s.store}
                className="text-text-secondary flex items-center gap-1.5"
              >
                <span
                  aria-hidden="true"
                  className="h-0.5 w-4 rounded"
                  style={{ background: STORE_COLOR[s.store] ?? FALLBACK_COLOR }}
                />
                {s.label}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-text-secondary text-xs">
            {labels.start.replace(
              "{date}",
              dateFormat.format(new Date(Date.parse(firstDate)))
            )}
          </p>
          {visible.length > 0 && (
            <button
              type="button"
              onClick={() => setShowTable((v) => !v)}
              className="text-accent hover:text-accent-hover text-xs font-medium"
            >
              {showTable ? labels.hideTable : labels.showTable}
            </button>
          )}
        </div>

        {showTable && visible.length > 0 && (
          <ScrollFade className="mt-3">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="text-text-secondary border-border border-b">
                  <th className="py-1.5 text-start font-medium">
                    {labels.date}
                  </th>
                  {visible.map((s) => (
                    <th key={s.store} className="py-1.5 text-start font-medium">
                      {s.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableDates.map((date) => (
                  <tr key={date} className="border-border border-b">
                    <td className="text-text-secondary py-1.5">
                      {dateFormat.format(new Date(Date.parse(date)))}
                    </td>
                    {visible.map((s) => (
                      <td key={s.store} className="text-text-primary py-1.5">
                        {formatValue(valueAt(s.points, Date.parse(date)))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollFade>
        )}
      </Overlay>
    </>
  );
}
