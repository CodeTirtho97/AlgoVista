import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Link,
  Stack,
  IconButton,
  useTheme,
  alpha,
  Tooltip,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MobileNavbar from "./MobileNavbar";
import { useThemeMode } from "../../ThemeProvider";

const Navbar: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, toggleTheme } = useThemeMode();

  const [algorithmsAnchorEl, setAlgorithmsAnchorEl] =
    useState<null | HTMLElement>(null);

  const handleAlgorithmsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAlgorithmsAnchorEl(event.currentTarget);
  };

  const handleAlgorithmsMenuClose = () => {
    setAlgorithmsAnchorEl(null);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const algorithmCategories = [
    { name: "Sorting", link: "/algorithms/sorting" },
    { name: "Searching", link: "/algorithms/searching" },
    { name: "Graph", link: "/algorithms/graph" },
    { name: "Dynamic Programming", link: "/algorithms/dp" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        backgroundColor: alpha(theme.palette.background.paper, 0.75),
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: "none",
                background: `linear-gradient(90deg, #00917c, #3f51b5)`, // New teal to indigo gradient
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
                letterSpacing: "0.5px",
              }}
            >
              AlgoVista
            </Typography>

            {!isMobile && (
              <Stack direction="row" spacing={1}>
                <Link
                  component={RouterLink}
                  to="/"
                  color="inherit"
                  underline="none"
                  sx={{
                    px: 2,
                    py: 2,
                    display: "inline-block",
                    color: isActive("/")
                      ? theme.palette.primary.main
                      : "text.primary",
                    fontWeight: isActive("/") ? "bold" : "medium",
                    transition: "all 0.2s",
                    borderBottom: isActive("/")
                      ? `2px solid ${theme.palette.primary.main}`
                      : "2px solid transparent",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Home
                </Link>

                <Box
                  sx={{
                    position: "relative",
                    "&:hover": {
                      "& .algorithms-menu": {
                        display: "block",
                      },
                    },
                  }}
                >
                  <Link
                    component={RouterLink}
                    to="/algorithms"
                    color="inherit"
                    underline="none"
                    aria-controls="algorithms-menu"
                    aria-haspopup="true"
                    onMouseEnter={handleAlgorithmsMenuOpen}
                    sx={{
                      px: 2,
                      py: 2,
                      display: "inline-flex",
                      alignItems: "center",
                      color:
                        isActive("/algorithms") ||
                        location.pathname.includes("/algorithms/")
                          ? theme.palette.primary.main
                          : "text.primary",
                      fontWeight:
                        isActive("/algorithms") ||
                        location.pathname.includes("/algorithms/")
                          ? "bold"
                          : "medium",
                      transition: "all 0.2s",
                      borderBottom:
                        isActive("/algorithms") ||
                        location.pathname.includes("/algorithms/")
                          ? `2px solid ${theme.palette.primary.main}`
                          : "2px solid transparent",
                      "&:hover": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    Algorithms
                    <KeyboardArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
                  </Link>

                  <Menu
                    id="algorithms-menu"
                    className="algorithms-menu"
                    anchorEl={algorithmsAnchorEl}
                    keepMounted
                    open={Boolean(algorithmsAnchorEl)}
                    onClose={handleAlgorithmsMenuClose}
                    MenuListProps={{
                      onMouseLeave: handleAlgorithmsMenuClose,
                      sx: { py: 0.5 },
                    }}
                    sx={{
                      mt: 1.5,
                      "& .MuiPaper-root": {
                        borderRadius: 2,
                        minWidth: 180,
                        boxShadow: 4,
                        background:
                          theme.palette.mode === "light"
                            ? `linear-gradient(145deg, ${alpha(
                                theme.palette.background.paper,
                                0.95
                              )}, ${alpha(
                                theme.palette.background.default,
                                0.95
                              )})`
                            : `linear-gradient(145deg, ${alpha(
                                theme.palette.background.paper,
                                0.95
                              )}, ${alpha(
                                theme.palette.background.default,
                                0.95
                              )})`,
                        backdropFilter: "blur(8px)",
                      },
                    }}
                  >
                    {algorithmCategories.map((category) => (
                      <MenuItem
                        key={category.name}
                        component={RouterLink}
                        to={category.link}
                        onClick={handleAlgorithmsMenuClose}
                        sx={{
                          borderRadius: 1,
                          mx: 0.5,
                          my: 0.5,
                          px: 2,
                          py: 1,
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          },
                          bgcolor:
                            location.pathname === category.link
                              ? alpha(theme.palette.primary.main, 0.1)
                              : "transparent",
                          fontWeight:
                            location.pathname === category.link
                              ? "medium"
                              : "normal",
                        }}
                      >
                        {category.name}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                <Link
                  component={RouterLink}
                  to="/compare"
                  color="inherit"
                  underline="none"
                  sx={{
                    px: 2,
                    py: 2,
                    display: "inline-block",
                    color: isActive("/compare")
                      ? theme.palette.primary.main
                      : "text.primary",
                    fontWeight: isActive("/compare") ? "bold" : "medium",
                    transition: "all 0.2s",
                    borderBottom: isActive("/compare")
                      ? `2px solid ${theme.palette.primary.main}`
                      : "2px solid transparent",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Compare
                </Link>

                <Link
                  component={RouterLink}
                  to="/learn"
                  color="inherit"
                  underline="none"
                  sx={{
                    px: 2,
                    py: 2,
                    display: "inline-block",
                    color: isActive("/learn")
                      ? theme.palette.primary.main
                      : "text.primary",
                    fontWeight: isActive("/learn") ? "bold" : "medium",
                    transition: "all 0.2s",
                    borderBottom: isActive("/learn")
                      ? `2px solid ${theme.palette.primary.main}`
                      : "2px solid transparent",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Learn
                </Link>
              </Stack>
            )}
          </Box>

          {isMobile ? (
            <MobileNavbar themeMode={mode} toggleTheme={toggleTheme} />
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip
                title={`Switch to ${mode === "light" ? "Dark" : "Light"} Mode`}
              >
                <IconButton
                  onClick={toggleTheme}
                  size="small"
                  sx={{
                    color: "text.secondary",
                    mr: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {mode === "light" ? (
                    <DarkModeIcon fontSize="small" />
                  ) : (
                    <LightModeIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>

              <Button
                component={RouterLink}
                to="/login"
                variant="text"
                color="inherit"
                sx={{
                  fontWeight: "medium",
                  color: "text.primary",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                Login
              </Button>

              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                color="primary"
                sx={{
                  px: 3,
                  fontWeight: "medium",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                Sign Up
              </Button>
            </Stack>
          )}
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
