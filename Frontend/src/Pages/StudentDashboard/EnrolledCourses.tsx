import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useGetStudentByEmailQuery } from "../../Slices/StudentSlice";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import CakeIcon from "@mui/icons-material/Cake";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import Recommended from "./Recommended";
import Enrolled from "./Enrolled";
import Wishlist from "../Wishlist/Whishlist";

const EnrolledCourses: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const { data: student } = useGetStudentByEmailQuery(email ?? "", {
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

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          width: "60%",
          height: "30vh",
          background: "linear-gradient(to top, royalblue -10%, deepskyblue 50%)",
          borderRadius: "20px",
          ml: 10,
          padding: "20px",
          boxSizing: "border-box",
          mt: 15,
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >

        <Box
          sx={{
            width: "45%",
            backgroundColor: "white",
            borderRadius: "10px",
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              mt: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                mt: -3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <AccountCircleIcon
                fontSize="inherit"
                sx={{ fontSize: 80, mb: 1 }}
              />
              <Typography variant="h6" sx={{ fontSize: 28, textAlign: "center" }}>
                {student?.name} <br />
                <span style={{ fontSize: 16 }}>Hello</span>
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: "55%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                width: "50%",
                backgroundColor: "white",
                borderRadius: "10px",
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}
                >
                  Email
                </Typography>
                <EmailIcon />
              </Box>
              <Divider />
              <Typography
                variant="body2"
                sx={{ mt: 2, textAlign: "left", fontSize: 18 }}
              >
                {student?.email}
              </Typography>
            </Box>

            <Box
              sx={{
                width: "50%",
                height: "108px",
                backgroundColor: "white",
                borderRadius: "10px",
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}
                >
                  DOB
                </Typography>
                <CakeIcon />
              </Box>
              <Divider />
              <Typography
                variant="body2"
                sx={{ mt: 2, textAlign: "left", fontSize: 18 }}
              >
                {student?.dob}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                width: "50%",
                height: "108px",
                backgroundColor: "white",
                borderRadius: "10px",
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}
                >
                  Mobile
                </Typography>
                <PhoneIcon />
              </Box>
              <Divider />
              <Typography
                variant="body2"
                sx={{ mt: 2, textAlign: "left", fontSize: 18 }}
              >
                {student?.mobile}
              </Typography>
            </Box>

            <Box
              sx={{
                width: "50%",
                backgroundColor: "white",
                borderRadius: "10px",
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontFamily: "sans-serif" }}
                >
                  Address
                </Typography>
                <HomeIcon />
              </Box>
              <Divider />
              <Typography
                variant="body2"
                sx={{ mt: 2, textAlign: "left", fontSize: 18 }}
              >
                {student?.address}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          right: 50,
          top: 0,
          width: "30%",
          height: "calc(80vh - 2rem)",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <Recommended />
      </Box>
      <Box
      >
        <Enrolled />
      </Box>
     <Box>
       <Wishlist/>
     </Box>
    </Box>
  );
};

export default EnrolledCourses;