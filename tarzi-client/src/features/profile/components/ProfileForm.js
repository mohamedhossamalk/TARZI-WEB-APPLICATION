// src/features/profile/components/ProfileForm.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { isValidEgyptianPhone } from '../../../core/utils/validators';

const ProfileForm = ({ initialData, onSubmit, loading, error, setError }) => {
  const { t } = useTranslation();
  
  // مخطط التحقق من صحة النموذج
  const validationSchema = Yup.object({
    username: Yup.string()
      .required(t('errors.requiredField'))
      .min(3, t('errors.minLengthNotMet'))
      .max(50, t('errors.maxLengthExceeded')),
    phone: Yup.string()
      .test(
        'is-valid-phone',
        t('errors.invalidPhone'),
        (value) => !value || isValidEgyptianPhone(value)
      ),
  });
  
  // إعداد Formik
  const formik = useFormik({
    initialValues: {
      username: initialData?.username || '',
      phone: initialData?.phone || '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (setError) setError(null);
      onSubmit(values);
    },
  });
  
  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="username"
            name="username"
            label={t('profile.username')}
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label={t('profile.phone')}
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            placeholder="01xxxxxxxxx"
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sx={{ mt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || !formik.dirty || !formik.isValid}
          >
            {loading ? <CircularProgress size={24} /> : t('profile.saveChanges')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileForm;