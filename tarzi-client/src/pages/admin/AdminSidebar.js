import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingBag as OrdersIcon,
  Inventory as ProductsIcon,
  People as UsersIcon,
  Category as CategoriesIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const AdminSidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const menuItems = [
    {
      text: t('admin.dashboard'),
      icon: <DashboardIcon />,
      path: '/admin/dashboard'
    },
    {
      text: t('admin.products'),
      icon: <ProductsIcon />,
      path: '/admin/products'
    },
    {
      text: t('admin.orders'),
      icon: <OrdersIcon />,
      path: '/admin/orders'
    },
    {
      text: t('admin.users'),
      icon: <UsersIcon />,
      path: '/admin/users'
    },
    {
      text: t('admin.categories'),
      icon: <CategoriesIcon />,
      path: '/admin/categories'
    },
    {
      text: t('admin.settings'),
      icon: <SettingsIcon />,
      path: '/admin/settings'
    }
  ];
  
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        },
        display: { xs: 'none', sm: 'block' }
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {t('app.name')} - {t('admin.panel')}
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main'
                },
                '&:hover': {
                  backgroundColor: 'primary.light'
                }
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminSidebar;