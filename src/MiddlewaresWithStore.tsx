import React, { useEffect } from "react";

type State = {
  value: number;
  addTwoCount: number;
  addOneCount: number;
};

type Action =
  | {
      type: "incrementOne";
    }
  | {
      type: "countOneActivity";
    }
  | {
      type: "incrementOneAsync";
    };

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

    default:
      return state;
  }
}

type MiddleWare = (arg: {
  action: Action;
  dispatch: React.Dispatch<Action>;
  state: State;
}) => void;

const logger: MiddleWare = ({ action, state }) => {
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
  logger,
  incrementOneMiddleWare,
  incrementOneAsyncMiddleWare,
];

type Subscriber = () => void;

const createStore = (arg: {
  middlewares: MiddleWare[];
  reducer: (state: State, action: Action) => State;
  initialState: State;
}) => {
  let state = arg.initialState;
  const listeners: Set<Subscriber> = new Set();

  const dispatch = (action: Action) => {
    state = arg.reducer(state, action);

    middlewares.forEach((middleware) => {
      middleware({
        action,
        dispatch,
        state,
      });
    });

    listeners.forEach((listener) => listener());
  };

  return {
    dispatch,
    getState: () => state,
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
      },
    });
  }

  const state = React.useSyncExternalStore(
    storeRef.current.subscribe,
    storeRef.current.getState
  );

  // console.log("State from component:", state);

  return (
    <div>
      <h1>Middlewares</h1>

      <p>Value: {state.value}</p>

      <button
        onClick={() => {
          storeRef.current?.dispatch({ type: "incrementOne" });
        }}
      >
        Add one
      </button>

      <button
        onClick={() => {
          storeRef.current?.dispatch({ type: "incrementOneAsync" });
        }}
      >
        Add one async
      </button>

      <Child dispatch={storeRef.current?.dispatch} />
    </div>
  );
}

function Child({
  dispatch,
}: {
  dispatch: ReturnType<typeof createStore>["dispatch"];
}) {
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      dispatch({ type: "incrementOne" });
    }
  }, [loaded, dispatch]);

  return (
    <div>
      <h1>Child</h1>
    </div>
  );
}
