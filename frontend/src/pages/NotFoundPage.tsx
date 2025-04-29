import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: "6rem", fontWeight: "bold" }}
        >
          404
        </Typography>
        <Typography variant="h4" component="h2" sx={{ my: 3 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
          size="large"
        >
          Go back home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
