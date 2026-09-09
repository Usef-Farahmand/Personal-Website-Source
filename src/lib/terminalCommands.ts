/**
 * Command parser for the interactive 404 "developer terminal".
 *
 * Deliberately framework-free (no React/next-intl imports) so the command
 * table and its behavior are easy to read and reason about in one place —
 * see components/sections/NotFoundTerminal.tsx for the UI that renders
 * this, and history/focus/DOM concerns.
 *
 * SAFETY: this is a UI simulation only. Nothing here ever executes,
 * evaluates, or shells out to real input — `executeCommand` is a pure
 * string-in, data-out switch over a fixed, predefined command table. A
 * command that doesn't match anything below just falls through to the
 * "command not found" branch; there is no eval, no dynamic property
 * access on user input, and no code path that reaches Node.js or the
 * network.
 *
 * Language: every line this module returns is intentionally English,
 * regardless of site locale — this mirrors real developer tooling (git,
 * npm, a shell prompt) which stays English-language even inside
 * otherwise-localized products, and avoids forcing bidi text into
 * monospace-aligned ASCII output (dot leaders, progress bars) that only
 * reads correctly left-to-right. The page chrome around the terminal
 * (heading, "Go home" / "View projects" links) still uses the visitor's
 * locale — see [locale]/not-found.tsx.
 */

/** Every command below that actually navigates somewhere. Doubles as the
 *  source of truth for `ls` and `help`'s directory listing, so the three
 *  can never drift out of sync — every path here is a real route that
 *  already exists in this project (src/app/[locale]/*), never invented. */
export interface TerminalRoute {
  id: string;
  path: string;
  description: string;
}

export const TERMINAL_ROUTES: TerminalRoute[] = [
  { id: "home", path: "/", description: "Return to the homepage" },
  { id: "about", path: "/about", description: "About the developer" },
  { id: "projects", path: "/projects", description: "Browse all projects" },
  {
    id: "games",
    path: "/projects?category=game",
    description: "Browse game projects",
  },
  { id: "articles", path: "/articles", description: "Read the articles" },
  {
    id: "experience",
    path: "/experience",
    description: "View work experience",
  },
  { id: "skills", path: "/skills", description: "View skills & tech stack" },
  {
    id: "achievements",
    path: "/achievements",
    description: "View achievements",
  },
  {
    id: "exploring",
    path: "/exploring",
    description: "See what's being explored",
  },
  {
    id: "recommendations",
    path: "/recommendations",
    description: "Read recommendations",
  },
  { id: "contact", path: "/#contact", description: "Contact information" },
];

const FIXED_COMMANDS: { id: string; description: string }[] = [
  { id: "help", description: "Show available commands" },
  { id: "ls", description: "List available directories" },
  { id: "pwd", description: "Show current location" },
  { id: "whoami", description: "Identify the developer" },
  { id: "status", description: "System status" },
  { id: "date", description: "Show current date & time" },
  { id: "coffee", description: "Important developer resources" },
  { id: "clear", description: "Clear the terminal" },
];

/** Real, already-authored facts about the developer, passed in from the
 *  server component (src/content/site) rather than hardcoded here — see
 *  the "Do not invent personal information" requirement. */
export interface CommandContext {
  professionalTitle: string;
  highlights: string[];
}

export interface CommandResult {
  /** Lines to print to the terminal output. Omit for a pure side effect
   *  (e.g. `clear`). */
  lines?: string[];
  /** Wipes the terminal's command history/output. */
  clear?: boolean;
  /** A real, already-existing app route (see TERMINAL_ROUTES) to
   *  navigate to after the lines above are shown. */
  navigateTo?: string;
  /** A harmless cosmetic flourish the UI layer can react to. */
  effect?: "konami";
}

