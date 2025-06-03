import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Grid,
  Input,
  Typography,
} from "@mui/material";

import "./styles.css";
import { Link, useParams } from "react-router-dom";
import models from "../../modelData/models";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos(props) {
  const user = useParams();
  const { reloadPhotos, setContent } = props;
  const [userPhotos, setUserPhotos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentValues, setCommentValues] = useState({});
  const [commentLoading, setCommentLoading] = useState({});

  const handleComment = async (photoId) => {
    if (commentLoading[photoId]) return;
    const commentValue = commentValues[photoId];
    if (!commentValue) return;

    setCommentLoading((prev) => ({ ...prev, [photoId]: true }));

    const token = localStorage.getItem("token");
    const data = { comment: commentValue };

    const res = await fetch(
      `https://xwtzjv-8081.csb.app/comment/commentsOfPhoto/${photoId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const newPhoto = data.photo;

      setUserPhotos((prev) =>
        prev.map((p) => (p._id === photoId ? newPhoto : p))
      );

      setCommentValues((prev) => ({ ...prev, [photoId]: "" }));
    }

    setCommentLoading((prev) => ({ ...prev, [photoId]: false }));
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const res = await fetchModel(
          `https://xwtzjv-8081.csb.app/photos/photosOfUser/${user.userId}`
        );

        setCurrentUser(res.user);
        setContent(
          `Photos of User: ${res.user?.first_name} ${res.user?.last_name}`
        );
        setUserPhotos(res.photos);
      } catch (error) {
        setError("User Not Found");
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [reloadPhotos, user.userId]);

  return loading ? (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div className="photo-gallery">
      <Typography
        style={{ marginBottom: "15px" }}
        variant="h4"
        className="gallery-title"
      >
        {currentUser &&
          `Photos of User: ${currentUser?.first_name} ${currentUser?.last_name}`}
      </Typography>

      <Grid container spacing={3}>
        {userPhotos.length > 0 ? (
          userPhotos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} key={photo._id}>
              <Card className="photo-card">
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://xwtzjv-8081.csb.app/images/${photo.file_name}`}
                  alt={`Photo by user ${photo.user_id}`}
                  style={{ objectFit: "contain" }}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    Date: {dayjs(photo.date_time).format("DD/MM/YYYY")}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Time: {dayjs(photo.date_time).format("hh:mm A")}
                  </Typography>

                  <Divider style={{ margin: "10px 0" }} />

                  <div className="photo-comments">
                    <Typography
                      variant="subtitle1"
                      style={{ marginTop: "10px" }}
                    >
                      Comments:
                    </Typography>

                    {!photo.comments || photo.comments.length === 0 ? (
                      <Typography variant="body2" color="textSecondary">
                        No comments yet.
                      </Typography>
                    ) : (
                      photo.comments.map((comment) => (
                        <div
                          key={comment._id}
                          className="comment-item"
                          style={{ marginBottom: "15px" }}
                        >
                          <Typography variant="body2">
                            <Link
                              to={`/users/${comment.user._id}`}
                              className="comment-user-link"
                            >
                              {comment.user.first_name} {comment.user.last_name}
                            </Link>
                            : {comment.comment}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="textSecondary"
                            style={{ display: "block" }}
                          >
                            {dayjs(comment.date_time).format(
                              "MMMM D, YYYY h:mm A"
                            )}
                          </Typography>
                        </div>
                      ))
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItem: "center",
                    }}
                    className="comment-box"
                  >
                    <Input
                      value={commentValues[photo._id] || ""}
                      onChange={(e) =>
                        setCommentValues((prev) => ({
                          ...prev,
                          [photo._id]: e.target.value,
                        }))
                      }
                      type="text"
                      placeholder="comment..."
                    />
                    <Button onClick={() => handleComment(photo._id)}>
                      {commentLoading[photo._id] ? "Loading..." : "Send"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              There are no photos yet.
            </Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default UserPhotos;
