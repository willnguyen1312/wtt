import React from "react";
import { flushSync } from "react-dom";

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
      type: "incrementTwo";
    }
  | {
      type: "countTwoActivity";
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

    case "incrementTwo":
      return {
        ...state,
        value: state.value + 2,
      };

    case "countTwoActivity":
      return {
        ...state,
        addTwoCount: state.addTwoCount + 1,
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

const incrementTwoMiddleWare: MiddleWare = ({ action, dispatch }) => {
  if (action.type === "incrementTwo") {
    dispatch({ type: "countTwoActivity" });
  }
};

const middlewares: MiddleWare[] = [
  logger,
  incrementOneMiddleWare,
  incrementTwoMiddleWare,
];

export default function Middlewares() {
  const [state, dispatch] = React.useReducer(reducer, {
    value: 0,
    addTwoCount: 0,
    addOneCount: 0,
  });

  const stateRef = React.useRef(state);
  stateRef.current = state;

  function dispatchWithMiddleware(action: Action) {
    flushSync(() => {
      dispatch(action);
    });

    middlewares.forEach((middleware) => {
      middleware({ action, dispatch, state: stateRef.current });
    });
  }

  console.log("State from component:", state);

  return (
    <div>
      <h1>Middlewares</h1>

      <p>Value: {state.value}</p>

      <button
        onClick={() => {
          dispatchWithMiddleware({ type: "incrementOne" });
        }}
      >
        Add one
      </button>

      <button
        onClick={() => {
          dispatchWithMiddleware({ type: "incrementTwo" });
        }}
      >
        Add two
      </button>
    </div>
  );
}
