import { test as defaultFixture } from "@playwright/test";

export const test = defaultFixture.extend({
  page: async ({ page, contextOptions }, use) => {
    // Logger:
    page.on("console", (message) => console.log(message));

    // Viewport management:
    if (contextOptions.viewport) {
      await page.setViewportSize(contextOptions.viewport);
    }

    // Next:
    await use(page);
  },
});

export { expect } from "@playwright/test";
