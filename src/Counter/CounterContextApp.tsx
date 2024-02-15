/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useReducer, useContext } from "react";

// Initial state
const initialState = { count: 0 };

type State = typeof initialState;

// Create context
const CounterContext = createContext<{
  state: State;
  dispatch: React.Dispatch<any>;
} | null>(null);

// Reducer function
function counterReducer(state: State, action): State {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// Counter provider
function CounterProvider({ children }) {
  const [state, dispatch] = useReducer(counterReducer, initialState);
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}

// Custom hooks to use counter state and dispatch
export function useSelector(selector: (state) => any) {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error("useCounterState must be used within a CounterProvider");
  }

  return selector(context.state);
}

export function useDispatch() {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error("useCounterDispatch must be used within a CounterProvider");
  }
  return context.dispatch;
}

function App({ children }) {
  return <CounterProvider>{children}</CounterProvider>;
}

export default App;
