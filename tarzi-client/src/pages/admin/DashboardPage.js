// src/pages/admin/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Paper, Typography, Box, Card, CardContent, CircularProgress, Alert, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AdminSidebar from '../../components/admin/AdminSidebar';
import API from '../../services/api'; // استيراد API مباشرة
import { getDashboardStats } from '../../store/actions/adminActions';
import {
  ShoppingBasket as OrderIcon,
  AttachMoney as RevenueIcon,
  Inventory as ProductIcon,
  People as UserIcon,
  LocalShipping as ShippingIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const DashboardPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector(state => state.admin);
  
  // إضافة حالة محلية للإحصائيات وحالة التحميل
  const [localStats, setLocalStats] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  // استدعاء API مباشرة للحصول على الإحصائيات
  const fetchStatsDirectly = async () => {
    setLocalLoading(true);
    setLocalError(null);
    
    try {
      // محاولة استدعاء عدة مسارات محتملة للحصول على الإحصائيات
      let response;
      try {
        response = await API.get('/admin/dashboard');
      } catch (err) {
        console.log('محاولة مسار بديل للإحصائيات...');
        try {
          response = await API.get('/admin/stats');
        } catch (err2) {
          console.log('محاولة مسار آخر بديل...');
          response = await API.get('/stats');
        }
      }
      
      console.log('تم الحصول على الإحصائيات بنجاح:', response.data);
      setLocalStats(response.data);
    } catch (error) {
      console.error('خطأ في الحصول على الإحصائيات:', error);
      setLocalError('فشل في الحصول على إحصائيات لوحة التحكم. يرجى المحاولة مرة أخرى.');
      
      // في حالة الخطأ، نستخدم بيانات افتراضية للعرض
      setLocalStats({
        totalOrders: 127,
        totalRevenue: 25600,
        totalProducts: 43,
        totalUsers: 92,
        pendingOrders: 18,
        recentOrders: [
          { id: 'ord123', customer: 'أحمد محمد', amount: 450, status: 'pending', date: '2025-05-05' },
          { id: 'ord122', customer: 'محمد علي', amount: 780, status: 'processing', date: '2025-05-04' },
          { id: 'ord121', customer: 'سارة أحمد', amount: 320, status: 'delivered', date: '2025-05-03' }
        ]
      });
    } finally {
      setLocalLoading(false);
    }
  };
  
  // استدعاء الإحصائيات عند تحميل المكون
  useEffect(() => {
    // خيار 1: استخدام Redux (كما كان)
    // dispatch(getDashboardStats());
    
    // خيار 2: استدعاء مباشر للـ API (أكثر موثوقية للتطوير)
    fetchStatsDirectly();
  }, []);
  
  // التأكد من أن الإحصائيات موجودة وإنشاء كائن فارغ إذا لم تكن موجودة
  // نستخدم الإحصائيات المحلية إذا كانت متاحة، وإلا نستخدم إحصائيات Redux
  const safeStats = localStats || stats || { 
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    recentOrders: []
  };
  
  // دالة آمنة لتنسيق الأرقام
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString();
  };
  
  // تحديث الإحصائيات يدويًا
  const handleRefresh = () => {
    fetchStatsDirectly();
  };
  
  const isLoading = localLoading || loading;
  const displayError = localError || error;
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">
            {t('admin.dashboard')}
          </Typography>
          
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {t('common.refresh')}
          </Button>
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : displayError ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {displayError}
          </Alert>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* إجمالي الطلبات */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="overline">{t('admin.totalOrders')}</Typography>
                      <Typography variant="h4">{formatNumber(safeStats.totalOrders)}</Typography>
                    </Box>
                    <OrderIcon fontSize="large" />
                  </CardContent>
                </Card>
              </Grid>
              
              {/* الإيرادات */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="overline">{t('admin.revenue')}</Typography>
                      <Typography variant="h4">
                        {formatNumber(safeStats.totalRevenue)} {t('common.currency')}
                      </Typography>
                    </Box>
                    <RevenueIcon fontSize="large" />
                  </CardContent>
                </Card>
              </Grid>
              
              {/* عدد المنتجات */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="overline">{t('admin.products')}</Typography>
                      <Typography variant="h4">{formatNumber(safeStats.totalProducts)}</Typography>
                    </Box>
                    <ProductIcon fontSize="large" />
                  </CardContent>
                </Card>
              </Grid>
              
              {/* عدد المستخدمين */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="overline">{t('admin.users')}</Typography>
                      <Typography variant="h4">{formatNumber(safeStats.totalUsers)}</Typography>
                    </Box>
                    <UserIcon fontSize="large" />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* الطلبات الأخيرة */}
            {safeStats.recentOrders && safeStats.recentOrders.length > 0 && (
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {t('admin.recentOrders')}
                </Typography>
                
                <Grid container spacing={2}>
                  {safeStats.recentOrders.map((order, index) => (
                    <Grid item xs={12} sm={6} md={4} key={order.id || index}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          borderLeft: 4, 
                          borderColor: 
                            order.status === 'pending' ? 'warning.main' : 
                            order.status === 'delivered' ? 'success.main' : 
                            'primary.main' 
                        }}
                      >
                        <Typography variant="subtitle1">
                          {order.customer}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.date} - {formatNumber(order.amount)} {t('common.currency')}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{
                            display: 'inline-block',
                            bgcolor: 
                              order.status === 'pending' ? 'warning.light' : 
                              order.status === 'delivered' ? 'success.light' : 
                              'primary.light',
                            color: 
                              order.status === 'pending' ? 'warning.dark' : 
                              order.status === 'delivered' ? 'success.dark' : 
                              'primary.dark',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            mt: 1
                          }}
                        >
                          {t(`order.${order.status}`) || order.status}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;