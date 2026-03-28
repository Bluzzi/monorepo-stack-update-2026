import type { FastifyRequest } from "fastify";
import type { FastifyInstance } from "fastify";
import type { ZodType } from "zod";
import { routes } from "#/routes";
import { logger } from "#/utils/logger";
import { z, ZodObject } from "zod";

// Types & route helpers:
export const routeConfig = <const Config extends z.infer<typeof routeSchema>["config"]> (config: Config) => config;

type ResponseResult<Success extends ZodObject> = Success | Promise<Success>;
export type RouteHandler<Body extends ZodType, Response extends object> = (
  request: FastifyRequest<{ Body: z.output<Body> }>,
) => ResponseResult<z.input<Response>>;

// Custom error:
export class HTTPException extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "HttpException";
  }
}

// Route schema:
export const routeSchema = z.object({
  config: z.object({
    path: z.string(), // path of the route

    rateLimit: z.number().positive().optional(), // max request per 1 minute
    fileMaxSize: z.number().optional(), // max multipart file size in bytes
  }),

  input: z.instanceof(ZodObject),
  output: z.instanceof(ZodObject),

  handler: z.function({
    input: [z.custom<FastifyRequest>()],
    output: z.union([z.looseObject({}), z.promise(z.looseObject({}))]),
  }),
});

// Route loader:
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
        if (!inputParsed.success) throw new HTTPException("Invalid input data");

        // Handle the request:
        const outputParsed = route.output.safeParse(await route.handler(request));
        if (!outputParsed.success) throw new HTTPException("Invalid output data");

        // Reply:
        return reply.status(200).send(outputParsed.data);
      },
    });

    logger.info(`Route loaded: ${route.config.path}`);
  }
};
