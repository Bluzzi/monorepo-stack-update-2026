import type { RouteHandler } from "#/utils/route";
import { routeConfig } from "#/utils/route";
import { z } from "zod";

export const config = routeConfig({
  path: "/get_players",
});

export const input = z.object({
  ping: z.string(),
});

export const output = z.object({
  pong: z.string(),
});

export const handler: RouteHandler<typeof input, typeof output> = (request) => {
  console.log(request.headers.authorization);
  return {
    pong: request.body.ping,
  };
};
