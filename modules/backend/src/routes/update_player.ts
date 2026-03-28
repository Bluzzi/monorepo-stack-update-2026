import type { RouteHandler } from "#/fastify/route";
import { routeConfig } from "#/fastify/route";
import { logger } from "#/utils/logger";
import { z } from "zod";

export const config = routeConfig({
  path: "/update_player",
});

export const input = z.object({
  playerName: z.string(),
});

export const output = z.object({
  playerID: z.string(),
});

export const handler: RouteHandler<typeof input, typeof output> = (request) => {
  logger.info(`${request.body.playerName} updated`);

  return {
    playerID: "5555",
  };
};
