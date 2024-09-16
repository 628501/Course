import { configureStore } from '@reduxjs/toolkit';
import { CourseApi } from '../Slices/CourseSlice';
import { StudentApi } from '../Slices/StudentSlice';


const store = configureStore({
  reducer: {
    [CourseApi.reducerPath]: CourseApi.reducer, 
    [StudentApi.reducerPath]: StudentApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(CourseApi.middleware) 
      .concat(StudentApi.middleware), 
});

export default store;