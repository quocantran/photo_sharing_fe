import React from "react";
import { Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      style={{
        textAlign: "center",
        paddingTop: "100px",
        height: "100vh",
      }}
    >
      <Typography variant="h2" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Sorry, the page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        style={{ marginTop: "20px" }}
      >
        Go to Home
      </Button>
    </Container>
  );
};

export default NotFound;
