import ReactDOM from "react-dom/client";
import App from "./LoseFocusApp";

const startApp = async () => {
  if (process.env.NODE_ENV === "development") {
    const { worker } = await import("./mocks/browser");
    return worker.start();
  }
};

startApp().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <>
      <App />
    </>
  );
});
