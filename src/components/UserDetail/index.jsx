import React from "react";
import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import "./styles.css";
import { Link, useLocation, useParams } from "react-router-dom";
import models from "../../modelData/models";
import fetchModel from "../../lib/fetchModelData";
import { useState, useEffect } from "react";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail(props) {
  const { setContent } = props;
  const user = useParams();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await fetchModel(
          `https://xwtzjv-8081.csb.app/user/${user.userId}`
        );

        setUserData(data);
        setContent(`${data.first_name} ${data.last_name}`);
      } catch (err) {
        setError("User Not Found");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user.userId]);
  return loading ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <>
      <Card style={{ padding: "15px" }} className="user-detail-card">
        <CardContent>
          <Typography variant="h4" className="user-name">
            {userData?.first_name} {userData?.last_name}
          </Typography>

          <Typography variant="subtitle1" color="textSecondary">
            <strong>Occupation:</strong> {userData?.occupation}
          </Typography>

          <Typography variant="body1" className="user-location">
            <strong>Location:</strong> {userData?.location}
          </Typography>

          <Typography variant="body2" className="user-description">
            <strong>Description:</strong> {userData?.description}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="body1">
        <Link
          to={`/photos/${userData?._id}`}
          style={{ textDecoration: "none" }}
        >
          <h2>
            View Photos of {userData?.first_name} {userData?.last_name}
          </h2>
        </Link>
      </Typography>
    </>
  );
}

export default UserDetail;
