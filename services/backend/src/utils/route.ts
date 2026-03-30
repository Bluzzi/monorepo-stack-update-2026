import type { FastifyRequest } from "fastify";
import type { ZodType } from "zod";
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
    output: z.unknown(),
  }),
});
