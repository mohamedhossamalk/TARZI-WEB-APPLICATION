// src/features/admin/components/dashboard/DashboardStats.js
import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import {
  ShoppingCart as OrderIcon,
  People as UserIcon,
  Inventory as ProductIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const StatCard = ({ icon, title, value, color }) => {
  return (
    <Paper 
      sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        height: '100%', 
        position: 'relative', 
        overflow: 'hidden' 
      }}
    >
      <Box sx={{ 
        bgcolor: `${color}.light`, 
        p: 2, 
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mr: 2
      }}>
        {React.cloneElement(icon, { sx: { color: `${color}.main`, fontSize: 32 } })}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 0.5 }}>
          {value}
        </Typography>
      </Box>
      {React.cloneElement(icon, { 
        sx: { 
          position: 'absolute', 
          bottom: -10, 
          right: -10, 
          fontSize: 100, 
          color: `${color}.light`, 
          opacity: 0.2,
          transform: 'rotate(-15deg)'
        } 
      })}
    </Paper>
  );
};

const DashboardStats = ({ stats }) => {
  if (!stats) return null;

  const { totalSales, totalOrders, totalUsers, totalProducts } = stats;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard 
          icon={<MoneyIcon />}
          title="إجمالي المبيعات"
          value={`${totalSales} ج.م`}
          color="primary"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard 
          icon={<OrderIcon />}
          title="إجمالي الطلبات"
          value={totalOrders}
          color="secondary"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard 
          icon={<ProductIcon />}
          title="إجمالي المنتجات"
          value={totalProducts}
          color="success"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard 
          icon={<UserIcon />}
          title="إجمالي المستخدمين"
          value={totalUsers}
          color="warning"
        />
      </Grid>
    </Grid>
  );
};

export default DashboardStats;