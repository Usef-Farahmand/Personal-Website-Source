"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Only "dark" exists today. This becomes "dark" | "light" the moment a
 * light theme ships (see styles/tokens/colors.css for that extension
 * point) — no other part of this file changes shape when it does.
 */
type Theme = "dark";

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Provides the active theme via context. Deliberately has no setter yet —
 * nothing in the app can trigger a theme change until a light theme and a
 * toggle control both exist, and an unreachable setter would just be dead
 * code. When that lands, this provider gains React state and a `setTheme`
 * that syncs `document.documentElement.dataset.theme`; consumers of
 * `useTheme()` don't change.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
