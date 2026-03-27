import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Import our custom Medical Design System CSS
import "./assets/styles/variables.css";
import "./assets/styles/global.css";
import "./assets/styles/layout.css";
import "./assets/styles/components.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
