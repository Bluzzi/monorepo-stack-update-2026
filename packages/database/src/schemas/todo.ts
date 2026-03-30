import { columnsTimestamp } from "../columns/timestamp";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const todo = sqliteTable("todo", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),

  title: text("title").notNull(),
  description: text("description"),

  createdAt: columnsTimestamp.createdAt,
  updatedAt: columnsTimestamp.updatedAt,
  deletedAt: columnsTimestamp.deletedAt,
});
