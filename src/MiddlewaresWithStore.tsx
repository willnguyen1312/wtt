import React, { useEffect } from "react";

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

type AsyncAction = (dispatch: Dispatch, state: State) => void;

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

  const dispatch = (action: Action | AsyncAction) => {
    if (typeof action === "function") {
      action(dispatch, state);
      return;
    } else {
      state = arg.reducer(state, action);
    }

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

      <Child dispatch={storeRef.current.dispatch} state={state} />
    </div>
  );
}

function Child({ dispatch, state }: { dispatch: Dispatch; state: State }) {
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

      <p>Value: {state.data}</p>

      <button
        onClick={() => {
          dispatch(async (dispatch) => {
            // Wait 1s
            await new Promise((resolve) => setTimeout(resolve, 1000));
            dispatch({ type: "setData", payload: "Data from async action" });
          });
        }}
      >
        Fetch data
      </button>
    </div>
  );
}
