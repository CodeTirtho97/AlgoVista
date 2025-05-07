// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store";
import App from "./App";
import { ThemeProvider } from "./ThemeProvider";

// Add Google Fonts preconnect for performance
const preconnectLink = document.createElement("link");
preconnectLink.rel = "preconnect";
preconnectLink.href = "https://fonts.googleapis.com";
document.head.appendChild(preconnectLink);

const preconnectGstatic = document.createElement("link");
preconnectGstatic.rel = "preconnect";
preconnectGstatic.href = "https://fonts.gstatic.com";
preconnectGstatic.crossOrigin = "anonymous";
document.head.appendChild(preconnectGstatic);

// Add Inter font which we use in our theme
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
document.head.appendChild(fontLink);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline /> {/* Provides CSS baseline/reset */}
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
