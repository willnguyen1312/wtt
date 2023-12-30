import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { checkA11y } from "./utils";

test("successful user flow", async ({ page }) => {
  // Arrange
  await page.goto("/");
  await checkA11y(page);

  // Act
  const name = faker.person.fullName();
  await page.getByLabel("Name").fill(name);
  await page.getByRole("button", { name: "Submit" }).click();

  // Assert
  await expect(page.getByRole("alert")).toHaveText(`Hello ${name}`);
});
