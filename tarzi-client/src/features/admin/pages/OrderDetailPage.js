// src/features/admin/pages/OrderDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as AddressIcon,
  AccessTime as TimeIcon,
  Edit as EditIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import adminService from '../services/adminService';
import OrderStatusEditor from '../components/orders/OrderStatusEditor';
import { formatDate, formatCurrency } from '../../../core/utils/formatters';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // جلب تفاصيل الطلب
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await adminService.getOrderById(id);
        setOrder(response.data.order);
      } catch (error) {
        setError('حدث خطأ أثناء جلب تفاصيل الطلب');
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);
  
  // تحديث حالة الطلب
  const handleUpdateStatus = async (orderId, statusData) => {
    try {
      const response = await adminService.updateOrderStatus(orderId, statusData);
      setOrder(response.data.order);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // طباعة تفاصيل الطلب
  const handlePrintOrder = () => {
    window.print();
  };
  
  // الرجوع لصفحة الطلبات
  const handleGoBack = () => {
    navigate('/admin/orders');
  };
  
  // الحصول على لون حالة الطلب
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
  
  // الحصول على نص حالة الطلب
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'قيد الانتظار',
      'processing': 'قيد المعالجة',
      'shipped': 'تم الشحن',
      'delivered': 'تم التسليم',
      'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
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
            العودة للطلبات
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!order) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">الطلب غير موجود</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            العودة للطلبات
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          تفاصيل الطلب #{order.orderNumber || id.substring(0, 8)}
        </Typography>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mr: 1 }}
          >
            العودة للطلبات
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrintOrder}
          >
            طباعة
          </Button>
        </Box>
      </Box>
      
      {/* تفاصيل العميل والطلب */}
      <Grid container spacing={3}>
        {/* تفاصيل العميل */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="معلومات العميل"
              avatar={
                <Avatar>
                  <PersonIcon />
                </Avatar>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  اسم العميل
                </Typography>
                <Typography variant="body1">{order.user?.username || 'غير معروف'}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  البريد الإلكتروني
                </Typography>
                <Typography variant="body1">{order.user?.email || 'غير متوفر'}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  رقم الهاتف
                </Typography>
                <Typography variant="body1">{order.user?.phone || 'غير متوفر'}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* تفاصيل الشحن */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="عنوان الشحن"
              avatar={
                <Avatar>
                  <AddressIcon />
                </Avatar>
              }
            />
            <Divider />
            <CardContent>
              {order.shippingAddress ? (
                <>
                  <Typography variant="body1">
                    {order.shippingAddress.street}
                  </Typography>
                  <Typography variant="body1">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </Typography>
                  <Typography variant="body1">
                    {order.shippingAddress.country}, {order.shippingAddress.postalCode}
                  </Typography>
                  {order.shippingAddress.phone && (
                    <Typography variant="body1">
                      هاتف: {order.shippingAddress.phone}
                    </Typography>
                  )}
                </>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  لا يوجد عنوان شحن
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* تفاصيل الطلب */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="معلومات الطلب"
              avatar={
                <Avatar>
                  <TimeIcon />
                </Avatar>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  تاريخ الطلب
                </Typography>
                <Typography variant="body1">{formatDate(order.createdAt)}</Typography>
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
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  طريقة الدفع
                </Typography>
                <Typography variant="body1">
                  {order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 
                   order.paymentMethod === 'card' ? 'بطاقة ائتمان' : order.paymentMethod}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* محرر حالة الطلب */}
      <Box sx={{ mt: 3 }}>
        <OrderStatusEditor order={order} onUpdateStatus={handleUpdateStatus} />
      </Box>
      
      {/* منتجات الطلب */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          منتجات الطلب
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>المنتج</TableCell>
                <TableCell>السعر</TableCell>
                <TableCell>الكمية</TableCell>
                <TableCell>الإجمالي</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {product.imageUrl && (
                        <Box
                          component="img"
                          src={product.imageUrl}
                          alt={product.name}
                          sx={{ width: 40, height: 40, objectFit: 'cover', mr: 2, borderRadius: 1 }}
                        />
                      )}
                      <Box>
                        <Typography variant="body2">{product.name}</Typography>
                        {product.fabricChoice && (
                          <Typography variant="caption" color="text.secondary">
                            القماش: {product.fabricChoice}
                          </Typography>
                        )}
                        {product.colorChoice && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            اللون: {product.colorChoice}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{formatCurrency(product.price * product.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* ملخص الطلب */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Grid container>
          <Grid item xs={12} md={6} sx={{ ml: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              ملخص الطلب
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">المجموع الفرعي:</Typography>
              <Typography variant="body1">{formatCurrency(order.subtotal)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">الشحن:</Typography>
              <Typography variant="body1">{formatCurrency(order.shippingCost)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">الضريبة:</Typography>
              <Typography variant="body1">{formatCurrency(order.taxAmount)}</Typography>
            </Box>
            
            {order.discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">الخصم:</Typography>
                <Typography variant="body1" color="error.main">
                  -{formatCurrency(order.discount)}
                </Typography>
              </Box>
            )}
            
            <Divider sx={{ my: 1.5 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">الإجمالي:</Typography>
              <Typography variant="h6" color="primary.main">{formatCurrency(order.totalPrice)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* ملاحظات الطلب */}
      {order.notes && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            ملاحظات الطلب
          </Typography>
          <Typography variant="body1">
            {order.notes}
          </Typography>
        </Paper>
      )}
      
      {/* تاريخ الطلب */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          تاريخ الطلب
        </Typography>
        
        {order.timeline && order.timeline.length > 0 ? (
          <Box
            sx={{
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 12,
                width: 2,
                bgcolor: 'divider',
              },
            }}
          >
            {order.timeline.map((event, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  mb: 2,
                  position: 'relative',
                }}
              >
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: 'primary.main',
                    mr: 2,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">
                    {event.status === 'created' ? 'تم إنشاء الطلب' :
                     event.status === 'pending' ? 'قيد الانتظار' :
                     event.status === 'processing' ? 'قيد المعالجة' :
                     event.status === 'shipped' ? 'تم الشحن' :
                     event.status === 'delivered' ? 'تم التسليم' :
                     event.status === 'cancelled' ? 'تم إلغاء الطلب' : event.status}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(event.date)} {new Date(event.date).toLocaleTimeString('ar-EG')}
                  </Typography>
                  {event.note && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {event.note}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            لا يوجد تاريخ لهذا الطلب
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default OrderDetailPage;