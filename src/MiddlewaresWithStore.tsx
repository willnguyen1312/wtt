import React from "react";
import { devtools } from "./devtools";

type State = {
  value: number;
  addTwoCount: number;
  addOneCount: number;
  data: string;
};

type Dispatch = ReturnType<typeof createStore>["dispatch"];
type Action =
  | {
      type: "incrementOne";
    }
  | {
      type: "countOneActivity";
    }
  | {
      type: "incrementOneAsync";
    }
  | {
      type: "setData";
      payload: string;
    };

type AsyncAction = (dispatch: Dispatch, getState: () => State) => void;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "incrementOne":
      return {
        ...state,
        value: state.value + 1,
      };

    case "countOneActivity":
      return {
        ...state,
        addOneCount: state.addOneCount + 1,
      };

    case "setData":
      return {
        ...state,
        data: action.payload,
      };

    default:
      return state;
  }
}

const context = React.createContext<{
  dispatch: Dispatch;
  state: State;
} | null>(null);

type MiddleWare = (arg: {
  action: Action;
  dispatch: React.Dispatch<Action>;
  state: State;
}) => void;

export const logger: MiddleWare = ({ action, state }) => {
  console.log("Action from middleware:", action);
  console.log("State from middleware:", state);
};

const incrementOneMiddleWare: MiddleWare = ({ action, dispatch }) => {
  if (action.type === "incrementOne") {
    dispatch({ type: "countOneActivity" });
  }
};

const incrementOneAsyncMiddleWare: MiddleWare = ({ action, dispatch }) => {
  if (action.type === "incrementOneAsync") {
    setTimeout(() => {
      dispatch({ type: "incrementOne" });
    }, 1000);
  }
};

const middlewares: MiddleWare[] = [
  // logger,
  incrementOneMiddleWare,
  incrementOneAsyncMiddleWare,
];

type Subscriber = () => void;

export const createStore = (arg: {
  middlewares: MiddleWare[];
  reducer: (state: State, action: Action) => State;
  initialState: State;
}) => {
  let state = arg.initialState;
  const listeners: Set<Subscriber> = new Set();

  const getState = () => state;

  const setState = (newState: Partial<State>) => {
    state = { ...state, ...newState };
    listeners.forEach((listener) => listener());
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let devtoolsResult: any = undefined;

  const dispatch = (action: Action | AsyncAction) => {
    if (typeof action === "function") {
      action(dispatch, getState);
      return;
    } else {
      state = arg.reducer(state, action);
    }

    devtoolsResult?.dispatch(action);

    arg.middlewares.forEach((middleware) => {
      middleware({
        action,
        dispatch,
        state,
      });
    });

    listeners.forEach((listener) => listener());
  };

  devtoolsResult = devtools?.({
    getState,
    setState,
    dispatch,
  });

  return {
    dispatch,
    getState,
    setState,
    subscribe: (subscriber: Subscriber) => {
      listeners.add(subscriber);
      return () => {
        listeners.delete(subscriber);
      };
    },
  };
};

export default function Middlewares() {
  const storeRef = React.useRef<ReturnType<typeof createStore>>();

  if (!storeRef.current) {
    storeRef.current = createStore({
      middlewares,
      reducer,
      initialState: {
        value: 0,
        addTwoCount: 0,
        addOneCount: 0,
        data: "",
      },
    });
  }

  const state = React.useSyncExternalStore(
    storeRef.current.subscribe,
    storeRef.current.getState
  );

  // console.log("State from component:", state);

  return (
    <context.Provider
      value={{
        dispatch: storeRef.current.dispatch,
        state,
      }}
    >
      <div>
        <h1>Middlewares</h1>

        <Child />
      </div>
    </context.Provider>
  );
}

function Child() {
  const { dispatch, state } = React.useContext(context)!;

  const deferredState = React.useDeferredValue(state);

  return (
    <div>
      <h1>Child</h1>

      <button
        onClick={() => {
          React.startTransition(() => {
            dispatch({ type: "incrementOne" });
          });
        }}
      >
        Increment data
      </button>

      <GrandChild state={deferredState} />
    </div>
  );
}

const GrandChild = React.memo(({ state }: { state: State }) => {
  console.log({ state });
  const items: React.ReactNode[] = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowComponent key={i} />);
  }

  return (
    <div>
      <h1>GrandChild</h1>

      <p>{state.value}</p>

      {items}
    </div>
  );
});

function SlowComponent() {
  const startTime = performance.now();
  while (performance.now() - startTime < 2) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return null;
}
