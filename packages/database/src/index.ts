import { todo } from "#src/schemas/todo";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { join } from "node:path";

if (typeof process.env.POSTGRESQL_URL === "undefined") {
  throw new Error("POSTGRESQL_URL variable must be defined");
}

// Connection to the database and schemas:
export const database = drizzle({
  connection: { connectionString: process.env.POSTGRESQL_URL },
});

export const schemas = { todo };
export * from "drizzle-orm";

// Apply migration:
await migrate(database, {
  migrationsFolder: join(import.meta.dirname, "../drizzle"),
});
