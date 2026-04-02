import { config } from "dotenv";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(3005),
  POSTGRESQL_URL: z.url(),
});

if (existsSync(join(cwd(), ".env"))) config();
else config({ path: join(cwd(), "../../.env") });
export const env = schema.parse(process.env);
