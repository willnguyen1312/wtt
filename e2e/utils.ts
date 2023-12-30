import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

export async function checkA11y(page: Page) {
  await page.waitForSelector("main", { state: "attached" });
  const results = await new AxeBuilder({ page }).include("main").analyze();
  expect(results.violations).toEqual([]);
}
