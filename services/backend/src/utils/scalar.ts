import { Temporal } from "@js-temporal/polyfill";
import { z } from "zod";

export const scalarsInput = {
  date: z.number().positive().transform((value) => Temporal.Instant.fromEpochMilliseconds(value)).meta({
    description: "timestamp (in milliseconds)",
  }),
};

export const scalarsOutput = {
  date: z.date().transform((value) => value.getTime()).pipe(z.number()).meta({
    description: "timestamp (in milliseconds)",
  }),
  bigint: z.bigint().transform((bigint) => String(bigint)).pipe(z.string()).meta({
    description: "big integer as string",
  }),
};
