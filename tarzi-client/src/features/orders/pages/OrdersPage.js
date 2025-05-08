// src/features/orders/pages/OrdersPage.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Home as HomeIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  LocalShipping as ShippingIcon,
  ShoppingBag as ShoppingBagIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import orderService from '../services/orderService';

// مكون TabPanel
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await orderService.getOrders();
        setOrders(response.data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء جلب الطلبات');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // تصفية الطلبات حسب حالتها
  const getFilteredOrders = (status) => {
    if (status === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === status);
  };

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
          to="/profile"
        >
          الملف الشخصي
        </Link>
        <Typography color="text.primary">الطلبات</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ShoppingBagIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h1">
            طلباتي
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.7, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              لا توجد طلبات حالية
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              لم تقم بإجراء أي طلبات بعد
            </Typography>
            <Button
              component={RouterLink}
              to="/products"
              variant="contained"
              color="primary"
              startIcon={<ShoppingBagIcon />}
            >
              تصفح المنتجات
            </Button>
          </Box>
        ) : (
          <Box>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="جميع الطلبات" />
              <Tab label="قيد الانتظار" />
              <Tab label="قيد المعالجة" />
              <Tab label="تم الشحن" />
              <Tab label="تم التسليم" />
              <Tab label="ملغية" />
            </Tabs>
            
            <TabPanel value={tabValue} index={0}>
              {renderOrders(getFilteredOrders('all'))}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {renderOrders(getFilteredOrders('pending'))}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {renderOrders(getFilteredOrders('processing'))}
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              {renderOrders(getFilteredOrders('shipped'))}
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              {renderOrders(getFilteredOrders('delivered'))}
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              {renderOrders(getFilteredOrders('cancelled'))}
            </TabPanel>
          </Box>
        )}
      </Paper>
    </Container>
  );

  // دالة عرض الطلبات
  function renderOrders(filteredOrders) {
    if (filteredOrders.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            لا توجد طلبات في هذه الفئة
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {filteredOrders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        رقم الطلب
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        #{order.orderNumber}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        تاريخ الطلب
                      </Typography>
                      <Typography variant="body1">
                        {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        الحالة
                      </Typography>
                      <Chip
                        label={getStatusText(order.status)}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        إجمالي الطلب
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {order.totalPrice} ر.س
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    المنتجات ({order.items?.length || 0})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {order.items?.map((item, index) => (
                      <Chip
                        key={index}
                        label={`${item.name} (${item.quantity})`}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {order.shippingAddress?.city}, {order.shippingAddress?.country}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Button
                      component={RouterLink}
                      to={`/orders/${order._id}/track`}
                      startIcon={<ShippingIcon />}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      تتبع الطلب
                    </Button>
                    
                    <Button
                      component={RouterLink}
                      to={`/orders/${order._id}`}
                      startIcon={<AssignmentIcon />}
                      variant="contained"
                      size="small"
                    >
                      تفاصيل الطلب
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }
};

export default OrdersPage;