// src/features/profile/pages/ProfilePage.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Badge,
  Chip,
  Link,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  ShoppingBag as OrdersIcon,
  Star as FavoriteIcon,
  VpnKey as PasswordIcon,
  Home as AddressIcon,
  StraightenOutlined as MeasurementIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  PhotoCamera as CameraIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../core/hooks/useAuth';
import { formatDate } from '../../../core/utils/formatters';
import ProfileForm from '../components/ProfileForm';
import PasswordChangeForm from '../components/PasswordChangeForm';
import AddressForm from '../components/AddressForm';

// مكون للعناصر في لوحة المعلومات
const InfoCard = ({ title, value, icon }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{icon}</Avatar>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="body1">{value}</Typography>
      </CardContent>
    </Card>
  );
};

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, updateProfile, changePassword, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  // تغيير التبويب النشط
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // فتح نموذج تعديل الملف الشخصي
  const handleOpenEditProfile = () => {
    setOpenEditProfile(true);
  };
  
  // إغلاق نموذج تعديل الملف الشخصي
  const handleCloseEditProfile = () => {
    setOpenEditProfile(false);
  };
  
  // فتح نموذج تغيير كلمة المرور
  const handleOpenChangePassword = () => {
    setOpenChangePassword(true);
  };
  
  // إغلاق نموذج تغيير كلمة المرور
  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
  };
  
  // فتح نموذج إضافة/تعديل العنوان
  const handleOpenAddressForm = (address = null) => {
    setSelectedAddress(address);
    setOpenAddressForm(true);
  };
  
  // إغلاق نموذج العنوان
  const handleCloseAddressForm = () => {
    setOpenAddressForm(false);
    setSelectedAddress(null);
  };
  
  // فتح حوار تسجيل الخروج
  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };
  
  // إغلاق حوار تسجيل الخروج
  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };
  
  // تسجيل الخروج
  const handleLogout = () => {
    logout();
  };
  
  // حفظ تعديلات الملف الشخصي
  const handleUpdateProfile = async (profileData) => {
    try {
      setLoading(true);
      await updateProfile(profileData);
      handleCloseEditProfile();
    } catch (error) {
      setError(error.response?.data?.message || t('errors.generalError'));
    } finally {
      setLoading(false);
    }
  };
  
  // تغيير كلمة المرور
  const handleChangePassword = async (passwordData) => {
    try {
      setLoading(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      handleCloseChangePassword();
    } catch (error) {
      setError(error.response?.data?.message || t('errors.generalError'));
    } finally {
      setLoading(false);
    }
  };
  
  // حفظ العنوان
  const handleSaveAddress = async (addressData) => {
    try {
      setLoading(true);
      // هنا يمكن استدعاء API لحفظ العنوان
      // تحديث العنوان في كائن المستخدم
      const updatedUser = {
        ...user,
        address: addressData
      };
      
      await updateProfile({ address: addressData });
      handleCloseAddressForm();
    } catch (error) {
      setError(error.response?.data?.message || t('errors.generalError'));
    } finally {
      setLoading(false);
    }
  };
  
  // تحميل صورة جديدة
  const handleImageUpload = (event) => {
    // هنا يمكن استدعاء API لتحميل الصورة وتحديث الملف الشخصي
    console.log('تحميل الصورة:', event.target.files[0]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* القسم الأيمن: معلومات الملف الشخصي */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <label htmlFor="upload-image">
                      <input
                        accept="image/*"
                        id="upload-image"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 32,
                          height: 32,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'primary.dark' }
                        }}
                      >
                        <CameraIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                    </label>
                  }
                >
                  <Avatar
                    src={user?.imageUrl}
                    alt={user?.username}
                    sx={{ width: 100, height: 100 }}
                  >
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </Badge>
              
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                {user?.username}
              </Typography>
              
              <Chip
                label={t(`profile.${user?.role || 'user'}`)}
                color={user?.role === 'admin' ? 'primary' : user?.role === 'professional' ? 'secondary' : 'default'}
                size="small"
                sx={{ mt: 1 }}
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('profile.joinDate')}: {formatDate(user?.createdAt || new Date())}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={t('profile.email')}
                  secondary={user?.email}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={t('profile.phone')}
                  secondary={user?.phone || t('general.notProvided')}
                />
              </ListItem>
              
              {user?.address && (
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('profile.address')}
                    secondary={
                      user.address.street
                        ? `${user.address.street}, ${user.address.city}, ${user.address.state}`
                        : t('general.notProvided')
                    }
                  />
                </ListItem>
              )}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                fullWidth
                onClick={handleOpenEditProfile}
              >
                {t('profile.editProfile')}
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                startIcon={<PasswordIcon />}
                fullWidth
                onClick={handleOpenChangePassword}
              >
                {t('profile.changePassword')}
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                fullWidth
                onClick={handleOpenLogoutDialog}
              >
                {t('profile.logout')}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* القسم الأيسر: لوحة المعلومات والتبويبات */}
        <Grid item xs={12} md={8}>
          {/* لوحة معلومات المستخدم */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <InfoCard
                title={t('orders.orders')}
                value={user?.orderCount || 0}
                icon={<OrdersIcon />}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <InfoCard
                title={t('measurements.measurements')}
                value={user?.measurementsCount || 0}
                icon={<MeasurementIcon />}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <InfoCard
                title={t('notifications.notifications')}
                value={user?.unreadNotifications || 0}
                icon={<NotificationIcon />}
              />
            </Grid>
          </Grid>
          
          {/* تبويبات المحتوى */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label={t('profile.addresses')} />
              <Tab label={t('orders.recentOrders')} />
              <Tab label={t('profile.settings')} />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {/* تبويب العناوين */}
              {activeTab === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {t('profile.addresses')}
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddressIcon />}
                      onClick={() => handleOpenAddressForm()}
                    >
                      {t('profile.addAddress')}
                    </Button>
                  </Box>
                  
                  {user?.address ? (
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={10}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {user.address.name || t('profile.defaultAddress')}
                            </Typography>
                            <Typography variant="body2">
                              {user.address.street}, {user.address.city}<br />
                              {user.address.state}, {user.address.postalCode}<br />
                              {user.address.country}<br />
                              {t('profile.phone')}: {user.address.phone || user.phone}
                            </Typography>
                          </Grid>
                          <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Box>
                              <Button
                                size="small"
                                onClick={() => handleOpenAddressForm(user.address)}
                              >
                                <EditIcon fontSize="small" />
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ) : (
                    <Alert severity="info">
                      {t('profile.noAddresses')} {t('profile.addYourFirstAddress')}
                    </Alert>
                  )}
                </Box>
              )}
              
              {/* تبويب الطلبات الأخيرة */}
              {activeTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {t('orders.recentOrders')}
                    </Typography>
                    
                    <Button
                      component={RouterLink}
                      to="/orders"
                      variant="outlined"
                      size="small"
                      startIcon={<OrdersIcon />}
                    >
                      {t('orders.viewAllOrders')}
                    </Button>
                  </Box>
                  
                  {user?.recentOrders && user.recentOrders.length > 0 ? (
                    <List>
                      {user.recentOrders.map((order) => (
                        <ListItem
                          key={order._id}
                          button
                          component={RouterLink}
                          to={`/orders/${order._id}`}
                          sx={{ mb: 1, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2">
                                  {order.orderNumber || `#${order._id.substring(0, 8)}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(order.createdAt)}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Chip
                                  size="small"
                                  label={t(`orders.status.${order.status}`)}
                                  color={
                                    order.status === 'delivered'
                                      ? 'success'
                                      : order.status === 'cancelled'
                                      ? 'error'
                                      : order.status === 'shipped'
                                      ? 'primary'
                                      : 'warning'
                                  }
                                />
                                <Typography variant="subtitle2" color="primary.main">
                                  {order.totalPrice} {t('general.currency')}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="info">
                      {t('orders.noOrders')}
                    </Alert>
                  )}
                </Box>
              )}
              
              {/* تبويب الإعدادات */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {t('profile.settings')}
                  </Typography>
                  
                  {/* إعدادات اللغة */}
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {t('general.language')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {t('general.selectLanguage')}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                        >
                          {t('general.arabic')}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                        >
                          {t('general.english')}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                  
                  {/* إعدادات الإشعارات */}
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {t('profile.notificationSettings')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {t('profile.notificationDescription')}
                      </Typography>
                      
                      <Box>
                        {/* هنا يمكن إضافة عناصر تبديل للإشعارات */}
                        <Button
                          component={RouterLink}
                          to="/notifications"
                          variant="outlined"
                          size="small"
                          startIcon={<NotificationIcon />}
                        >
                          {t('notifications.manageNotifications')}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Box>
          </Paper>
          
          {/* روابط سريعة */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('general.quickLinks')}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Button
                component={RouterLink}
                to="/orders"
                variant="outlined"
                size="small"
                startIcon={<OrdersIcon />}
              >
                {t('orders.myOrders')}
              </Button>
              
              <Button
                component={RouterLink}
                to="/measurements"
                variant="outlined"
                size="small"
                startIcon={<MeasurementIcon />}
              >
                {t('measurements.myMeasurements')}
              </Button>
              
              <Button
                component={RouterLink}
                to="/notifications"
                variant="outlined"
                size="small"
                startIcon={<NotificationIcon />}
              >
                {t('notifications.notifications')}
              </Button>
              
              {user?.role === 'admin' && (
                <Button
                  component={RouterLink}
                  to="/admin"
                  variant="outlined"
                  size="small"
                  startIcon={<SettingsIcon />}
                  color="secondary"
                >
                  {t('admin.dashboard')}
                </Button>
              )}
              
              {user?.role === 'professional' && (
                <Button
                  component={RouterLink}
                  to="/my-services"
                  variant="outlined"
                  size="small"
                  startIcon={<SettingsIcon />}
                  color="secondary"
                >
                  {t('services.myServices')}
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* حوار تعديل الملف الشخصي */}
      <Dialog
        open={openEditProfile}
        onClose={handleCloseEditProfile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t('profile.editProfile')}
        </DialogTitle>
        <DialogContent>
          <ProfileForm
            initialData={user}
            onSubmit={handleUpdateProfile}
            loading={loading}
            error={error}
            setError={setError}
          />
        </DialogContent>
      </Dialog>
      
      {/* حوار تغيير كلمة المرور */}
      <Dialog
        open={openChangePassword}
        onClose={handleCloseChangePassword}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t('profile.changePassword')}
        </DialogTitle>
        <DialogContent>
          <PasswordChangeForm
            onSubmit={handleChangePassword}
            loading={loading}
            error={error}
            setError={setError}
          />
        </DialogContent>
      </Dialog>
      
      {/* حوار إضافة/تعديل العنوان */}
      <Dialog
        open={openAddressForm}
        onClose={handleCloseAddressForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedAddress ? t('profile.editAddress') : t('profile.addAddress')}
        </DialogTitle>
        <DialogContent>
          <AddressForm
            initialData={selectedAddress}
            onSubmit={handleSaveAddress}
            loading={loading}
            error={error}
            setError={setError}
          />
        </DialogContent>
      </Dialog>
      
      {/* حوار تسجيل الخروج */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
      >
        <DialogTitle>
          {t('profile.confirmLogout')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('profile.logoutConfirmMessage')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog}>
            {t('general.cancel')}
          </Button>
          <Button
            onClick={handleLogout}
            color="error"
            autoFocus
          >
            {t('profile.logout')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;