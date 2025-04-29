import React from "react";
import { Box, Typography, Paper, Container } from "@mui/material";

const AlgorithmsPage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Algorithm Catalog
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Explore our collection of interactive algorithm visualizations across
          various categories.
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1">
          We're currently building our algorithm visualization engine. Check
          back soon to explore interactive visualizations for sorting,
          searching, graph algorithms, and more!
        </Typography>
      </Paper>
    </Container>
  );
};

export default AlgorithmsPage;
