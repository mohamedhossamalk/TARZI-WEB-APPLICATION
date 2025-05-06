import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  StraightenOutlined as MeasureIcon
} from '@mui/icons-material';
import MeasurementForm from '../components/measurements/MeasurementForm';
import { 
  getUserMeasurements, 
  createMeasurement, 
  updateMeasurement, 
  deleteMeasurement 
} from '../store/actions/measurementActions';

const MeasurementsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { measurements, loading, error } = useSelector(state => state.measurements);
  
  const [openForm, setOpenForm] = useState(false);
  const [currentMeasurement, setCurrentMeasurement] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [measurementToDelete, setMeasurementToDelete] = useState(null);
  
  // Fetch user measurements on component mount
  useEffect(() => {
    dispatch(getUserMeasurements());
  }, [dispatch]);
  
  // Open form to add new measurement
  const handleAddMeasurement = () => {
    setCurrentMeasurement(null);
    setOpenForm(true);
  };
  
  // Open form to edit measurement
  const handleEditMeasurement = (measurement) => {
    setCurrentMeasurement(measurement);
    setOpenForm(true);
  };
  
  // Close form
  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentMeasurement(null);
  };
  
  // Handle form submission
  const handleFormSubmit = (formData) => {
    if (currentMeasurement) {
      // Update existing measurement
      dispatch(updateMeasurement(currentMeasurement._id, formData)).then(() => {
        handleCloseForm();
      });
    } else {
      // Create new measurement
      dispatch(createMeasurement(formData)).then(() => {
        handleCloseForm();
      });
    }
  };
  
  // Open delete confirmation dialog
  const handleDeleteClick = (measurement) => {
    setMeasurementToDelete(measurement);
    setOpenDelete(true);
  };
  
  // Close delete confirmation dialog
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setMeasurementToDelete(null);
  };
  
  // Confirm deletion
  const handleConfirmDelete = () => {
    if (measurementToDelete) {
      dispatch(deleteMeasurement(measurementToDelete._id)).then(() => {
        handleCloseDelete();
      });
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {t('measurement.title')}
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddMeasurement}
          >
            {t('measurement.addNew')}
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            {!measurements || measurements.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <MeasureIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t('measurement.noMeasurements')}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddMeasurement}
                  sx={{ mt: 2 }}
                >
                  {t('measurement.addNew')}
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {measurements.map((measurement) => (
                  <Grid item key={measurement._id} xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">
                            {measurement.name}
                          </Typography>
                          
                          <Box>
                            <IconButton 
                              color="primary" 
                              onClick={() => handleEditMeasurement(measurement)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              onClick={() => handleDeleteClick(measurement)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ mb: 2 }} />
                        
                        <Grid container spacing={2}>
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
                          <>
                            <Divider sx={{ my: 2 }} />
                            
                            <Typography variant="body2" color="text.secondary">
                              {t('measurement.notes')}
                            </Typography>
                            <Typography variant="body2">
                              {measurement.notes}
                            </Typography>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
      
      {/* Measurement Form Dialog */}
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <MeasurementForm 
            initialData={currentMeasurement}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
      >
        <DialogTitle>
          {t('measurement.confirmDelete')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('measurement.deleteWarning', { name: measurementToDelete?.name })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MeasurementsPage;