import { Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

const SideBar = (props) => {
  const { setCurrentLocation, user } = props;
  return (
    <div className="sidebar-container">
      {user && (
        <Link className="nav-link" to="/users">
          <Typography variant="h6" color="inherit">
            Users
          </Typography>
        </Link>
      )}

      {user && (
        <Link className="nav-link" to={`/users/${user._id}`}>
          <Typography variant="h6" color="inherit">
            Profile
          </Typography>
        </Link>
      )}

      {user && (
        <Link className="nav-link" to={`/photos/${user._id}`}>
          <Typography variant="h6" color="inherit">
            Your Photos
          </Typography>
        </Link>
      )}

      {!user && (
        <Link className="nav-link" to="/login">
          <Typography variant="h6" color="inherit">
            Login
          </Typography>
        </Link>
      )}

      {!user && (
        <Link className="nav-link" to="/register">
          <Typography variant="h6" color="inherit">
            Register
          </Typography>
        </Link>
      )}
    </div>
  );
};

export default SideBar;
