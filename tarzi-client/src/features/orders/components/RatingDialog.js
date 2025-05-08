// src/features/orders/components/RatingDialog.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Rating,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

const RatingDialog = ({ open, onClose, onSubmit, orderNumber }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(-1);
  
  // الحصول على نص وصف التقييم
  const getLabelText = (value) => {
    const labels = {
      1: t('ratings.poor', 'سيء'),
      2: t('ratings.fair', 'مقبول'),
      3: t('ratings.good', 'جيد'),
      4: t('ratings.veryGood', 'جيد جداً'),
      5: t('ratings.excellent', 'ممتاز')
    };
    
    return labels[value];
  };
  
  // إرسال التقييم
  const handleSubmit = async () => {
    if (!rating) return;
    
    try {
      setSubmitting(true);
      await onSubmit(rating, comment);
      handleReset();
      onClose();
    } catch (error) {
      console.error('خطأ في إرسال التقييم:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // إعادة تعيين النموذج
  const handleReset = () => {
    setRating(5);
    setComment('');
  };
  
  // إغلاق الحوار
  const handleClose = () => {
    handleReset();
    onClose();
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {t('orders.rateOrder')} {orderNumber}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, pt: 1 }}>
          <Typography component="legend" gutterBottom>
            {t('orders.rateYourExperience')}
          </Typography>
          <Rating
            name="order-rating"
            size="large"
            value={rating}
            precision={1}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHoverRating(newHover);
            }}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="primary">
              {getLabelText(hoverRating !== -1 ? hoverRating : rating)}
            </Typography>
          </Box>
        </Box>
        
        <TextField
          label={t('orders.additionalComments')}
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
          placeholder={t('orders.commentPlaceholder', 'أخبرنا المزيد عن تجربتك مع هذا الطلب...')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          {t('general.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={submitting || !rating}
        >
          {submitting ? <CircularProgress size={24} /> : t('general.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingDialog;