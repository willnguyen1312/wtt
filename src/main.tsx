// import { useState } from "react";
import ReactDOM from "react-dom/client";
// import { App } from "./Playground";
// import App from "./ErrorBoundary";
// import App from "./MiddlewaresWithStore";
import App from "./CounterWithSignals/CounterWithSignals";

const startApp = async () => {
  if (process.env.NODE_ENV === "development") {
    const { worker } = await import("./mocks/browser");
    return worker.start();
  }
};

// const App = () => {
//   const [value, setValue] = useState(0);

//   console.log("App:", value);

//   return (
//     <>
//       <h1>Value: {value}</h1>

//       <button
//         onClick={() => {
//           setValue(value + 1);

//           setValue((value) => value + 1);
//         }}
//       >
//         Click me
//       </button>
//     </>
//   );
// };

// console.log("App:", app);

startApp().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
});
