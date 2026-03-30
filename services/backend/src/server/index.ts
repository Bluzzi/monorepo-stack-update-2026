import { fastifyError } from "./error";
import { fastifyHooks } from "./hook";
import { fastifyPlugins } from "./plugin";
import { fastifyRoutes } from "./route";
import { env } from "#/utils/env";
import { logger } from "#/utils/logger";
import { fastify } from "fastify";

export const startHTTPServer = async () => {
  const server = fastify();

  fastifyPlugins(server);
  fastifyError(server);
  fastifyHooks(server);
  fastifyRoutes(server);

  await server.listen({ host: "0.0.0.0", port: env.PORT });
  logger.info(`The server has been successfully started at http://localhost:${String(env.PORT)}`);
};
