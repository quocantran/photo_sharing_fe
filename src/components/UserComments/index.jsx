import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Link,
} from "@mui/material";
import dayjs from "dayjs";
import fetchModel from "../../lib/fetchModelData";

function UserComments(props) {
  const user = useParams();
  const { setContent } = props;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const data = await fetchModel(
          `https://xwtzjv-8081.csb.app/comment/user/${user.userId}`
        );
        setComments(data.comments);
        setContent(
          `Comments of User: ${data.user?.first_name} ${data.user?.last_name}`
        );
        setCurrentUser(data.user);
      } catch (err) {
        console.error("Error fetching user comments");
      } finally {
        setLoading(false);
      }
    };

    fetchUserComments();
  }, [user.userId]);

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Comments of {currentUser.first_name + " " + currentUser.last_name}
      </Typography>
      {comments.length === 0 ? (
        <Typography
          variant="body1"
          align="center"
          sx={{ width: "100%", mt: 4 }}
        >
          There are no comments yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {comments.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.commentId}>
              <Card style={{ cursor: "pointer" }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={`https://xwtzjv-8081.csb.app/images/${item.file_name}`}
                  alt="User photo"
                  onClick={() => navigate(`/photos/${item.photo_id}`)}
                />
                <CardContent
                  onClick={() => navigate(`/photos/${item.photo_id}`)}
                >
                  <Typography variant="body2" gutterBottom>
                    <strong>Comment:</strong> {item.comment}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {dayjs(item.date_time).format("MMM D, YYYY h:mm A")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default UserComments;
