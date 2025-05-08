// src/features/orders/components/OrderRating.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Star as StarIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import orderService from '../services/orderService';

const OrderRating = ({ order, onRatingSubmitted }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('يرجى تحديد تقييم من 1 إلى 5 نجوم');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await orderService.rateOrder(order._id, { rating, review });
      
      setSuccess(true);
      setTimeout(() => {
        handleClose();
        if (onRatingSubmitted) {
          onRatingSubmitted({ rating, review });
        }
      }, 1500);
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء إرسال التقييم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        startIcon={<StarIcon />}
        disabled={order.rated || order.status !== 'delivered'}
      >
        {order.rated ? 'تم التقييم' : 'تقييم الطلب'}
      </Button>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>تقييم الطلب #{order.orderNumber}</DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              كيف كانت تجربتك مع هذا الطلب؟
            </Typography>
            
            <Rating
              name="order-rating"
              value={rating}
              onChange={handleRatingChange}
              size="large"
              precision={1}
              sx={{ my: 2 }}
            />
            
            <TextField
              label="أخبرنا المزيد عن تجربتك (اختياري)"
              fullWidth
              multiline
              rows={4}
              value={review}
              onChange={handleReviewChange}
              disabled={loading}
              placeholder="يمكنك كتابة ملاحظاتك حول المنتج، جودته، التوصيل، الخدمة، إلخ..."
            />
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              تم إرسال التقييم بنجاح. شكراً لك!
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={loading || success}
          >
            {loading ? <CircularProgress size={24} /> : 'إرسال التقييم'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderRating;