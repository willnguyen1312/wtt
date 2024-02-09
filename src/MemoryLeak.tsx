import { EventEmitter } from "events";

import { useEffect, useReducer } from "react";

const eventEmitter = new EventEmitter();
export default function MemoryLeak() {
  const [value, dispatch] = useReducer((a) => a + 1, 0);

  useEffect(() => {
    console.log("Listeners: ", eventEmitter.listeners("increment").length);
  }, [value]);

  eventEmitter.on("increment", () => {
    dispatch();
  });

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
