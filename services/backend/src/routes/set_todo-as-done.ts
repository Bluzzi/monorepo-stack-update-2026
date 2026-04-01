import { database, eq, schemas } from "@core-package/database";
import { routeConfig } from "#src/utils/route";
import { HTTPException, type RouteHandler } from "#src/utils/route";
import { z } from "zod";

export const config = routeConfig({
  path: "/set_todo-as-done",

  resources: {
    invalidates: ["todo"],
    provides: [],
  },
});

export const input = z.object({
  id: z.string(),
});

export const output = z.object({});

export const handler: RouteHandler<typeof input, typeof output> = async (request) => {
  // Check if the todo exist in the database:
  const [todo] = await database
    .select()
    .from(schemas.todo)
    .where(eq(schemas.todo.id, request.body.id))
    .limit(1);
  if (!todo) {
    throw new HTTPException("Resource does not exist");
  }

  // Set todo as done in the database:
  await database
    .update(schemas.todo)
    .set({ deletedAt: new Date() })
    .where(eq(schemas.todo.id, request.body.id));

  // Reply:
  return {};
};
