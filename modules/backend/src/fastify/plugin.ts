import type { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyRateLimit from "@fastify/rate-limit";

export const RATELIMIT_DEFAULT = 100;

export const fastifyPlugins = (server: FastifyInstance): void => {
  server.register(fastifyRateLimit, {
    global: false, // make all routes independent
    timeWindow: 1000 * 60,
    max: 100, // default value (can be customized per route)
    hook: "onRequest",
  });

  server.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: "*",
    credentials: true,
  });

  server.register(fastifyMultipart);
};
