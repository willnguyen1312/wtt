import { test } from "vitest";

const FunctionComponent = () => {
  return null;
};

test("Function return component", () => {
  const result = FunctionComponent();
  expect(result).toBeNull();
});

const Component = () => {
  return <FunctionComponent />;
};

test("FunctionComponent", () => {
  const result = Component();
  expect(result).not.toBeNull();
});
