import "./App.css";

import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import SideBar from "./components/SideBar";
import UserComments from "./components/UserComments";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import { Navigate } from "react-router-dom";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import NewPhoto from "./components/NewPhoto";

const App = (props) => {
  const [currentLocation, setCurrentLocation] = useState(
    window.location.pathname
  );
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadPhotos, setReloadPhotos] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("https://xwtzjv-8081.csb.app/admin/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const userData = await res.json();
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Typography variant="h6">Loading...</Typography>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar
              setReloadPhotos={setReloadPhotos}
              reloadPhotos={reloadPhotos}
              setUser={setUser}
              content={content}
              user={user}
              currentLocation={currentLocation}
            />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <SideBar user={user} setCurrentLocation={setCurrentLocation} />
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route
                  path="/users/:userId"
                  element={
                    <ProtectedRoute user={user}>
                      <UserDetail
                        setContent={setContent}
                        setUser={setUser}
                        setCurrentLocation={setCurrentLocation}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users/comments/:userId"
                  element={
                    <ProtectedRoute user={user}>
                      <UserComments
                        setContent={setContent}
                        setUser={setUser}
                        setCurrentLocation={setCurrentLocation}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/users" replace />} />
                <Route
                  path="/photos/:userId"
                  element={
                    <ProtectedRoute user={user}>
                      <UserPhotos
                        reloadPhotos={reloadPhotos}
                        setUser={setUser}
                        setContent={setContent}
                        setCurrentLocation={setCurrentLocation}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/photos/new"
                  element={
                    <ProtectedRoute user={user}>
                      <NewPhoto user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <Login setContent={setContent} onLoginSuccess={setUser} />
                  }
                />
                <Route
                  path="/register"
                  element={<Register setContent={setContent} />}
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute user={user}>
                      <UserList
                        setContent={setContent}
                        setUser={setUser}
                        setCurrentLocation={setCurrentLocation}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
