import type { RouteHandler } from "#src/utils/route";
import { database, isNull, schemas } from "@core-package/database";
import { routeConfig } from "#src/utils/route";
import { z } from "zod";

export const config = routeConfig({
  path: "/get_todos",
});

export const input = z.object({});

export const output = z.object({
  todos: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
  })),
});

export const handler: RouteHandler<typeof input, typeof output> = async () => {
  // Get todos from the database:
  const todos = await database
    .select()
    .from(schemas.todo)
    .where(isNull(schemas.todo.deletedAt));

  // Reply:
  return {
    todos: todos,
  };
};
