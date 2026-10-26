/**
 * The loading screen's backdrop: a dark game-dev room drawn as inline SVG
 * (no image request, crisp at any size). Two art-directed compositions —
 * landscape (1600×900) and portrait (900×1600) — are anchored to the
 * bottom with `slice`, so the desk line stays behind the characters while
 * the sides or top crop away on other aspect ratios. styles/loader.css
 * shows the one that matches the viewport's orientation.
 *
 * Deliberately quiet: static, low contrast, softly blurred. The screens
 * share two <symbol>s (abstract code, an engine viewport) defined once.
 */

// [indent, width, tone] per line of abstract "code".
const CODE_LINES: [number, number, 0 | 1 | 2][] = [
  [0, 120, 0],
  [16, 170, 1],
  [16, 96, 2],
  [32, 150, 1],
  [32, 74, 0],
  [16, 58, 1],
  [0, 0, 1],
  [0, 140, 2],
  [16, 190, 1],
  [32, 110, 0],
  [32, 160, 1],
  [16, 64, 2],
  [0, 40, 1],
];
const CODE_TONES = ["#ff914d", "#8a8f9c", "#6f86c9"];

function Defs() {
  return (
    <svg className="site-loader__defs" width="0" height="0" aria-hidden="true">
      <defs>
        <radialGradient id="loader-wall" cx="50%" cy="58%" r="75%">
          <stop offset="0" stopColor="#1d1512" />
          <stop offset="0.55" stopColor="#100c0c" />
          <stop offset="1" stopColor="#060506" />
        </radialGradient>
        <linearGradient id="loader-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141820" />
          <stop offset="1" stopColor="#0c0e13" />
        </linearGradient>
        <linearGradient id="loader-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1515" />
          <stop offset="1" stopColor="#0b0909" />
        </linearGradient>
        <radialGradient id="loader-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff914d" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff914d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="loader-cool" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#7d9bff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#7d9bff" stopOpacity="0" />
        </radialGradient>
        <filter id="loader-soften" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <filter id="loader-far" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="4" />
        </filter>

        <symbol id="loader-code" viewBox="0 0 300 180">
          {CODE_LINES.map(([indent, width, tone], i) =>
            width ? (
              <rect
                key={i}
                x={18 + indent}
                y={16 + i * 12}
                width={width}
                height={5}
                rx={2.5}
                fill={CODE_TONES[tone]}
                opacity={tone === 1 ? 0.5 : 0.7}
              />
            ) : null
          )}
          <rect
            x="18"
            y="16"
            width="2"
            height="148"
            fill="#ffffff"
            opacity="0.05"
          />
        </symbol>

        <symbol id="loader-engine" viewBox="0 0 300 180">
          {/* hierarchy panel */}
          <rect x="0" y="0" width="70" height="180" fill="#0f1218" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect
              key={i}
              x={10 + (i % 3) * 6}
              y={14 + i * 14}
              width={40 - (i % 3) * 8}
              height={4}
              rx={2}
              fill={i === 2 ? "#ff914d" : "#8a8f9c"}
              opacity={i === 2 ? 0.7 : 0.4}
            />
          ))}
          {/* scene viewport: horizon grid + a selected cube */}
          <g stroke="#8a8f9c" strokeOpacity="0.22" strokeWidth="1">
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`h${i}`}
                x1="70"
                x2="300"
                y1={96 + i * i * 5}
                y2={96 + i * i * 5}
              />
            ))}
            {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
              <line
                key={`v${i}`}
                x1={185 + i * 12}
                y1="96"
                x2={185 + i * 52}
                y2="150"
              />
            ))}
          </g>
          <g
            fill="none"
            stroke="#ff914d"
            strokeOpacity="0.75"
            strokeWidth="1.6"
          >
            <path d="M170 70 l16 -9 l16 9 v19 l-16 9 l-16 -9 z" />
            <path d="M170 70 l16 9 l16 -9 M186 79 v19" />
          </g>
          {/* timeline */}
          <rect x="70" y="150" width="230" height="30" fill="#0f1218" />
          <rect
            x="82"
            y="162"
            width="120"
            height="4"
            rx="2"
            fill="#6f86c9"
            opacity="0.55"
          />
          <rect
            x="150"
            y="156"
            width="2"
            height="18"
            fill="#ff914d"
            opacity="0.8"
          />
        </symbol>
      </defs>
    </svg>
  );
}

function Monitor({
  x,
  y,
  width,
  height,
  screen,
  stand = true,
  standHeight = 40,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  screen: "code" | "engine";
  stand?: boolean;
  standHeight?: number;
}) {
  const inset = Math.max(6, width * 0.02);
  return (
    <g>
      {stand && (
        <>
          <rect
            x={x + width / 2 - 8}
            y={y + height}
            width={16}
            height={standHeight}
            fill="#0a0809"
          />
          <rect
            x={x + width / 2 - width * 0.16}
            y={y + height + standHeight - 6}
            width={width * 0.32}
            height={6}
            rx={3}
            fill="#0a0809"
          />
        </>
      )}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill="#070607"
        stroke="#ffffff"
        strokeOpacity="0.05"
      />
      <rect
        x={x + inset}
        y={y + inset}
        width={width - inset * 2}
        height={height - inset * 2}
        rx={3}
        fill="url(#loader-screen)"
      />
      <use
        href={screen === "code" ? "#loader-code" : "#loader-engine"}
        x={x + inset}
        y={y + inset}
        width={width - inset * 2}
        height={height - inset * 2}
        preserveAspectRatio="xMinYMin slice"
      />
    </g>
  );
}

function LandscapeRoom() {
  return (
    <svg
      className="site-loader__room site-loader__room--landscape"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
    >
      <rect width="1600" height="900" fill="url(#loader-wall)" />
      {/* acoustic panels on the back wall */}
      <g filter="url(#loader-far)" opacity="0.55">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={150 + i * 230}
            y={60}
            width={190}
            height={400}
            rx={6}
            fill="#ffffff"
            opacity="0.025"
          />
        ))}
        <rect x="150" y="190" width="300" height="6" rx="3" fill="#2a2120" />
        <rect x="180" y="150" width="26" height="40" rx="2" fill="#3b2c26" />
        <rect x="212" y="158" width="22" height="32" rx="2" fill="#2c2a33" />
        <rect
          x="246"
          y="146"
          width="48"
          height="44"
          rx="4"
          fill="#ff914d"
          opacity="0.18"
        />
      </g>
      {/* screen glow spilling onto the wall */}
      <ellipse cx="290" cy="420" rx="300" ry="190" fill="url(#loader-cool)" />
      <ellipse cx="1310" cy="420" rx="300" ry="190" fill="url(#loader-cool)" />
      <g filter="url(#loader-soften)" opacity="0.8">
        <Monitor
          x={110}
          y={300}
          width={360}
          height={210}
          screen="code"
          standHeight={32}
        />
        <Monitor
          x={560}
          y={240}
          width={480}
          height={250}
          screen="code"
          standHeight={52}
        />
        <Monitor
          x={1130}
          y={300}
          width={360}
          height={210}
          screen="engine"
          standHeight={32}
        />
        {/* desk lamp */}
        <path
          d="M58 542 h56 l-8 -8 h-40 z M84 534 l18 -120 l40 -22"
          stroke="#141011"
          strokeWidth="7"
          fill="none"
        />
        <path d="M128 384 l44 -10 l6 30 l-46 4 z" fill="#1b1414" />
        <ellipse
          cx="160"
          cy="420"
          rx="90"
          ry="40"
          fill="url(#loader-warm)"
          opacity="0.6"
        />
        {/* PC tower with a warm fan ring */}
        <rect
          x="1400"
          y="560"
          width="110"
          height="240"
          rx="8"
          fill="#0d0b0c"
          stroke="#ffffff"
          strokeOpacity="0.04"
        />
        <circle
          cx="1455"
          cy="640"
          r="30"
          fill="none"
          stroke="#ff914d"
          strokeOpacity="0.5"
          strokeWidth="3"
        />
        <circle
          cx="1455"
          cy="720"
          r="30"
          fill="none"
          stroke="#ff914d"
          strokeOpacity="0.3"
          strokeWidth="3"
        />
      </g>
      {/* desk */}
      <rect
        x="40"
        y="542"
        width="1520"
        height="22"
        rx="4"
        fill="url(#loader-desk)"
      />
      <rect
        x="40"
        y="542"
        width="1520"
        height="1.5"
        fill="#ff914d"
        opacity="0.28"
      />
      {/* LED strip under the desk */}
      <ellipse
        cx="800"
        cy="575"
        rx="760"
        ry="34"
        fill="url(#loader-warm)"
        opacity="0.55"
      />
      <rect
        x="0"
        y="564"
        width="1600"
        height="336"
        fill="#070606"
        opacity="0.6"
      />
    </svg>
  );
}

function PortraitRoom() {
  return (
    <svg
      className="site-loader__room site-loader__room--portrait"
      viewBox="0 0 900 1600"
      preserveAspectRatio="xMidYMax slice"
    >
      <rect width="900" height="1600" fill="url(#loader-wall)" />
      <g filter="url(#loader-far)" opacity="0.55">
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={110 + i * 240}
            y={360}
            width={200}
            height={520}
            rx={6}
            fill="#ffffff"
            opacity="0.025"
          />
        ))}
      </g>
      <ellipse cx="450" cy="900" rx="420" ry="220" fill="url(#loader-cool)" />
      <g filter="url(#loader-soften)" opacity="0.8">
        <Monitor
          x={-60}
          y={880}
          width={230}
          height={150}
          screen="engine"
          standHeight={50}
        />
        <Monitor
          x={200}
          y={790}
          width={500}
          height={270}
          screen="code"
          standHeight={50}
        />
        <Monitor
          x={730}
          y={880}
          width={230}
          height={150}
          screen="code"
          standHeight={50}
        />
      </g>
      <rect
        x="-20"
        y="1080"
        width="940"
        height="20"
        rx="4"
        fill="url(#loader-desk)"
      />
      <rect
        x="-20"
        y="1080"
        width="940"
        height="1.5"
        fill="#ff914d"
        opacity="0.28"
      />
      <ellipse
        cx="450"
        cy="1110"
        rx="460"
        ry="40"
        fill="url(#loader-warm)"
        opacity="0.55"
      />
      <rect
        x="0"
        y="1100"
        width="900"
        height="500"
        fill="#070606"
        opacity="0.6"
      />
    </svg>
  );
}

export function LoaderRoom() {
  return (
    <div className="site-loader__backdrop">
      <Defs />
      <LandscapeRoom />
      <PortraitRoom />
      <div className="site-loader__glow" />
      <div className="site-loader__vignette" />
    </div>
  );
}
