// src/features/profile/pages/AddressesPage.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Alert,
  IconButton,
  Chip,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon
} from '@mui/icons-material';
import profileService from '../services/profileService';

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await profileService.getAddresses();
        setAddresses(response.data.addresses);
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setError(err.response?.data?.message || 'حدث خطأ أثناء جلب العناوين');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAddresses();
  }, []);

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await profileService.setDefaultAddress(addressId);
      
      // تحديث القائمة لتعكس التغيير
      setAddresses(addresses.map(address => ({
        ...address,
        isDefault: address._id === addressId
      })));
    } catch (err) {
      console.error('Error setting default address:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء تعيين العنوان الافتراضي');
    }
  };

  const handleOpenDeleteDialog = (address) => {
    setAddressToDelete(address);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAddressToDelete(null);
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      await profileService.deleteAddress(addressToDelete._id);
      
      // حذف العنوان من القائمة
      setAddresses(addresses.filter(address => address._id !== addressToDelete._id));
      
      // إغلاق مربع الحوار
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting address:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء حذف العنوان');
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
          to="/profile"
        >
          الملف الشخصي
        </Link>
        <Typography color="text.primary">العناوين</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationIcon color="primary" sx={{ mr: 1 }} />
            العناوين
          </Typography>
          
          <Button
            component={RouterLink}
            to="/profile/addresses/add"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            إضافة عنوان جديد
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Typography>جاري التحميل...</Typography>
        ) : addresses.length === 0 ? (
          <Alert severity="info">
            لا توجد عناوين مضافة. قم بإضافة عنوان جديد.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {addresses.map((address) => (
              <Grid item xs={12} md={6} key={address._id}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3,
                    position: 'relative',
                    border: address.isDefault ? '2px solid' : '1px solid',
                    borderColor: address.isDefault ? 'primary.main' : 'divider'
                  }}
                >
                  {address.isDefault && (
                    <Chip
                      label="العنوان الافتراضي"
                      color="primary"
                      size="small"
                      sx={{ position: 'absolute', top: 10, left: 10 }}
                    />
                  )}
                  
                  <Typography variant="h6" gutterBottom>
                    {address.name}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      {address.street}
                    </Typography>
                    <Typography variant="body1">
                      {address.city}, {address.state}
                    </Typography>
                    <Typography variant="body1">
                      {address.country} {address.postalCode}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      رقم الهاتف: {address.phoneNumber}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    {!address.isDefault && (
                      <Button 
                        variant="text" 
                        onClick={() => handleSetDefaultAddress(address._id)}
                        sx={{ mr: 1 }}
                      >
                        تعيين كافتراضي
                      </Button>
                    )}
                    
                    <Button
                      component={RouterLink}
                      to={`/profile/addresses/edit/${address._id}`}
                      startIcon={<EditIcon />}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      تعديل
                    </Button>
                    
                    {!address.isDefault && (
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(address)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
        
        <Box sx={{ mt: 3 }}>
          <Button
            component={RouterLink}
            to="/profile"
            startIcon={<ArrowBackIcon />}
          >
            العودة للملف الشخصي
          </Button>
        </Box>
      </Paper>
      
      {/* مربع حوار حذف العنوان */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          تأكيد الحذف
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            هل أنت متأكد من حذف هذا العنوان؟ لا يمكن التراجع عن هذه العملية.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>إلغاء</Button>
          <Button onClick={handleDeleteAddress} color="error" autoFocus>
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddressesPage;