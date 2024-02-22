import ReactDOM from "react-dom/client";
// import { App } from "./Playground";
// import App from "./ErrorBoundary";
import App from "./MiddlewaresWithStore";

const startApp = async () => {
  if (process.env.NODE_ENV === "development") {
    const { worker } = await import("./mocks/browser");
    return worker.start();
  }
};

const app = <App />;

console.log("App:", app);

startApp().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(<>{app}</>);
});
