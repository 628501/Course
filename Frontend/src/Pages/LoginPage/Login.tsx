import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, TextField, Container, Typography, Paper, Box, Link as MuiLink, InputAdornment, IconButton } from '@mui/material';
import { useLoginMutation } from '../../Slices/StudentSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const returnUrl = params.get('returnUrl');

  useEffect(() => {
    if (returnUrl) navigate(returnUrl);
  }, [navigate, returnUrl]);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const response = await login(data).unwrap();
      localStorage.setItem('student', JSON.stringify(response));
      navigate('/');
      toast.success("Login Successfully");
    } catch (err) {
      console.error('Login failed:', err);
      toast.error("Login Error");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '150px', backgroundColor: 'whitesmoke'}}>
        <Typography variant="h5">Login</Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box mt={2}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[\w-]+@([\w-]+\.)+[\w-]{2,63}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Box>
          <Box mt={2}>
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 5,
                  message: 'Password must be at least 5 characters'
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box mt={2}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Don't have an account? &nbsp;
              <MuiLink href="/register" color="primary">
                Register
              </MuiLink>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;