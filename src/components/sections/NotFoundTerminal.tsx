"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import {
  executeCommand,
  getLineVariant,
  listDirectories,
  KONAMI_SEQUENCE,
  type CommandContext,
  type TerminalLineVariant,
} from "@/lib/terminalCommands";

interface NotFoundTerminalProps {
  professionalTitle: string;
  highlights: string[];
  goHomeLabel: string;
  viewProjectsLabel: string;
}

interface TerminalEntry {
  /** Stable identity for this entry, independent of its position in the
   *  `entries` array — needed because the print loop below must be able
   *  to find *its own* entry even if another entry gets appended after
   *  it (see `entryIdCounterRef`). */
  id: number;
  /** The raw line the visitor "typed" (empty for system-generated
   *  entries like the Konami easter egg). */
  input: string;
  output: string[];
}

/** The command line "typed" during boot, revealed one real character at a
 *  time via JS (see the boot effect below) — not a CSS trick, so timing
 *  is exact and independent of any animation cascade quirks. */
const BOOT_COMMAND_LINE = "$ locate --target requested-page";

/** Everything printed after the typed command — short on purpose (a real
 *  shell doesn't narrate every step, it just runs the command and prints
 *  the result), and each line lands on its own JS timer tick, not a CSS
 *  stagger. Reuses listDirectories() (trimmed) so the boot "search" can
 *  never list different directories than the real `ls` command. */
const BOOT_OUTPUT_LINES: string[] = [
  "",
  "Searching filesystem...",
  "",
  ...listDirectories().slice(0, 5),
  "",
  "ERROR: target not found",
];

/** Milliseconds per typed character / per printed line — tuned short so
 *  the whole boot sequence reads as quick, snappy terminal output rather
 *  than a slow scripted intro. */
const TYPE_CHAR_MS = 18;
const PRINT_LINE_MS = 55;
const COMMAND_TO_OUTPUT_PAUSE_MS = 150;

const LINE_VARIANT_CLASS: Record<TerminalLineVariant, string> = {
  default: "text-text-primary",
  muted: "text-text-secondary",
  accent: "text-accent",
  error: "text-error",
};

function TerminalLine({ text }: { text: string }) {
  // Defensive: `text` should always be a string, but a stray undefined
  // (e.g. from a transient state race) must render as a blank line, not
  // crash the page.
  if (!text) return <div className="h-[1.4em]" aria-hidden="true" />;
  return (
    <div
      className={cn(
        "animate-[terminal-line-in_180ms_ease-out] whitespace-pre-wrap",
        LINE_VARIANT_CLASS[getLineVariant(text)]
      )}
    >
      {text}
    </div>
  );
}

/** Solid blinking block, styled like a real terminal cursor — used only
 *  next to the boot sequence's typed command line while it's actively
 *  "typing"; the live prompt below hands off to a real <input>'s native
 *  caret once boot finishes. */
function BlockCursor() {
  return (
    <span
      aria-hidden="true"
      className="bg-accent ms-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] align-middle"
      style={{ animation: "terminal-cursor-blink 1s steps(1, end) infinite" }}
    />
  );
}

/**
 * Interactive 404 terminal. The boot sequence — the typed command line,
 * then each output line — is driven by real JS timers, not a CSS
 * stagger, so it genuinely types and prints line-by-line rather than
 * fading a pre-rendered block in. That's a deliberate tradeoff: without
 * JavaScript, this box shows only a blinking cursor (the sequence never
 * starts) — but the page's actual 404 message, description, and "Go
 * home" / "View projects" links all live outside this component in
 * [locale]/not-found.tsx and are never gated behind it, so a no-JS
 * visitor still lands somewhere useful. `prefers-reduced-motion` skips
 * the timer sequence entirely and shows the finished state immediately.
 *
 * Security: user input is never executed. Every keystroke only ever
 * reaches `executeCommand` (a pure string-in/data-out switch — see
 * lib/terminalCommands.ts), which returns lines to print and, for a
 * handful of predefined, real app routes, a path to navigate to. There
 * is no eval, no dynamic code execution, and no server round-trip.
 */
