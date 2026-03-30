import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";

// Env variable:
if (existsSync(join(cwd(), ".env"))) config();
else config({ path: join(cwd(), "../../.env") });

if (typeof process.env.SQLITE_FILE === "undefined") {
  throw new Error("SQLITE_FILE variable must be defined");
}

// Config:
export default defineConfig({
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.SQLITE_FILE,
  },
  schema: "./src/schemas",
  out: "./drizzle",
});
