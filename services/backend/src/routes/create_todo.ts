import { database, schemas } from "@core-package/database";
import { routeConfig } from "#src/utils/route";
import { HTTPException, type RouteHandler } from "#src/utils/route";
import { z } from "zod";

export const config = routeConfig({
  path: "/create_todo",

  resources: {
    invalidates: ["todo"],
    provides: ["todo"],
  },
});

export const input = z.object({
  title: z.string(),
  description: z.string().nullable(),
});

export const output = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
});

export const handler: RouteHandler<typeof input, typeof output> = async (request) => {
  // Create todo in the database:
  const [newTodo] = await database.insert(schemas.todo).values({
    title: request.body.title,
    description: request.body.description,
  }).returning();
  if (!newTodo) {
    throw new HTTPException("Unable to create resource");
  }

  // Reply:
  return {
    ...newTodo,
  };
};
