import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

document.addEventListener("contextmenu", (event) => {
  const target = event.target;

  if (target instanceof Element && target.closest("img")) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