function formatTerminalDate(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function buildHelpLines(): string[] {
  const entries = [
    ...TERMINAL_ROUTES.map(({ id, description }) => ({ id, description })),
    ...FIXED_COMMANDS,
  ];
  const width = Math.max(...entries.map((entry) => entry.id.length)) + 3;
  const commandLines = entries.map(
    ({ id, description }) => `  ${id.padEnd(width)}${description}`
  );

  return [
    "Available commands:",
    "",
    ...commandLines,
    "",
    "Tip: press \u2191 / \u2193 to reuse a previous command.",
  ];
}

function buildWhoAmILines(ctx: CommandContext): string[] {
  return [
    "Developer detected.",
    "",
    ctx.professionalTitle,
    ...ctx.highlights,
    "",
    "Status: probably debugging something.",
  ];
}

const STATUS_LINES = [
  "SYSTEM STATUS",
  "",
  "Website ........ ONLINE",
  "Portfolio ...... ONLINE",
  "Terminal ....... ONLINE",
  "Coffee ......... REQUIRED",
  "Missing page ... NOT FOUND",
];

const COFFEE_LINES = [
  "Checking coffee supply...",
  "",
  "\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591 87%",
  "",
  "Status: ACCEPTABLE.",
  "You may continue debugging.",
];

const SUDO_LINES = [
  "Nice try.",
  "This terminal does not grant root access.",
];

const KONAMI_LINES = [
  "Konami code accepted.",
  "+30 lives. No real effect, just vibes.",
];

/** ls lists directories, not "home" (that's the root, not a subfolder). */
export function listDirectories(): string[] {
  return TERMINAL_ROUTES.filter((route) => route.id !== "home").map(
    (route) => `${route.id}/`
  );
}

/**
 * Parses and runs a single command line. Pure and synchronous — any
 * navigation is only *described* via `navigateTo`; the caller (a React
 * component with access to the router) is responsible for actually
 * pushing the route once the output above has had a moment to render.
 */
export function executeCommand(
  rawInput: string,
  ctx: CommandContext
): CommandResult {
  const trimmed = rawInput.trim();
  if (!trimmed) return {};

  const [command] = trimmed.toLowerCase().split(/\s+/);

  const route = TERMINAL_ROUTES.find((entry) => entry.id === command);
  if (route) {
    return {
      lines: [`Locating '${route.id}'... found.`, `Opening ${route.path}`],
      navigateTo: route.path,
    };
  }

  switch (command) {
    case "help":
      return { lines: buildHelpLines() };
    case "clear":
      return { clear: true };
    case "ls":
      return { lines: listDirectories() };
    case "pwd":
      return { lines: ["/home/usef"] };
    case "whoami":
      return { lines: buildWhoAmILines(ctx) };
    case "status":
      return { lines: STATUS_LINES };
    case "date":
      return { lines: [formatTerminalDate()] };
    case "coffee":
      return { lines: COFFEE_LINES };
    case "sudo":
      return { lines: SUDO_LINES };
    case "404":
      return { lines: ["Yes.", "It's definitely a 404."] };
    case "konami":
      return { lines: KONAMI_LINES, effect: "konami" };
    default:
      return {
        lines: [
          `command not found: ${command}`,
          "Type 'help' to see available commands.",
        ],
      };
  }
}

export type TerminalLineVariant = "default" | "muted" | "accent" | "error";

/**
 * Cheap, line-content heuristic used to color output — a real terminal
 * doesn't tag every line with a style, it just renders conventions (a
 * prompt starts with `$`, an error starts with `ERROR`). Shared between
 * the boot sequence and command output so both read consistently.
 */
export function getLineVariant(line: string): TerminalLineVariant {
  if (!line) return "default";
  if (line.startsWith("$")) return "accent";
  if (line.startsWith("ERROR") || line.startsWith("command not found"))
    return "error";
  if (line.startsWith("Locating") || line.startsWith("Opening"))
    return "muted";
  return "default";
}

/** The Konami code, as key names from a native KeyboardEvent — an
 *  additional, purely optional way to trigger the same easter egg as
 *  typing "konami", for anyone who tries the classic sequence out of
 *  habit. */
export const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
