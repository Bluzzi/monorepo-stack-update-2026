import type { RouteHandler } from "#/utils/route";
import { logger } from "#/utils/logger";
import { routeConfig } from "#/utils/route";
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
