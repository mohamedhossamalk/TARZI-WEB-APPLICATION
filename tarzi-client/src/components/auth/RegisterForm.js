import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Link,
  Grid,
  Box,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { register as registerUser } from '../../store/actions/authActions';

const RegisterForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form validation schema
  const schema = yup.object({
    username: yup.string()
      .required(t('validation.username.required'))
      .min(3, t('validation.username.min')),
    email: yup.string()
      .email(t('validation.email.invalid'))
      .required(t('validation.email.required')),
    phone: yup.string()
      .required(t('validation.phone.required'))
      .matches(/^[0-9]+$/, t('validation.phone.matches')),
    password: yup.string()
      .required(t('validation.password.required'))
      .min(6, t('validation.password.min')),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], t('validation.confirmPassword.match'))
      .required(t('validation.confirmPassword.required'))
  });
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const onSubmit = async (data) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = data;
    
    try {
      await dispatch(registerUser(userData));
      navigate('/login');
    } catch (err) {
      // Error is handled in the reducer
      console.error(err);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          {t('auth.register')}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label={t('auth.username')}
          autoComplete="username"
          autoFocus
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label={t('auth.email')}
          autoComplete="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="phone"
          label={t('auth.phone')}
          autoComplete="tel"
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          label={t('auth.password')}
          type={showPassword ? 'text' : 'password'}
          id="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={toggleShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          label={t('auth.confirmPassword')}
          type={showConfirmPassword ? 'text' : 'password'}
          id="confirmPassword"
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={toggleShowConfirmPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            t('auth.registerBtn')
          )}
        </Button>
        
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link component={RouterLink} to="/login" variant="body2">
              {t('auth.haveAccount')}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RegisterForm;