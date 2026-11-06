import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/** Renders the site and resolves once its type has loaded and its first frame has been laid out. */
export async function boot() {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  await new Promise(requestAnimationFrame);
  await Promise.race([document.fonts.ready, new Promise((resolve) => window.setTimeout(resolve, 1500))]);
  await new Promise(requestAnimationFrame);
}
