// src/features/notifications/pages/NotificationSettingsPage.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Breadcrumbs,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Home as HomeIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  Settings as SettingsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import notificationService from '../services/notificationService';

const NotificationSettingsPage = () => {
  const [settings, setSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    notificationTypes: {
      order: true,
      message: true,
      system: true,
      offer: true
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // جلب إعدادات الإشعارات من الخادم
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await notificationService.getNotificationSettings();
        setSettings(response.data.settings);
      } catch (err) {
        console.error('Error fetching notification settings:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء جلب إعدادات الإشعارات');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  // تغيير إعدادات قناة الإشعارات
  const handleToggleChannel = (channel) => {
    setSettings({
      ...settings,
      [channel]: !settings[channel]
    });
  };

  // تغيير إعدادات نوع الإشعارات
  const handleToggleNotificationType = (type) => {
    setSettings({
      ...settings,
      notificationTypes: {
        ...settings.notificationTypes,
        [type]: !settings.notificationTypes[type]
      }
    });
  };

  // حفظ الإعدادات
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      await notificationService.updateNotificationSettings(settings);
      
      setSuccess(true);
      
      // إخفاء رسالة النجاح بعد 3 ثوان
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving notification settings:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ إعدادات الإشعارات');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Breadcrumbs separator={<KeyboardArrowLeftIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          الرئيسية
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/notifications"
        >
          الإشعارات
        </Link>
        <Typography color="text.primary">إعدادات الإشعارات</Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon color="primary" sx={{ mr: 1 }} />
        إعدادات الإشعارات
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          تم حفظ الإعدادات بنجاح
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              قنوات الإشعارات
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              اختر الطرق التي ترغب في استلام الإشعارات من خلالها
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <NotificationsActiveIcon />
                </ListItemIcon>
                <ListItemText
                  primary="الإشعارات داخل التطبيق"
                  secondary="الإشعارات التي تظهر عند استخدام التطبيق"
                />
                <Switch
                  edge="end"
                  checked={settings.pushEnabled}
                  onChange={() => handleToggleChannel('pushEnabled')}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="البريد الإلكتروني"
                  secondary="إرسال إشعارات عبر البريد الإلكتروني"
                />
                <Switch
                  edge="end"
                  checked={settings.emailEnabled}
                  onChange={() => handleToggleChannel('emailEnabled')}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <SmsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="الرسائل النصية"
                  secondary="إرسال إشعارات عبر رسائل SMS القصيرة"
                />
                <Switch
                  edge="end"
                  checked={settings.smsEnabled}
                  onChange={() => handleToggleChannel('smsEnabled')}
                />
              </ListItem>
            </List>
          </Paper>
          
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              أنواع الإشعارات
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              اختر أنواع الإشعارات التي ترغب في استلامها
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notificationTypes.order}
                    onChange={() => handleToggleNotificationType('order')}
                  />
                }
                label="إشعارات الطلبات"
              />
              <Typography variant="caption" color="text.secondary" paragraph>
                إشعارات تتعلق بحالة طلباتك وتحديثاتها
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notificationTypes.message}
                    onChange={() => handleToggleNotificationType('message')}
                  />
                }
                label="إشعارات الرسائل"
              />
              <Typography variant="caption" color="text.secondary" paragraph>
                إشعارات عند استلام رسائل جديدة
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notificationTypes.system}
                    onChange={() => handleToggleNotificationType('system')}
                  />
                }
                label="إشعارات النظام"
              />
              <Typography variant="caption" color="text.secondary" paragraph>
                إشعارات مهمة متعلقة بحسابك وتحديثات النظام
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notificationTypes.offer}
                    onChange={() => handleToggleNotificationType('offer')}
                  />
                }
                label="إشعارات العروض والخصومات"
              />
              <Typography variant="caption" color="text.secondary" paragraph>
                إشعارات حول العروض الترويجية والخصومات الخاصة
              </Typography>
            </FormGroup>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              component={RouterLink}
              to="/notifications"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
            >
              العودة إلى الإشعارات
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default NotificationSettingsPage;