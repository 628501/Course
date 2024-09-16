import React from "react";
import { Route, Routes } from "react-router-dom";
import Cards from "./Components/Cards/Cards";
import CourseDetail from "./Pages/CourseDetailsPage/CourseDetail";
import LoginPage from "./Pages/LoginPage/Login";
import RegisterPage from "./Pages/LoginPage/Register";
import EnrolledCourses from "./Pages/StudentDashboard/EnrolledCourses";
import AuthRoute from "./Components/AuthRoute";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Cards />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      <Route path="/search/:searchTerm" element={<Cards />} />
      <Route path="/tag/:tags" element={<Cards />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/enrolled-courses"
        element={
          <AuthRoute>
            <EnrolledCourses />
          </AuthRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;