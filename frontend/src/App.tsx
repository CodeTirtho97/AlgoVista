import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import MainLayout from "./layouts/MainLayout";

// Lazy loaded pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const AlgorithmsPage = lazy(() => import("./pages/AlgorithmsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Loading fallback component
const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      gap: 2,
    }}
  >
    <CircularProgress size={60} thickness={4} />
    <Typography variant="h6">Loading content...</Typography>
  </Box>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="algorithms" element={<AlgorithmsPage />} />
            {/* Additional routes will be added here */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
