// src/features/cart/components/AddressForm.js
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const countries = [
  { value: 'SA', label: 'المملكة العربية السعودية' },
  { value: 'AE', label: 'الإمارات العربية المتحدة' },
  { value: 'BH', label: 'البحرين' },
  { value: 'KW', label: 'الكويت' },
  { value: 'OM', label: 'عمان' },
  { value: 'QA', label: 'قطر' },
];

const AddressForm = ({ onSubmit, onCancel, initialData }) => {
  const validationSchema = Yup.object({
    fullName: Yup.string().required('الاسم الكامل مطلوب'),
    phoneNumber: Yup.string().required('رقم الهاتف مطلوب'),
    street: Yup.string().required('العنوان مطلوب'),
    city: Yup.string().required('المدينة مطلوبة'),
    state: Yup.string().required('المنطقة مطلوبة'),
    postalCode: Yup.string().required('الرمز البريدي مطلوب'),
    country: Yup.string().required('الدولة مطلوبة'),
  });

  const formik = useFormik({
    initialValues: {
      fullName: initialData?.fullName || '',
      phoneNumber: initialData?.phoneNumber || '',
      street: initialData?.street || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      postalCode: initialData?.postalCode || '',
      country: initialData?.country || 'SA',
      saveAddress: true
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    }
  });

  return (
    <Box>
       <Typography variant="h6" gutterBottom>
        عنوان التوصيل
      </Typography>
      
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="fullName"
              name="fullName"
              label="الاسم الكامل"
              fullWidth
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              id="phoneNumber"
              name="phoneNumber"
              label="رقم الهاتف"
              fullWidth
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              id="street"
              name="street"
              label="العنوان"
              fullWidth
              value={formik.values.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.street && Boolean(formik.errors.street)}
              helperText={formik.touched.street && formik.errors.street}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="city"
              name="city"
              label="المدينة"
              fullWidth
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="state"
              name="state"
              label="المنطقة"
              fullWidth
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="postalCode"
              name="postalCode"
              label="الرمز البريدي"
              fullWidth
              value={formik.values.postalCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
              helperText={formik.touched.postalCode && formik.errors.postalCode}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="country"
              name="country"
              label="الدولة"
              fullWidth
              select
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.country && Boolean(formik.errors.country)}
              helperText={formik.touched.country && formik.errors.country}
            >
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>
                  {country.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox 
                  name="saveAddress" 
                  color="primary" 
                  checked={formik.values.saveAddress}
                  onChange={formik.handleChange}
                />
              }
              label="احفظ هذا العنوان للطلبات المستقبلية"
            />
          </Grid>
          
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={onCancel} sx={{ mr: 1 }}>
              إلغاء
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
            >
              متابعة للدفع
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddressForm;