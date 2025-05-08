// src/features/admin/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  ShoppingCart as OrderIcon,
  People as UserIcon,
  Inventory as ProductIcon 
} from '@mui/icons-material';
import adminService from '../services/adminService';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentOrders from '../components/dashboard/RecentOrders';
import SalesChart from '../components/dashboard/SalesChart';
import TopProducts from '../components/dashboard/TopProducts';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل بيانات لوحة التحكم');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        لوحة التحكم
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <DashboardStats stats={stats} />
      </Box>
      
      <Grid container spacing={4}>
        {/* Sales Chart - 8/12 width */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              المبيعات خلال الأسبوع الماضي
            </Typography>
            <SalesChart data={stats?.salesData || []} />
          </Paper>
        </Grid>
        
        {/* Top Products - 4/12 width */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              أفضل المنتجات مبيعاً
            </Typography>
            <TopProducts products={stats?.topProducts || []} />
          </Paper>
        </Grid>
        
        {/* Recent Orders - Full width */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              أحدث الطلبات
            </Typography>
            <RecentOrders orders={stats?.recentOrders || []} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;