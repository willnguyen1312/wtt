import { useReducer, useRef } from "react";
import { flushSync } from "react-dom";

export default function Closure() {
  const [value, dispatch] = useReducer((a) => a + 1, 0);
  const valueRef = useRef(value);
  valueRef.current = value;

  function increment() {
    flushSync(() => {
      dispatch();
    });

    console.log("Value from method:", valueRef.current);
  }

  return (
    <div>
      <h1>Memory Leak</h1>

      <p>Value: {value}</p>
      <button onClick={increment}>Counter</button>
    </div>
  );
}
