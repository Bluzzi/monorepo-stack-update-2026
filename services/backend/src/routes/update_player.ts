import type { RouteHandler } from "#/utils/route";
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

export const handler: RouteHandler<typeof input, typeof output> = (_request) => {
  return {
    playerID: "5555",
  };
};
