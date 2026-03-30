import type { RouteHandler } from "#src/utils/route";
import { database, eq, schemas } from "@core-package/database";
import { routeConfig } from "#src/utils/route";
import { z } from "zod";

export const config = routeConfig({
  path: "/set_todo-as-done",
});

export const input = z.object({
  id: z.string(),
});

export const output = z.object({});

export const handler: RouteHandler<typeof input, typeof output> = async (request) => {
  // Set todo as done in the database:
  await database.update(schemas.todo)
    .set({ deletedAt: new Date() })
    .where(eq(schemas.todo, request.body.id));

  // Reply:
  return {};
};
