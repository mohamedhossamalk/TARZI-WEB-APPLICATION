import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  Divider
} from '@mui/material';

const MeasurementForm = ({ initialData, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    chest: '',
    waist: '',
    hips: '',
    shoulder: '',
    sleeve: '',
    inseam: '',
    neck: '',
    notes: ''
  });
  
  // Initialize form with data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure all fields exist
        name: initialData.name || '',
        chest: initialData.chest || '',
        waist: initialData.waist || '',
        hips: initialData.hips || '',
        shoulder: initialData.shoulder || '',
        sleeve: initialData.sleeve || '',
        inseam: initialData.inseam || '',
        neck: initialData.neck || '',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? t('measurement.edit') : t('measurement.addNew')}
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label={t('measurement.name')}
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="chest"
              label={t('measurement.chest')}
              fullWidth
              value={formData.chest}
              onChange={handleChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">{t('measurement.cm')}</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="waist"
              label={t('measurement.waist')}
              fullWidth
              value={formData.waist}
              onChange={handleChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">{t('measurement.cm')}</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="hips"
              label={t('measurement.hips')}
              fullWidth
              value={formData.hips}
              onChange={handleChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">{t('measurement.cm')}</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="shoulder"
              label={t('measurement.shoulder')}
              fullWidth
              value={formData.shoulder}
              onChange={handleChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">{t('measurement.cm')}</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="sleeve"
              label={t('measurement.sleeve')}
              fullWidth
              value={formData.sleeve}
              onChange={handleChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">{t('measurement.cm')}</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="inseam"
              label={t('measurement.inseam')}
              fullWidth
              value={formData.inseam}
              onChange={handleChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">{t('measurement.cm')}</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="neck"
              label={t('measurement.neck')}
              fullWidth
              value={formData.neck}
              onChange={handleChange}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">{t('measurement.cm')}</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="notes"
              label={t('measurement.notes')}
              fullWidth
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
            >
              {t('common.cancel')}
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {initialData ? t('common.save') : t('measurement.addNew')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default MeasurementForm;