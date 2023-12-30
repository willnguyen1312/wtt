import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { checkA11y } from "./utils";

test("successful user flow", async ({ page }) => {
  // Arrange
  await page.goto("/");
  await checkA11y(page);
  await expect(page.getByRole("alert")).not.toBeAttached();

  // Act
  const submitButton = page.getByRole("button", { name: "Submit" });
  await submitButton.click();
  const nameInput = page.getByLabel("Name");
  await expect(nameInput).toBeFocused();

  const name = faker.person.fullName();
  await page.getByLabel("Name").fill(name);
  await submitButton.click();

  // Assert
  await expect(page.getByRole("alert")).toHaveText(`Hello ${name}`);
});
