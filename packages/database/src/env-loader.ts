import { config } from "dotenv";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";

if (existsSync(join(cwd(), ".env"))) config();
else config({ path: join(cwd(), "../../.env") });

if (typeof process.env.POSTGRESQL_URL === "undefined") {
  throw new Error("POSTGRESQL_URL variable must be defined");
}
