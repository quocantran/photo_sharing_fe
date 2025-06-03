import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";

const Register = ({ setContent }) => {
  const [message, setMessage] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  setContent("Register");
  const [loading, setLoading] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    const { confirm_password, ...user } = data;
    try {
      setLoading(true);
      const res = await fetch("https://xwtzjv-8081.csb.app/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: result.errors.join("\n") });
      } else {
        setMessage({ type: "success", text: "Registration successful!" });
        reset();
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Login Name"
              fullWidth
              {...register("login_name", {
                required: "Login name is required",
              })}
              error={!!errors.login_name}
              helperText={errors.login_name?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              fullWidth
              {...register("first_name", {
                required: "First name is required",
              })}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              fullWidth
              {...register("last_name", { required: "Last name is required" })}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              {...register("confirm_password", {
                validate: (value) =>
                  value === password || "Passwords do not match",
                required: "Confirm password is required",
              })}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Location" fullWidth {...register("location")} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Occupation"
              fullWidth
              {...register("occupation")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              {...register("description")}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              type="submit"
              variant="contained"
              fullWidth
            >
              {loading ? "Loading..." : "Register Me"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default Register;
