import React, { useEffect, useState } from "react";
import { Course } from "../../Interfaces/CourseIF";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEmailValidationQuery, useEnrollMutation, useWhishlistUpdateMutation } from "../../Slices/CourseSlice";
import { toast } from "react-toastify";

interface VideoCardProps {
  course: Course;
  email: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ course, email }) => {
  const [open, setOpen] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [whishlistUpdate] = useWhishlistUpdateMutation();
  const [opened, setOpened] = useState(false);
  const [enroll, { isLoading: isEnrollLoading }] = useEnrollMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const courseName = course?.name ?? "";

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data: emailExists, isLoading: isEmailLoading } =
    useEmailValidationQuery(
      { email: formData.email, courseName },
      { skip: !formData.email || !courseName }
    );

  const handleOpened = () => setOpened(true);
  const handleClosed = () => setOpened(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (emailExists) {
      toast.error("Email already exists for this course.");
    }
  }, [emailExists]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (emailExists) {
      toast.error("Email already exists for this course.");
      return;
    }

    try {
      await enroll({
        ...formData,
        course,
        enrollStatus: true,
        courseName,
      }).unwrap();
      handleClosed();
      toast.success("Enrolled Successfully");
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (err) {
      console.error("Error enrolling:", err);
      toast.error("Error enrolling");
    }
  };

  const isEnrollButtonDisabled =
    course?.enrollmentStatus === "Closed" ||
    course?.enrollmentStatus === "In Progress";

  const getYouTubeVideoId = (url: string | null) => {
    if (!url) return null;
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|video\/|v=|e\/|user\/\w+\/playlists\?v=)?|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(course.Youtubelink);

  const handleWishlistToggle = async () => {
    try {
      const newWishlistStatus = !isInWishlist;
      setIsInWishlist(newWishlistStatus);

      let wishlist = JSON.parse(
        localStorage.getItem(email) || "[]"
      ) as number[];
      if (newWishlistStatus) {
        wishlist.push(course.id);
        localStorage.setItem(email, JSON.stringify(wishlist));
      } else {
        wishlist = wishlist.filter((id) => id !== course.id);
        localStorage.setItem(email, JSON.stringify(wishlist));
      }

      await whishlistUpdate({
        email,
        coursename: course.name,
        wishlist: newWishlistStatus,
        course,
      }).unwrap();
    } catch (err) {
      console.error("Error updating wishlist:", err);
      setIsInWishlist(!isInWishlist);
    }
  };

  useEffect(() => {
    const wishlist = JSON.parse(
      localStorage.getItem(email) || "[]"
    ) as number[];
    setIsInWishlist(wishlist.includes(course.id));
  }, [email, course.id]);

  return (
    <Card sx={{ position: "relative", overflow: "hidden", boxShadow: 3, width: 300 }}>
      {course.thumbnail && (
        <div style={{ position: "relative", width: "100%", height: "180px" }}>
          <CardMedia
            component="img"
            alt={course.name}
            image={`/Courses/${course.thumbnail}`}
            sx={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))",
              zIndex: 1,
            }}
          />
          <IconButton
            onClick={handleOpen}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              color: "black",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              boxShadow: 2,
              zIndex: 2,
            }}
          >
            <Typography variant="h6">▶</Typography>
          </IconButton>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              position: "absolute",
              bottom: 7,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "transparent",
              color: "white",
              padding: "4px 8px",
              borderRadius: "15px",
              zIndex: 2, 
            }}
          >
            Preview this course
          </Typography>
        </div>
      )}
      <CardContent sx={{ textAlign: "center", bgcolor: "background.paper" }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              fontWeight: 600,
              "&:hover": { backgroundColor: "darkgray" },
            }}
            onClick={handleOpened}
            disabled={isEnrollButtonDisabled}
          >
            {course?.enrollmentStatus === "In Progress"
              ? "Coming Soon..."
              : course?.enrollmentStatus === "Open"
              ? "Enroll"
              : "Enrollment Closed"}
          </Button>
          <IconButton onClick={handleWishlistToggle} sx={{ ml: 1 }}>
            {isInWishlist ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>
      </CardContent>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="video-modal-title"
        aria-describedby="video-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "black",
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            id="video-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            {course.name}
          </Typography>
          {videoId ? (
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={course.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Invalid video URL
            </Typography>
          )}
        </Box>
      </Modal>

      <Modal
        open={opened}
        onClose={handleClosed}
        aria-labelledby="enroll-modal-title"
        aria-describedby="enroll-modal-description"
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            onClick={handleClosed}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              backgroundColor: "black",
              borderRadius: "50%",
              padding: "4px",
              "&:hover": {
                opacity: "0.8",
                backgroundColor: "gray",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            id="enroll-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Enroll in Course
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ backgroundColor: "gray" }}
            disabled={isEnrollLoading || isEmailLoading}
          >
            {isEnrollLoading || isEmailLoading
              ? "Submitting..."
              : "Submit"}
          </Button>
        </Box>
      </Modal>
    </Card>
  );
};

export default VideoCard;
