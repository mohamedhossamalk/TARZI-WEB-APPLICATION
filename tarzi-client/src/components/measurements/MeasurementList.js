import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  StraightenOutlined as MeasureIcon
} from '@mui/icons-material';

const MeasurementList = ({ 
  measurements, 
  loading, 
  error, 
  onEdit, 
  onDelete,
  onAddNew
}) => {
  const { t } = useTranslation();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!measurements || measurements.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <MeasureIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t('measurement.noMeasurements')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onAddNew}
          sx={{ mt: 2 }}
        >
          {t('measurement.addNew')}
        </Button>
      </Box>
    );
  }
  
  return (
    <Grid container spacing={3}>
      {measurements.map((measurement) => (
        <Grid item key={measurement._id} xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {measurement.name}
              </Typography>
              
              <Divider sx={{ my: 1 }} />
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {measurement.chest && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      {t('measurement.chest')}
                    </Typography>
                    <Typography variant="body1">
                      {measurement.chest} {t('measurement.cm')}
                    </Typography>
                  </Grid>
                )}
                
                {measurement.waist && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      {t('measurement.waist')}
                    </Typography>
                    <Typography variant="body1">
                      {measurement.waist} {t('measurement.cm')}
                    </Typography>
                  </Grid>
                )}
                
                {measurement.hips && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      {t('measurement.hips')}
                    </Typography>
                    <Typography variant="body1">
                      {measurement.hips} {t('measurement.cm')}
                    </Typography>
                  </Grid>
                )}
                
                {measurement.shoulder && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      {t('measurement.shoulder')}
                    </Typography>
                    <Typography variant="body1">
                      {measurement.shoulder} {t('measurement.cm')}
                    </Typography>
                  </Grid>
                )}
                
                {measurement.sleeve && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      {t('measurement.sleeve')}
                    </Typography>
                    <Typography variant="body1">
                      {measurement.sleeve} {t('measurement.cm')}
                    </Typography>
                  </Grid>
                )}
                
                {measurement.inseam && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      {t('measurement.inseam')}
                    </Typography>
                    <Typography variant="body1">
                      {measurement.inseam} {t('measurement.cm')}
                    </Typography>
                  </Grid>
                )}
                
                {measurement.neck && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      {t('measurement.neck')}
                    </Typography>
                    <Typography variant="body1">
                      {measurement.neck} {t('measurement.cm')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              {measurement.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('measurement.notes')}:
                  </Typography>
                  <Typography variant="body2">
                    {measurement.notes}
                  </Typography>
                </Box>
              )}
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEdit(measurement)}
              >
                {t('measurement.edit')}
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(measurement)}
              >
                {t('measurement.delete')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MeasurementList;