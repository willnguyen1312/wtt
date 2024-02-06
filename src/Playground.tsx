import { useEffect } from "react";

const rejected = Promise.reject(new Error("oops"));

setTimeout(() => {
  rejected.catch((err) => {
    console.log("OMG " + err);
  });
}, 1000);

globalThis.onunhandledrejection = (event) => {
  console.log(event.type);
};

globalThis.addEventListener("rejectionhandled", (event) => {
  console.log(event.type);
});

async function asyncCall() {
  throw new Error("Error from async call function.");
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
    </>
  );
}
