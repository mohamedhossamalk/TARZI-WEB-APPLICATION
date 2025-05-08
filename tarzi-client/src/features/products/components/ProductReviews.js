// src/features/products/components/ProductReviews.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Rating,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Send as SendIcon, Star as StarIcon } from '@mui/icons-material';
import { useAuth } from '../../../core/hooks/useAuth';
import productService from '../services/productService';
import { formatRelativeTime } from '../../../core/utils/formatters';

const ProductReviews = ({ productId }) => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  
  // جلب التقييمات
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        const response = await productService.getProductReviews(productId);
        setReviews(response.data.reviews);
        setStats(response.data.stats);
        
        // التحقق مما إذا كان المستخدم قد قام بتقييم المنتج بالفعل
        if (isAuthenticated && response.data.userReview) {
          setUserReview(response.data.userReview);
        }
        
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('حدث خطأ أثناء جلب التقييمات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, isAuthenticated]);

  // فتح نافذة التقييم
  const handleOpenReviewDialog = () => {
    if (!isAuthenticated) {
      // توجيه المستخدم إلى صفحة تسجيل الدخول
      window.location.href = `/login?redirect=/products/${productId}`;
      return;
    }
    
    // إذا كان المستخدم قد قيّم المنتج بالفعل، نعرض تقييمه الحالي
    if (userReview) {
      setNewReview({
        rating: userReview.rating,
        comment: userReview.comment
      });
    } else {
      setNewReview({
        rating: 5,
        comment: ''
      });
    }
    
    setReviewDialogOpen(true);
  };

  // إغلاق نافذة التقييم
  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
  };

  // إرسال التقييم
  const handleSubmitReview = async () => {
    try {
      if (!newReview.comment.trim()) {
        alert('يرجى إضافة تعليق للتقييم');
        return;
      }
      
      const reviewData = {
        productId,
        rating: newReview.rating,
        comment: newReview.comment
      };
      
      let response;
      if (userReview) {
        // تحديث تقييم موجود
        response = await productService.updateReview(userReview._id, reviewData);
      } else {
        // إضافة تقييم جديد
        response = await productService.addReview(reviewData);
      }
      
      // تحديث قائمة التقييمات
      const updatedReviewsResponse = await productService.getProductReviews(productId);
      setReviews(updatedReviewsResponse.data.reviews);
      setStats(updatedReviewsResponse.data.stats);
      setUserReview(response.data.review);
      
      handleCloseReviewDialog();
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('حدث خطأ أثناء إرسال التقييم. يرجى المحاولة مرة أخرى.');
    }
  };

  // حساب نسبة توزيع التقييم
  const calculatePercentage = (count) => {
    if (stats.total === 0) return 0;
    return (count / stats.total) * 100;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">{error}</Alert>
    );
  }

  return (
    <Box>
      {/* ملخص التقييمات */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary">
              {stats.average.toFixed(1)}
            </Typography>
            <Rating
              value={stats.average}
              precision={0.5}
              readOnly
              size="large"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              بناءً على {stats.total} تقييم
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Box>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: 40 }}>
                  <Typography variant="body2">{rating}</Typography>
                  <StarIcon sx={{ fontSize: 16, color: 'primary.main', ml: 0.5 }} />
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    height: 8,
                    mx: 1,
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'primary.main',
                      height: '100%',
                      width: `${calculatePercentage(stats.distribution[rating])}%`
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ width: 30 }}>
                  {stats.distribution[rating]}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
      
      {/* زر إضافة تقييم */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenReviewDialog}
          startIcon={userReview ? null : <SendIcon />}
        >
          {userReview ? 'تعديل تقييمك' : 'أضف تقييمك'}
        </Button>
        
        {!isAuthenticated && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
            يجب تسجيل الدخول لإضافة تقييم
          </Typography>
        )}
      </Box>
      
      {/* قائمة التقييمات */}
      {reviews.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            لا توجد تقييمات حتى الآن. كن أول من يقيم هذا المنتج!
          </Typography>
        </Box>
      ) : (
        <Box>
          {reviews.map((review) => (
            <Paper key={review._id} variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={review.user.avatar}
                    alt={review.user.name}
                    sx={{ mr: 1 }}
                  >
                    {review.user.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {review.user.name}
                      {review.user._id === user?._id && ' (أنت)'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatRelativeTime(new Date(review.createdAt))}
                    </Typography>
                  </Box>
                </Box>
                <Rating value={review.rating} readOnly />
              </Box>
              
              <Typography variant="body1">{review.comment}</Typography>
              
              {review.response && (
                <Box sx={{ mt: 2, pl: 4, borderRight: '2px solid', borderColor: 'primary.main', pr: 2 }}>
                  <Typography variant="subtitle2" color="primary">
                    رد من البائع
                  </Typography>
                  <Typography variant="body2">{review.response}</Typography>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      )}
      
      {/* نافذة إضافة/تعديل تقييم */}
      <Dialog open={reviewDialogOpen} onClose={handleCloseReviewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{userReview ? 'تعديل تقييمك' : 'إضافة تقييم جديد'}</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              ما مدى رضاك عن هذا المنتج؟
            </Typography>
            <Rating
              value={newReview.rating}
              onChange={(_, value) => {
                setNewReview({...newReview, rating: value || 5});
              }}
              size="large"
            />
          </Box>
          
          <TextField
            label="تعليقك"
            multiline
            rows={4}
            fullWidth
            value={newReview.comment}
            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
            placeholder="شارك رأيك حول المنتج..."
            variant="outlined"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmitReview} 
            color="primary" 
            variant="contained"
            disabled={!newReview.comment.trim()}
          >
            {userReview ? 'تعديل التقييم' : 'إرسال التقييم'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductReviews;