// src/features/orders/pages/OrderDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Link,
  Breadcrumbs,
  Rating,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Assignment as AssignmentIcon,
  CancelOutlined as CancelIcon,
  RateReview as RateReviewIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Receipt as ReceiptIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import orderService from '../services/orderService';
import { formatDate, formatPrice, formatOrderStatus } from '../../../core/utils/formatters';
import OrderStatusStepper from '../components/OrderStatusStepper';
import OrderItemCard from '../components/OrderItemCard';
import RatingDialog from '../components/RatingDialog';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [openRatingDialog, setOpenRatingDialog] = useState(false);
  
  // جلب تفاصيل الطلب
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(id);
        setOrder(response.data);
      } catch (error) {
        console.error('خطأ في جلب تفاصيل الطلب:', error);
        setError(error.response?.data?.message || t('errors.generalError'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);
  
  // فتح حوار إلغاء الطلب
  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };
  
  // إغلاق حوار إلغاء الطلب
  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    setCancelReason('');
  };
  
  // إلغاء الطلب
  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      await orderService.cancelOrder(id, { reason: cancelReason });
      
      // تحديث حالة الطلب محلياً
      setOrder(prev => ({
        ...prev,
        status: 'cancelled',
        notes: cancelReason
      }));
      
      handleCloseCancelDialog();
    } catch (error) {
      console.error('خطأ في إلغاء الطلب:', error);
      setError(error.response?.data?.message || t('errors.generalError'));
    } finally {
      setCancelling(false);
    }
  };
  
  // فتح حوار تقييم الطلب
  const handleOpenRatingDialog = () => {
    setOpenRatingDialog(true);
  };
  
  // إغلاق حوار تقييم الطلب
  const handleCloseRatingDialog = () => {
    setOpenRatingDialog(false);
  };
  
  // تقييم الطلب
  const handleRateOrder = async (rating, comment) => {
    try {
      await orderService.rateOrder(id, { rate: rating, comment });
      
      // تحديث الطلب محلياً
      setOrder(prev => ({
        ...prev,
        rating: {
          rate: rating,
          comment,
          date: new Date().toISOString()
        }
      }));
      
      handleCloseRatingDialog();
    } catch (error) {
      console.error('خطأ في تقييم الطلب:', error);
      setError(error.response?.data?.message || t('errors.generalError'));
    }
  };
  
  // الرجوع إلى صفحة الطلبات
  const handleGoBack = () => {
    navigate('/orders');
  };
  
  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            {t('general.back')}
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!order) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">{t('orders.orderNotFound')}</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            {t('general.back')}
          </Button>
        </Box>
      </Container>
    );
  }
  
  // تحديد لون حالة الطلب
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // تحديد ما إذا كان يمكن إلغاء الطلب
  const canCancel = ['pending', 'processing'].includes(order.status);
  
  // تحديد ما إذا كان يمكن تقييم الطلب
  const canRate = order.status === 'delivered' && !order.rating;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* شريط التنقل */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {t('pages.home')}
        </Link>
        <Link
          component={RouterLink}
          to="/orders"
          color="inherit"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <ReceiptIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {t('orders.myOrders')}
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {t('orders.orderDetails')}
        </Typography>
      </Breadcrumbs>
      
      {/* رأس الصفحة */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {t('orders.orderDetails')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('orders.orderNumber')}: {order.orderNumber || `#${order._id.substring(0, 8)}`}
          </Typography>
        </Box>
        
        <Box>
          <Chip
            label={formatOrderStatus(order.status)}
            color={getStatusColor(order.status)}
            icon={<ShippingIcon />}
            sx={{ fontWeight: 'bold', px: 1 }}
          />
        </Box>
      </Box>
      
      {/* تتبع حالة الطلب */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <OrderStatusStepper status={order.status} />
      </Paper>
      
      {/* تفاصيل الطلب */}
      <Grid container spacing={3}>
        {/* القسم الأيمن: المنتجات ومعلومات الطلب */}
        <Grid item xs={12} md={8}>
          {/* منتجات الطلب */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t('orders.items')}
            </Typography>
            
            <Grid container spacing={2}>
              {order.products && order.products.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <OrderItemCard item={item} />
                  {index < order.products.length - 1 && <Divider sx={{ my: 2 }} />}
                </Grid>
              ))}
            </Grid>
          </Paper>
          
          {/* معلومات الشحن */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t('orders.shippingInformation')}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <LocationIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {t('orders.shippingAddress')}
                    </Typography>
                    <Typography variant="body2">
                      {order.shippingAddress?.street}, {order.shippingAddress?.city}
                      <br />
                      {order.shippingAddress?.state}, {order.shippingAddress?.postalCode}
                      <br />
                      {t('general.phone')}: {order.shippingAddress?.phone}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <TimeIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {t('orders.orderDates')}
                    </Typography>
                    <Typography variant="body2">
                      {t('orders.placedOn')}: {formatDate(order.createdAt)}
                      <br />
                      {order.status === 'delivered' && order.deliveredAt && (
                        <>{t('orders.deliveredOn')}: {formatDate(order.deliveredAt)}</>
                      )}
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <>{t('orders.estimatedDelivery')}: {formatDate(new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000))}</>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            {order.trackingNumber && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {t('orders.trackingNumber')}
                </Typography>
                <Typography variant="body2">
                  {order.trackingNumber}
                </Typography>
              </Box>
            )}
          </Paper>
          
          {/* تقييم الطلب */}
          {order.rating && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t('orders.yourRating')}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={order.rating.rate} readOnly precision={0.5} />
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  ({order.rating.rate}/5)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(order.rating.date)}
                </Typography>
              </Box>
              
              {order.rating.comment && (
                <Typography variant="body2">
                  "{order.rating.comment}"
                </Typography>
              )}
            </Paper>
          )}
        </Grid>
        
        {/* القسم الأيسر: ملخص الطلب والإجراءات */}
        <Grid item xs={12} md={4}>
          {/* ملخص الطلب */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t('orders.orderSummary')}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">{t('orders.subtotal')}</Typography>
                <Typography variant="body2">{formatPrice(order.subtotal)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">{t('orders.shipping')}</Typography>
                <Typography variant="body2">{formatPrice(order.shippingCost)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">{t('orders.tax')}</Typography>
                <Typography variant="body2">{formatPrice(order.taxAmount)}</Typography>
              </Box>
              
              {order.discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{t('orders.discount')}</Typography>
                  <Typography variant="body2" color="error.main">-{formatPrice(order.discount)}</Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 1.5 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight="bold">{t('orders.total')}</Typography>
                <Typography variant="subtitle1" fontWeight="bold">{formatPrice(order.totalPrice)}</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {t('orders.paymentMethod')}
              </Typography>
              <Typography variant="body2">
                {order.paymentMethod === 'cod' ? t('checkout.cashOnDelivery') : t('checkout.creditCard')}
              </Typography>
            </Box>
          </Paper>
          
          {/* إجراءات الطلب */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {t('orders.actions')}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {canCancel && (
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<CancelIcon />}
                  onClick={handleOpenCancelDialog}
                >
                  {t('orders.cancelOrder')}
                </Button>
              )}
              
              {canRate && (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<RateReviewIcon />}
                  onClick={handleOpenRatingDialog}
                >
                  {t('orders.rateOrder')}
                </Button>
              )}
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
              >
                {t('orders.backToOrders')}
              </Button>
            </Box>
          </Paper>
          
          {/* ملاحظات إضافية */}
          {order.notes && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t('orders.additionalNotes')}
              </Typography>
              <Typography variant="body2">
                {order.notes}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* حوار إلغاء الطلب */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
        aria-labelledby="cancel-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="cancel-dialog-title">
          {t('orders.cancelOrder')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText gutterBottom>
            {t('orders.confirmCancel')}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            name="reason"
            label={t('orders.cancelReason')}
            type="text"
            fullWidth
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} color="primary">
            {t('general.cancel')}
          </Button>
          <Button
            onClick={handleCancelOrder}
            color="error"
            disabled={cancelling}
          >
            {cancelling ? (
              <CircularProgress size={24} />
            ) : (
              t('orders.cancelOrder')
            )}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* حوار تقييم الطلب */}
      <RatingDialog
        open={openRatingDialog}
        onClose={handleCloseRatingDialog}
        onSubmit={handleRateOrder}
        orderNumber={order.orderNumber || `#${order._id.substring(0, 8)}`}
      />
    </Container>
  );
};

export default OrderDetailPage;