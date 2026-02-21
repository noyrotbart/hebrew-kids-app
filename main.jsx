import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./hebrew-kids-app.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
