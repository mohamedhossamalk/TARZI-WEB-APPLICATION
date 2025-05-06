import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Tooltip,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  ChevronLeft as ChevronLeftIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { logout } from '../../store/actions/authActions';

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart || { items: [] });
  
  // State for dropdowns and mobile menu
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElLang, setAnchorElLang] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Check if user is admin - تصحيح طريقة التحقق
  const isAdmin = Boolean(user && (user.role === 'admin' || user.role === 'Admin' || user.role === 'ADMIN'));
  
  // DEVELOPMENT: Log user info for debugging
  useEffect(() => {
    console.log('Header - Auth state:', { isAuthenticated, user });
    console.log('User role:', user?.role);
    console.log('Is admin check:', isAdmin);
  }, [isAuthenticated, user, isAdmin]);
  
  // Handle user menu
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  
  // Handle language menu
  const handleOpenLangMenu = (event) => setAnchorElLang(event.currentTarget);
  const handleCloseLangMenu = () => setAnchorElLang(null);
  
  // Handle drawer
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
  };
  
  // Handle navigation to dashboard directly
  const goToDashboard = () => {
    navigate('/admin/dashboard');
    handleCloseUserMenu();
  };
  
  // Handle language change
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    handleCloseLangMenu();
  };
  
  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile menu icon */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label={t('common.menu')}
            sx={{ mr: 2, display: { md: 'none' } }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex' },
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            {t('app.name')}
          </Typography>
          
          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {t('nav.home')}
            </Button>
            <Button
              component={RouterLink}
              to="/products"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {t('nav.products')}
            </Button>
            
            {/* زر لوحة التحكم للمسؤول مع تصحيح الشرط */}
            {isAuthenticated && isAdmin && (
              <Button
                component={RouterLink}
                to="/admin/dashboard"
                sx={{ 
                  my: 2, 
                  color: 'white', 
                  display: 'block',
                  fontWeight: 'bold',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)'
                  },
                  mx: 1
                }}
                startIcon={<DashboardIcon />}
              >
                {t('nav.dashboard')}
              </Button>
            )}
          </Box>
          
          {/* Right side icons */}
          <Box sx={{ display: 'flex' }}>
            {/* Cart icon */}
            <Tooltip title={t('nav.cart')}>
              <IconButton component={RouterLink} to="/cart" color="inherit">
                <Badge badgeContent={items?.length || 0} color="secondary">
                  <CartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* Language selector */}
            <Tooltip title={t('nav.language')}>
              <IconButton
                color="inherit"
                onClick={handleOpenLangMenu}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElLang}
              open={Boolean(anchorElLang)}
              onClose={handleCloseLangMenu}
            >
              <MenuItem onClick={() => changeLanguage('ar')}>
                العربية
              </MenuItem>
              <MenuItem onClick={() => changeLanguage('en')}>
                English
              </MenuItem>
            </Menu>
            
            {/* User menu */}
            {isAuthenticated ? (
              <>
                <Tooltip title={t('nav.account')}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                    <Avatar sx={{ bgcolor: isAdmin ? 'secondary.main' : 'primary.main' }}>
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t('nav.profile')} />
                  </MenuItem>
                  
                  <MenuItem component={RouterLink} to="/orders" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <ProductsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t('nav.orders')} />
                  </MenuItem>
                  
                  {/* رابط لوحة التحكم للمسؤولين مع تصحيح الشرط */}
                  {isAdmin && (
                    <MenuItem 
                      onClick={goToDashboard}
                      sx={{
                        bgcolor: 'primary.light',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                          color: 'white'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={t('nav.dashboard')} 
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </MenuItem>
                  )}
                  
                  <Divider />
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t('auth.logout')} />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
              >
                {t('auth.login')}
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile drawer */}
      <Drawer
        anchor={i18n.language === 'ar' ? 'right' : 'left'}
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2
            }}
          >
            <Typography variant="h6">{t('app.name')}</Typography>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>
          
          <Divider />
          
          <List>
            <ListItem button component={RouterLink} to="/">
              <ListItemText primary={t('nav.home')} />
            </ListItem>
            
            <ListItem button component={RouterLink} to="/products">
              <ListItemText primary={t('nav.products')} />
            </ListItem>
            
            {/* لوحة التحكم في القائمة الجانبية للمسؤول مع تصحيح الشرط */}
            {isAuthenticated && isAdmin && (
              <ListItem 
                button 
                component={RouterLink} 
                to="/admin/dashboard"
                sx={{
                  bgcolor: 'primary.light',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    color: 'white'
                  }
                }}
              >
                <ListItemIcon>
                  <DashboardIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={t('nav.dashboard')} 
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
            )}
            
            {isAuthenticated ? (
              <>
                <ListItem button component={RouterLink} to="/profile">
                  <ListItemText primary={t('nav.profile')} />
                </ListItem>
                
                <ListItem button component={RouterLink} to="/orders">
                  <ListItemText primary={t('nav.orders')} />
                </ListItem>
                
                <ListItem button component={RouterLink} to="/measurements">
                  <ListItemText primary={t('nav.measurements')} />
                </ListItem>
                
                <Divider />
                
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary={t('auth.logout')} />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={RouterLink} to="/login">
                  <ListItemText primary={t('auth.login')} />
                </ListItem>
                
                <ListItem button component={RouterLink} to="/register">
                  <ListItemText primary={t('auth.register')} />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;