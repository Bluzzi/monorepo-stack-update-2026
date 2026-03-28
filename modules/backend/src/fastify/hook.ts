import type { FastifyInstance } from "fastify";
import { logger } from "#/utils/logger";
import { HTTPException } from "#/utils/route";
import { styleText } from "node:util";

export const fastifyHooks = (server: FastifyInstance): void => {
  server.addHook("onError", (request, __, error, done) => {
    const requestID = request.id.toUpperCase();

    // Known errors logging:
    if (error instanceof HTTPException) {
      logger.warn(`${requestID} => ${request.url} - known error occurred: \`${error.message}\``);

      return done();
    }

    // Unknown errors logging:
    const params = request.params ? JSON.stringify(request.params) : "EMPTY";
    const query = request.query ? JSON.stringify(request.query) : "EMPTY";
    const body = request.body ? JSON.stringify(request.body) : "EMPTY";

    logger.error(
      `${requestID} => ${request.url} - unknown error occurred: \`${error.message}\``,
      [
        `- Method: ${request.method}`,
        `- Params: ${params}`,
        `- Query: ${query}`,
        `- Body: ${body}`,
        error instanceof Error ? `- ${error.stack ?? "Error stack not available"}` : `- Error: ${String(error)}`,
      ].join("\n"),
    );
    return done();
  });

  server.addHook("onRequest", (request, _, done) => {
    const requestID = request.id.toUpperCase();

    logger.info(`${requestID} => ${request.url} - processing...`);

    return done();
  });

  server.addHook("onResponse", (request, reply, done) => {
    const requestID = request.id.toUpperCase();
    const responseTime = `${reply.elapsedTime.toFixed(2)}ms`;
    const statusCode = styleText(reply.statusCode < 400 ? "green" : "red", String(reply.statusCode));

    logger[reply.statusCode < 500 ? "info" : "error"](`${requestID} <= ${request.url} - ${statusCode} (${responseTime})`);

    return done();
  });
};
