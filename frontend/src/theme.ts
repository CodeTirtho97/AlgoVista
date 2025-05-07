// src/theme.ts
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { alpha } from "@mui/material";

// Create a theme instance
let theme = createTheme({
  palette: {
  primary: {
    light: "#4caf93", // Teal-green light
    main: "#00917c", // Teal-green main
    dark: "#00695c", // Teal-green dark
    contrastText: "#fff",
  },
  secondary: {
    light: "#6573c3", // Indigo-blue light
    main: "#3f51b5", // Indigo-blue main
    dark: "#2c387e", // Indigo-blue dark
    contrastText: "#fff",
  },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#03a9f4",
    },
    success: {
      main: "#4caf50",
    },
    background: {
      default: "#f5f7fa", // Light gray with a subtle blue tint
      paper: "#ffffff",
    },
    text: {
      primary: "#2d3748", // Dark slate for improved readability
      secondary: "#718096", // Muted gray for secondary text
    },
    divider: alpha("#718096", 0.12),
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.01562em",
    },
    h2: {
      fontSize: "2.75rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.00833em",
    },
    h3: {
      fontSize: "2.25rem",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "0em",
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: "0.00735em",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "0em",
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.6,
      letterSpacing: "0.0075em",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: "0.00938em",
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: "0.00714em",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: "0.01071em",
    },
    button: {
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.75,
      letterSpacing: "0.02857em",
      textTransform: "none", // Changed from uppercase for a more modern look
    },
  },
  shape: {
    borderRadius: 10, // More rounded corners for a modern feel
  },
  components: {
    // Add custom component overrides
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 16px",
          transition: "all 0.2s ease-in-out",
          fontWeight: 500,
        },
        contained: {
          boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.15)",
          "&:hover": {
            boxShadow: "0 6px 15px 0 rgba(0, 0, 0, 0.20)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.10)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
        elevation1: {
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        },
        elevation2: {
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.07)",
        },
        elevation3: {
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.09)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          transition: "color 0.2s ease-in-out",
          "&:hover": {
            textDecoration: "none",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: "16px 0",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            transition: "all 0.2s",
            "&:hover": {
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            },
            "&.Mui-focused": {
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontWeight: 500,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "0.75rem",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: "0px 16px 16px 0px",
        },
      },
    },
  },
});

// Responsive typography
theme = responsiveFontSizes(theme);

// Dark mode theme
const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: "dark",
    primary: {
      light: "#5ba3ff",
      main: "#3a86ff", // Slightly adjusted for dark mode
      dark: "#0063cc",
      contrastText: "#fff",
    },
    secondary: {
      light: "#d36fdd",
      main: "#ae58c7", // Slightly adjusted for dark mode
      dark: "#8944a6",
      contrastText: "#fff",
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Dark paper
    },
    text: {
      primary: "#f8f9fa", // Light text for dark mode
      secondary: "#b0b8c4", // Light secondary text
    },
    divider: alpha("#f8f9fa", 0.12),
  },
});

export { theme, darkTheme };
export default theme;