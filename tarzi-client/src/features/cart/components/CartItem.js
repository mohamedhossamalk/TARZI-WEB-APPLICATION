// src/features/cart/components/CartItem.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Chip,
} from '@mui/material';
import { Delete, Add, Remove, Edit } from '@mui/icons-material';

const CartItem = ({ item, index, updateQuantity, removeFromCart, measurements }) => {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(item.measurementId || '');
  
  // تنسيق السعر
  const formatPrice = (price) => {
    return price.toLocaleString('ar-EG', {
      style: 'currency',
      currency: 'EGP',
    });
  };
  
  // زيادة الكمية
  const handleIncreaseQuantity = () => {
    updateQuantity(index, item.quantity + 1);
  };
  
  // إنقاص الكمية
  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(index, item.quantity - 1);
    }
  };
  
  // تغيير الكمية يدويًا
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value >= 1) {
      updateQuantity(index, value);
    }
  };
  
  // تغيير المقاس
  const handleMeasurementChange = (event) => {
    setSelectedMeasurement(event.target.value);
    // تحديث المقاس في السلة
    const updatedItem = { ...item, measurementId: event.target.value };
    updateQuantity(index, item.quantity, updatedItem);
  };
  
  // فتح حوار الحذف
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };
  
  // إغلاق حوار الحذف
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  
  // حذف العنصر من السلة
  const handleDeleteItem = () => {
    removeFromCart(index);
    setOpenDeleteDialog(false);
  };
  
  // الانتقال إلى صفحة تفاصيل المنتج
  const handleGoToProduct = () => {
    navigate(`/products/${item.productId}`);
  };
  
  // البحث عن اسم المقاس المحدد
  const selectedMeasurementName = measurements?.find(m => m._id === item.measurementId)?.name || 'لم يتم تحديد المقاس';

  return (
    <Grid container spacing={2} alignItems="center">
      {/* صورة المنتج */}
      <Grid item xs={3} sm={2}>
        <Box
          component="img"
          src={item.imageUrl || '/assets/images/placeholder.png'}
          alt={item.name}
          sx={{
            width: '100%',
            maxHeight: { xs: 80, sm: 100 },
            objectFit: 'cover',
            borderRadius: 1,
            cursor: 'pointer',
          }}
          onClick={handleGoToProduct}
        />
      </Grid>
      
      {/* معلومات المنتج */}
      <Grid item xs={9} sm={4}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          gutterBottom
          sx={{ cursor: 'pointer' }}
          onClick={handleGoToProduct}
        >
          {item.name}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {item.fabricChoice && (
            <Chip
              label={`القماش: ${item.fabricChoice}`}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
          
          {item.colorChoice && (
            <Chip
              label={`اللون: ${item.colorChoice}`}
              size="small"
              variant="outlined"
              color="secondary"
            />
          )}
        </Box>
        
        <Box sx={{ mt: 1 }}>
          <FormControl size="small" sx={{ width: '100%', maxWidth: 200 }}>
            <InputLabel id={`measurement-label-${index}`}>المقاس</InputLabel>
            <Select
              labelId={`measurement-label-${index}`}
              value={selectedMeasurement}
              label="المقاس"
              onChange={handleMeasurementChange}
            >
              {measurements?.length > 0 ? (
                measurements.map((measurement) => (
                  <MenuItem key={measurement._id} value={measurement._id}>
                    {measurement.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>
                  لا توجد مقاسات متاحة
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
      </Grid>
      
      {/* التحكم في الكمية */}
      <Grid item xs={6} sm={3}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="small"
            onClick={handleDecreaseQuantity}
            disabled={item.quantity <= 1}
          >
            <Remove fontSize="small" />
          </IconButton>
          
          <TextField
            value={item.quantity}
            onChange={handleQuantityChange}
            type="number"
            InputProps={{ inputProps: { min: 1, style: { textAlign: 'center' } } }}
            variant="outlined"
            size="small"
            sx={{ width: 60, mx: 1 }}
          />
          
          <IconButton size="small" onClick={handleIncreaseQuantity}>
            <Add fontSize="small" />
          </IconButton>
        </Box>
      </Grid>
      
      {/* السعر */}
      <Grid item xs={4} sm={2} sx={{ textAlign: 'right' }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {formatPrice(item.price * item.quantity)}
        </Typography>
      </Grid>
      
      {/* زر الحذف */}
      <Grid item xs={2} sm={1} sx={{ textAlign: 'right' }}>
        <IconButton
          color="error"
          aria-label="حذف من السلة"
          onClick={handleOpenDeleteDialog}
        >
          <Delete />
        </IconButton>
      </Grid>
      
      {/* حوار تأكيد الحذف */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          حذف المنتج من السلة
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            هل أنت متأكد من حذف "{item.name}" من سلة التسوق؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleDeleteItem} color="error" autoFocus>
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default CartItem;
