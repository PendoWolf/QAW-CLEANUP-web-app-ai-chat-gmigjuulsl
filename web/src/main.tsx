import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { buildId } from "./pendo-build.js";
import "./styles.css";

// Start Pendo once, as an anonymous visitor. AuthProvider identifies the signed-in user.
pendo.initialize({
  buildId,
  visitor: { id: "" },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
