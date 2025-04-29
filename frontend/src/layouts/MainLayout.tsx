import React from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Link,
  Stack,
  Divider,
} from "@mui/material";

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Container
            maxWidth="xl"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: "none",
                color: "white",
                fontWeight: "bold",
              }}
            >
              AlgoVista
            </Typography>

            <Stack direction="row" spacing={4}>
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                underline="none"
              >
                Home
              </Link>
              <Link
                component={RouterLink}
                to="/algorithms"
                color="inherit"
                underline="none"
              >
                Algorithms
              </Link>
              <Link
                component={RouterLink}
                to="/compare"
                color="inherit"
                underline="none"
              >
                Compare
              </Link>
              <Link
                component={RouterLink}
                to="/learn"
                color="inherit"
                underline="none"
              >
                Learn
              </Link>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Link
                component={RouterLink}
                to="/login"
                color="inherit"
                underline="none"
              >
                Login
              </Link>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                color="secondary"
                size="small"
              >
                Sign Up
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{ bgcolor: "grey.900", color: "white", py: 6, mt: "auto" }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
              <Typography variant="h6" gutterBottom>
                AlgoVista
              </Typography>
              <Typography variant="body2" color="grey.400">
                Interactive algorithm visualization platform to transform how
                developers understand and learn algorithms.
              </Typography>
            </Box>

            <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
              <Typography variant="subtitle1" gutterBottom>
                Features
              </Typography>
              <Stack spacing={1}>{/* Links remain the same */}</Stack>
            </Box>

            <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
              <Typography variant="subtitle1" gutterBottom>
                Resources
              </Typography>
              <Stack spacing={1}>{/* Links remain the same */}</Stack>
            </Box>

            <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
              <Typography variant="subtitle1" gutterBottom>
                Contact
              </Typography>
              <Stack spacing={1}>{/* Links remain the same */}</Stack>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "grey.800", my: 4 }} />

          <Typography variant="body2" color="grey.500" align="center">
            &copy; {new Date().getFullYear()} AlgoVista. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
