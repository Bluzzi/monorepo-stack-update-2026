import { fastifyRoutes } from "./fastify/route";
import { fastifyError } from "#/fastify/error";
import { fastifyHooks } from "#/fastify/hook";
import { fastifyPlugins } from "#/fastify/plugin";
import { env } from "#/utils/env";
import { logger } from "#/utils/logger";
import { uncaughtExceptionHandler } from "#/utils/process";
import { fastify } from "fastify";

// Setup uncaught exception handler:
uncaughtExceptionHandler();

// Server:
const server = fastify();

fastifyPlugins(server);
fastifyError(server);
fastifyHooks(server);
fastifyRoutes(server);

await server.listen({ host: "0.0.0.0", port: env.PORT });
logger.info(`The server has been successfully started at http://localhost:${String(env.PORT)}`);
