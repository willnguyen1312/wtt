import { axe } from "jest-axe";
import "jest-axe/extend-expect";
import { expect } from "vitest";

export async function checkA11y(container: Element) {
  const result = await axe(container);
  expect(result).toHaveNoViolations();
}
