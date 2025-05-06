import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography
} from '@mui/material';
import UserManagement from '../../components/admin/UserManagement';
import AdminSidebar from '../../components/admin/AdminSidebar';

const UsersPage = () => {
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
            {t('admin.users')}
          </Typography>
          
          <UserManagement />
        </Container>
      </Box>
    </Box>
  );
};

export default UsersPage;