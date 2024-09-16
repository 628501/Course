import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { login, register, Student, Students } from "../Interfaces/CourseIF";

export const StudentApi = createApi({
  reducerPath: "student",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000", credentials: 'include' }),
  endpoints: (builder) => ({
    register: builder.mutation<void, Students>({
      query: (user: Students) => ({
        url: "/api/student/register",
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation<login, register>({
      query: (log: register) => ({
        url: "/api/student/login",
        method: "POST",
        body: log,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/student/logout",
        method: "POST",
      }),
    }),
    getStudentByEmail: builder.query<Student, string>({
      query: (email) => `/api/student/${email}`,
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetStudentByEmailQuery } = StudentApi;