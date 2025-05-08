// src/features/orders/components/OrderDetail.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Paper
} from '@mui/material';
import {
  Payment as PaymentIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';

const OrderDetail = ({ order }) => {
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

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'تم التسليم';
      case 'shipped':
        return 'تم الشحن';
      case 'processing':
        return 'قيد المعالجة';
      case 'pending':
        return 'قيد الانتظار';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* تفاصيل الطلب الأساسية */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              معلومات الطلب
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                رقم الطلب
              </Typography>
              <Typography variant="body1">
                #{order.orderNumber}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                تاريخ الطلب
              </Typography>
              <Typography variant="body1">
                {new Date(order.createdAt).toLocaleDateString('ar-EG')}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                حالة الطلب
              </Typography>
              <Chip
                label={getStatusText(order.status)}
                color={getStatusColor(order.status)}
                size="small"
              />
            </Box>

            {order.estimatedDeliveryDate && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  تاريخ التسليم المتوقع
                </Typography>
                <Typography variant="body1">
                  {new Date(order.estimatedDeliveryDate).toLocaleDateString('ar-EG')}
                </Typography>
              </Box>
            )}
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                طريقة الدفع
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PaymentIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body1">
                  {order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 
                   order.paymentMethod === 'card' ? 'بطاقة ائتمان' : order.paymentMethod}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* عنوان الشحن */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              عنوان التوصيل
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {order.shippingAddress ? (
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {order.shippingAddress.name}
                </Typography>
                <Typography variant="body1">
                  {order.shippingAddress.street}
                </Typography>
                <Typography variant="body1">
                  {order.shippingAddress.city}، {order.shippingAddress.state}
                </Typography>
                <Typography variant="body1">
                  {order.shippingAddress.country}، {order.shippingAddress.postalCode}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  رقم الهاتف: {order.shippingAddress.phoneNumber}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                لا يوجد عنوان شحن متاح
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* ملخص السعر */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              ملخص الطلب
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">المجموع الفرعي:</Typography>
              <Typography variant="body1">{order.subtotal} ر.س</Typography>
            </Box>
            
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">الشحن:</Typography>
              <Typography variant="body1">{order.shippingCost} ر.س</Typography>
            </Box>
            
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">الضريبة:</Typography>
              <Typography variant="body1">{order.taxAmount} ر.س</Typography>
            </Box>
            
            {order.discount > 0 && (
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" color="error.main">الخصم:</Typography>
                <Typography variant="body1" color="error.main">-{order.discount} ر.س</Typography>
              </Box>
            )}
            
            <Divider sx={{ my: 1.5 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">الإجمالي:</Typography>
              <Typography variant="h6" color="primary.main" fontWeight="bold">{order.totalPrice} ر.س</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* المنتجات */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              المنتجات
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {order.items.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card variant="outlined">
                    {item.image && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={item.image}
                        alt={item.name}
                      />
                    )}
                    <CardContent>
                      <Typography variant="subtitle1" component={RouterLink} to={`/products/${item.productId}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                        {item.name}
                      </Typography>
                      
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          الكمية: {item.quantity}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                          السعر: {item.price} ر.س
                        </Typography>
                        
                        <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
                          الإجمالي: {item.price * item.quantity} ر.س
                        </Typography>
                      </Box>
                      
                      {item.fabricChoice && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            القماش: {item.fabricChoice}
                          </Typography>
                        </Box>
                      )}
                      
                      {item.colorChoice && (
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            اللون: {item.colorChoice}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetail;