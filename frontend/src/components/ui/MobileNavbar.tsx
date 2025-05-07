import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  ListItemIcon,
  Collapse,
  Button,
  Typography,
  useTheme,
  alpha,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import CodeIcon from "@mui/icons-material/Code";
import CompareIcon from "@mui/icons-material/Compare";
import SchoolIcon from "@mui/icons-material/School";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SearchIcon from "@mui/icons-material/Search";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface MobileNavbarProps {
  themeMode: "light" | "dark";
  toggleTheme: () => void;
}

// Define the submenu item type
interface SubMenuItem {
  name: string;
  icon: React.ReactNode;
  link: string;
}

// Define the main menu item type
interface MenuItem {
  name: string;
  icon: React.ReactNode;
  link: string;
  submenu?: SubMenuItem[];
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  themeMode,
  toggleTheme,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [algorithmsOpen, setAlgorithmsOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleAlgorithmsToggle = () => {
    setAlgorithmsOpen(!algorithmsOpen);
  };

  const algorithmCategories: SubMenuItem[] = [
    {
      name: "Sorting",
      icon: <EqualizerIcon />,
      link: "/algorithms/sorting",
    },
    {
      name: "Searching",
      icon: <SearchIcon />,
      link: "/algorithms/searching",
    },
    {
      name: "Graph",
      icon: <AccountTreeIcon />,
      link: "/algorithms/graph",
    },
    {
      name: "Dynamic Programming",
      icon: <BubbleChartIcon />,
      link: "/algorithms/dp",
    },
  ];

  const menuItems: MenuItem[] = [
    { name: "Home", icon: <HomeIcon />, link: "/" },
    {
      name: "Algorithms",
      icon: <CodeIcon />,
      link: "/algorithms",
      submenu: algorithmCategories,
    },
    { name: "Compare", icon: <CompareIcon />, link: "/compare" },
    { name: "Learn", icon: <SchoolIcon />, link: "/learn" },
  ];

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleDrawerToggle}
        sx={{
          color: "text.primary",
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          },
          transition: "all 0.2s ease",
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            borderRadius: "12px 0 0 12px",
            background:
              theme.palette.mode === "light"
                ? `linear-gradient(145deg, ${alpha(
                    theme.palette.background.paper,
                    0.95
                  )}, ${alpha(theme.palette.background.default, 0.95)})`
                : `linear-gradient(145deg, ${alpha(
                    theme.palette.background.paper,
                    0.95
                  )}, ${alpha(theme.palette.background.default, 0.95)})`,
            backdropFilter: "blur(8px)",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography
            component={RouterLink}
            to="/"
            variant="h6"
            sx={{
              textDecoration: "none",
              fontWeight: "bold",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
            }}
            onClick={() => setOpen(false)}
          >
            AlgoVista
          </Typography>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              bgcolor: alpha(theme.palette.error.main, 0.08),
              "&:hover": {
                bgcolor: alpha(theme.palette.error.main, 0.12),
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          <Button
            startIcon={
              themeMode === "light" ? <DarkModeIcon /> : <LightModeIcon />
            }
            onClick={toggleTheme}
            fullWidth
            variant="outlined"
            sx={{
              justifyContent: "flex-start",
              borderRadius: 1,
              mb: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.text.primary,
              borderColor: "transparent",
              py: 1,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                borderColor: "transparent",
              },
            }}
          >
            <Typography variant="body2">
              Switch to {themeMode === "light" ? "Dark" : "Light"} Mode
            </Typography>
          </Button>
        </Box>

        <List
          sx={{
            width: "100%",
            "& .MuiListItem-root": {
              borderRadius: 1,
              my: 0.5,
              mx: 1,
              width: "auto",
            },
          }}
        >
          {menuItems.map((item) => (
            <React.Fragment key={item.name}>
              {item.submenu ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={handleAlgorithmsToggle}
                      sx={{
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        bgcolor: algorithmsOpen
                          ? alpha(theme.palette.primary.main, 0.08)
                          : "transparent",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                        },
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.name} />
                      {algorithmsOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={algorithmsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.submenu.map((subItem) => (
                        <ListItem key={subItem.name} disablePadding>
                          <ListItemButton
                            component={RouterLink}
                            to={subItem.link}
                            onClick={handleDrawerToggle}
                            sx={{
                              pl: 4,
                              borderRadius: 1,
                              mx: 1,
                              my: 0.5,
                              "&:hover": {
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.08
                                ),
                              },
                            }}
                          >
                            <ListItemIcon>{subItem.icon}</ListItemIcon>
                            <ListItemText primary={subItem.name} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to={item.link}
                    onClick={handleDrawerToggle}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>

        <Divider sx={{ my: 2, opacity: 0.1 }} />

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            component={RouterLink}
            to="/login"
            onClick={handleDrawerToggle}
            sx={{ mb: 2 }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/signup"
            onClick={handleDrawerToggle}
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileNavbar;
