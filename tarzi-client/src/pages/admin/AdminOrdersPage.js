import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography
} from '@mui/material';
import OrderManagement from '../../components/admin/OrderManagement';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminOrdersPage = () => {
  const { t } = useTranslation();
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            {t('admin.orders')}
          </Typography>
          
          <OrderManagement />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminOrdersPage;