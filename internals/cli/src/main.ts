import type { Script } from "#src/utils/script";
import { select } from "@inquirer/prompts";
import { readdirSync } from "node:fs";
import { join } from "node:path";

// Get the list of scripts:
const scriptsDirectory = join(import.meta.dirname, "scripts");
const scripts: ({ name: string } & Script)[] = [];

for (const filename of readdirSync(scriptsDirectory)) {
  const scriptFile = await import(join(scriptsDirectory, filename)) as { default: Script };

  scripts.push({ name: filename.replace(".ts", ""), ...scriptFile.default });
}

// Ask for the script to run:
const execute = await select<Script["execute"]>({
  message: "Choose the script you want to run",
  choices: scripts.map((element) => ({
    name: element.name,
    description: element.description,
    value: element.execute,
  })),
});

// Run the script:
await execute();
