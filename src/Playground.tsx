import { useEffect } from "react";

const rejected = Promise.reject(new Error("oops"));

setTimeout(() => {
  rejected.catch((err) => {
    console.log("OMG " + err);
  });
}, 1000);

globalThis.addEventListener("unhandledrejection", (event) => {
  console.log(event.reason);
});

globalThis.addEventListener("rejectionhandled", (event) => {
  console.log(event.reason);
});

globalThis.addEventListener("error", (event) => {
  console.log(event.error.stack);
});

async function asyncCall() {
  throw new Error("Error from async call function.");
}

function syncCall() {
  throw new Error("Error from sync call function.");
}

export function App() {
  useEffect(() => {
    async function run() {
      asyncCall();
    }

    run();
  }, []);

  return (
    <>
      <h1>Playground</h1>

      <button onClick={syncCall}>Click me</button>
    </>
  );
}