export function NotFoundTerminal({
  professionalTitle,
  highlights,
  goHomeLabel,
  viewProjectsLabel,
}: NotFoundTerminalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const recentKeysRef = useRef<string[]>([]);

  const [typedCommand, setTypedCommand] = useState("");
  const [printedLines, setPrintedLines] = useState<string[]>([]);
  const [bootDone, setBootDone] = useState(false);

  const [currentInput, setCurrentInput] = useState("");
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [konamiPulse, setKonamiPulse] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printTimeoutsRef = useRef<number[]>([]);
  const entryIdCounterRef = useRef(0);
  /** Mirrors `isPrinting`, but read/written synchronously. `isPrinting`
   *  (React state) can't be trusted as a same-tick guard: if Enter fires
   *  twice before a re-render (key auto-repeat, a fast double press),
   *  both calls would read the same stale `isPrinting === false` and
   *  both would start a print loop, corrupting the transcript. This ref
   *  is updated immediately, so the second call is reliably blocked. */
  const printingRef = useRef(false);

  const commandContext: CommandContext = { professionalTitle, highlights };

  // Boot sequence: type the command character-by-character, then print
  // each output line one at a time — real sequencing via timers, not a
  // CSS delay, so it's genuinely line-by-line (and character-by-
  // character for the command itself) rather than a simultaneous fade.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setTypedCommand(BOOT_COMMAND_LINE);
      setPrintedLines(BOOT_OUTPUT_LINES);
      setBootDone(true);
      return;
    }

    let cancelled = false;
    const timeouts: number[] = [];
    const schedule = (fn: () => void, delay: number) => {
      timeouts.push(window.setTimeout(fn, delay));
    };

    function typeCommand(charIndex: number) {
      if (cancelled) return;
      setTypedCommand(BOOT_COMMAND_LINE.slice(0, charIndex));
      if (charIndex >= BOOT_COMMAND_LINE.length) {
        schedule(() => printLine(0), COMMAND_TO_OUTPUT_PAUSE_MS);
        return;
      }
      schedule(() => typeCommand(charIndex + 1), TYPE_CHAR_MS);
    }

    function printLine(lineIndex: number) {
      if (cancelled) return;
      if (lineIndex >= BOOT_OUTPUT_LINES.length) {
        setBootDone(true);
        return;
      }
      setPrintedLines((prev) => [...prev, BOOT_OUTPUT_LINES[lineIndex]]);
      schedule(() => printLine(lineIndex + 1), PRINT_LINE_MS);
    }

    typeCommand(0);

    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Auto-focus the live prompt as soon as it appears, so the caret is
  // already blinking and ready to type without requiring a click first.
  useEffect(() => {
    if (bootDone) {
      inputRef.current?.focus();
    }
  }, [bootDone]);

  // Keep the transcript scrolled to the latest line as it grows.
  useEffect(() => {
    const el = outputRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight });
  }, [entries, printedLines]);

  // Cancel any pending command-output print timers on unmount (e.g. the
  // component unmounts mid-print because a nav command's route push
  // resolved before printing finished).
  useEffect(() => {
    return () => {
      printTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  function triggerKonamiPulse() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;
    setKonamiPulse(true);
    window.setTimeout(() => setKonamiPulse(false), 900);
  }

  /** Appends a new transcript entry and reveals its output lines one at a
   *  time (real terminal-style scrolling output), rather than dumping
   *  the whole block in at once. `onDone` fires once every line is
   *  visible — used to defer navigation/effects until output is
   *  actually readable. */
  function printEntryLines(
    input: string,
    lines: string[],
    onDone?: () => void
  ) {
    const entryId = entryIdCounterRef.current++;
    setEntries((prev) => [...prev, { id: entryId, input, output: [] }]);

    if (lines.length === 0) {
      onDone?.();
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId ? { ...entry, output: lines } : entry
        )
      );
      onDone?.();
      return;
    }

    printingRef.current = true;
    setIsPrinting(true);

    let lineIndex = 0;
    const printNext = () => {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId
            ? { ...entry, output: [...entry.output, lines[lineIndex]] }
            : entry
        )
      );
      lineIndex += 1;
      if (lineIndex < lines.length) {
        printTimeoutsRef.current.push(
          window.setTimeout(printNext, PRINT_LINE_MS)
        );
      } else {
        printingRef.current = false;
        setIsPrinting(false);
        onDone?.();
      }
    };

    printTimeoutsRef.current.push(window.setTimeout(printNext, PRINT_LINE_MS));
  }

  function cancelPendingPrints() {
    printTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    printTimeoutsRef.current = [];
    printingRef.current = false;
    setIsPrinting(false);
  }

  function runCommand(rawInput: string) {
    if (printingRef.current) return;

    const trimmed = rawInput.trim();
    const result = executeCommand(rawInput, commandContext);

    if (trimmed) {
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(null);
    }

    if (result.clear) {
      cancelPendingPrints();
      setEntries([]);
      setCurrentInput("");
      return;
    }

    setCurrentInput("");

    printEntryLines(rawInput, result.lines ?? [], () => {
      if (result.effect === "konami") triggerKonamiPulse();
      if (result.navigateTo) {
        const target = result.navigateTo;
        // Small delay so the last output line is actually readable
        // before the route change unmounts this page.
        window.setTimeout(() => router.push(target), 300);
      }
    });
  }

  function recallHistory(direction: -1 | 1) {
    if (commandHistory.length === 0) return;
    const base = historyIndex === null ? commandHistory.length : historyIndex;
    const next = base + direction;

    if (next < 0) return;
    if (next >= commandHistory.length) {
      setHistoryIndex(null);
      setCurrentInput("");
      return;
    }
    setHistoryIndex(next);
    setCurrentInput(commandHistory[next]);
  }

  function trackKonamiKey(key: string) {
    const seq = [...recentKeysRef.current, key].slice(
      -KONAMI_SEQUENCE.length
    );
    recentKeysRef.current = seq;

    const matches =
      seq.length === KONAMI_SEQUENCE.length &&
      seq.every((k, i) => k.toLowerCase() === KONAMI_SEQUENCE[i].toLowerCase());

    if (matches && !printingRef.current) {
      recentKeysRef.current = [];
      const result = executeCommand("konami", commandContext);
      printEntryLines("", result.lines ?? [], () => {
        if (result.effect === "konami") triggerKonamiPulse();
      });
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    trackKonamiKey(event.key);

    if (event.key === "Enter") {
      event.preventDefault();
      runCommand(currentInput);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      recallHistory(-1);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      recallHistory(1);
      return;
    }
    if (event.key.toLowerCase() === "l" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      cancelPendingPrints();
      setEntries([]);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div
        dir="ltr"
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "border-border bg-surface w-full max-w-full overflow-hidden rounded-lg border text-left shadow-lg transition-shadow",
          konamiPulse && "animate-[terminal-glow-pulse_900ms_ease-in-out]"
        )}
      >
        {/* Title bar */}
        <div className="border-border flex items-center gap-2 border-b px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="bg-error/70 h-2.5 w-2.5 rounded-full" />
            <span className="bg-warning/70 h-2.5 w-2.5 rounded-full" />
            <span className="bg-success/70 h-2.5 w-2.5 rounded-full" />
          </span>
          <span className="text-caption text-text-secondary font-mono">
            404 — terminal
          </span>
        </div>

        {/* Output / scrollback */}
        <div
          ref={outputRef}
          role="group"
          aria-label="Interactive 404 terminal. Type help for a list of commands."
          className="text-code h-[55vh] max-h-[520px] min-h-[340px] cursor-text overflow-x-hidden overflow-y-auto px-4 py-4 font-mono sm:px-6 sm:py-5"
        >
          <div className="text-accent">
            <span aria-hidden="true">$ </span>
            <span>{typedCommand}</span>
            {typedCommand.length < BOOT_COMMAND_LINE.length && (
              <BlockCursor />
            )}
          </div>

          {printedLines.map((line, index) => (
            <TerminalLine key={index} text={line} />
          ))}

          {bootDone && (
            <>
              <div className="mt-4" aria-hidden="true">
                <p className="text-display text-accent font-mono leading-none">
                  404
                </p>
                <p className="text-h4 text-text-primary mt-1 font-semibold">
                  PAGE NOT FOUND
                </p>
              </div>

              <div className="mt-3">
                <TerminalLine text="Type 'help' to see available commands." />
              </div>
            </>
          )}

          {/* Command transcript — the only part of this region that's
              aria-live, and only once boot has finished: announcing each
              boot line (or worse, each typed character) would flood a
              screen reader, but announcing each command's result here,
              one discrete event at a time, is exactly what a live
              region is for. */}
          <div aria-live="polite">
            {entries.map((entry) => (
              <div key={entry.id} className="mt-2">
                {entry.input !== "" && (
                  <div className="text-accent">
                    <span aria-hidden="true">$ </span>
                    {entry.input}
                  </div>
                )}
                {entry.output.map((line, lineIndex) => (
                  <TerminalLine key={lineIndex} text={line} />
                ))}
              </div>
            ))}
          </div>

          {/* Live prompt — only once boot has finished "printing" */}
          {bootDone && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-accent" aria-hidden="true">
                $
              </span>
              <input
                ref={inputRef}
                autoFocus
                value={currentInput}
                onChange={(event) => setCurrentInput(event.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label="Terminal command input"
                className="text-code caret-accent text-text-primary flex-1 bg-transparent font-mono"
              />
            </div>
          )}
        </div>
      </div>

      {/* Always rendered (not gated behind interaction) so there's a
          working way home even for a visitor who never touches the
          terminal at all, or is browsing without JavaScript. */}
      <div className="border-border flex w-full max-w-full flex-col items-center gap-3 border-t pt-6 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="bg-accent text-background hover:bg-accent-hover text-small rounded-md px-5 py-2.5 font-medium transition-colors"
        >
          {goHomeLabel}
        </Link>
        <Link
          href="/projects"
          className="border-border text-text-primary hover:border-accent hover:text-accent text-small rounded-md border px-5 py-2.5 font-medium transition-colors"
        >
          {viewProjectsLabel}
        </Link>
      </div>
    </div>
  );
}
