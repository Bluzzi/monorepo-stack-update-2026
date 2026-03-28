import type { FastifyInstance } from "fastify";
import { HTTPException } from "#/utils/route";

export const fastifyError = (server: FastifyInstance): void => {
  server.setErrorHandler((error, __, reply) => {
    if (error instanceof HTTPException) {
      return reply
        .status(400 /* BadRequest */)
        .send({ message: error.message });
    }

    return reply
      .status(500 /* InternalServerError */)
      .send({ message: "An error has occurred" });
  });
};
