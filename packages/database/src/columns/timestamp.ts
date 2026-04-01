import { timestamp } from "drizzle-orm/pg-core";

const createdAt = timestamp("created_at").notNull().defaultNow();
const updatedAt = timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date());
const deletedAt = timestamp("deleted_at");

export const columnsTimestamp = { createdAt, updatedAt, deletedAt };
