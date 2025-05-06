// src/components/common/Header.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  ShoppingCart,
  Person,
  Logout,
  Login,
  Dashboard,
} from '@mui/icons-material';
import AuthService from '../../services/AuthService';
import logo from '../../assets/logo.png'; // يجب إضافة شعار للتطبيق

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = () => {
    AuthService.logout();
    // تحديث حالة المستخدم في Redux (يفترض وجود إجراء logout في متجر Redux)
    // dispatch(logout());
    handleCloseUserMenu();
    navigate('/login');
  };
  
  const cartItemsCount = cartItems?.length || 0;
  
  const mainMenuItems = [
    { text: 'الرئيسية', path: '/' },
    { text: 'المنتجات', path: '/products' },
    // يمكن إضافة المزيد من عناصر القائمة هنا
  ];
  
  const renderMobileDrawer = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleToggleMobileMenu}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={handleToggleMobileMenu}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <RouterLink to="/" style={{ textDecoration: 'none' }}>
            <img src={logo} alt="تَرزي" style={{ height: '50px' }} />
          </RouterLink>
        </Box>
        <Divider />
        <List>
          {mainMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={RouterLink} to={item.path}>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {userInfo ? (
            <>
              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/profile">
                  <Person sx={{ mr: 1 }} /> <ListItemText primary="الملف الشخصي" />
                </ListItemButton>
              </ListItem>
              {userInfo.role === 'admin' && (
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/admin/dashboard">
                    <Dashboard sx={{ mr: 1 }} /> <ListItemText primary="لوحة التحكم" />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> <ListItemText primary="تسجيل خروج" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/login">
                  <Login sx={{ mr: 1 }} /> <ListItemText primary="تسجيل دخول" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/register">
                  <Person sx={{ mr: 1 }} /> <ListItemText primary="إنشاء حساب" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
  
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: '#fff' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* شعار للشاشات الكبيرة */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <RouterLink to="/">
              <img src={logo} alt="تَرزي" style={{ height: '50px' }} />
            </RouterLink>
          </Box>
          
          {/* عنوان للشاشات الكبيرة */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            تَرزي
          </Typography>
          
          {/* قائمة للشاشات الكبيرة */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {mainMenuItems.map((item) => (
              <Button
                key={item.text}
                component={RouterLink}
                to={item.path}
                sx={{ my: 2, color: 'text.primary', display: 'block' }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
          
          {/* شعار للشاشات الصغيرة */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
            <RouterLink to="/">
              <img src={logo} alt="تَرزي" style={{ height: '40px' }} />
            </RouterLink>
          </Box>
          
          {/* عنوان للشاشات الصغيرة */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            تَرزي
          </Typography>
          
          {/* سلة التسوق وحساب المستخدم */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton component={RouterLink} to="/cart" color="inherit" sx={{ ml: 1 }}>
              <Badge badgeContent={cartItemsCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
            
            {userInfo ? (
              <>
                <IconButton onClick={handleOpenUserMenu} sx={{ ml: 1 }}>
                  <Avatar
                    alt={userInfo.name}
                    src={userInfo.avatar}
                    sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                  >
                    {userInfo.name?.charAt(0)}
                  </Avatar>
                </IconButton>
                
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <Person sx={{ mr: 1 }} /> الملف الشخصي
                  </MenuItem>
                  
                  {userInfo.role === 'admin' && (
                    <MenuItem component={RouterLink} to="/admin/dashboard" onClick={handleCloseUserMenu}>
                      <Dashboard sx={{ mr: 1 }} /> لوحة التحكم
                    </MenuItem>
                  )}
                  
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} /> تسجيل خروج
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  تسجيل دخول
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                >
                  إنشاء حساب
                </Button>
              </Box>
            )}
            
            {/* زر القائمة للشاشات الصغيرة */}
            {isMobile && (
              <IconButton
                size="large"
                edge="end"
                aria-label="menu"
                onClick={handleToggleMobileMenu}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* قائمة الشاشات الصغيرة */}
      {renderMobileDrawer}
    </AppBar>
  );
};

export default Header;