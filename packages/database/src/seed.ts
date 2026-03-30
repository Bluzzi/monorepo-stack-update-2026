import "./env-loader";
// env variables loading priority
import { database } from ".";
import { todo } from "#/schemas/todo";
import { reset, seed } from "drizzle-seed";

await reset(database, { todo });

await seed(database, { todo }).refine((funcs) => ({
  todo: {
    columns: {
      id: funcs.uuid(),
      title: funcs.jobTitle(),
      description: funcs.loremIpsum(),
      deletedAt: funcs.weightedRandom([
        { weight: 0.25, value: funcs.timestamp() },
        { weight: 0.75, value: funcs.default({ defaultValue: null }) },
      ]),
    },
    count: 10,
  },
}));
