import React from "react";
import {
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";

import "./styles.css";
import { useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { useEffect, useState } from "react";
import "./styles.css";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList(props) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setContent } = props;
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/users/${id}`);
  };
  setContent("User Lists");

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      const usersData = await fetchModel(
        "https://xwtzjv-8081.csb.app/user/list"
      );

      setUsers(usersData);
      setLoading(false);
    };

    initData();
  }, []);

  const handleCommentClick = (e, id) => {
    e.stopPropagation();

    navigate(`/users/comments/${id}`);
  };

  return (
    <div>
      <Typography variant="body1">
        <h2>User List</h2>
      </Typography>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <List component="nav">
          {users?.map((item) => (
            <div>
              <ListItem
                className="list-item"
                style={{ cursor: "pointer" }}
                key={item._id}
              >
                <ListItemText
                  onClick={() => handleClick(item._id)}
                  primary={
                    <div className="bubble-container">
                      <span>{item.first_name + " " + item.last_name}</span>
                      <Tooltip title="Number of photos" arrow>
                        <span className="bubble bubble-green">
                          {item.photos_count}
                        </span>
                      </Tooltip>

                      <Tooltip title="Number of comments" arrow>
                        <span
                          className="bubble bubble-red"
                          onClick={(e) => handleCommentClick(e, item._id)}
                        >
                          {item.comments_count}
                        </span>
                      </Tooltip>
                    </div>
                  }
                />
              </ListItem>

              <Divider />
            </div>
          ))}
        </List>
      )}
    </div>
  );
}

export default UserList;
