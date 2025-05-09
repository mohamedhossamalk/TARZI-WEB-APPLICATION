// src/features/services/pages/MyServicesPage.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Home as HomeIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { useAuth } from '../../../core/hooks/useAuth';
import professionalService from '../services/professionalService';

const MyServicesPage = () => {
  const { isAuthenticated, isProfessional } = useAuth();
  const navigate = useNavigate();
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // حالة مربع حوار الحذف
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // حالة القائمة المنسدلة لكل خدمة
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeServiceId, setActiveServiceId] = useState(null);

  useEffect(() => {
    // التحقق من صلاحيات المستخدم
    if (!isAuthenticated || !isProfessional) {
      navigate('/login');
      return;
    }
    
    const fetchMyServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await professionalService.getMyServices();
        setServices(response.data.services);
      } catch (err) {
        console.error('Error fetching my services:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء جلب الخدمات الخاصة بك');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyServices();
  }, [isAuthenticated, isProfessional, navigate]);

  // فتح القائمة المنسدلة للخدمة
  const handleOpenMenu = (event, serviceId) => {
    setMenuAnchorEl(event.currentTarget);
    setActiveServiceId(serviceId);
  };

  // إغلاق القائمة المنسدلة
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setActiveServiceId(null);
  };

  // فتح مربع حوار حذف الخدمة
  const handleOpenDeleteDialog = (service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  // إغلاق مربع حوار الحذف
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  // حذف الخدمة
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      setDeleting(true);
      
      await professionalService.deleteService(serviceToDelete._id);
      
      // تحديث القائمة بعد الحذف
      setServices(services.filter(service => service._id !== serviceToDelete._id));
      
      // إغلاق مربع الحوار
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء حذف الخدمة');
    } finally {
      setDeleting(false);
    }
  };

  // تغيير حالة نشاط الخدمة (نشطة/غير نشطة)
  const handleToggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      
      await professionalService.updateServiceStatus(serviceId, {
        isActive: newStatus
      });
      
      // تحديث حالة الخدمة محلياً
      setServices(services.map(service => 
        service._id === serviceId ? { ...service, isActive: newStatus } : service
      ));
    } catch (err) {
      console.error('Error updating service status:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء تغيير حالة الخدمة');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          to="/services"
        >
          الخدمات المهنية
        </Link>
        <Typography color="text.primary">خدماتي</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          خدماتي المهنية
        </Typography>
        
        <Button
          component={RouterLink}
          to="/services/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          إضافة خدمة جديدة
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : services.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            لم تقم بإضافة أي خدمات بعد
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
            قم بإضافة خدماتك المهنية للوصول إلى العملاء الآن
          </Typography>
          <Button
            component={RouterLink}
            to="/services/new"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            size="large"
          >
            إضافة خدمة جديدة
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item key={service._id} xs={12} sm={6} md={4}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                },
                position: 'relative',
                opacity: service.isActive ? 1 : 0.7
              }}>
                {!service.isActive && (
                  <Chip 
                    label="غير نشطة" 
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 1
                    }}
                  />
                )}
                
                <CardMedia
                  component="img"
                  height="160"
                  image={service.images?.[0] || '/assets/images/service-placeholder.jpg'}
                  alt={service.title}
                />
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {service.title}
                    </Typography>
                    
                    <IconButton
                      aria-label="المزيد من الخيارات"
                      onClick={(e) => handleOpenMenu(e, service._id)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    height: '40px'
                  }}>
                    {service.description}
                  </Typography>
                  
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary.main">
                      {service.price} ر.س
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StarBorderIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {service.rating || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <Divider />
                
                <CardActions sx={{ justifyContent: 'space-between', padding: 2 }}>
                  <Button
                    component={RouterLink}
                    to={`/services/${service._id}`}
                    size="small"
                    startIcon={<VisibilityIcon />}
                  >
                    عرض
                  </Button>
                  
                  <Box>
                    <Button
                      component={RouterLink}
                      to={`/services/edit/${service._id}`}
                      size="small"
                      color="primary"
                      startIcon={<EditIcon />}
                    >
                      تعديل
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* قائمة منسدلة للخيارات */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem component={RouterLink} to={`/services/${activeServiceId}`} onClick={handleCloseMenu}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="عرض الخدمة" />
        </MenuItem>
        
        <MenuItem component={RouterLink} to={`/services/edit/${activeServiceId}`} onClick={handleCloseMenu}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="تعديل الخدمة" />
        </MenuItem>
        
        <Divider />
        
        {activeServiceId && services.find(s => s._id === activeServiceId) && (
          <MenuItem onClick={() => {
            const service = services.find(s => s._id === activeServiceId);
            handleToggleServiceStatus(activeServiceId, service?.isActive);
            handleCloseMenu();
          }}>
            <ListItemIcon>
              {services.find(s => s._id === activeServiceId)?.isActive 
                ? <VisibilityOffIcon fontSize="small" />
                : <VisibilityIcon fontSize="small" />
              }
            </ListItemIcon>
            <ListItemText 
              primary={services.find(s => s._id === activeServiceId)?.isActive 
                ? "تعطيل الخدمة" 
                : "تفعيل الخدمة"
              } 
            />
          </MenuItem>
        )}
        
        <MenuItem onClick={() => handleOpenDeleteDialog(services.find(s => s._id === activeServiceId))} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="حذف الخدمة" />
        </MenuItem>
      </Menu>
      
      {/* مربع حوار تأكيد الحذف */}
      <Dialog
        open={deleteDialogOpen}
        onClose={!deleting ? handleCloseDeleteDialog : undefined}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          تأكيد حذف الخدمة
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            هل أنت متأكد من رغبتك في حذف الخدمة "{serviceToDelete?.title}"؟
            <br/>
            لا يمكن التراجع عن هذا الإجراء.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleting}>
            إلغاء
          </Button>
          <Button 
            onClick={handleDeleteService} 
            color="error" 
            variant="contained" 
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            {deleting ? 'جاري الحذف...' : 'حذف الخدمة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyServicesPage;