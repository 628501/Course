import React from 'react';
import { useGetCoursesQuery } from '../../Slices/CourseSlice';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Course } from '../../Interfaces/CourseIF';
import { Link } from 'react-router-dom';

const Recommended: React.FC = () => {
  const { data: courses } = useGetCoursesQuery();


  return (
    <Box sx={{ width: '30vw', height: '77vh', border: '1px solid #ddd', borderRadius: '10px', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1,
          borderBottom: '1px solid #ddd',
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Recommended Courses
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2}}>
        <Grid container spacing={2}>
          {courses?.map((course: Course) => (
            <Grid item xs={12} key={course.id} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box
                  sx={{
                    width: '150px',
                    height: '100px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <img
                    src={`/Courses/${course.thumbnail}`}
                    alt={course.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {course.instructor}
                  </Typography>
                </Box>
                <Link to={`/course/${course.id}`}>
                <IconButton sx={{ color: 'skyblue' }} aria-label="more-info">
                  <OpenInNewIcon />
                </IconButton>
                </Link>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Recommended;