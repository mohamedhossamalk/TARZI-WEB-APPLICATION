// src/core/layouts/AdminLayout.js
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  Container,
  ListItemButton,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Category as CategoryIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  ExpandLess,
  ExpandMore,
  Assignment as ReportsIcon,
  Backup as BackupIcon,
  Error as ErrorLogIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

const drawerWidth = 260;

const AdminLayout = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [open, setOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState({
    reports: false,
    system: false
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  
  const handleMenuClick = (menu) => {
    setMenuOpen(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleNavigate = (path) => {
    navigate(path);
    handleProfileMenuClose();
    handleNotificationMenuClose();
  };
  
  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };
  
  // التحقق مما إذا كان الرابط نشطًا
  const isLinkActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const menuItems = [
    { text: 'لوحة التحكم', icon: <DashboardIcon />, path: '/admin' },
    { text: 'المنتجات', icon: <ProductsIcon />, path: '/admin/products' },
    { text: 'الفئات', icon: <CategoryIcon />, path: '/admin/categories' },
    { text: 'الطلبات', icon: <OrdersIcon />, path: '/admin/orders' },
    { text: 'المستخدمين', icon: <UsersIcon />, path: '/admin/users' },
    { text: 'الإعدادات', icon: <SettingsIcon />, path: '/admin/settings' }
  ];
  
  return (
    <Box sx={{ display: 'flex', direction: 'rtl' }}>
      <AppBar
        position="fixed"
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
          mr: open ? `${drawerWidth}px` : 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="فتح القائمة"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            لوحة إدارة تارزي
          </Typography>
          
          {/* أيقونة الإشعارات */}
          <Tooltip title="الإشعارات">
            <IconButton
              color="inherit"
              onClick={handleNotificationMenuOpen}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* أيقونة الملف الشخصي */}
          <Tooltip title="الملف الشخصي">
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ p: 0 }}
            >
              <Avatar
                alt={user?.username}
                src={user?.imageUrl}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Tooltip>
          
          {/* قائمة الملف الشخصي */}
          <Menu
            anchorEl={anchorEl}
            id="profile-menu"
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => handleNavigate('/profile')}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="الملف الشخصي" />
            </MenuItem>
            <MenuItem onClick={() => handleNavigate('/')}>
              <ListItemIcon>
                <ChevronRightIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="العودة للموقع" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="تسجيل الخروج" />
            </MenuItem>
          </Menu>
          
          {/* قائمة الإشعارات */}
          <Menu
            anchorEl={notificationAnchorEl}
            id="notification-menu"
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            PaperProps={{
              style: {
                width: 320,
                maxHeight: 400,
              },
            }}
          >
            <MenuItem
              onClick={() => handleNavigate('/admin/notifications')}
              sx={{ justifyContent: 'center' }}
            >
              <Typography variant="subtitle2" color="primary">
                عرض جميع الإشعارات
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* القائمة الجانبية */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', padding: theme.spacing(2) }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}>
            لوحة التحكم
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => handleNavigate(item.path)}
              selected={isLinkActive(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'common.white',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'common.white',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isLinkActive(item.path) ? 'common.white' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
          
          {/* قائمة التقارير */}
          <ListItemButton onClick={() => handleMenuClick('reports')}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ReportsIcon />
            </ListItemIcon>
            <ListItemText primary="التقارير" />
            {menuOpen.reports ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          
          <Collapse in={menuOpen.reports} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pr: 4 }}
                onClick={() => handleNavigate('/admin/reports/sales')}
                selected={isLinkActive('/admin/reports/sales')}
              >
                <ListItemText primary="تقارير المبيعات" />
              </ListItemButton>
              
              <ListItemButton
                sx={{ pr: 4 }}
                onClick={() => handleNavigate('/admin/reports/products')}
                selected={isLinkActive('/admin/reports/products')}
              >
                <ListItemText primary="تقارير المنتجات" />
              </ListItemButton>
              
              <ListItemButton
                sx={{ pr: 4 }}
                onClick={() => handleNavigate('/admin/reports/users')}
                selected={isLinkActive('/admin/reports/users')}
              >
                <ListItemText primary="تقارير المستخدمين" />
              </ListItemButton>
            </List>
          </Collapse>
          
          {/* قائمة النظام */}
          <ListItemButton onClick={() => handleMenuClick('system')}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="النظام" />
            {menuOpen.system ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          
          <Collapse in={menuOpen.system} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pr: 4 }}
                onClick={() => handleNavigate('/admin/backups')}
                selected={isLinkActive('/admin/backups')}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <BackupIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="النسخ الاحتياطية" />
              </ListItemButton>
              
              <ListItemButton
                sx={{ pr: 4 }}
                onClick={() => handleNavigate('/admin/logs')}
                selected={isLinkActive('/admin/logs')}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ErrorLogIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="السجلات" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>
      
      {/* المحتوى الرئيسي */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginRight: `-${drawerWidth}px`,
          ...(open && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: 0,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;