import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Course, emailValidation, enroll, enroll2, whishlist } from "../Interfaces/CourseIF";

export const CourseApi = createApi({
  reducerPath: "course",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  tagTypes: ['Courses', 'Wishlist', 'Enroll'], 
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], void>({
      query: () => "/api/course/",
      providesTags: ['Courses'],
    }),
    searchCourse: builder.query<Course[], string>({
      query: (searchTerm: string) => `/api/course/search/${searchTerm}`,
    }),
    getCourseId: builder.query<Course, number>({
      query: (id: number) => `/api/course/${id}`,
    }),
    enroll: builder.mutation<void, enroll>({
      query: (enrollData) => ({
        url: "/api/course/enroll",
        method: "POST",
        body: enrollData,
      }),
      invalidatesTags: ['Courses']
    }),
    enrollDetail: builder.query<enroll2[], string>({
      query: (email) => ({
        url: `/api/course/enrolledCourses/${email}`,
      }),
      providesTags: ['Enroll'],
    }),
    emailValidation: builder.query<boolean, emailValidation>({
      query: ({ email, courseName }) => ({
        url: `/api/course/emailValidation/${email}/${courseName}`,
      }),
    }),
    getSuggestions: builder.query<any[], string>({
      query: (query) => `/api/course/search/suggestions/${query}`,
    }),
    wishlist: builder.query<any[], string>({
      query: (email) => `/api/course/wishlist/${email}`,
      providesTags: (result, error, email) => [{ type: 'Wishlist', email }], 
    }),
    whishlistUpdate: builder.mutation<void, whishlist>({
      query: (whishlist) => ({
        url: "/api/course/enroll/wishlist",
        method: "POST",
        body: whishlist,
      }),
      invalidatesTags: (result, error, { email }) => [{ type: 'Wishlist', email }],
    }),
    getCoursesByTag: builder.query<Course,string>({
      query: (tag) => `/api/course/tag/${tag}`,
    }),
    deleteEnroll: builder.mutation<void, number[] | number>({
      query: (ids) => ({
        url: '/api/course/enroll/delete',
        method: 'DELETE',
        body: Array.isArray(ids) ? ids : [ids],
      }),
      invalidatesTags: ['Enroll']
    })
  }),
});


export const {
  useGetCoursesQuery,
  useSearchCourseQuery,
  useGetCourseIdQuery,
  useEnrollMutation,
  useEnrollDetailQuery,
  useEmailValidationQuery,
  useGetSuggestionsQuery,
  useWhishlistUpdateMutation,
  useWishlistQuery,
  useGetCoursesByTagQuery,
  useDeleteEnrollMutation,
} = CourseApi;