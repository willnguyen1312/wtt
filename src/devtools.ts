// Credit - https://github.com/pmndrs/zustand/blob/6109bc3bd0f3850c2d9546956de971f27834ac7a/src/middleware/devtools.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import type {} from "@redux-devtools/extension";

const isDEV = import.meta.env.MODE !== "production";
// const isDEV = process.env.NODE_ENV === "production";

// FIXME https://github.com/reduxjs/redux-devtools/issues/1097
type Message = {
  type: string;
  payload?: any;
  state?: any;
};

export const devtools = isDEV
  ? ({ getState, setState, dispatch }) => {
      const extensionConnector = window.__REDUX_DEVTOOLS_EXTENSION__;

      if (!extensionConnector) {
        // console.warn("Please install/enable Redux devtools extension");
        return;
      }

      const connection = extensionConnector.connect({});

      const initialState = getState();

      connection.init(initialState);

      (
        connection as unknown as {
          // FIXME https://github.com/reduxjs/redux-devtools/issues/1097
          subscribe: (
            listener: (message: Message) => void,
          ) => (() => void) | undefined;
        }
      ).subscribe((message) => {
        switch (message.type) {
          case "ACTION":
            return parseJsonThen(message.payload, (action) => {
              dispatch(action);
              return;
            });

          case "DISPATCH":
            switch (message.payload.type) {
              case "RESET":
                setState(initialState);
                return connection.init(getState());

              case "COMMIT":
                return connection.init(getState());

              case "ROLLBACK":
                return parseJsonThen(message.state, (state) => {
                  setState(state);
                  connection.init(getState());
                });

              case "JUMP_TO_ACTION":
                return parseJsonThen(message.state, (state: any) => {
                  setState(state);

                  if (state._meta?.stackTrace) {
                    console.clear();
                    console.log(state._meta.stackTrace);
                  }
                });

              case "IMPORT_STATE": {
                const { nextLiftedState } = message.payload;
                const lastComputedState =
                  nextLiftedState.computedStates.slice(-1)[0]?.state;
                if (!lastComputedState) return;

                setState(lastComputedState);
                connection?.send(null as any, nextLiftedState);
                return;
              }
            }
            return;
        }
      });

      return {
        dispatch: (action: any) => {
          const stackTrace = new Error("stack trace").stack ?? "";

          connection.send(action, { ...getState(), _meta: { stackTrace } });
        },
      };
    }
  : undefined;

const parseJsonThen = <T>(
  stringified: string,
  callBack: (parsed: T) => void,
) => {
  let parsed: T | undefined;
  try {
    parsed = JSON.parse(stringified);
  } catch (e) {
    console.error("Could not parse the received json", e);
  }

  if (parsed) callBack(parsed as T);
};
