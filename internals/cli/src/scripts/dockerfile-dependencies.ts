import type { Script } from "#src/utils/script";
import { checkbox } from "@inquirer/prompts";
import { execSync } from "node:child_process";
import { join, normalize, sep } from "node:path";
import { z } from "zod";

type Package = {
  path: string;
  dependencies?: Record<string, Package>;
};

const packageSchema: z.ZodType<Package> = z.object({
  path: z.string(),
  dependencies: z.lazy(() => z.record(z.string(), packageSchema)).optional(),
});

const packageListSchema = z.array(z.object({
  name: z.string(),
  path: z.string(),
  dependencies: z.lazy(() => z.record(z.string(), packageSchema)).optional(),
}));

export default {
  description: "Get the dependencies of a service to be used in a Dockerfile",
  execute: async () => {
    // Fetch all core services with their workspace dependencies:
    const output = execSync(
      "pnpm list --filter=@core-service/* --only-projects --depth Infinity --json",
      { encoding: "utf8" },
    ).trim();
    const packages = packageListSchema.safeParse(JSON.parse(output));
    if (!packages.success) {
      console.error(`Error while parsing data: ${packages.error.message}`);
      return;
    }

    // Prompt the user to select services:
    const services = await checkbox({
      message: "Select services",
      choices: packages.data.map((pkg) => ({ name: pkg.name, value: pkg })),
    });

    // Resolve the monorepo root path:
    const monorepoRootPath = execSync(
      "pnpm --workspace-root exec node -e \"process.stdout.write(process.cwd())\"",
      { encoding: "utf8" },
    );
    const pathPrefix = normalize(join(monorepoRootPath, sep));

    // Print COPY instructions for each selected service:
    for (const service of services) {
      console.log(
        ["", "-".repeat(process.stdout.columns), service.name, "-".repeat(process.stdout.columns)].join("\n"),
      );

      // Collect all unique workspace paths via DFS:
      const uniquePaths = new Set<string>();
      const stack: Package[] = [service];
      while (stack.length > 0) {
        const current = stack.pop()!;
        uniquePaths.add(current.path);
        if (current.dependencies) {
          stack.push(...Object.values(current.dependencies));
        }
      }

      // Format and output COPY instructions:
      const paths = [...uniquePaths].map((p) => p.replaceAll(pathPrefix, "").replaceAll(sep, "/"));
      const maxLength = Math.max(...paths.map((p) => p.length));
      for (const p of paths.sort()) {
        console.log(`COPY ./${p}/ ${" ".repeat(maxLength - p.length)}./${p}/`);
      }
    }
  },
} satisfies Script;
