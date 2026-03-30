import type { FastifyInstance } from "fastify";
import { routes } from "#src/routes";
import { logger } from "#src/utils/logger";
import { HTTPException, routeSchema } from "#src/utils/route";
import { z } from "zod";

export const fastifyRoutes = (server: FastifyInstance): void => {
  const parsedRoutes = z.array(routeSchema).parse(routes);

  for (const route of parsedRoutes) {
    server.route({
      method: "POST",
      url: route.config.path,
      config: {
        rateLimit: {
          max: route.config.rateLimit,
        },
        multipartOptions: {
          limits: {
            fileSize: route.config.fileMaxSize,
          },
        },
      },
      handler: async (request, reply) => {
        // Parse input data:
        const inputParsed = route.input.safeParse(request.body);
        if (!inputParsed.success) {
          throw new HTTPException("Invalid input data");
        }

        // Handle the request:
        const outputParsed = route.output.safeParse(await route.handler(request));
        if (!outputParsed.success) {
          throw new HTTPException("Invalid output data");
        }

        // Reply:
        return reply.status(200).send(outputParsed.data);
      },
    });

    logger.info(`Route loaded: ${route.config.path}`);
  }
};
