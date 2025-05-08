// src/features/measurements/pages/MeasurementsPage.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  CircularProgress,
  Alert,
  Collapse,
  Fab,
  Chip,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Straighten as StraightenIcon,
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useMeasurements } from '../../../core/hooks/useMeasurements';
import MeasurementForm from '../components/MeasurementForm';
import MeasurementGuide from '../components/MeasurementGuide';

const MeasurementsPage = () => {
  const { t } = useTranslation();
  const {
    measurements,
    defaultMeasurement,
    isLoading,
    error,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement,
    setDefaultMeasurementById
  } = useMeasurements();
  
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openGuide, setOpenGuide] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  
  // فتح النموذج للإضافة
  const handleOpenCreateForm = () => {
    setFormMode('create');
    setSelectedMeasurement(null);
    setOpenForm(true);
  };
  
  // فتح النموذج للتعديل
  const handleOpenEditForm = (measurement) => {
    setFormMode('edit');
    setSelectedMeasurement(measurement);
    setOpenForm(true);
  };
  
  // إغلاق النموذج
  const handleCloseForm = () => {
    setOpenForm(false);
  };
  
  // فتح حوار الحذف
  const handleOpenDeleteDialog = (measurement) => {
    setSelectedMeasurement(measurement);
    setOpenDeleteDialog(true);
  };
  
  // إغلاق حوار الحذف
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedMeasurement(null);
  };
  
  // حذف المقاس
  const handleDeleteMeasurement = async () => {
    if (!selectedMeasurement) return;
    
    try {
      await deleteMeasurement(selectedMeasurement._id);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('خطأ في حذف المقاس:', error);
    }
  };
  
  // تعيين المقاس كافتراضي
  const handleSetAsDefault = async (id) => {
    try {
      await setDefaultMeasurementById(id);
    } catch (error) {
      console.error('خطأ في تعيين المقاس كافتراضي:', error);
    }
  };
  
  // إضافة مقاس جديد
  const handleAddMeasurement = async (measurementData) => {
    try {
      await createMeasurement(measurementData);
      handleCloseForm();
    } catch (error) {
      console.error('خطأ في إضافة المقاس:', error);
    }
  };
  
  // تعديل مقاس
  const handleUpdateMeasurement = async (measurementData) => {
    try {
      await updateMeasurement(selectedMeasurement._id, measurementData);
      handleCloseForm();
    } catch (error) {
      console.error('خطأ في تحديث المقاس:', error);
    }
  };
  
  // فتح دليل القياس
  const handleOpenGuide = () => {
    setOpenGuide(true);
  };
  
  // إغلاق دليل القياس
  const handleCloseGuide = () => {
    setOpenGuide(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {t('measurements.myMeasurements')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('measurements.measurementDescription', 'احفظ مقاساتك للطلب بسرعة وسهولة')}
          </Typography>
        </Box>
        
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<HelpIcon />}
            onClick={handleOpenGuide}
            sx={{ mr: 1 }}
          >
            {t('measurements.measurementGuide')}
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateForm}
          >
            {t('measurements.addMeasurement')}
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || t('errors.generalError')}
        </Alert>
      )}
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : measurements.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <StraightenIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.7, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {t('measurements.noMeasurements')}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {t('measurements.addYourFirstMeasurement')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateForm}
          >
            {t('measurements.addMeasurement')}
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {measurements.map((measurement) => (
            <Grid item xs={12} sm={6} md={4} key={measurement._id}>
              <Card 
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  ...(measurement.isDefault && {
                    border: '2px solid',
                    borderColor: 'primary.main',
                  }),
                }}
              >
                {measurement.isDefault && (
                  <Chip
                    label={t('measurements.default')}
                    color="primary"
                    size="small"
                    icon={<StarIcon />}
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                    }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {measurement.name}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        {t('measurements.unit')}
                      </Typography>
                      <Typography variant="body1">
                        {measurement.unit === 'cm' ? t('measurements.cm') : t('measurements.inch')}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        {t('measurements.height')}
                      </Typography>
                      <Typography variant="body1">
                        {measurement.height} {measurement.unit}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        {t('measurements.chest')}
                      </Typography>
                      <Typography variant="body1">
                        {measurement.chest} {measurement.unit}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        {t('measurements.waist')}
                      </Typography>
                      <Typography variant="body1">
                        {measurement.waist} {measurement.unit}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        {t('measurements.hips')}
                      </Typography>
                      <Typography variant="body1">
                        {measurement.hips} {measurement.unit}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Box>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditForm(measurement)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(measurement)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  {!measurement.isDefault && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<StarBorderIcon />}
                      onClick={() => handleSetAsDefault(measurement._id)}
                    >
                      {t('measurements.setAsDefault')}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* نموذج إضافة/تعديل المقاس */}
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {formMode === 'create' ? t('measurements.addMeasurement') : t('measurements.editMeasurement')}
        </DialogTitle>
        <DialogContent>
          <MeasurementForm
            initialData={selectedMeasurement}
            onSubmit={formMode === 'create' ? handleAddMeasurement : handleUpdateMeasurement}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
      
      {/* حوار تأكيد حذف المقاس */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>
          {t('measurements.deleteMeasurement')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('measurements.confirmDelete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            {t('general.cancel')}
          </Button>
          <Button onClick={handleDeleteMeasurement} color="error" autoFocus>
            {t('general.delete')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* دليل القياس */}
      <Dialog
        open={openGuide}
        onClose={handleCloseGuide}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t('measurements.measurementGuide')}
        </DialogTitle>
        <DialogContent>
          <MeasurementGuide />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGuide} color="primary">
            {t('general.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MeasurementsPage;