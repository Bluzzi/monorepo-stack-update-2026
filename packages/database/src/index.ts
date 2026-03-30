import { todo } from "#/schemas/todo";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { join } from "node:path";
import { cwd } from "node:process";

if (typeof process.env.SQLITE_FILE === "undefined") {
  throw new Error("SQLITE_FILE variable must be defined");
}

// Connection to the database and schemas:
export const database = drizzle({
  connection: { url: process.env.SQLITE_FILE },
});

export const schemas = { todo };
export * from "drizzle-orm";

// Apply migration:
await migrate(database, {
  migrationsFolder: join(cwd(), "drizzle"),
});
