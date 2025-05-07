import React from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
  Container,
  Divider,
  Typography,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import Navbar from "../components/ui/Navbar";
import { useThemeMode } from "../ThemeProvider";

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const { mode } = useThemeMode();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background:
          mode === "light"
            ? "linear-gradient(145deg, #f7f9fc, #ffffff)"
            : "linear-gradient(145deg, #121212, #1e1e1e)",
      }}
    >
      <Navbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 2, md: 4 },
          px: { xs: 0, sm: 2 },
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 6,
          mt: "auto",
          background:
            mode === "light"
              ? "linear-gradient(145deg, #f7f9fc, #eef2f6)"
              : "linear-gradient(145deg, #1a1a1a, #121212)",
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AlgoVista
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interactive algorithm visualization platform to transform how
                developers understand and learn algorithms. Perfect for students
                preparing for technical interviews.
              </Typography>
            </Box>

            <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Features
              </Typography>
              <Stack spacing={1}>
                <Typography
                  component="a"
                  href="/algorithms"
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  Algorithm Library
                </Typography>
                <Typography
                  component="a"
                  href="/compare"
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  Algorithm Comparison
                </Typography>
                <Typography
                  component="a"
                  href="/learn"
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  Learning Paths
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Resources
              </Typography>
              <Stack spacing={1}>
                <Typography
                  component="a"
                  href="#"
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  Documentation
                </Typography>
                <Typography
                  component="a"
                  href="#"
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  API Reference
                </Typography>
                <Typography
                  component="a"
                  href="#"
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  GitHub Repository
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Contact
              </Typography>
              <Stack spacing={1}>
                <Typography
                  component="a"
                  href="mailto:support@algovista.com"
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  support@algovista.com
                </Typography>
                <Typography
                  component="a"
                  href="#"
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  Feedback
                </Typography>
                <Typography
                  component="a"
                  href="#"
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  Community
                </Typography>
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ my: 4, opacity: 0.1 }} />

          <Typography variant="body2" color="text.secondary" align="center">
            &copy; {new Date().getFullYear()} AlgoVista. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
