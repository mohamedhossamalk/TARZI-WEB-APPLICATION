// src/features/admin/pages/SettingsAdminPage.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Divider,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import adminService from '../services/adminService';

const SettingsAdminPage = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: '',
      siteDescription: '',
      logo: '',
      favicon: '',
      contactEmail: '',
      contactPhone: '',
    },
    shipping: {
      freeShippingMinimum: 0,
      shippingCost: 0,
      enableFreeShipping: false,
    },
    payment: {
      enableCOD: true,
      enableCreditCard: true,
      taxPercentage: 14,
    },
    notification: {
      enableEmailNotifications: true,
      enableSmsNotifications: false,
      notifyOnNewOrder: true,
      notifyOnOrderStatus: true,
    }
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // جلب الإعدادات
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await adminService.getSettings();
        setSettings(response.data.settings);
      } catch (error) {
        setError('حدث خطأ أثناء جلب الإعدادات');
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // تغيير التبويب
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // تعديل قيمة الإعداد
  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // مسح رسائل النجاح والخطأ
    setSuccess(false);
    setError(null);
  };
  
  // حفظ الإعدادات
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      await adminService.updateSettings(settings);
      
      setSuccess(true);
    } catch (error) {
      setError('حدث خطأ أثناء حفظ الإعدادات');
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          إعدادات النظام
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? <CircularProgress size={24} /> : 'حفظ الإعدادات'}
        </Button>
      </Box>
      
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
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="الإعدادات العامة" />
          <Tab label="إعدادات الشحن" />
          <Tab label="إعدادات الدفع" />
          <Tab label="إعدادات الإشعارات" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* الإعدادات العامة */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="اسم الموقع"
                  value={settings.general.siteName}
                  onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="البريد الإلكتروني للتواصل"
                  value={settings.general.contactEmail}
                  onChange={(e) => handleChange('general', 'contactEmail', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="رقم هاتف التواصل"
                  value={settings.general.contactPhone}
                  onChange={(e) => handleChange('general', 'contactPhone', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="وصف الموقع"
                  value={settings.general.siteDescription}
                  onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
                />
              </Grid>
            </Grid>
          )}
          
          {/* إعدادات الشحن */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.shipping.enableFreeShipping}
                      onChange={(e) => handleChange('shipping', 'enableFreeShipping', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="تفعيل الشحن المجاني للطلبات التي تتجاوز الحد الأدنى"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="تكلفة الشحن (ج.م)"
                  value={settings.shipping.shippingCost}
                  onChange={(e) => handleChange('shipping', 'shippingCost', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="الحد الأدنى للشحن المجاني (ج.م)"
                  value={settings.shipping.freeShippingMinimum}
                  onChange={(e) => handleChange('shipping', 'freeShippingMinimum', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }}
                  disabled={!settings.shipping.enableFreeShipping}
                />
              </Grid>
            </Grid>
          )}
          
          {/* إعدادات الدفع */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.payment.enableCOD}
                      onChange={(e) => handleChange('payment', 'enableCOD', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="تفعيل الدفع عند الاستلام"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.payment.enableCreditCard}
                      onChange={(e) => handleChange('payment', 'enableCreditCard', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="تفعيل الدفع ببطاقة الائتمان"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="نسبة الضريبة (%)"
                  value={settings.payment.taxPercentage}
                  onChange={(e) => handleChange('payment', 'taxPercentage', Number(e.target.value))}
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
              </Grid>
            </Grid>
          )}
          
          {/* إعدادات الإشعارات */}
          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notification.enableEmailNotifications}
                      onChange={(e) => handleChange('notification', 'enableEmailNotifications', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="تفعيل إشعارات البريد الإلكتروني"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notification.enableSmsNotifications}
                      onChange={(e) => handleChange('notification', 'enableSmsNotifications', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="تفعيل إشعارات الرسائل القصيرة"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notification.notifyOnNewOrder}
                      onChange={(e) => handleChange('notification', 'notifyOnNewOrder', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="إشعار المسؤولين عند إنشاء طلب جديد"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notification.notifyOnOrderStatus}
                      onChange={(e) => handleChange('notification', 'notifyOnOrderStatus', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="إشعار العملاء عند تغيير حالة الطلب"
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsAdminPage;