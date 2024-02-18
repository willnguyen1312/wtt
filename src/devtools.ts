// Credit - https://github.com/pmndrs/zustand/blob/6109bc3bd0f3850c2d9546956de971f27834ac7a/src/middleware/devtools.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import type {} from "@redux-devtools/extension";

// FIXME https://github.com/reduxjs/redux-devtools/issues/1097
type Message = {
  type: string;
  payload?: any;
  state?: any;
};

export const devtools = ({ getState, setState }) => {
  const extensionConnector =
    import.meta.env?.MODE !== "production" &&
    window.__REDUX_DEVTOOLS_EXTENSION__;

  if (!extensionConnector) {
    console.warn("Please install/enable Redux devtools extension");
    return;
  }

  const connection = extensionConnector.connect({});

  let isRecording = true;

  const setStateFromDevtools = (newState) => {
    const originalIsRecording = isRecording;
    isRecording = false;
    setState(newState);
    isRecording = originalIsRecording;
  };

  const initialState = getState();

  connection.init(initialState);

  (
    connection as unknown as {
      // FIXME https://github.com/reduxjs/redux-devtools/issues/1097
      subscribe: (
        listener: (message: Message) => void
      ) => (() => void) | undefined;
    }
  ).subscribe((message) => {
    switch (message.type) {
      // case "ACTION":
      //   if (typeof message.payload !== "string") {
      //     console.error("Unsupported action format");
      //     return;
      //   }
      //   return parseJsonThen<{ type: unknown; state?: any }>(
      //     message.payload,
      //     (action) => {
      //       dispatch(action);
      //     }
      //   );

      case "DISPATCH":
        switch (message.payload.type) {
          case "RESET":
            setStateFromDevtools(initialState);
            return connection.init(getState());

          case "COMMIT":
            return connection.init(getState());

          case "ROLLBACK":
            return parseJsonThen(message.state, (state) => {
              setStateFromDevtools(state);
              connection.init(getState());
            });

          case "JUMP_TO_STATE":
          case "JUMP_TO_ACTION":
            return parseJsonThen(message.state, (state) => {
              setStateFromDevtools(state);
              return;
            });

          case "IMPORT_STATE": {
            const { nextLiftedState } = message.payload;
            const lastComputedState =
              nextLiftedState.computedStates.slice(-1)[0]?.state;
            if (!lastComputedState) return;

            setStateFromDevtools(lastComputedState);
            connection?.send(
              null as any, // FIXME no-any
              nextLiftedState
            );
            return;
          }

          case "PAUSE_RECORDING":
            return (isRecording = !isRecording);
        }
        return;
    }
  });

  return {
    dispatch: (action: any) => {
      connection.send(action, getState());
    },
  };
};

const parseJsonThen = <T>(stringified: string, f: (parsed: T) => void) => {
  let parsed: T | undefined;
  try {
    parsed = JSON.parse(stringified);
  } catch (e) {
    console.error(
      "[zustand devtools middleware] Could not parse the received json",
      e
    );
  }
  if (parsed !== undefined) f(parsed as T);
};
