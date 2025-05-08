// src/core/layouts/components/Header.js
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Badge,
  InputBase,
  alpha,
  styled,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle,
  Notifications,
  ShoppingCart,
  Logout,
  Settings,
  Dashboard,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useNotifications } from '../../hooks/useNotifications';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItems } = useCart();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };

  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);
  const isUserMenuOpen = Boolean(userMenuAnchorEl);

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const userMenuId = 'primary-account-menu';

  return (
    <AppBar position="sticky">
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        {/* شعار للجوال */}
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
          تارزي
        </Typography>

        {/* قائمة الجوال */}
        <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="القائمة الرئيسية"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id={mobileMenuId}
            anchorEl={mobileMenuAnchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
          >
            <MenuItem component={RouterLink} to="/" onClick={handleMobileMenuClose}>
              الرئيسية
            </MenuItem>
            <MenuItem component={RouterLink} to="/products" onClick={handleMobileMenuClose}>
              المنتجات
            </MenuItem>
            <MenuItem component={RouterLink} to="/services" onClick={handleMobileMenuClose}>
              الخدمات المهنية
            </MenuItem>
            {isAuthenticated ? (
              <>
                <MenuItem component={RouterLink} to="/orders" onClick={handleMobileMenuClose}>
                  طلباتي
                </MenuItem>
                <MenuItem component={RouterLink} to="/measurements" onClick={handleMobileMenuClose}>
                  مقاساتي
                </MenuItem>
                <MenuItem component={RouterLink} to="/cart" onClick={handleMobileMenuClose}>
                  سلة التسوق
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem component={RouterLink} to="/login" onClick={handleMobileMenuClose}>
                  تسجيل الدخول
                </MenuItem>
                <MenuItem component={RouterLink} to="/register" onClick={handleMobileMenuClose}>
                  إنشاء حساب
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>

        {/* شعار للموبايل */}
        <Typography
          variant="h6"
          noWrap
          component={RouterLink}
          to="/"
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          تارزي
        </Typography>

        {/* روابط القائمة */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button
            component={RouterLink}
            to="/"
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            الرئيسية
          </Button>
          <Button
            component={RouterLink}
            to="/products"
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            المنتجات
          </Button>
          <Button
            component={RouterLink}
            to="/services"
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            الخدمات المهنية
          </Button>
          {isAuthenticated && (
            <Button
              component={RouterLink}
              to="/orders"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              طلباتي
            </Button>
          )}
          {isAuthenticated && (
            <Button
              component={RouterLink}
              to="/measurements"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              مقاساتي
            </Button>
          )}
        </Box>

        {/* البحث */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <form onSubmit={handleSearch}>
            <StyledInputBase
              placeholder="بحث..."
              inputProps={{ 'aria-label': 'بحث' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </Search>

        {/* أيقونات وقائمة المستخدم */}
        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              {/* سلة التسوق */}
              <IconButton
                component={RouterLink}
                to="/cart"
                size="large"
                aria-label="سلة التسوق"
                color="inherit"
                sx={{ mx: 1 }}
              >
                <StyledBadge badgeContent={cartItems.length} color="error">
                  <ShoppingCart />
                </StyledBadge>
              </IconButton>

              {/* الإشعارات */}
              <IconButton
                component={RouterLink}
                to="/notifications"
                size="large"
                aria-label="الإشعارات"
                color="inherit"
                sx={{ mx: 1 }}
              >
                <StyledBadge badgeContent={unreadCount} color="error">
                  <Notifications />
                </StyledBadge>
              </IconButton>

              {/* قائمة المستخدم */}
              <Tooltip title="الإعدادات">
                <IconButton
                  onClick={handleUserMenuOpen}
                  size="large"
                  edge="end"
                  aria-label="قائمة المستخدم"
                  aria-controls={userMenuId}
                  aria-haspopup="true"
                  color="inherit"
                  sx={{ mx: 1 }}
                >
                  {user?.imageUrl ? (
                    <Avatar alt={user.username} src={user.imageUrl} />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                id={userMenuId}
                anchorEl={userMenuAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={isUserMenuOpen}
                onClose={handleUserMenuClose}
              >
                <MenuItem component={RouterLink} to="/profile" onClick={handleUserMenuClose}>
                  <AccountCircle sx={{ mr: 2 }} />
                  الملف الشخصي
                </MenuItem>
                
                {isAdmin && (
                  <MenuItem component={RouterLink} to="/admin" onClick={handleUserMenuClose}>
                    <Dashboard sx={{ mr: 2 }} />
                    لوحة التحكم
                  </MenuItem>
                )}
                
                <Divider />
                
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 2 }} />
                  تسجيل الخروج
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
                sx={{ ml: 1 }}
              >
                تسجيل الدخول
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="secondary"
              >
                إنشاء حساب
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
);
};

export default Header;