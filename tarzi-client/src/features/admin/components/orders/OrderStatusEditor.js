// src/features/admin/components/orders/OrderStatusEditor.js
import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  TextField,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';

const steps = [
  { label: 'قيد الانتظار', value: 'pending' },
  { label: 'قيد المعالجة', value: 'processing' },
  { label: 'تم الشحن', value: 'shipped' },
  { label: 'تم التسليم', value: 'delivered' }
];

const OrderStatusEditor = ({ order, onUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  
  // الحصول على الخطوة الحالية بناءً على حالة الطلب
  const getActiveStep = () => {
    if (order.status === 'cancelled') return -1;
    return steps.findIndex(step => step.value === order.status);
  };
  
  const activeStep = getActiveStep();
  
  // تغيير حالة الطلب
  const handleChangeStatus = async (newStatus) => {
    setLoading(true);
    setError(null);
    
    try {
      const updateData = {
        status: newStatus,
        notes: notes || undefined,
        trackingNumber: trackingNumber || undefined
      };
      
      await onUpdateStatus(order._id, updateData);
      
      // مسح الملاحظات بعد التحديث الناجح
      setNotes('');
    } catch (err) {
      setError('فشل تحديث حالة الطلب');
      console.error('Error updating order status:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // إلغاء الطلب
  const handleCancelOrder = async () => {
    await handleChangeStatus('cancelled');
  };
  
  if (order.status === 'cancelled') {
    return (
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#fdeded' }}>
        <Typography variant="h6" color="error" gutterBottom>
          هذا الطلب ملغي
        </Typography>
        {order.notes && (
          <Typography variant="body2" color="text.secondary">
            سبب الإلغاء: {order.notes}
          </Typography>
        )}
      </Paper>
    );
  }
  
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        تحديث حالة الطلب
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((step) => (
          <Step key={step.value}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Grid container spacing={2}>
        {activeStep === 1 && ( // إذا كانت الحالة "قيد المعالجة"
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="رقم التتبع"
              variant="outlined"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="أدخل رقم تتبع الشحنة"
              sx={{ mb: 2 }}
            />
          </Grid>
        )}
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="ملاحظات (اختياري)"
            variant="outlined"
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أضف ملاحظات حول تحديث الحالة"
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleCancelOrder}
          disabled={loading || order.status === 'delivered'}
        >
          إلغاء الطلب
        </Button>
        
        <Box>
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleChangeStatus(steps[activeStep + 1].value)}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : `نقل إلى ${steps[activeStep + 1].label}`}
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default OrderStatusEditor;