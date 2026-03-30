import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { join } from "node:path";
import { cwd } from "node:process";

if (typeof process.env.SQLITE_FILE === "undefined") {
  throw new Error("SQLITE_FILE variable must be defined");
}

// Connection to the database:
export const database = drizzle({
  connection: { url: process.env.SQLITE_FILE },
});

// Schemas:
export * from "#/schemas/todo";

// Apply migration:
await migrate(database, {
  migrationsFolder: join(cwd(), "drizzle"),
});
