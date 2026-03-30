import { config } from "dotenv";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";

if (existsSync(join(cwd(), ".env"))) config();
else config({ path: join(cwd(), "../../.env") });

if (typeof process.env.SQLITE_FILE === "undefined") {
  throw new Error("SQLITE_FILE variable must be defined");
}
