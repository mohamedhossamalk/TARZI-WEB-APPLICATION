// src/features/orders/pages/OrderTrackingPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Breadcrumbs,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Home as HomeIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  LocalShipping as ShippingIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Inventory as InventoryIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import orderService from '../services/orderService';
import { 
  CustomTimeline as Timeline,
  CustomTimelineItem as TimelineItem,
  CustomTimelineSeparator as TimelineSeparator,
  CustomTimelineConnector as TimelineConnector,
  CustomTimelineDot as TimelineDot,
  CustomTimelineContent as TimelineContent
} from '../components/CustomTimeline';
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
    borderTopWidth: 3,
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
  },
}));

// تصميم مخصص للخطوات المكتملة
const CustomStepConnectorCompleted = styled(StepConnector)(({ theme }) => ({
  '.MuiStepConnector-line': {
    borderColor: theme.palette.primary.main,
  },
}));

// أيقونة مخصصة للخطوات
const StepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: theme.palette.primary.main,
  }),
  '& .StepIconDot': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  ...(ownerState.completed && {
    color: theme.palette.primary.main,
  }),
}));

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await orderService.getOrderById(id);
        setOrder(response.data.order);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء جلب تفاصيل الطلب');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);

  // الحصول على الخطوة الحالية لـ Stepper
  const getActiveStep = (status) => {
    if (status === 'cancelled') {
      return -1; // حالة خاصة للإلغاء
    }
    return orderStatusSteps.findIndex(step => step.status === status);
  };

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status) => {
    switch (status) {
      case 'created':
        return <AssignmentIcon />;
      case 'pending':
        return <AccessTimeIcon />;
      case 'processing':
        return <InventoryIcon />;
      case 'shipped':
        return <ShippingIcon />;
      case 'delivered':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return <AssignmentIcon />;
    }
  };

  // الحصول على لون الحالة
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // الحصول على نص الحالة
  const getStatusText = (status) => {
    switch (status) {
      case 'created':
        return 'تم إنشاء الطلب';
      case 'pending':
        return 'قيد الانتظار';
      case 'processing':
        return 'قيد المعالجة';
      case 'shipped':
        return 'تم الشحن';
      case 'delivered':
        return 'تم التسليم';
      case 'cancelled':
        return 'تم إلغاء الطلب';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'لم يتم العثور على الطلب'}
        </Alert>
        <Button
          component={RouterLink}
          to="/orders"
          sx={{ mt: 2 }}
          variant="outlined"
          startIcon={<KeyboardArrowLeftIcon />}
        >
          العودة إلى الطلبات
        </Button>
      </Container>
    );
  }

  const activeStep = getActiveStep(order.status);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs separator={<KeyboardArrowLeftIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          الرئيسية
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/orders"
        >
          الطلبات
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to={`/orders/${order._id}`}
        >
          الطلب #{order.orderNumber}
        </Link>
        <Typography color="text.primary">تتبع الطلب</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
          <ShippingIcon color="primary" sx={{ mr: 1 }} />
          تتبع الطلب #{order.orderNumber}
        </Typography>
        
        <Button
          component={RouterLink}
          to={`/orders/${order._id}`}
          variant="outlined"
          startIcon={<KeyboardArrowLeftIcon />}
        >
          العودة للتفاصيل
        </Button>
      </Box>

      {order.status === 'cancelled' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CancelIcon sx={{ mr: 1 }} />
            <Typography variant="body1">
              تم إلغاء هذا الطلب
              {order.cancelReason && ` - السبب: ${order.cancelReason}`}
            </Typography>
          </Box>
        </Alert>
      )}

      {/* حالة الطلب - Stepper */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            حالة الطلب
          </Typography>
          {order.estimatedDeliveryDate && (
            <Typography variant="body2" color="text.secondary">
              تاريخ التسليم المتوقع: {new Date(order.estimatedDeliveryDate).toLocaleDateString('ar-EG')}
            </Typography>
          )}
        </Box>

        {order.status !== 'cancelled' ? (
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }} connector={<CustomStepConnector />}>
            {orderStatusSteps.map((step, index) => (
              <Step key={step.status} completed={index <= activeStep}>
                <StepLabel
                  StepIconProps={{
                    active: index === activeStep,
                    completed: index < activeStep,
                    icon: index + 1
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" color="error" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CancelIcon sx={{ mr: 1 }} />
              تم إلغاء الطلب
            </Typography>
          </Box>
        )}

        {/* معلومات تتبع الشحنة */}
        {order.trackingInfo && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  رقم التتبع
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {order.trackingInfo.trackingNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  شركة الشحن
                </Typography>
                <Typography variant="body1">
                  {order.trackingInfo.shippingCompany}
                </Typography>
              </Grid>
              {order.trackingInfo.trackingUrl && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    href={order.trackingInfo.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    تتبع الشحنة على موقع الشركة
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* خريطة زمنية مفصلة */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          مسار الطلب
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Timeline position="left">
          {order.timeline && order.timeline.length > 0 ? (
            order.timeline.map((event, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot color={
                    event.status === 'delivered' ? 'success' :
                    event.status === 'shipped' ? 'info' :
                    event.status === 'cancelled' ? 'error' :
                    'primary'
                  }>
                    {getStatusIcon(event.status)}
                  </TimelineDot>
                  {index !== order.timeline.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ py: 2, px: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {getStatusText(event.status)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(event.timestamp).toLocaleDateString('ar-EG', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                  {event.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {event.description}
                    </Typography>
                  )}
                  {event.location && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Box>
                  )}
                </TimelineContent>
              </TimelineItem>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                لا توجد معلومات متاحة عن مسار الطلب
              </Typography>
            </Box>
          )}
        </Timeline>
      </Paper>

      {/* معلومات المنتجات الرئيسية */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          ملخص الطلب
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  المنتجات
                </Typography>
                {order.items.map((item, idx) => (
                  <Box key={idx} sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      {item.name} × {item.quantity}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  عنوان التوصيل
                </Typography>
                {order.shippingAddress && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      {order.shippingAddress.name}
                    </Typography>
                    <Typography variant="body2">
                      {order.shippingAddress.street}
                    </Typography>
                    <Typography variant="body2">
                      {order.shippingAddress.city}، {order.shippingAddress.state}
                    </Typography>
                    <Typography variant="body2">
                      {order.shippingAddress.country}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default OrderTrackingPage;