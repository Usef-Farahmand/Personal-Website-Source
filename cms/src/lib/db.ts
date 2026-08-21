import path from "node:path";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 *
 * As of Prisma 7, the client no longer reads a connection URL from
 * schema.prisma implicitly — it takes an explicit driver adapter (see
 * prisma.config.ts for the equivalent CLI-side wiring, which is a
 * separate config path). PrismaLibSQL is Prisma's driver adapter backed
 * by libSQL (a SQLite-compatible engine) — used here instead of the
 * better-sqlite3 adapter because better-sqlite3's native binary has no
 * prebuilt release for current Node versions on some platforms, forcing
 * a local C++ build toolchain (node-gyp + Visual Studio Build Tools on
 * Windows) that most machines don't have set up. libSQL's native
 * bindings ship prebuilt for a much wider Node/OS/arch matrix, so `npm
 * install` works without any extra toolchain. Functionally, for a local
 * single-user SQLite file, the two are interchangeable.
 *
 * `DATABASE_URL` still names the file, kept as `file:./dev.db` (relative
 * to prisma/schema.prisma, matching the CLI's own resolution) so the one
 * env var stays the single source of truth for where the database lives.
 *
 * Next.js dev mode hot-reloads server modules on every file change, which
 * would otherwise create a fresh PrismaClient (and a fresh SQLite
 * connection) per reload. Caching the instance on `globalThis` in
 * development avoids exhausting connections; production gets one instance
 * per server process, which is what we want anyway.
 *
 * This file — and only this file — is allowed to import `@prisma/client`
 * or touch the database connection. Every other module reaches the
 * database through this singleton, never through its own `new
 * PrismaClient()`. That boundary is what makes it possible to later swap
 * storage without hunting down scattered instantiations, and it is also
 * the boundary the public website must never cross: this package
 * (`cms/`) is not a dependency of the public site, so there is no import
 * path from `src/` (public website) into this file at all.
 */

function resolveDatabaseFile(): string {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const relativePath = url.replace(/^file:/, "");
  return path.isAbsolute(relativePath)
    ? relativePath
    : path.join(process.cwd(), "prisma", relativePath);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaLibSql({ url: `file:${resolveDatabaseFile()}` }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
