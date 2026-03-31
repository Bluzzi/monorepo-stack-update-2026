import "./env-loader";
// env variables loading priority
import { database } from ".";
import { todo } from "#src/schemas/todo";
import { reset, seed } from "drizzle-seed";

await reset(database, { todo });

await seed(database, { todo }).refine((funcs) => ({
  todo: {
    columns: {
      id: funcs.uuid(),
      title: funcs.valuesFromArray({ values: [
        "Buy groceries for the week",
        "Finish the project documentation",
        "Clean the apartment",
        "Go for a 30-minute run",
        "Call the bank about account details",
        "Schedule a dentist appointment",
        "Reply to pending emails",
        "Prepare meals for the next few days",
        "Review and refactor old code",
        "Backup important files",
      ] }),
      description: funcs.weightedRandom([
        { weight: 0.25, value: funcs.loremIpsum() },
        { weight: 0.75, value: funcs.default({ defaultValue: null }) },
      ]),
      deletedAt: funcs.weightedRandom([
        { weight: 0.25, value: funcs.timestamp() },
        { weight: 0.75, value: funcs.default({ defaultValue: null }) },
      ]),
    },
    count: 10,
  },
}));
