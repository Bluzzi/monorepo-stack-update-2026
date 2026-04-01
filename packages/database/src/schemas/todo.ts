import { columnsTimestamp } from "#src/columns/timestamp";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: text("title").notNull(),
  description: text("description"),

  createdAt: columnsTimestamp.createdAt,
  updatedAt: columnsTimestamp.updatedAt,
  deletedAt: columnsTimestamp.deletedAt,
});
