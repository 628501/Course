import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';

interface NotFoundProps<TMessage = string> {
  message: TMessage;
  linkRoute: LinkProps['to'];
  linkText: TMessage;
}

const NotFound = <TMessage extends NotFoundProps>({ message, linkRoute, linkText }: TMessage) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        textAlign: 'center',
        p: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        {message}
      </Typography>
      <Link to={linkRoute} style={{ textDecoration: 'none' }}>
        <Button
          variant="contained"
          color="error"
          sx={{
            borderRadius: '20px',
            px: 4,
            py: 1.5,
            opacity: 0.8,
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          {linkText}
        </Button>
      </Link>
    </Box>
  );
};

NotFound.defaultProps = {
  message: 'No Courses Found!',
  linkRoute: '/',
  linkText: 'Go To Home Page',
};

export default NotFound;