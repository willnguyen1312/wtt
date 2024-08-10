import { signal } from "@preact/signals-react";

export const count = signal({
  hi: {
    there: "123",
  },
  numb: 1,
});

function increaseCount() {
  const previousValue = { ...count.value };
  previousValue.numb += 1;
  count.value = previousValue;
}

function Counter() {
  return (
    <>
      <h1>Value: {count.value.numb}</h1>
      <div>
        <button onClick={increaseCount}>+</button>
      </div>
    </>
  );
}

export const showSignal = signal(true);

export default function App() {
  return (
    <div className="App">
      <button
        onClick={() => {
          showSignal.value = !showSignal.value;
        }}
      >
        Toggle
      </button>
      {showSignal.value ? (
        <>
          <h1>Message: {count.value.hi.there}</h1>
          <Counter />
        </>
      ) : null}
    </div>
  );
}
