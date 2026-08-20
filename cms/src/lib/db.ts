import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
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

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
