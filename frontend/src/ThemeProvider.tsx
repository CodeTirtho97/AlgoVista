import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme, darkTheme } from "./theme";

// Create a context for theme mode
type ThemeContextType = {
  mode: "light" | "dark";
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useThemeMode = () => useContext(ThemeContext);

// Props type for the ThemeProvider component
interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Check if user has a preference stored in localStorage
  const storedTheme = localStorage.getItem("themeMode") as
    | "light"
    | "dark"
    | null;

  // Check system preference if no stored preference
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Set initial theme mode
  const [mode, setMode] = useState<"light" | "dark">(
    storedTheme || (prefersDarkMode ? "dark" : "light")
  );

  // Toggle theme function
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // Only change theme if user hasn't explicitly set a preference
      if (!localStorage.getItem("themeMode")) {
        setMode(e.matches ? "dark" : "light");
      }
    };

    // Add listener for preference changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Select the appropriate theme based on mode
  const currentTheme = mode === "light" ? theme : darkTheme;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
