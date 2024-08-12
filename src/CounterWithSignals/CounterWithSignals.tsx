import { signal, computed } from "@preact/signals-react";

export const count = signal({
  hi: {
    there: "123",
  },
  numb: 1,
});

const doubleNumb = computed(() => count.value.numb * 2);

function increaseCount() {
  const previousValue = { ...count.value };
  previousValue.numb += 1;
  count.value = previousValue;
}

function Counter() {
  console.log("Counter render");
  return (
    <>
      <h1>Value: {count.value.numb}</h1>
      <div>
        <button onClick={increaseCount}>+</button>
      </div>
      <h1>Double Value: {doubleNumb.value}</h1>
    </>
  );
}

export const showSignal = signal(true);

export default function App() {
  console.log("App render");
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
