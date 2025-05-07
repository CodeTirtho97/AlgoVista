import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Avatar,
  useTheme,
  alpha,
  Chip,
  IconButton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CodeIcon from "@mui/icons-material/Code";
import BarChartIcon from "@mui/icons-material/BarChart";
import SchoolIcon from "@mui/icons-material/School";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SearchIcon from "@mui/icons-material/Search";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import RestoreIcon from "@mui/icons-material/Restore";
import AbcIcon from "@mui/icons-material/Abc";
import TimelineIcon from "@mui/icons-material/Timeline";

// Update type definition for setTimeout/clearTimeout
type TimeoutType = ReturnType<typeof setTimeout>;

// Sample sorting visualization demo component
const SortingVisualizer = () => {
  const theme = useTheme();
  const [array, setArray] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [compareIndex, setCompareIndex] = useState(-1);
  const [sortingComplete, setSortingComplete] = useState(false);
  const [sortingInterval, setSortingInterval] = useState<TimeoutType | null>(
    null
  );

  // Generate new random array
  const generateArray = () => {
    // Initialize with proper typing
    const newArray: number[] = [];

    for (let i = 0; i < 15; i++) {
      newArray.push(Math.floor(Math.random() * 50) + 5);
    }

    setArray(newArray);
    setSortingComplete(false);
    setCurrentIndex(-1);
    setCompareIndex(-1);
  };

  // Initialize array on component mount
  useEffect(() => {
    generateArray();
    return () => {
      if (sortingInterval) clearTimeout(sortingInterval);
    };
  }, []);

  // Bubble sort visualization
  const bubbleSort = () => {
    setSorting(true);
    const arrayCopy = [...array];
    let i = 0;
    let j = 0;
    let swapped = false;

    const interval = setInterval(() => {
      if (i < arrayCopy.length - 1) {
        if (j < arrayCopy.length - i - 1) {
          setCurrentIndex(j);
          setCompareIndex(j + 1);

          if (arrayCopy[j] > arrayCopy[j + 1]) {
            // Swap
            const temp = arrayCopy[j];
            arrayCopy[j] = arrayCopy[j + 1];
            arrayCopy[j + 1] = temp;
            setArray([...arrayCopy]);
            swapped = true;
          }
          j++;
        } else {
          j = 0;
          i++;
          if (!swapped) {
            setSortingComplete(true);
            setSorting(false);
            clearInterval(interval);
            setSortingInterval(null);
          }
          swapped = false;
        }
      } else {
        setSortingComplete(true);
        setSorting(false);
        clearInterval(interval);
        setSortingInterval(null);
      }
    }, 150);

    setSortingInterval(interval);
  };

  // Start/pause sorting
  const toggleSorting = () => {
    if (sorting) {
      if (sortingInterval) clearInterval(sortingInterval);
      setSortingInterval(null);
      setSorting(false);
    } else {
      if (sortingComplete) {
        generateArray();
        setTimeout(() => bubbleSort(), 100);
      } else {
        bubbleSort();
      }
    }
  };

  // Restart sorting with a new array
  const restartSorting = () => {
    if (sortingInterval) clearInterval(sortingInterval);
    setSortingInterval(null);
    setSorting(false);
    generateArray();
  };

  return (
    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          height: "200px",
          alignItems: "flex-end",
          mb: 2,
          overflow: "hidden",
        }}
      >
        {array.map((value, idx) => (
          <Box
            key={idx}
            sx={{
              height: `${value * 2.5}px`,
              width: "100%",
              mx: 0.5,
              borderRadius: "4px 4px 0 0",
              transition: "height 0.2s ease, background-color 0.2s ease",
              backgroundColor: sortingComplete
                ? theme.palette.success.main
                : idx === currentIndex || idx === compareIndex
                ? theme.palette.primary.main
                : theme.palette.secondary.main,
            }}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <IconButton
          onClick={toggleSorting}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          {sorting ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton
          onClick={restartSorting}
          sx={{
            bgcolor: alpha(theme.palette.secondary.main, 0.1),
            "&:hover": {
              bgcolor: alpha(theme.palette.secondary.main, 0.2),
            },
          }}
        >
          <RestartAltIcon />
        </IconButton>
      </Box>
      <Typography
        variant="caption"
        sx={{ display: "block", textAlign: "center", mt: 1 }}
      >
        {sortingComplete
          ? "Sort complete! Click restart to try again."
          : sorting
          ? "Bubble sort in progress..."
          : "Click play to start bubble sort visualization"}
      </Typography>
    </Box>
  );
};

// Define type for algorithm categories for type safety
interface AlgorithmCategory {
  name: string;
  icon: React.ReactNode;
  count: number;
  link: string;
  color: string;
  description: string;
}

const HomePage: React.FC = () => {
  const theme = useTheme();

  const algorithmCategories: AlgorithmCategory[] = [
    {
      name: "Sorting",
      icon: <EqualizerIcon fontSize="large" />,
      count: 8,
      link: "/algorithms/sorting",
      color: "#3a86ff",
      description:
        "Organize data efficiently with classic and advanced sorting techniques.",
    },
    {
      name: "Searching",
      icon: <SearchIcon fontSize="large" />,
      count: 5,
      link: "/algorithms/searching",
      color: "#ff006e",
      description:
        "Find elements quickly with binary search, linear search, and more.",
    },
    {
      name: "Graph",
      icon: <TimelineIcon fontSize="large" />,
      count: 7,
      link: "/algorithms/graph",
      color: "#8338ec",
      description:
        "Navigate networks and solve complex problems with graph algorithms.",
    },
    {
      name: "Dynamic Programming",
      icon: <BubbleChartIcon fontSize="large" />,
      count: 6,
      link: "/algorithms/dp",
      color: "#fb5607",
      description:
        "Solve complex problems by breaking them down into simpler subproblems.",
    },
    {
      name: "Greedy",
      icon: <CurrencyExchangeIcon fontSize="large" />,
      count: 5,
      link: "/algorithms/greedy",
      color: "#38b000",
      description:
        "Find optimal solutions by making locally optimal choices at each stage.",
    },
    {
      name: "Divide & Conquer",
      icon: <CallSplitIcon fontSize="large" />,
      count: 4,
      link: "/algorithms/divide-conquer",
      color: "#ffaa00",
      description:
        "Break problems into smaller subproblems, solve them independently, and combine results.",
    },
    {
      name: "Backtracking",
      icon: <RestoreIcon fontSize="large" />,
      count: 6,
      link: "/algorithms/backtracking",
      color: "#7209b7",
      description:
        "Find solutions incrementally by trying possibilities and backtracking when needed.",
    },
    {
      name: "Tree",
      icon: <AccountTreeIcon fontSize="large" />,
      count: 7,
      link: "/algorithms/tree",
      color: "#4cc9f0",
      description:
        "Explore hierarchical data structures with traversal and manipulation algorithms.",
    },
    {
      name: "Strings",
      icon: <AbcIcon fontSize="large" />,
      count: 6,
      link: "/algorithms/strings",
      color: "#f72585",
      description:
        "Analyze and manipulate text with pattern matching and transformation algorithms.",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Hero Section - Dark Mode */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          m: 0,
          p: 0,
          color: "white",
          textAlign: "center",
          // Dark mode gradient that blends with the dark theme
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(13,17,27,1) 0%, rgba(18,25,40,0.98) 100%)"
              : "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)",
          boxSizing: "border-box",
          borderBottom: (theme) =>
            theme.palette.mode === "dark"
              ? "1px solid rgba(255,255,255,0.05)"
              : "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {/* Dark mode background pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.04,
            display: { xs: "none", md: "block" },
            backgroundImage: (theme) =>
              theme.palette.mode === "dark"
                ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`
                : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Main content container */}
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            py: { xs: 8, md: 10 },
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "120px",
                  height: "120px",
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "radial-gradient(circle, rgba(0, 9, 15, 0.94) 0%, rgba(0,0,0,0) 70%)"
                      : "radial-gradient(circle, rgba(241, 243, 244, 0.96) 0%, rgba(255, 255, 255, 0.95) 70%)",
                  borderRadius: "50%",
                  zIndex: -1,
                },
              }}
            >
              <img
                src="/algo_icon.png"
                alt="AlgoVista Logo"
                style={{
                  height: "80px",
                  width: "auto",
                  position: "relative",
                }}
              />
            </Box>
          </Box>

          {/* Main heading - dark mode */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2.75rem", sm: "3.5rem", md: "4.5rem" },
              lineHeight: 1.1,
              mb: 2,
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "#a4fffa" // Teal color for dark mode
                  : theme.palette.primary.dark, // Primary dark for light mode
              textShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 0 20px rgba(164, 255, 250, 0.15)"
                  : "none",
            }}
          >
            Visualize Algorithms
          </Typography>

          {/* Subtitle with theme-aware styles */}
          <Typography
            variant="h2"
            component="div"
            sx={{
              fontWeight: 600,
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "#0099ff" // Bright blue for dark mode
                  : theme.palette.secondary.main, // Secondary for light mode
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              mb: 4,
              textShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 0 10px rgba(0, 153, 255, 0.2)"
                  : "none",
            }}
          >
            Like Never Before
          </Typography>

          {/* Description with theme-aware text color */}
          <Typography
            variant="h6"
            sx={{
              maxWidth: "700px",
              mx: "auto",
              color: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(0,0,0,0.7)",
              fontWeight: "normal",
              lineHeight: 1.6,
              mb: 6,
              px: { xs: 2, md: 4 },
              fontSize: { xs: "1rem", md: "1.1rem" },
            }}
          >
            Transform how you understand algorithms through interactive
            visualizations, side-by-side comparisons, and personalized learning
            paths. Perfect for students and developers alike.
          </Typography>

          {/* CTA buttons with theme-aware styles */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, md: 3 },
              justifyContent: "center",
              flexWrap: "wrap",
              mb: { xs: 6, md: 8 },
            }}
          >
            <Button
              component={RouterLink}
              to="/algorithms"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #0088ff, #00c3ff)"
                    : theme.palette.primary.main,
                color: "white",
                px: { xs: 3, md: 4 },
                py: { xs: 1.5, md: 1.75 },
                fontWeight: 600,
                fontSize: { xs: "1rem", md: "1.1rem" },
                borderRadius: "8px",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 4px 15px rgba(0, 153, 255, 0.3)"
                    : "0 4px 12px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "linear-gradient(45deg, #0070d8, #00adff)"
                      : theme.palette.primary.dark,
                  transform: "translateY(-3px)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 8px 20px rgba(0, 153, 255, 0.5)"
                      : "0 8px 20px rgba(0, 0, 0, 0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Explore Algorithms
            </Button>
            <Button
              component={RouterLink}
              to="/learn"
              variant="outlined"
              size="large"
              sx={{
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.2)"
                    : theme.palette.primary.main,
                borderWidth: 1,
                color: (theme) =>
                  theme.palette.mode === "dark"
                    ? "white"
                    : theme.palette.primary.main,
                px: { xs: 3, md: 4 },
                py: { xs: 1.5, md: 1.75 },
                fontWeight: 600,
                fontSize: { xs: "1rem", md: "1.1rem" },
                borderRadius: "8px",
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.03)"
                    : "transparent",
                "&:hover": {
                  borderColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "#00c3ff"
                      : theme.palette.primary.dark,
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(0, 153, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                  transform: "translateY(-3px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Start Learning
            </Button>
          </Box>

          {/* Algorithm Cards Row - Seamlessly connected */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: 2, md: 4 },
              flexWrap: { xs: "wrap", md: "nowrap" },
              mb: { xs: 2, md: 0 },
              // This transforms the cards up to create overlap with next section
              transform: { xs: "translateY(0)", md: "translateY(40px)" },
              zIndex: 10,
              position: "relative",
            }}
          >
            {/* Binary Search Card */}
            <Box
              sx={{
                width: { xs: "100%", sm: "30%", md: "220px" },
                height: { xs: "120px", md: "140px" },
                backgroundColor: "rgba(18, 30, 53, 0.6)",
                backdropFilter: "blur(10px)",
                borderRadius: "8px",
                border: "1px solid rgba(0, 153, 255, 0.1)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Card header */}
              <Box
                sx={{
                  p: 1,
                  borderBottom: "1px solid rgba(0, 153, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Binary Search
                </Typography>
              </Box>

              {/* Simple visualization */}
              <Box
                sx={{
                  p: 1,
                  display: "flex",
                  justifyContent: "center",
                  height: "calc(100% - 40px)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 0.5,
                    height: "100%",
                  }}
                >
                  {[35, 20, 15, 30, 40, 50, 25].map((height, i) => (
                    <Box
                      key={i}
                      sx={{
                        height: `${height * 0.9}%`,
                        width: "8px",
                        backgroundColor:
                          i === 3 ? "#00c6ff" : "rgba(255,255,255,0.1)",
                        borderRadius: "2px 2px 0 0",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Bubble Sort Card */}
            <Box
              sx={{
                width: { xs: "100%", sm: "30%", md: "220px" },
                height: { xs: "120px", md: "140px" },
                backgroundColor: "rgba(18, 30, 53, 0.6)",
                backdropFilter: "blur(10px)",
                borderRadius: "8px",
                border: "1px solid rgba(0, 145, 124, 0.1)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Card header */}
              <Box
                sx={{
                  p: 1,
                  borderBottom: "1px solid rgba(0, 145, 124, 0.1)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Bubble Sort
                </Typography>
              </Box>

              {/* Simple visualization */}
              <Box
                sx={{
                  p: 1,
                  display: "flex",
                  justifyContent: "center",
                  height: "calc(100% - 40px)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 0.5,
                    height: "100%",
                  }}
                >
                  {[45, 25, 35, 15, 30, 20, 40, 10].map((height, i) => (
                    <Box
                      key={i}
                      sx={{
                        height: `${height * 0.9}%`,
                        width: "8px",
                        backgroundColor:
                          i === 2 || i === 3
                            ? "#00917c"
                            : "rgba(255,255,255,0.1)",
                        borderRadius: "2px 2px 0 0",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Graph Traversal Card */}
            <Box
              sx={{
                width: { xs: "100%", sm: "30%", md: "220px" },
                height: { xs: "120px", md: "140px" },
                backgroundColor: "rgba(18, 30, 53, 0.6)",
                backdropFilter: "blur(10px)",
                borderRadius: "8px",
                border: "1px solid rgba(63, 81, 181, 0.1)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Card header */}
              <Box
                sx={{
                  p: 1,
                  borderBottom: "1px solid rgba(63, 81, 181, 0.1)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Graph Traversal
                </Typography>
              </Box>

              {/* Simple graph visualization */}
              <Box
                sx={{
                  p: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "calc(100% - 40px)",
                }}
              >
                <svg width="100" height="60" viewBox="0 0 100 60">
                  <circle cx="50" cy="20" r="6" fill="#3f51b5" />
                  <circle cx="20" cy="40" r="6" fill="rgba(255,255,255,0.2)" />
                  <circle cx="80" cy="40" r="6" fill="rgba(255,255,255,0.2)" />
                  <line
                    x1="50"
                    y1="20"
                    x2="20"
                    y2="40"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                  />
                  <line
                    x1="50"
                    y1="20"
                    x2="80"
                    y2="40"
                    stroke="#3f51b5"
                    strokeWidth="2"
                  />
                  <line
                    x1="20"
                    y1="40"
                    x2="80"
                    y2="40"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                  />
                </svg>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Mini Demo Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              flex: "1 1 500px",
              minWidth: { xs: "100%", md: "50%" },
              overflow: "hidden",
              borderRadius: 3,
              boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background:
                theme.palette.mode === "light"
                  ? `linear-gradient(145deg, ${alpha(
                      theme.palette.background.paper,
                      0.9
                    )}, ${alpha(theme.palette.background.default, 0.8)})`
                  : `linear-gradient(145deg, ${alpha(
                      theme.palette.background.paper,
                      0.9
                    )}, ${alpha(theme.palette.background.default, 0.8)})`,
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography variant="h5" component="h2" fontWeight="bold">
                Try Sorting Visualizer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Watch how bubble sort works in real-time. Click play to start
                the visualization.
              </Typography>
            </Box>
            <SortingVisualizer />
          </Paper>

          <Box sx={{ flex: "1 1 500px", minWidth: { xs: "100%", md: "40%" } }}>
            <Typography
              variant="h3"
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              Learn by{" "}
              <span style={{ color: theme.palette.primary.main }}>Doing</span>
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ mb: 3, color: "text.secondary" }}
            >
              AlgoVista makes algorithms accessible through interactive
              visualizations. See how data moves, understand the logic behind
              complex operations, and gain intuition through hands-on
              exploration.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                component={RouterLink}
                to="/algorithms/sorting"
                variant="contained"
                color="primary"
                startIcon={<EqualizerIcon />}
              >
                More Sorting Algorithms
              </Button>
              <Button
                component={RouterLink}
                to="/compare"
                variant="outlined"
                color="primary"
              >
                Compare Algorithms
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Algorithm Categories */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: "bold",
              position: "relative",
              display: "inline-block",
              mb: 1,
            }}
          >
            Algorithm Categories
            <Box
              sx={{
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 60,
                height: 4,
                bgcolor: theme.palette.primary.main,
                borderRadius: 2,
              }}
            />
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mt: 3, maxWidth: "700px", mx: "auto" }}
          >
            Explore our organized collection of algorithms across major
            categories. Each algorithm includes visualizations, code samples,
            and real-world applications.
          </Typography>
        </Box>

        {/* Algorithm Categories Cards */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
          {algorithmCategories.map((category) => (
            <Box
              key={category.name}
              sx={{
                flex: "1 1 calc(25% - 16px)",
                minWidth: "250px",
                "@media (max-width: 900px)": {
                  flex: "1 1 calc(50% - 16px)",
                },
                "@media (max-width: 600px)": {
                  flex: "1 1 100%",
                },
                position: "relative", // Add position relative here
                zIndex: 1, // Add a normal z-index
              }}
            >
              <Card
                component={RouterLink}
                to={category.link}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  overflow: "visible",
                  position: "relative", // Add this to ensure proper containment
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  "&:hover": {
                    transform: "translateY(-12px)",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                    "& .category-icon": {
                      transform: "scale(1.1) translateY(-5px)",
                      boxShadow: `0 10px 25px ${alpha(category.color, 0.5)}`,
                    },
                  },
                }}
              >
                {/* Background gradient */}
                <Box
                  sx={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "30%",
                    background: `linear-gradient(145deg, ${alpha(
                      category.color,
                      0.2
                    )}, ${alpha(category.color, 0.1)})`,
                    borderRadius: "12px 12px 0 0",
                    zIndex: 0,
                  }}
                />

                <Box
                  className="category-icon"
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: category.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mt: 3,
                    mb: 1,
                    position: "relative",
                    zIndex: 1,
                    transition: "all 0.3s ease",
                    boxShadow: `0 8px 20px ${alpha(category.color, 0.3)}`,
                  }}
                >
                  {category.icon}
                </Box>
                <CardContent
                  sx={{ pt: 1, flexGrow: 1, zIndex: 1, position: "relative" }}
                >
                  <Typography
                    variant="h5"
                    component="h3"
                    align="center"
                    gutterBottom
                    fontWeight="bold"
                  >
                    {category.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mb: 2 }}
                  >
                    {category.description}
                  </Typography>
                  <Chip
                    label={`${category.count} algorithms`}
                    size="small"
                    sx={{
                      display: "flex",
                      mx: "auto",
                      fontWeight: 500,
                      backgroundColor: alpha(category.color, 0.1),
                      color: category.color,
                      borderRadius: "4px",
                    }}
                  />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Comparison Feature */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), py: 8 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 6,
              alignItems: "center",
            }}
          >
            <Box
              sx={{ flex: "1 1 500px", minWidth: { xs: "100%", md: "40%" } }}
            >
              <Chip
                label="FEATURED"
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  mb: 2,
                  borderRadius: "4px",
                  px: 1,
                }}
              />
              <Typography
                variant="h3"
                component="h2"
                fontWeight="bold"
                gutterBottom
              >
                Compare Algorithms Side by Side
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ mb: 3, color: "text.secondary" }}
              >
                Understand the efficiency differences between algorithms by
                comparing them in real-time on various datasets and conditions.
                Perfect for learning which algorithm to choose for specific
                scenarios.
              </Typography>
              <Button
                component={RouterLink}
                to="/compare"
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: `linear-gradient(90deg, #00917c, #3f51b5)`, // New teal to indigo gradient
                  boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Try Algorithm Comparison
              </Button>
            </Box>
            <Box
              sx={{
                flex: "1 1 500px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Paper
                elevation={4}
                sx={{
                  width: "100%",
                  height: "320px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 3,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                  transform: "translateY(0px)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0.05,
                    background:
                      "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')",
                  }}
                />
                <Box
                  sx={{ p: 4, textAlign: "center", zIndex: 1, width: "100%" }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Comparison Visualization Preview
                  </Typography>

                  {/* Simple chart with properly sized bars */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: 180,
                      position: "relative",
                    }}
                  >
                    {/* Y-axis label */}
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        left: -5,
                        top: "50%",
                        transform: "rotate(-90deg)",
                        color: "text.secondary",
                      }}
                    >
                      Time Complexity
                    </Typography>

                    {/* Chart bars and labels */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        height: "100%",
                        px: 3,
                      }}
                    >
                      {/* Quick Sort */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                          Quick Sort
                        </Typography>
                        <Box
                          sx={{
                            height: 80,
                            width: 30,
                            bgcolor: "#00917c",
                            borderRadius: "4px 4px 0 0",
                          }}
                        />
                        <Typography variant="caption" sx={{ mt: 2 }}>
                          O(n log n)
                        </Typography>
                      </Box>

                      {/* Merge Sort */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                          Merge Sort
                        </Typography>
                        <Box
                          sx={{
                            height: 80,
                            width: 30,
                            bgcolor: "#3f51b5",
                            borderRadius: "4px 4px 0 0",
                          }}
                        />
                        <Typography variant="caption" sx={{ mt: 2 }}>
                          O(n log n)
                        </Typography>
                      </Box>

                      {/* Bubble Sort */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                          Bubble Sort
                        </Typography>
                        <Box
                          sx={{
                            height: 140,
                            width: 30,
                            bgcolor: "#e63946",
                            borderRadius: "4px 4px 0 0",
                          }}
                        />
                        <Typography variant="caption" sx={{ mt: 2 }}>
                          O(n²)
                        </Typography>
                      </Box>
                    </Box>

                    {/* X-axis label */}
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        bottom: -20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        color: "text.secondary",
                      }}
                    >
                      Algorithm Type
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Key Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          fontWeight="bold"
          sx={{
            mb: 1,
            position: "relative",
            display: "inline-block",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Key Features
          <Box
            sx={{
              position: "absolute",
              bottom: -10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 60,
              height: 4,
              bgcolor: theme.palette.primary.main,
              borderRadius: 2,
            }}
          />
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          align="center"
          sx={{ mb: 6, mt: 3, maxWidth: "700px", mx: "auto" }}
        >
          Designed for students and developers, our platform makes algorithm
          learning intuitive and effective.
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          <Box
            sx={{
              flex: "1 1 300px",
              minWidth: "280px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              p: 3,
              height: "100%",
              position: "relative",
              "&:hover": {
                "& .feature-icon": {
                  transform: "translateY(-10px)",
                  boxShadow: `0 15px 30px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                },
              },
            }}
          >
            <Avatar
              className="feature-icon"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                width: 80,
                height: 80,
                mb: 3,
                transition: "all 0.3s ease",
              }}
            >
              <BarChartIcon fontSize="large" />
            </Avatar>
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              fontWeight="bold"
            >
              Interactive Visualizations
            </Typography>
            <Typography variant="body1" color="text.secondary">
              See algorithms in action with step-by-step visualizations that
              make complex concepts easy to understand. Control the speed and
              move forward or backward through each stage of execution.
            </Typography>
          </Box>

          <Box
            sx={{
              flex: "1 1 300px",
              minWidth: "280px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              p: 3,
              height: "100%",
              "&:hover": {
                "& .feature-icon": {
                  transform: "translateY(-10px)",
                  boxShadow: `0 15px 30px ${alpha(
                    theme.palette.secondary.main,
                    0.3
                  )}`,
                },
              },
            }}
          >
            <Avatar
              className="feature-icon"
              sx={{
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main,
                width: 80,
                height: 80,
                mb: 3,
                transition: "all 0.3s ease",
              }}
            >
              <CodeIcon fontSize="large" />
            </Avatar>
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              fontWeight="bold"
            >
              Code Integration
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Edit code and see visualization update in real-time. Supports
              multiple programming languages including Python, JavaScript, Java
              and C++. Perfect for understanding implementation details.
            </Typography>
          </Box>

          <Box
            sx={{
              flex: "1 1 300px",
              minWidth: "280px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              p: 3,
              height: "100%",
              "&:hover": {
                "& .feature-icon": {
                  transform: "translateY(-10px)",
                  boxShadow: `0 15px 30px ${alpha("#8338ec", 0.3)}`,
                },
              },
            }}
          >
            <Avatar
              className="feature-icon"
              sx={{
                bgcolor: alpha("#8338ec", 0.1),
                color: "#8338ec",
                width: 80,
                height: 80,
                mb: 3,
                transition: "all 0.3s ease",
              }}
            >
              <SchoolIcon fontSize="large" />
            </Avatar>
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              fontWeight="bold"
            >
              Learning Challenges
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Test your knowledge with interactive challenges and puzzles
              designed to reinforce algorithm understanding. Track your progress
              and master algorithms at your own pace.
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: alpha(theme.palette.primary.dark, 0.95),
          color: "white",
          py: 8,
          textAlign: "center",
          borderRadius: { xs: 0, sm: 4 },
          mx: { xs: 0, sm: 3 },
          mt: 4,
          mb: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background:
              "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgwKSI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmZiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')",
            zIndex: 0,
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            gutterBottom
          >
            Ready to Master Algorithms?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of students and developers who use AlgoVista to
            strengthen their algorithm skills and ace technical interviews.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              color="inherit"
              size="large"
              sx={{
                bgcolor: "white",
                color: theme.palette.primary.dark,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.9)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Create Free Account
            </Button>
            <Button
              component={RouterLink}
              to="/algorithms"
              variant="outlined"
              color="inherit"
              size="large"
              sx={{
                borderColor: "rgba(255,255,255,0.5)",
                color: "white",
                px: 4,
                py: 1.5,
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Explore Algorithms
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
