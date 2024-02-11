import EventEmitter from "events";

import { useReducer } from "react";

export default function MemoryLeak() {
  const eventEmitter = new EventEmitter();
  const [value, dispatch] = useReducer((a) => a + 1, 0);

  for (let index = 0; index < 20; index++) {
    eventEmitter.on("increment", () => {
      dispatch();
    });
  }

  function increment() {
    eventEmitter.emit("increment");
  }

  return (
    <div>
      <h1>Memory Leak</h1>

      <p>Value: {value}</p>
      <button onClick={increment}>Counter</button>
    </div>
  );
}
