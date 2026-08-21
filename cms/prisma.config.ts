import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 moved datasource connection config out of schema.prisma and
 * into this file (schema.prisma's `datasource` block now only declares
 * the provider). This is what the Prisma CLI (`migrate`, `studio`, `db
 * seed`, ...) reads to find the local SQLite file and the seed command —
 * see src/lib/db.ts for the equivalent runtime wiring used by the app
 * itself via the driver adapter.
 *
 * The URL is relative to this file's directory (the cms/ project root),
 * matching DATABASE_URL in .env.example — keep the two in sync if you
 * ever move the database file.
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    /** `npx prisma db seed` runs this. Prisma 7 no longer runs it
     *  automatically after `migrate dev` — seeding is always explicit. */
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: "file:./prisma/dev.db",
  },
});
