import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Login = ({ onLoginSuccess, setContent }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm();
  setContent("Login");
  const handleLogin = async (data) => {
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("https://xwtzjv-8081.csb.app/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_name: data.login_name,
          password: data.password,
        }),
      });

      if (!res.ok) throw new Error("Login failed");

      const { token, user } = await res.json();
      localStorage.setItem("token", token);
      onLoginSuccess(user);
      navigate(`/users/${user._id}`, { replace: true });
    } catch (err) {
      setError("Invalid login name or password.");
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit(handleLogin)} noValidate>
        <TextField
          fullWidth
          label="Login Name"
          {...register("login_name", {
            required: "Login name must not be empty",
          })}
          error={!!errors.login_name}
          helperText={errors.login_name?.message}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          {...register("password", { required: "Password must not be empty" })}
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </Box>
    </Paper>
  );
};

export default Login;
