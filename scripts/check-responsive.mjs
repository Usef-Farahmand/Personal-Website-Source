/**
 * Responsive / horizontal-overflow check across every route, locale and a
 * range of viewport sizes (phones → desktop), using real Chromium.
 *
 * Usage (dev server or `next start` already running):
 *   npm i -D playwright && npx playwright install chromium   # once
 *   BASE_URL=http://localhost:3000 node scripts/check-responsive.mjs
 *   SCREENSHOTS=1 node scripts/check-responsive.mjs           # also save PNGs to .responsive-report/
 *
 * Routes come from /sitemap.xml (all locales, all project/learning slugs)
 * plus a deliberately missing page for the 404 view.
 *
 * What counts as a failure, per route × viewport:
 *   - the page scrolls horizontally (scrollWidth > viewport width), or
 *   - on a mobile viewport the browser expanded the layout viewport
 *     (window.innerWidth !== requested width) — this is the "page zoomed
 *     out and pushed into a corner" symptom.
 * Offending elements are listed so the cause is obvious.
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const SHOTS = process.env.SCREENSHOTS === "1";
const OUT = ".responsive-report";

const VIEWPORTS = [
  { name: "phone-320", width: 320, height: 568, mobile: true },
  { name: "phone-360", width: 360, height: 740, mobile: true },
  { name: "phone-375", width: 375, height: 667, mobile: true },
  { name: "phone-390", width: 390, height: 844, mobile: true },
  { name: "phone-412", width: 412, height: 915, mobile: true },
  { name: "phone-430", width: 430, height: 932, mobile: true },
  { name: "phone-landscape-844", width: 844, height: 390, mobile: true },
  { name: "tablet-600", width: 600, height: 960, mobile: true },
  { name: "tablet-768", width: 768, height: 1024, mobile: true },
  { name: "tablet-820", width: 820, height: 1180, mobile: true },
  { name: "laptop-1024", width: 1024, height: 768, mobile: false },
  { name: "desktop-1280", width: 1280, height: 800, mobile: false },
  { name: "desktop-1440", width: 1440, height: 900, mobile: false },
];

async function routes() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const unique = [...new Set(paths)];
  const locales = [...new Set(unique.map((p) => p.split("/")[1]))];
  return [...unique, ...locales.map((l) => `/${l}/this-page-does-not-exist`)];
}

/** Runs in the page: elements sticking out past the viewport horizontally
 *  that are not clipped/scrolled by an ancestor. */
function findOverflowers(vw) {
  const clips = (el) => {
    const s = getComputedStyle(el);
    return ["hidden", "auto", "scroll", "clip"].includes(s.overflowX);
  };
  const out = [];
  for (const el of document.body.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right <= vw + 1 && r.left >= -1) continue;
    let clipped = false;
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      if (clips(p)) { clipped = true; break; }
    }
    if (clipped) continue;
    const pos = getComputedStyle(el).position;
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") : "";
    out.push(`${el.tagName.toLowerCase()}${id}${cls} [${pos}] left=${Math.round(r.left)} right=${Math.round(r.right)}`);
    if (out.length >= 5) break;
  }
  return out;
}

const browser = await chromium.launch();
const list = await routes();
if (SHOTS) mkdirSync(OUT, { recursive: true });
let failures = 0;
let checks = 0;

for (const vp of VIEWPORTS) {
  const base = vp.mobile ? devices["Pixel 7"] : {};
  const ctx = await browser.newContext({
    ...base,
    viewport: { width: vp.width, height: vp.height },
    screen: { width: vp.width, height: vp.height },
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  const page = await ctx.newPage();
  for (const path of list) {
    checks++;
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    // Trigger below-the-fold reveal animations / lazy content.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    const m = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.scrollingElement.scrollWidth,
      dir: document.documentElement.dir,
    }));
    const zoomedOut = vp.mobile && m.innerWidth !== vp.width;
    const overflow = m.scrollWidth > vp.width + 1;
    if (zoomedOut || overflow) {
      failures++;
      const culprits = await page.evaluate(findOverflowers, vp.width);
      console.log(`FAIL ${vp.name.padEnd(20)} ${path}  (${m.dir}) innerWidth=${m.innerWidth} scrollWidth=${m.scrollWidth}`);
      for (const c of culprits) console.log(`       ↳ ${c}`);
    }
    if (SHOTS) {
      const file = `${OUT}/${vp.name}${path.replace(/\//g, "_")}.png`;
      await page.screenshot({ path: file, fullPage: true });
    }
  }
  await ctx.close();
}
await browser.close();
console.log(`\n${checks - failures}/${checks} route×viewport checks passed.`);
process.exit(failures ? 1 : 0);
