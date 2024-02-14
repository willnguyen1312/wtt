/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import MiddlewaresWithStore, { createStore } from "./MiddlewaresWithStore";
import { userEvent } from "@testing-library/user-event";

describe("<MiddlewaresWithStore />", () => {
  it("handle the synchronous flow successfully", async () => {
    render(<MiddlewaresWithStore />);
    const user = userEvent.setup();

    const addOneButton = screen.getByRole("button", { name: "Add one" });

    await user.click(addOneButton);

    expect(screen.getByText("Value: 1")).toBeInTheDocument();
  });

  it("handle the asynchronous flow successfully", async () => {
    render(<MiddlewaresWithStore />);
    const user = userEvent.setup();

    const addOneAsyncButton = screen.getByRole("button", {
      name: "Add one async",
    });

    await user.click(addOneAsyncButton);

    expect(await screen.findByText("Value: 1")).toBeInTheDocument();
  });

  it("handle the async action successfully", async () => {
    vi.useFakeTimers();
    render(<MiddlewaresWithStore />);
    const user = userEvent.setup();

    const fetchDataButton = screen.getByRole("button", { name: "Fetch data" });

    user.click(fetchDataButton);

    vi.runAllTimersAsync();

    expect(
      await screen.findByText("Data from async action")
    ).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("should work for timer", async () => {
    vi.useFakeTimers();

    const fakeFunc = vi.fn();

    setTimeout(() => {
      fakeFunc();
    }, 5000);

    await vi.runAllTimersAsync();

    expect(fakeFunc).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});

describe.only("createStore", () => {
  it("should handle synchronous flow successfully", () => {
    const store: any = createStore({
      middlewares: [],
      reducer: (state, action) => {
        if (action.type === "increment") {
          return { ...state, value: state.value + 1 };
        }

        return state;
      },
      initialState: {
        value: 0,
      },
    } as unknown as Parameters<typeof createStore>[0]);

    expect(store.getState()).toEqual({ value: 0 });

    expect(store.dispatch({ type: "increment" }));

    expect(store.getState()).toEqual({ value: 1 });
  });

  it.only("should handle multiple middlewares flow successfully", () => {
    let stateFromMiddlewareOne: any;
    const store: any = createStore({
      middlewares: [
        ({ action, dispatch, state }) => {
          // stateFromMiddlewareOne = { ...state };
          if (action.type === "actionForMiddleWareOne") {
            stateFromMiddlewareOne = { ...state };
            dispatch({ type: "increment" });
          }
        },
        ({ action, dispatch }) => {
          if (action.type === "actionForMiddleWareTwo") {
            dispatch({ type: "increment" });
            dispatch({ type: "actionForMiddleWareOne" });
          }
        },
      ],
      reducer: (state, action) => {
        if (action.type === "increment") {
          return { ...state, value: state.value + 1 };
        }

        return state;
      },
      initialState: {
        value: 0,
      },
    } as unknown as Parameters<typeof createStore>[0]);

    expect(store.getState()).toEqual({ value: 0 });

    expect(store.dispatch({ type: "actionForMiddleWareTwo" }));

    expect(store.getState()).toEqual({ value: 2 });
    expect(stateFromMiddlewareOne).toEqual({ value: 1 });
  });

  it("should handle middleware with synchronous actions successfully", () => {
    const store: any = createStore({
      middlewares: [
        ({ action, dispatch }) => {
          if (action.type === "actionForMiddleWare") {
            dispatch({ type: "increment" });
          }
        },
      ],
      reducer: (state, action) => {
        if (action.type === "actionForMiddleWare") {
          return { ...state, value: state.value + 1 };
        }

        return state;
      },
      initialState: {
        value: 0,
      },
    } as unknown as Parameters<typeof createStore>[0]);

    expect(store.getState()).toEqual({ value: 0 });

    expect(store.dispatch({ type: "actionForMiddleWare" }));

    expect(store.getState()).toEqual({ value: 1 });
  });

  it("should handle middleware with asynchronous actions successfully", async () => {
    vi.useFakeTimers();

    const store: any = createStore({
      middlewares: [
        ({ action, dispatch }) => {
          if (action.type === "asyncActionForMiddleWare") {
            setTimeout(() => {
              dispatch({ type: "increment" });
            }, 1000);
          }
        },
      ],
      reducer: (state, action) => {
        if (action.type === "increment") {
          return { ...state, value: state.value + 1 };
        }

        return state;
      },
      initialState: {
        value: 0,
      },
    } as unknown as Parameters<typeof createStore>[0]);

    expect(store.getState()).toEqual({ value: 0 });

    expect(store.dispatch({ type: "asyncActionForMiddleWare" }));

    await vi.runAllTimersAsync();

    // Wait 1s
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(store.getState()).toEqual({ value: 1 });

    vi.useRealTimers();
  });
});
