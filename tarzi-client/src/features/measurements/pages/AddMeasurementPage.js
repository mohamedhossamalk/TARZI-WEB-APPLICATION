// src/features/measurements/pages/AddMeasurementPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import MeasurementForm from '../components/MeasurementForm';
import measurementService from '../services/measurementService';

const AddMeasurementPage = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  const handleSaveMeasurement = async (measurementData) => {
    try {
      await measurementService.createMeasurement(measurementData);
      navigate('/measurements');
    } catch (error) {
      setError('حدث خطأ أثناء حفظ المقاس. يرجى المحاولة مرة أخرى.');
      console.error('Error saving measurement:', error);
    }
  };

  const handleCancel = () => {
    navigate('/measurements');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{ mr: 2 }}
        >
          العودة للمقاسات
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          إضافة مقاس جديد
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <MeasurementForm
          onSubmit={handleSaveMeasurement}
          onCancel={handleCancel}
        />
      </Paper>
    </Container>
  );
};

export default AddMeasurementPage;