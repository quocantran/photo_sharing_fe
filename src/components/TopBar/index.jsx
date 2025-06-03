import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function TopBar({ user, setUser, content }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://xwtzjv-8081.csb.app/admin/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("Logout successfully");
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          className="topbar-left"
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <Typography variant="h6" color="inherit">
            {user ? `Hi ${user.first_name}` : "Please Login"}
          </Typography>
          {user && (
            <>
              <Button color="inherit" onClick={() => navigate("/photos/new")}>
                Add Photo
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>

        <div className="topbar-right">
          <Typography variant="h6" color="inherit">
            {content}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
