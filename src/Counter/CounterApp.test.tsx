/* eslint-disable */
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { describe, it } from "vitest";

import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
} from "react-redux";

import CounterContextApp, {
  useDispatch,
  useSelector,
} from "./CounterContextApp";

import CounterReduxApp from "./CounterReduxApp";

const useGenericSelector = (selector = (state) => state) => {
  try {
    return useSelector(selector);
  } catch {}

  try {
    return useReduxSelector(selector);
  } catch {}

  throw new Error(
    "useSelector must be used within a React Context or Redux Provider"
  );
};

const useGenericDispatch = () => {
  try {
    return useDispatch();
  } catch {}

  try {
    return useReduxDispatch();
  } catch {}

  throw new Error(
    "useGenericDispatch must be used within a React Context or Redux Provider"
  );
};

const SharedComponentGeneric = () => {
  const count = useGenericSelector((state) => state.count);
  const dispatch = useGenericDispatch();

  return (
    <>
      <h1>Value: {count}</h1>

      <button onClick={() => dispatch({ type: "increment" })}>Add</button>
      <button onClick={() => dispatch({ type: "decrement" })}>Minus</button>
    </>
  );
};

describe("<CounterContextApp /> with useGeneric", () => {
  it("works for React Context app", async () => {
    const user = userEvent.setup();
    render(
      <CounterContextApp>
        <SharedComponentGeneric />
      </CounterContextApp>
    );

    const plusButton = screen.getByRole("button", { name: "Add" });
    const minusButton = screen.getByRole("button", { name: "Minus" });

    await user.click(plusButton);
    expect(screen.getByText("Value: 1")).toBeInTheDocument();

    await user.click(minusButton);
    expect(screen.getByText("Value: 0")).toBeInTheDocument();
  });
});

describe("<CounterReduxApp /> with useGeneric", () => {
  it("works for React Redux app", async () => {
    const user = userEvent.setup();
    render(
      <CounterReduxApp>
        <SharedComponentGeneric />
      </CounterReduxApp>
    );

    const plusButton = screen.getByRole("button", { name: "Add" });
    const minusButton = screen.getByRole("button", { name: "Minus" });

    await user.click(plusButton);
    expect(screen.getByText("Value: 1")).toBeInTheDocument();

    await user.click(minusButton);
    expect(screen.getByText("Value: 0")).toBeInTheDocument();
  });
});

const SharedComponent = (props: {
  count: number;
  dispatch: React.Dispatch<any>;
}) => {
  return (
    <>
      <h1>Value: {props.count}</h1>

      <button onClick={() => props.dispatch({ type: "increment" })}>Add</button>
      <button onClick={() => props.dispatch({ type: "decrement" })}>
        Minus
      </button>
    </>
  );
};

const SharedComponentWithContext = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.count);

  return <SharedComponent count={count} dispatch={dispatch} />;
};

const SharedComponentWithRedux = () => {
  const dispatch = useReduxDispatch();
  const count = useReduxSelector((state: any) => state.count);

  return <SharedComponent count={count} dispatch={dispatch} />;
};

describe("<CounterContextApp /> with pass props", () => {
  it("works for React Context app", async () => {
    const user = userEvent.setup();
    render(
      <CounterContextApp>
        <SharedComponentWithContext />
      </CounterContextApp>
    );

    const plusButton = screen.getByRole("button", { name: "Add" });
    const minusButton = screen.getByRole("button", { name: "Minus" });

    await user.click(plusButton);
    expect(screen.getByText("Value: 1")).toBeInTheDocument();

    await user.click(minusButton);
    expect(screen.getByText("Value: 0")).toBeInTheDocument();
  });
});

describe("<CounterReduxApp /> with with pass props", () => {
  it("works for React Redux app", async () => {
    const user = userEvent.setup();
    render(
      <CounterReduxApp>
        <SharedComponentWithRedux />
      </CounterReduxApp>
    );

    const plusButton = screen.getByRole("button", { name: "Add" });
    const minusButton = screen.getByRole("button", { name: "Minus" });

    await user.click(plusButton);
    expect(screen.getByText("Value: 1")).toBeInTheDocument();

    await user.click(minusButton);
    expect(screen.getByText("Value: 0")).toBeInTheDocument();
  });
});
