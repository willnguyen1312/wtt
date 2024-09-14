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

const Component2 = () => {
  return null;
};

const FunctionReturnsComponent = () => {
  // This returns null
  return Component2();
};

const FunctionComponent2 = () => {
  // This returns an object so-called VNODE in virtual DOM language
  return <Component2 />;
};

// This evaluate to false
const first = Boolean(FunctionReturnsComponent());

// This evaluate to true
const second = Boolean(FunctionComponent2());

test("tada", () => {
  expect(first).toBeFalsy();
  expect(second).toBeTruthy();
});
