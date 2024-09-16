import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, TextField, Container, Typography, Paper, Box } from '@mui/material';
import { useRegisterMutation } from '../../Slices/StudentSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  address: string;
}

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      await registerUser(data).unwrap();
      navigate('/login');
      toast.success("Registered Successfully");
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error("Registration Failed");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '150px', backgroundColor: 'whitesmoke'}}>
        <Typography variant="h5">Register</Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box mt={2}>
            <TextField
              label="Name"
              fullWidth
              variant="outlined"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Box>
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
              type="password"
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
            />
          </Box>
          <Box mt={2}>
            <TextField
              label="Address"
              fullWidth
              variant="outlined"
              {...register('address', { required: 'Address is required' })}
              error={!!errors.address}
              helperText={errors.address?.message}
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
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
