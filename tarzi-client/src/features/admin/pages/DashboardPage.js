// src/features/admin/pages/DashboardPage.js
import React from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  ShoppingCart,
  People,
  Inventory,
  AttachMoney,
} from '@mui/icons-material';
import adminService from '../services/adminService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// مكون بطاقة إحصائيات
const StatCard = ({ title, value, icon, color, loading, error }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item>
            <Avatar
              sx={{
                bgcolor: `${color}.main`,
                width: 56,
                height: 56,
              }}
            >
              {icon}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width="80%" height={40} />
            ) : error ? (
              <Typography variant="h6" color="error">
                خطأ
              </Typography>
            ) : (
              <Typography variant="h4">{value}</Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery('dashboardStats', adminService.getDashboardStats);

  // بيانات مخطط المبيعات (بيانات وهمية في حالة عدم وجود بيانات)
  const salesData = stats?.stats?.sales?.byCategory || [
    { name: 'قمصان', value: 4000 },
    { name: 'بناطيل', value: 3000 },
    { name: 'بدل', value: 2000 },
    { name: 'أحذية', value: 2780 },
    { name: 'اكسسوارات', value: 1890 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        لوحة التحكم
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          حدث خطأ في تحميل بيانات لوحة التحكم. يرجى المحاولة مرة أخرى.
        </Alert>
      )}
      
      {/* بطاقات الإحصائيات */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي الطلبات"
            value={stats?.stats?.orders?.total || 0}
            icon={<ShoppingCart />}
            color="primary"
            loading={isLoading}
            error={error}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="المستخدمين"
            value={stats?.stats?.users || 0}
            icon={<People />}
            color="secondary"
            loading={isLoading}
            error={error}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="المنتجات"
            value={stats?.stats?.products?.total || 0}
            icon={<Inventory />}
            color="info"
            loading={isLoading}
            error={error}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي المبيعات"
            value={`${stats?.stats?.sales?.total || 0} ج.م`}
            icon={<AttachMoney />}
            color="success"
            loading={isLoading}
            error={error}
          />
        </Grid>
      </Grid>
      
      {/* مخططات وإحصائيات إضافية */}
      <Grid container spacing={3}>
        {/* مخطط المبيعات حسب الفئة */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 300,
            }}
          >
            <Typography variant="h6" gutterBottom>
              المبيعات حسب الفئة
            </Typography>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Skeleton variant="rectangular" width="100%" height="80%" />
              </Box>
            ) : error ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="body1" color="error">
                  حدث خطأ في تحميل البيانات
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={salesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" name="المبيعات" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        
        {/* آخر الطلبات */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 300,
              overflow: 'auto',
            }}
          >
            <Typography variant="h6" gutterBottom>
              آخر الطلبات
            </Typography>
            {isLoading ? (
              Array.from(new Array(5)).map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton variant="rectangular" height={50} />
                </Box>
              ))
            ) : error ? (
              <Typography variant="body1" color="error">
                حدث خطأ في تحميل البيانات
              </Typography>
            ) : (
              <List disablePadding>
                {stats?.stats?.recentOrders?.length > 0 ? (
                  stats.stats.recentOrders.map((order) => (
                    <React.Fragment key={order._id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar src={order.product?.imageUrl}>
                            <ShoppingCart />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={order.orderNumber || `طلب #${order._id.substring(0, 8)}`}
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {order.user?.username || 'مستخدم'}
                              </Typography>
                              {` - ${order.product?.name || 'منتج'} - ${order.totalPrice} ج.م`}
                              <Box sx={{ mt: 0.5 }}>
                                <Typography
                                  variant="caption"
                                  color={
                                    order.status === 'pending'
                                      ? 'warning.main'
                                      : order.status === 'completed'
                                      ? 'success.main'
                                      : order.status === 'cancelled'
                                      ? 'error.main'
                                      : 'info.main'
                                  }
                                >
                                  {order.status === 'pending'
                                    ? 'قيد الانتظار'
                                    : order.status === 'completed'
                                    ? 'مكتمل'
                                    : order.status === 'cancelled'
                                    ? 'ملغي'
                                    : order.status === 'shipped'
                                    ? 'تم الشحن'
                                    : order.status}
                                </Typography>
                              </Box>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))
                ) : (
                  <Typography variant="body1" align="center" sx={{ p: 2 }}>
                    لا توجد طلبات حديثة
                  </Typography>
                )}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;