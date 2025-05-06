// src/pages/OrderHistoryPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Chip, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import OrderService from '../services/OrderService';
import { formatDate, formatPrice } from '../utils/formatters';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await OrderService.getUserOrders();
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('حدث خطأ أثناء جلب تاريخ الطلبات. يرجى المحاولة مرة أخرى.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // تعيين لون حالة الطلب
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

  // ترجمة حالة الطلب
  const translateStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'processing':
        return 'قيد المعالجة';
      case 'shipped':
        return 'تم الشحن';
      case 'delivered':
        return 'تم التوصيل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        سجل الطلبات
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : orders.length === 0 ? (
        <Box textAlign="center" my={4}>
          <Typography variant="h6">لا يوجد طلبات سابقة</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            لم تقم بإجراء أي طلبات بعد. تسوق الآن!
          </Typography>
          <Box mt={2}>
            <Link to="/products" style={{ textDecoration: 'none' }}>
              <Typography color="primary">استعرض المنتجات</Typography>
            </Link>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    طلب #{order._id.substring(order._id.length - 8)}
                  </Typography>
                  <Chip
                    label={translateStatus(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  تاريخ الطلب: {formatDate(order.createdAt)}
                </Typography>

                <Box mt={2}>
                  <Typography variant="body1" fontWeight="bold">
                    المنتجات: {order.items.length}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" mt={1}>
                    إجمالي الطلب: {formatPrice(order.totalAmount)}
                  </Typography>
                </Box>

                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Link
                    to={`/orders/${order._id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Typography color="primary">عرض التفاصيل</Typography>
                  </Link>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default OrderHistoryPage;