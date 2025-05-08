// src/features/measurements/components/MeasurementForm.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  FormHelperText,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const MeasurementForm = ({ initialData, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  
  // مخطط التحقق من صحة النموذج
  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('errors.requiredField'))
      .max(50, t('errors.maxLengthExceeded')),
    unit: Yup.string()
      .required(t('errors.requiredField'))
      .oneOf(['cm', 'inch'], t('errors.invalidValue')),
    height: Yup.number()
      .required(t('errors.requiredField'))
      .positive(t('errors.invalidAmount')),
    chest: Yup.number()
      .required(t('errors.requiredField'))
      .positive(t('errors.invalidAmount')),
    waist: Yup.number()
      .required(t('errors.requiredField'))
      .positive(t('errors.invalidAmount')),
    hips: Yup.number()
      .required(t('errors.requiredField'))
      .positive(t('errors.invalidAmount')),
    shoulder: Yup.number()
      .required(t('errors.requiredField'))
      .positive(t('errors.invalidAmount')),
    sleeve: Yup.number()
      .required(t('errors.requiredField'))
      .positive(t('errors.invalidAmount')),
    inseam: Yup.number()
      .required(t('errors.requiredField'))
      .positive(t('errors.invalidAmount')),
    neck: Yup.number()
      .required(t('errors.requiredField'))
      .positive(t('errors.invalidAmount')),
    isDefault: Yup.boolean(),
    notes: Yup.string().max(500, t('errors.maxLengthExceeded')),
  });
  
  // القيم الافتراضية للنموذج
  const initialValues = {
    name: initialData?.name || '',
    unit: initialData?.unit || 'cm',
    height: initialData?.height || '',
    chest: initialData?.chest || '',
    waist: initialData?.waist || '',
    hips: initialData?.hips || '',
    shoulder: initialData?.shoulder || '',
    sleeve: initialData?.sleeve || '',
    inseam: initialData?.inseam || '',
    neck: initialData?.neck || '',
    isDefault: initialData?.isDefault || false,
    notes: initialData?.notes || '',
  };
  
  // إعداد Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        {/* البيانات الأساسية للمقاس */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label={t('measurements.measurementName')}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="unit-label">{t('measurements.unit')}</InputLabel>
            <Select
              labelId="unit-label"
              id="unit"
              name="unit"
              value={formik.values.unit}
              onChange={formik.handleChange}
              error={formik.touched.unit && Boolean(formik.errors.unit)}
            >
              <MenuItem value="cm">{t('measurements.cm')}</MenuItem>
              <MenuItem value="inch">{t('measurements.inch')}</MenuItem>
            </Select>
            {formik.touched.unit && formik.errors.unit && (
              <FormHelperText error>{formik.errors.unit}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 2, mt: 1 }}>
            {t('measurements.bodyMeasurements')}
          </Typography>
        </Grid>
        
        {/* قياسات الجسم */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            id="height"
            name="height"
            label={t('measurements.height')}
            type="number"
            inputProps={{ step: 0.1 }}
            value={formik.values.height}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.height && Boolean(formik.errors.height)}
            helperText={formik.touched.height && formik.errors.height}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            id="chest"
            name="chest"
            label={t('measurements.chest')}
            type="number"
            inputProps={{ step: 0.1 }}
            value={formik.values.chest}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.chest && Boolean(formik.errors.chest)}
            helperText={formik.touched.chest && formik.errors.chest}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            id="waist"
            name="waist"
            label={t('measurements.waist')}
            type="number"
            inputProps={{ step: 0.1 }}
            value={formik.values.waist}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.waist && Boolean(formik.errors.waist)}
            helperText={formik.touched.waist && formik.errors.waist}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            id="hips"
            name="hips"
            label={t('measurements.hips')}
            type="number"
            inputProps={{ step: 0.1 }}
            value={formik.values.hips}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.hips && Boolean(formik.errors.hips)}
            helperText={formik.touched.hips && formik.errors.hips}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            id="shoulder"
            name="shoulder"
            label={t('measurements.shoulder')}
            type="number"
            inputProps={{ step: 0.1 }}
            value={formik.values.shoulder}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.shoulder && Boolean(formik.errors.shoulder)}
            helperText={formik.touched.shoulder && formik.errors.shoulder}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            id="sleeve"
            name="sleeve"
            label={t('measurements.sleeve')}
            type="number"
            inputProps={{ step: 0.1 }}
            value={formik.values.sleeve}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.sleeve && Boolean(formik.errors.sleeve)}
            helperText={formik.touched.sleeve && formik.errors.sleeve}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            id="inseam"
            name="inseam"
            label={t('measurements.inseam')}
            type="number"
            inputProps={{ step: 0.1 }}
            value={formik.values.inseam}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.inseam && Boolean(formik.errors.inseam)}
            helperText={formik.touched.inseam && formik.errors.inseam}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            id="neck"
            name="neck"
            label={t('measurements.neck')}
            type="number"
            inputProps={{ step: 0.1 }}
            value={formik.values.neck}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.neck && Boolean(formik.errors.neck)}
            helperText={formik.touched.neck && formik.errors.neck}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                id="isDefault"
                name="isDefault"
                checked={formik.values.isDefault}
                onChange={formik.handleChange}
              />
            }
            label={t('measurements.setAsDefault')}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="notes"
            name="notes"
            label={t('general.notes')}
            multiline
            rows={3}
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.notes && Boolean(formik.errors.notes)}
            helperText={formik.touched.notes && formik.errors.notes}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{ mr: 1 }}
        >
          {t('general.cancel')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={formik.isSubmitting}
        >
          {initialData ? t('general.save') : t('general.add')}
        </Button>
      </Box>
    </Box>
  );
};

export default MeasurementForm;