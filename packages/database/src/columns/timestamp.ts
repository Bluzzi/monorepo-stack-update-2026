// SQLite:
import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

const createdAt = integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`);
const updatedAt = integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`).$onUpdate(() => new Date());
const deletedAt = integer("deleted_at", { mode: "timestamp" });

export const columnsTimestamp = { createdAt, updatedAt, deletedAt };

// PostgreSQL:
/**
import { timestamp } from "drizzle-orm/pg-core";

const createdAt = timestamp("created_at").notNull().defaultNow();
const updatedAt = timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date());
const deletedAt = timestamp("deleted_at");

export const columnsTimestamp = { createdAt, updatedAt, deletedAt };
*/
