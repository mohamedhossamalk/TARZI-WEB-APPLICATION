import React, { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Button,
  TextField,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { getOrderDetails, updateOrderStatus } from '../../store/actions/orderActions';
import { getStatusColor } from '../../utils/helpers';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminOrderDetailsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector(state => state.orders);
  
  // Fetch order details
  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);
  
  // Handle status change
  const handleStatusChange = (e) => {
    dispatch(updateOrderStatus(id, e.target.value));
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Available statuses
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 3 }}
          >
            <Link component={RouterLink} to="/admin/dashboard" color="inherit">
              {t('admin.dashboard')}
            </Link>
            <Link component={RouterLink} to="/admin/orders" color="inherit">
              {t('admin.orders')}
            </Link>
            <Typography color="text.primary">
              {order?.orderNumber || id}
            </Typography>
          </Breadcrumbs>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              {t('order.orderDetails')}
            </Typography>
            
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              component={RouterLink}
              to="/admin/orders"
            >
              {t('common.back')}
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          ) : !order ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              {t('order.notFound')}
            </Alert>
          ) : (
            <>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                      {t('order.orderNumber')}: {order.orderNumber}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>{t('order.customer')}:</strong> {order.user?.username || t('admin.deletedUser')}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>{t('order.date')}:</strong> {formatDate(order.createdAt)}
                    </Typography>
                    
                    {order.updatedAt !== order.createdAt && (
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>{t('order.lastUpdated')}:</strong> {formatDate(order.updatedAt)}
                      </Typography>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        <strong>{t('order.status')}:</strong>
                      </Typography>
                      
                      <TextField
                        select
                        value={order.status}
                        onChange={handleStatusChange}
                        sx={{ minWidth: 200 }}
                        SelectProps={{
                          renderValue: (value) => (
                            <Chip
                              label={t(`order.${value}`)}
                              color={getStatusColor(value)}
                            />
                          )
                        }}
                      >
                        {statuses.map((status) => (
                          <MenuItem 
                            key={status} 
                            value={status}
                            disabled={order.status === 'cancelled' && status !== 'cancelled'}
                          >
                            {t(`order.${status}`)}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
                    <Typography variant="h6" gutterBottom>
                      {t('order.items')}
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    {order.orderItems.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 2,
                          pb: 2,
                          borderBottom: index < order.orderItems.length - 1 ? '1px solid #eee' : 'none'
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={2} sm={1}>
                            <Box
                              component="img"
                              sx={{
                                width: '100%',
                                aspectRatio: '1/1',
                                objectFit: 'cover'
                              }}
                              src={item.imageUrl || 'https://placehold.co/100x100?text=Tarzi'}
                              alt={item.name}
                            />
                          </Grid>
                          
                          <Grid item xs={10} sm={11}>
                            <Grid container>
                              <Grid item xs={12} sm={8}>
                                <Typography variant="subtitle1">
                                  {item.name || t('product.unknownProduct')}
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary">
                                  {t('product.fabric')}: {item.fabricChoice}, {t('product.color')}: {item.colorChoice}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={6} sm={2}>
                                <Typography variant="body2" color="text.secondary">
                                  {t('product.quantity')}: {item.quantity}
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary">
                                  {item.price?.toLocaleString()} {t('common.currency')}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={6} sm={2} sx={{ textAlign: { sm: 'right' } }}>
                                <Typography variant="subtitle2">
                                  {(item.price * item.quantity).toLocaleString()} {t('common.currency')}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                    
                    {order.additionalRequests && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="h6" gutterBottom>
                          {t('order.additionalRequests')}:
                        </Typography>
                        
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                          <Typography variant="body2">
                            {order.additionalRequests}
                          </Typography>
                        </Paper>
                      </>
                    )}
                    
                    {order.notes && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="h6" gutterBottom>
                          {t('order.adminNotes')}:
                        </Typography>
                        
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                          <Typography variant="body2">
                            {order.notes}
                          </Typography>
                        </Paper>
                      </>
                    )}
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {t('cart.summary')}
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">
                          {t('cart.subtotal')}:
                        </Typography>
                        <Typography variant="body1">
                          {order.itemsPrice?.toLocaleString()} {t('common.currency')}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">
                          {t('cart.shipping')}:
                        </Typography>
                        <Typography variant="body1">
                          {order.shippingPrice?.toLocaleString()} {t('common.currency')}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">
                          {t('cart.tax')}:
                        </Typography>
                        <Typography variant="body1">
                          {order.taxPrice?.toLocaleString()} {t('common.currency')}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">
                        {t('cart.total')}:
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {order.totalPrice?.toLocaleString()} {t('common.currency')}
                      </Typography>
                    </Box>
                  </Paper>
                  
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {t('order.customer')}
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    {order.user ? (
                      <>
                        <Typography variant="body1">
                          <strong>{t('auth.username')}:</strong> {order.user.username}
                        </Typography>
                        <Typography variant="body1">
                          <strong>{t('auth.email')}:</strong> {order.user.email}
                        </Typography>
                        {order.user.phone && (
                          <Typography variant="body1">
                            <strong>{t('auth.phone')}:</strong> {order.user.phone}
                          </Typography>
                        )}
                      </>
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        {t('admin.deletedUser')}
                      </Typography>
                    )}
                  </Paper>
                  
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {t('order.shippingAddress')}
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="body1">
                      {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {order.shippingAddress?.country}
                    </Typography>
                  </Paper>
                  
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {t('checkout.paymentMethod')}
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="body1">
                      {order.paymentMethod === 'cashOnDelivery'
                        ? t('checkout.cashOnDelivery')
                        : t('checkout.creditCard')
                      }
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminOrderDetailsPage;