import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {App} from "src/App";
import {AuthProvider} from "src/contexts/AuthContext";
import "src/styles/main.scss";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element \"#root\" not found");
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
