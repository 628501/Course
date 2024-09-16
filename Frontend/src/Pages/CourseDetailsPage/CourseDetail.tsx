import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetCourseIdQuery } from "../../Slices/CourseSlice";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotFound from "../../Components/NotFound/NotFound";
import StarRating from "../../Components/StarRating/Star";
import VideoCard from "../../Components/VideoCard/VideoCard";
import { grey } from "@mui/material/colors";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CodeIcon from "@mui/icons-material/Code";
import ArticleIcon from "@mui/icons-material/Article";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CertificateIcon from "@mui/icons-material/EmojiEvents";

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const courseId = id ? parseInt(id, 10) : undefined;

  const { data: course, error } = useGetCourseIdQuery(courseId ?? -1, {
    skip: courseId === undefined,
  });

  const [email, setEmail] = useState<string>();

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      try {
        const student = JSON.parse(storedStudent);
        setEmail(student.email);
      } catch (e) {
        console.error("Error parsing student detail:", e);
      }
    }
  }, []);

  if (error) return <NotFound linkText="No Course" />;
  if (!course) return <NotFound linkText="No Course Found" />;

  const syllabus = course.syllabus || [];
  const leftTopics = syllabus.slice(0, 4);
  const rightTopics = syllabus.slice(4, 8);

  const courseIncludes = [
    {
      text: "22 hours on-demand video",
      icon: <VideoLibraryIcon sx={{ color: "#B4690E", mr: 1 }} />,
    },
    {
      text: "19 coding exercises",
      icon: <CodeIcon sx={{ color: "#B4690E", mr: 1 }} />,
    },
    {
      text: "15 articles",
      icon: <ArticleIcon sx={{ color: "#B4690E", mr: 1 }} />,
    },
    {
      text: "Access on mobile and TV",
      icon: <PhoneIphoneIcon sx={{ color: "#B4690E", mr: 1 }} />,
    },
    {
      text: "Certificate of completion",
      icon: <CertificateIcon sx={{ color: "#B4690E", mr: 1 }} />,
    },
  ];

  const leftIncludes = courseIncludes.slice(0, 3);
  const rightIncludes = courseIncludes.slice(3, 5);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Navbar Section */}
      <Box
        sx={{
          backgroundColor: "#2D2F31",
          color: "white",
          width: "100%",
          height: "350px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "left",
          px: 3,
          overflow: "hidden",
          mt: 3
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "1200px", textAlign: "left" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, mt: 6 }}>
            {course.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h6" sx={{ width: "800px", mb: 2 }}>
              {course.description}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, color: "#B4690E" }}
              >
                {course.stars}
              </Typography>
              <StarRating stars={course.stars} />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="body1" sx={{ width: "900px", mb: 2 }}>
              created by{" "}
              <span style={{ color: "#B4690E" }}>{course.instructor}</span>
            </Typography>
          </Box>
        </Box>
        {/* Video Thumbnail Section (half in navbar) */}
        <Box
          sx={{
            position: "absolute",
            top: 150,
            right: 400,
            width: 300,
            backgroundColor: "#f0f0f0",
            overflow: "visible",
          }}
        >
          <VideoCard course={course} email={email || ""} />
        </Box>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          position: "relative",
          alignItems: "flex-start",
          overflow: "auto",
          p: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Explore Related Topics */}
          <Box
            sx={{
              padding: 2,
              width: "55%",
              borderRadius: 1,
              mb: 3,
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              Explore Related Topics
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Link
                to={`/tag/${course.category}`}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "#B4690E",
                    borderRadius: "20px",
                    color: "#B4690E",
                    "&:hover": {
                      borderColor: "#B4690E",
                      backgroundColor: "rgba(180, 105, 14, 0.1)",
                    },
                  }}
                >
                  {course.category}
                </Button>
              </Link>
            </Box>
          </Box>

          {/* What You'll Learn */}
          <Box
            sx={{
              border: "1px solid #D1D7DC",
              padding: 2,
              width: "55%",
              borderRadius: 1,
              mb: 3,
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              What You'll Learn
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ width: "45%" }}>
                {leftTopics.map((item, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckCircleIcon sx={{ color: "#B4690E", mr: 1 }} />
                    <Typography variant="body2" sx={{ color: grey }}>
                      {item.topic}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ width: "45%" }}>
                {rightTopics.map((item, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <CheckCircleIcon sx={{ color: "#B4690E", mr: 1 }} />
                    <Typography variant="body2" sx={{ color: grey }}>
                      {item.topic}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* This Course Includes */}
          <Box
            sx={{
              padding: 2,
              width: "55%",
              borderRadius: 1,
              mb: 3,
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              This Course Includes:
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ width: "45%" }}>
                {leftIncludes.map((item, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    {item.icon}
                    <Typography variant="body2" sx={{ color: grey }}>
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ width: "45%" }}>
                {rightIncludes.map((item, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    {item.icon}
                    <Typography variant="body2" sx={{ color: grey }}>
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Top Companies Offer This Course */}
          <Box
            sx={{
              border: "1px solid #D1D7DC",
              padding: 2,
              width: "55%",
              borderRadius: 1,
              mb: 3,
            }}
          >
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 700 }}>
              Top Companies Offer This Course to Their Employees
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              This course was selected for our collection of top-rated courses
              trusted by businesses worldwide.
              <Typography
                variant="body2"
                sx={{
                  color: "#B4690E",
                  textDecoration: "underline",
                  "&:hover": {
                    color: "#B4690E",
                  },
                }}
              >
                Learn more
              </Typography>
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <img
                src="/nasdaq.png"
                alt="nasdaq"
                style={{ height: "40px", width: "auto" }}
              />
              <img
                src="/netapp.png"
                alt="netapp"
                style={{ height: "40px", width: "auto" }}
              />
              <img
                src="/bmw.png"
                alt="bmw"
                style={{ height: "40px", width: "auto" }}
              />
            </Box>
          </Box>

          {/* Course Content (Accordion) */}
          <Typography variant="h5" gutterBottom sx={{ mt: 3, fontWeight: 700 }}>
            Course Content
          </Typography>
          {syllabus.length > 0 && (
            <Box>
              {syllabus.map((item, index) => (
                <Accordion key={index} sx={{ width: "650px" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    <Typography>
                      Week {item.week}: {item.topic}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{item.content}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CourseDetail;