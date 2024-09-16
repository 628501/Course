import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  CircularProgress,
  Button,
} from "@mui/material";
import TrashIcon from "@mui/icons-material/Delete";
import { useEnrollDetailQuery, useDeleteEnrollMutation } from "../../Slices/CourseSlice";
import { enroll2 } from "../../Interfaces/CourseIF";
import { toast } from "react-toastify";

interface CircularProgressWithLabelProps {
  value: number;
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = (
  props
) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={props.value}
        size={80}
        thickness={5}
        sx={{ color: "#e0e0e0" }}
      />
      <CircularProgress
        variant="determinate"
        value={props.value}
        size={80}
        thickness={5}
        sx={{
          color: "skyblue",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="textSecondary">
          {`${props.value}%`}
        </Typography>
      </Box>
    </Box>
  );
};

const Enrolled: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const { data: enrolledCourses } = useEnrollDetailQuery(email ?? "", {
    skip: !email,
  });
  const [deleteEnroll] = useDeleteEnrollMutation();
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

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

  const handleCheckboxChange = (courseId: number) => {
    setSelectedCourses(prevState =>
      prevState.includes(courseId)
        ? prevState.filter(id => id !== courseId)
        : [...prevState, courseId]
    );
  };

  const handleUnenroll = () => {
    if (selectedCourses.length > 0) {
      deleteEnroll(selectedCourses)
        .unwrap()
        .then(() => {
        })
        .catch((error) => {
          console.error("Error during unenroll:", error);
        });
      toast.success("Unenrolled Successfully");
      setSelectedCourses([]);
    }
  };


  const handleRowUnenroll = (courseId: number) => {
    deleteEnroll(courseId);
    toast.success("Unenrolled Successfully");
  };

  return (
    <Box
      sx={{
        width: "62%",
        height: "auto",
        p: 2,
        pl: 8,
        borderRadius: "10px",
        overflowY: "auto",
        ml: "45px"
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "space-between", mt: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Enrolled Courses
        </Typography>
        {selectedCourses.length > 0 && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "red",
              color: "white",
              textTransform: "uppercase",
            }}
            startIcon={<TrashIcon />}
            onClick={handleUnenroll}
          >
            Unenroll
          </Button>
        )}
      </Box>

      {enrolledCourses && enrolledCourses.map((course: enroll2, index: number) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            border: "1px solid #ddd",
            borderRadius: "10px",
            position: "relative", 
          }}
        >
          <Checkbox
            checked={selectedCourses.includes(course.id)}
            onChange={() => handleCheckboxChange(course.id)}
            sx={{
              position: "absolute",
              left: -40,
              top: 0,
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: "170px",
                height: "100px",
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <img
                src={`/Courses/${course.course.thumbnail}`}
                alt={course.courseName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {course.courseName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {course.course.instructor}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
              <CircularProgressWithLabel value={88} />
            </Box>

            <Box sx={{ ml: 2, mr: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  textTransform: "uppercase",
                }}
                startIcon={<TrashIcon />}
                onClick={() => handleRowUnenroll(course.id)}
              >
                Unenroll
              </Button>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Enrolled;