// src/features/cart/components/QuickAddToCartButton.js
import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  AddShoppingCart as AddToCartIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useCart } from '../../../core/hooks/useCart';
import { useAuth } from '../../../core/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const QuickAddToCartButton = ({ product, iconOnly = false, size = 'medium', color = 'primary' }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleAddToCart = async (event) => {
    // منع انتشار الحدث حتى لا يؤثر على أي عناصر أخرى (مثل الروابط)
    event.preventDefault();
    event.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${product._id}` } });
      return;
    }
    
    if (product.requiresMeasurements) {
      // إعادة توجيه المستخدم إلى صفحة المنتج لاختيار المقاس إذا كان مطلوباً
      navigate(`/products/${product._id}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await addToCart({
        productId: product._id,
        name: product.name,
        price: product.discount ? calculateDiscountedPrice(product.price, product.discount) : product.price,
        quantity: 1,
        image: product.images?.[0] || '',
      });
      
      setSuccess(true);
      setOpenSnackbar(true);
      
      // إعادة تعيين حالة النجاح بعد 2 ثانية
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('حدث خطأ أثناء إضافة المنتج للسلة');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // حساب السعر بعد الخصم
  const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      {iconOnly ? (
        <IconButton
          color={success ? "success" : color}
          onClick={handleAddToCart}
          disabled={loading || !product.inStock || product.stockQuantity === 0}
          size={size}
          aria-label="إضافة إلى السلة"
        >
          {loading ? <CircularProgress size={24} /> : success ? <CheckIcon /> : <AddToCartIcon />}
        </IconButton>
      ) : (
        <Button
          variant="contained"
          color={success ? "success" : color}
          size={size}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : success ? <CheckIcon /> : <AddToCartIcon />}
          onClick={handleAddToCart}
          disabled={loading || !product.inStock || product.stockQuantity === 0}
        >
          {success ? 'تمت الإضافة' : 'إضافة للسلة'}
        </Button>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? "error" : "success"} 
          variant="filled"
        >
          {error ? error : 'تمت إضافة المنتج للسلة بنجاح!'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default QuickAddToCartButton;