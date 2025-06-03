import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  ImageList,
  ImageListItem,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

function NewPhoto({ user }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemove = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleSubmit = async () => {
    if (!selectedFiles.length) return alert("No files selected.");
    const token = localStorage.getItem("token");
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("photos", file);
    });
    setLoading(true);
    const res = await fetch("https://xwtzjv-8081.csb.app/photos/new", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      alert("Upload successfully!");
      navigate(`/photos/${user._id}`);
      setSelectedFiles([]);
    } else {
      alert("Upload Failed.");
    }
    setLoading(false);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Upload Photos
      </Typography>
      <input
        accept="image/*"
        type="file"
        multiple
        id="upload-photo"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <label htmlFor="upload-photo">
        <Button variant="contained" component="span">
          Select images
        </Button>
      </label>

      {selectedFiles.length > 0 && (
        <>
          <ImageList cols={3} gap={12} sx={{ mt: 3 }}>
            {selectedFiles.map((file, index) => (
              <ImageListItem
                key={index}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Ảnh ${index}`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "contain",
                    backgroundColor: "#f9f9f9",
                  }}
                />
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  p={1}
                  position="absolute"
                  bottom={0}
                  right={0}
                >
                  <IconButton
                    color="error"
                    onClick={() => handleRemove(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ImageListItem>
            ))}
          </ImageList>

          {loading ? (
            <Box mt={2}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 2 }}
            >
              Upload {selectedFiles.length} images
            </Button>
          )}
        </>
      )}
    </Box>
  );
}

export default NewPhoto;
