// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store";
import App from "./App";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#0284c7", // Blue color similar to what we had before
    },
    secondary: {
      main: "#7c3aed", // Purple color similar to what we had before
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Provides CSS baseline/reset */}
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
