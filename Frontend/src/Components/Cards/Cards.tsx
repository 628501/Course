import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Toolbar } from "@mui/material";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { NavbarItems } from "../Navbar/NavbarItems";
import { Link, useParams } from "react-router-dom";
import {
  useEnrollDetailQuery,
  useGetCoursesByTagQuery,
  useGetCoursesQuery,
  useSearchCourseQuery,
} from "../../Slices/CourseSlice";
import StarRating from "../StarRating/Star";

export const Cards: React.FC = () => {
  const drawerWidth = 350;
  const { searchTerm } = useParams<{ searchTerm?: string }>();
  const { tags } = useParams<{ tags?: string }>();
  const { data: course } = useGetCoursesByTagQuery(tags ?? "", { skip: !tags });
  const { data: allCourses } = useGetCoursesQuery();
  const { data: searchResults } = useSearchCourseQuery(searchTerm ?? "", {
    skip: !searchTerm,
  });
  const [email, setEmail] = useState<string | null>(null);
  const { data: enrolledCourses } = useEnrollDetailQuery(email ?? "", {
    skip: !email,
  });

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

  const courses = searchTerm ? searchResults : tags ? course : allCourses;

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Open":
        return { color: "green" };
      case "Closed":
        return { color: "red" };
      case "In Progress":
        return { color: "orange" };
      default:
        return { color: "green" };
    }
  };

  const isEnrolled = (courseName: string) => {
    return (
      Array.isArray(enrolledCourses) &&
      enrolledCourses.some(
        (enrolledCourse) =>
          enrolledCourse.courseName === courseName &&
          enrolledCourse.enrollStatus
      )
    );
  };

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (label: string) => {
    setSelectedItem(label);
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            zIndex: 1,
            padding: "20px",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          {NavbarItems.map((item) => (
            <Link to={`/tag/${item.label}`} key={item.id} style={{ textDecoration: 'none' }}>
              <ListItem
                button
                onClick={() => handleItemClick(item.label)}
                sx={{
                  borderRadius: "50px",
                  display: "flex",
                  fontSize: 22,
                  fontWeight: 700,
                  padding: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: selectedItem === item.label ? 'black' : 'inherit',
                  color: selectedItem === item.label ? 'white' : 'inherit',
                  mt: 2
                }}
              >
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    fontSize: 22,
                    fontWeight: 700,  
                    width: "100%",
                    color: selectedItem === item.label ? 'white' : 'inherit',
                  }} 
                />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <Box
      sx={{
        flexGrow: 1,
        ml: "30px",
        mt: "100px",
        p: 3,
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(450px, 1fr))",
        gap: 3,
        columnGap: 3,
        gridAutoFlow: "dense",
      }}
    >
        {Array.isArray(courses) &&
          courses.map((course) => {
            const status = course.enrollmentStatus ?? "";
            const statusStyles = getStatusStyles(status);

            return (
              <Box
                key={course.id}
                component={Link}
                to={`/course/${course.id}`}
                sx={{
                  textDecoration: "none",
                  border: "1px solid whitesmoke",
                  borderRadius: "10px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  maxWidth: "450px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                }}
              >
                <Box
                  component="img"
                  alt={course.name}
                  src={`/Courses/${course.thumbnail}`}
                  sx={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderBottom: "1px solid gray",
                  }}
                />
                <Box
                  sx={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 600,
                      fontSize: "20px",
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {course.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      flexGrow: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {course.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: "50px",
                        borderColor: statusStyles.color,
                        color: statusStyles.color,
                        "&:hover": {
                          borderColor: statusStyles.color,
                          backgroundColor: `${statusStyles.color}10`,
                        },
                      }}
                    >
                      {isEnrolled(course.name) ? "Enrolled" : status}
                    </Button>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {course.stars}
                      </Typography>
                      <StarRating stars={course.stars} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};

export default Cards;