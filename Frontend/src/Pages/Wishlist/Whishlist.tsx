import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import {
  useWishlistQuery,
  useWhishlistUpdateMutation,
} from "../../Slices/CourseSlice";
import { toast } from "react-toastify";
import { Course } from "../../Interfaces/CourseIF";
import { Link } from "react-router-dom";
import StarRating from "../../Components/StarRating/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NotFound from "../../Components/NotFound/NotFound";

const Wishlist: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const {
    data: wishlistCourses,
    error,
    isLoading,
  } = useWishlistQuery(email ?? "", {skip: !email});
  const [updateWishlist] = useWhishlistUpdateMutation();
  const [isInWishlist, setIsInWishlist] = useState(false);

  console.log(email)

  useEffect(() => {
    const studentDetail = localStorage.getItem("student");
    if (studentDetail) {
      try {
        const student = JSON.parse(studentDetail);
        setEmail(student.email);
      } catch (e) {
        console.error("Error parsing student detail:", e);
      }
    }
  }, []);

  const handleWishlistToggle = async (
    coursename: string,
    wishlist: boolean,
    course: Course,
    email: string
  ) => {
    try {
      const newWishlistStatus = isInWishlist;
      setIsInWishlist(newWishlistStatus);

      let wishliststorage = JSON.parse(
        localStorage.getItem(email) || "[]"
      ) as number[];
      if (newWishlistStatus) {
        wishliststorage.push(course.id);
        localStorage.setItem(email, JSON.stringify(wishliststorage));
      } else {
        wishliststorage = wishliststorage.filter((id) => id !== course.id);
        localStorage.setItem(email, JSON.stringify(wishliststorage));
        console.log("Current Wishlist Storage:", wishliststorage);
      }
      await updateWishlist({
        email,
        coursename,
        wishlist,
        course,
      }).unwrap();
      toast.success(wishlist ? "Added to wishlist" : "Removed from wishlist");
    } catch (err) {
      console.error("Error updating wishlist:", err);
      toast.error("Failed to update wishlist");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error)
    return <NotFound message="No Wishlist Found!" linkText="Home Page" />;

  return (
    <Box sx={{ padding: 2, marginTop: 4, marginLeft: 11 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
        Saved Courses
      </Typography>
      <Box
        sx={{
          width: '62%',
          height: "500px",
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 2,
          border: '1px solid #ddd',
          borderRadius: "5px",
          padding: 2,
        }}
      >
        {wishlistCourses?.map((course) => (
          <Card
            key={course.course.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #ddd',
              borderRadius: '15px',
              height: 290, 
              width: '100%',
              boxShadow: 'none',
              position: 'relative',
            }}
          >
            <Link to={`/course/${course.course.id}`}>
              <CardMedia
                component="img"
                alt={course.courseName}
                sx={{
                  height: 150, 
                  width: '100%',
                  objectFit: 'cover',
                }}
                image={`/Courses/${course.course.thumbnail}`}
              />
            </Link>
            <CardContent
              sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 'calc(100% - 100px)',
              }}
            >
              <Typography
                variant="body2"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  mb: 0.5,
                  fontSize: '1.1rem',
                }}
              >
                {course.courseName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5, fontSize: '0.9rem' }}
              >
                {course.course.instructor}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <StarRating stars={course.course.stars} />
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  onClick={() =>
                    handleWishlistToggle(
                      course.courseName,
                      !course.wishlist,
                      course.course,
                      email ?? ""
                    )
                  }
                  sx={{
                    color: 'red',
                    '&:hover': {
                      opacity: 0.7,
                    },
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Wishlist;