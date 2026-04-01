import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";

// Env variable:
if (existsSync(join(cwd(), ".env"))) config();
else config({ path: join(cwd(), "../../.env") });

if (typeof process.env.POSTGRESQL_URL === "undefined") {
  throw new Error("POSTGRESQL_URL variable must be defined");
}

// Config:
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRESQL_URL,
  },
  schema: "./src/schemas",
  out: "./drizzle",
});
