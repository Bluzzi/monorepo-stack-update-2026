import "#src/utils/env";
// env variables loading priority
import { devices } from "@playwright/test";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests",
  testMatch: "**/*.ts",

  timeout: 60 * 1000,
  expect: {
    timeout: 30 * 1000,
  },

  workers: process.env.CI ? 2 : undefined,
  retries: 2,

  reporter: [
    ["list", { printSteps: true }],
    ["html", { open: "always" }],
  ],

  use: {
    baseURL: "http://localhost:5173",
    trace: "on",
    video: "on-first-retry",
  },

  webServer: [
    {
      command: "pnpm --filter=@core-service/frontend run dev",
      url: new URL("/ping", "http://localhost:5173").toString(),
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      command: "pnpm --filter=@core-service/backend run dev",
      url: new URL("/ping", "http://localhost:3005").toString(),
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      stderr: "pipe",
    },
  ],

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
