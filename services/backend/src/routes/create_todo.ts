import type { RouteHandler } from "#/utils/route";
import { database, schemas } from "@core-package/database";
import { routeConfig } from "#/utils/route";
import { z } from "zod";

export const config = routeConfig({
  path: "/create_todo",
});

export const input = z.object({
  title: z.string(),
  description: z.string().nullable(),
});

export const output = z.object({
  id: z.string(),
});

export const handler: RouteHandler<typeof input, typeof output> = async (request) => {
  // Create todo in the database:
  const newTodo = await database.insert(schemas.todo).values({
    title: request.body.title,
    description: request.body.description,
  }).returning().get();

  // Reply:
  return {
    id: newTodo.id,
  };
};
