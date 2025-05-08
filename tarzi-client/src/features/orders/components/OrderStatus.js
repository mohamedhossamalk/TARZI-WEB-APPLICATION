// src/features/orders/components/OrderStatusStepper.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Inventory as ProcessingIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// تخصيص موصل الخطوات
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.MuiStepConnector-alternativeLabel`]: {
    top: 22,
  },
  [`&.MuiStepConnector-active`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`&.MuiStepConnector-completed`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`& .MuiStepConnector-line`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

// تخصيص أيقونة الخطوة
const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundColor: theme.palette.primary.main,
  }),
}));

// مكون أيقونة الخطوة
const ColorlibStepIcon = (props) => {
  const { active, completed, className, icon } = props;
  
  const icons = {
    1: <CartIcon />,
    2: <ProcessingIcon />,
    3: <ShippingIcon />,
    4: <DeliveredIcon />,
  };
  
  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[icon]}
    </ColorlibStepIconRoot>
  );
};

// مكون حالة الطلب الملغي
const CancelledOrderStatus = () => {
  const { t } = useTranslation();
  
  return (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <CancelIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" color="error.main" gutterBottom>
        {t('orders.status.cancelled')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('orders.orderCancelled')}
      </Typography>
    </Box>
  );
};

const OrderStatusStepper = ({ status }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // إذا كان الطلب ملغي
  if (status === 'cancelled') {
    return <CancelledOrderStatus />;
  }
  
  // تحديد الخطوة النشطة بناءً على حالة الطلب
  const getActiveStep = () => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };
  
  // خطوات حالة الطلب
  const steps = [
    {
      label: t('orders.status.pending'),
      description: t('orders.statusDescription.pending', 'تم استلام طلبك وهو قيد المعالجة')
    },
    {
      label: t('orders.status.processing'),
      description: t('orders.statusDescription.processing', 'يتم تجهيز طلبك')
    },
    {
      label: t('orders.status.shipped'),
      description: t('orders.statusDescription.shipped', 'تم شحن طلبك وهو في طريقه إليك')
    },
    {
      label: t('orders.status.delivered'),
      description: t('orders.statusDescription.delivered', 'تم تسليم طلبك')
    }
  ];
  
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper
        activeStep={getActiveStep()}
        alternativeLabel={!isMobile}
        orientation={isMobile ? 'vertical' : 'horizontal'}
        connector={<ColorlibConnector />}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconComponent={ColorlibStepIcon}
              optional={
                isMobile ? (
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            {!isMobile && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'center', mt: 1, maxWidth: 150, mx: 'auto' }}
              >
                {step.description}
              </Typography>
            )}
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default OrderStatusStepper;