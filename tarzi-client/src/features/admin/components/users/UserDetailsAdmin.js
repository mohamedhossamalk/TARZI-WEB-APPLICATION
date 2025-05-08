// src/features/admin/components/users/UserDetailsAdmin.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Chip,
  Divider,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Tab,
  Tabs
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Today as DateIcon,
  Security as SecurityIcon,
  LocalMall as OrdersIcon,
  Assignment as ActivityIcon,
} from '@mui/icons-material';
import { formatDate } from '../../../../core/utils/formatters';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UserDetailsAdmin = ({ user, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // تغيير التبويب
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // مخطط التحقق من صحة النموذج
  const validationSchema = Yup.object({
    username: Yup.string().required('اسم المستخدم مطلوب'),
    email: Yup.string().email('البريد الإلكتروني غير صالح').required('البريد الإلكتروني مطلوب'),
    phone: Yup.string(),
    role: Yup.string().required('الدور مطلوب'),
    isActive: Yup.boolean()
  });
  
  // إعداد Formik
  const formik = useFormik({
    initialValues: {
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      isActive: user.isActive !== undefined ? user.isActive : true
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      try {
        await onUpdate(user._id, values);
        setEditMode(false);
      } catch (err) {
        setError(err.response?.data?.message || 'حدث خطأ أثناء تحديث المستخدم');
      } finally {
        setLoading(false);
      }
    }
  });
  
  // الحصول على لون وتسمية الدور
  const getRoleInfo = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'مسؤول', color: 'error' };
      case 'professional':
        return { label: 'مهني', color: 'secondary' };
      case 'user':
      default:
        return { label: 'مستخدم', color: 'primary' };
    }
  };
  
  return (
    <>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {editMode ? 'تعديل بيانات المستخدم' : 'تفاصيل المستخدم'}
          </Typography>
          {!editMode && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setEditMode(true)}
              size="small"
            >
              تعديل
            </Button>
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {!editMode ? (
          <>
            {/* عرض التفاصيل */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={user.imageUrl}
                alt={user.username}
                sx={{ width: 80, height: 80, mr: 2 }}
              />
              <Box>
                <Typography variant="h5">{user.username}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Chip
                    label={getRoleInfo(user.role).label}
                    color={getRoleInfo(user.role).color}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={user.isActive ? 'نشط' : 'غير نشط'}
                    color={user.isActive ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="المعلومات الأساسية" />
              <Tab label="الطلبات" />
              <Tab label="النشاطات" />
            </Tabs>
            
            {activeTab === 0 && (
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="البريد الإلكتروني"
                    secondary={user.email}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="رقم الهاتف"
                    secondary={user.phone || 'غير متوفر'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <DateIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="تاريخ التسجيل"
                    secondary={formatDate(user.createdAt)}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="حالة الحساب"
                    secondary={user.isActive ? 'نشط' : 'غير نشط'}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={user.isActive}
                      disabled
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            )}
            
            {activeTab === 1 && (
              <Box>
                {user.recentOrders && user.recentOrders.length > 0 ? (
                  <List>
                    {user.recentOrders.map((order) => (
                      <ListItem key={order._id} button>
                        <ListItemIcon>
                          <OrdersIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`طلب #${order.orderNumber || order._id.substring(0, 8)}`}
                          secondary={`${formatDate(order.createdAt)} - ${order.totalPrice} ج.م`}
                        />
                        <Chip 
                          label={order.status === 'delivered' ? 'تم التسليم' : 
                                order.status === 'shipped' ? 'تم الشحن' : 
                                order.status === 'processing' ? 'قيد المعالجة' : 
                                order.status === 'cancelled' ? 'ملغي' : 'قيد الانتظار'}
                          color={
                            order.status === 'delivered' ? 'success' : 
                            order.status === 'shipped' ? 'primary' : 
                            order.status === 'processing' ? 'info' : 
                            order.status === 'cancelled' ? 'error' : 'warning'
                          }
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    لا توجد طلبات لهذا المستخدم
                  </Typography>
                )}
              </Box>
            )}
            
            {activeTab === 2 && (
              <Box>
                {user.activities && user.activities.length > 0 ? (
                  <List>
                    {user.activities.map((activity, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ActivityIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.description}
                          secondary={formatDate(activity.createdAt)}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    لا توجد نشاطات لهذا المستخدم
                  </Typography>
                )}
              </Box>
            )}
          </>
        ) : (
          /* نموذج تعديل المستخدم */
          <Box component="form" noValidate onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="اسم المستخدم"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  disabled={loading}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="البريد الإلكتروني"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  disabled={loading}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="رقم الهاتف"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  disabled={loading}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-label">الدور</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="الدور"
                    disabled={loading}
                  >
                    <MenuItem value="user">مستخدم عادي</MenuItem>
                    <MenuItem value="professional">مهني</MenuItem>
                    <MenuItem value="admin">مسؤول</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.isActive}
                      onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                      name="isActive"
                      color="primary"
                      disabled={loading}
                    />
                  }
                  label={formik.values.isActive ? 'نشط' : 'غير نشط'}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        {editMode ? (
          <>
            <Button onClick={() => setEditMode(false)} disabled={loading}>
              إلغاء
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={formik.handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'حفظ التغييرات'}
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>إغلاق</Button>
        )}
      </DialogActions>
    </>
  );
};

export default UserDetailsAdmin;
