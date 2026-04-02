import { database, schemas } from "@core-package/database";
import { expect, test } from "#src/fixtures/base";
import { randomUUID } from "node:crypto";

test("create a todo", async ({ page }) => {
  // Open the webapp:
  await page.goto("/");

  // Create the todo:
  const todoTitle = randomUUID();

  await page.getByRole("textbox", { name: "Title of the task" }).fill(todoTitle);
  await page.getByRole("textbox", { name: "Add more details" }).fill("Lorem ipsum di almet");
  await page.getByRole("button", { name: "Create task" }).click();

  // Check that the new todo is in the list:
  await expect(page.getByRole("listitem").filter({ hasText: todoTitle })).toBeVisible();
});

test("set a todo as done", async ({ page }) => {
  // Create a todo in the database for the test:
  const todoTitle = randomUUID();
  await database.insert(schemas.todo).values({ title: todoTitle });

  // Open the webapp:
  await page.goto("/");

  // Set the todo as done:
  await page.getByRole("listitem").filter({ hasText: todoTitle }).getByRole("button", { name: "Done" }).click();
});
