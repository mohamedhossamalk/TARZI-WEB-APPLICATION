// src/features/orders/components/OrderStatusStepper.js
import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

// نص حالات الطلب
const orderStatusSteps = [
  { status: 'pending', label: 'قيد الانتظار', icon: <ScheduleIcon /> },
  { status: 'processing', label: 'قيد المعالجة', icon: <AssignmentIcon /> },
  { status: 'shipped', label: 'تم الشحن', icon: <ShippingIcon /> },
  { status: 'delivered', label: 'تم التسليم', icon: <CheckCircleIcon /> }
];

// تصميم مخصص للرابط بين خطوات الطلب
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  '.MuiStepConnector-line': {
    borderColor: theme.palette.primary.main,
  },
}));

const OrderStatusStepper = ({ status, estimatedDeliveryDate }) => {
  // الحصول على الخطوة الحالية لـ Stepper
  const getActiveStep = (status) => {
    if (status === 'cancelled') {
      return -1; // حالة خاصة للإلغاء
    }
    return orderStatusSteps.findIndex(step => step.status === status);
  };

  const activeStep = getActiveStep(status);

  return (
    <Box>
      {status === 'cancelled' ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="h6" color="error" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CancelIcon sx={{ mr: 1 }} />
            تم إلغاء الطلب
          </Typography>
        </Box>
      ) : (
        <Stepper activeStep={activeStep} alternativeLabel connector={<CustomStepConnector />}>
          {orderStatusSteps.map((step, index) => (
            <Step key={step.status} completed={index <= activeStep}>
              <StepLabel
                StepIconProps={{
                  active: index === activeStep,
                  completed: index < activeStep,
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      
      {estimatedDeliveryDate && status !== 'cancelled' && status !== 'delivered' && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          تاريخ التسليم المتوقع: {new Date(estimatedDeliveryDate).toLocaleDateString('ar-EG')}
        </Typography>
      )}
    </Box>
  );
};

export default OrderStatusStepper;