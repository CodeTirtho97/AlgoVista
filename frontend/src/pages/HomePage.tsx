import React from "react";
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
} from "@mui/material";

const HomePage: React.FC = () => {
  const theme = useTheme();
  const algorithmCategories = [
    { name: "Sorting", icon: "🔄", count: 8, link: "/algorithms/sorting" },
    { name: "Searching", icon: "🔍", count: 5, link: "/algorithms/searching" },
    { name: "Graph", icon: "🕸️", count: 7, link: "/algorithms/graph" },
    {
      name: "Dynamic Programming",
      icon: "📊",
      count: 6,
      link: "/algorithms/dp",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Box
        sx={{
          py: 8,
          borderRadius: 2,
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: "white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" sx={{ mb: 3 }}>
            Visualize Algorithms Like Never Before
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, maxWidth: "800px", mx: "auto" }}
          >
            AlgoVista transforms how you understand algorithms through
            interactive visualizations, comparisons, and personalized learning
            paths.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              component={RouterLink}
              to="/algorithms"
              variant="contained"
              color="inherit"
              size="large"
              sx={{
                color: theme.palette.primary.main,
                bgcolor: "white",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              Explore Algorithms
            </Button>
            <Button
              component={RouterLink}
              to="/learn"
              variant="outlined"
              color="inherit"
              size="large"
              sx={{ borderColor: "white", color: "white" }}
            >
              Start Learning
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Algorithm Categories
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {algorithmCategories.map((category) => (
            <Box
              key={category.name}
              sx={{
                flex: "1 1 calc(25% - 24px)",
                minWidth: "250px",
              }}
            >
              <Card
                component={RouterLink}
                to={category.link}
                sx={{
                  height: "100%",
                  display: "block",
                  textDecoration: "none",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {category.icon}
                  </Typography>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.count} algorithms
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      <Box sx={{ bgcolor: "grey.100", py: 4 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              alignItems: "center",
            }}
          >
            <Box sx={{ flex: "1 1 500px", minWidth: "300px" }}>
              <Typography variant="h3" component="h2" gutterBottom>
                Compare Algorithms Side by Side
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                Understand the efficiency differences between algorithms by
                comparing them in real-time on various datasets and conditions.
              </Typography>
              <Button
                component={RouterLink}
                to="/compare"
                variant="contained"
                color="primary"
                size="large"
              >
                Try Algorithm Comparison
              </Button>
            </Box>
            <Box sx={{ flex: "1 1 500px", minWidth: "300px" }}>
              <Paper
                elevation={2}
                sx={{
                  height: 240,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                }}
              >
                <Typography color="text.secondary">
                  Comparison Visualization Preview
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Key Features
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          <Box sx={{ flex: "1 1 300px", minWidth: "280px" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.light",
                  color: "primary.main",
                  width: 56,
                  height: 56,
                  mb: 2,
                }}
              >
                📊
              </Avatar>
              <Typography variant="h5" component="h3" gutterBottom>
                Interactive Visualizations
              </Typography>
              <Typography variant="body1" color="text.secondary">
                See algorithms in action with step-by-step visualizations that
                make complex concepts easy to understand.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "280px" }}>
            <Avatar
              sx={{
                bgcolor: "primary.light",
                color: "primary.main",
                width: 56,
                height: 56,
                mb: 2,
              }}
            >
              💻
            </Avatar>
            <Typography variant="h5" component="h3" gutterBottom>
              Code Integration
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Edit code and see visualization update in real-time. Supports
              multiple programming languages.
            </Typography>
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "280px" }}>
            <Avatar
              sx={{
                bgcolor: "primary.light",
                color: "primary.main",
                width: 56,
                height: 56,
                mb: 2,
              }}
            >
              🧩
            </Avatar>
            <Typography variant="h5" component="h3" gutterBottom>
              Learning Challenges
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Test your knowledge with interactive challenges and puzzles
              designed to reinforce algorithm understanding.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
