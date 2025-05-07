// src/features/products/components/ProductReview.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Rating } from '../../../components/ui/Rating';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { useAddReviewMutation } from '../api/productsApi';
import { useToast } from '../../../hooks/useToast';
import { formatDate } from '../../../utils/format/date';
import { useSelector } from 'react-redux';

const ReviewContainer = styled.div`
  margin-bottom: 40px;
`;

const ReviewHeader = styled.div`
  margin-bottom: 24px;
`;

const ReviewTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 16px;
`;

const ReviewsList = styled.div`
  margin-bottom: 32px;
`;

const ReviewItem = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ReviewItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ReviewAuthor = styled.span`
  font-weight: 600;
`;

const ReviewDate = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ReviewItemTitle = styled.h4`
  font-size: 1.1rem;
  margin: 8px 0;
`;

const ReviewText = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const ReviewForm = styled.div`
  background-color: var(--grey-100);
  padding: 24px;
  border-radius: 8px;
`;

const FormTitle = styled.h4`
  margin-bottom: 16px;
  font-size: 1.2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 40px 0;
  color: var(--text-secondary);
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProductReview = ({ productId, reviews = [] }) => {
  const { showToast } = useToast();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [addReview, { isLoading }] = useAddReviewMutation();
  
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  
  const [errors, setErrors] = useState({
    title: '',
    comment: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({ ...prev, [name]: value }));
    
    // التحقق من الإدخال
    if (name === 'title' && value.length < 3) {
      setErrors(prev => ({ ...prev, title: 'عنوان التقييم يجب أن يكون 3 أحرف على الأقل' }));
    } else if (name === 'title') {
      setErrors(prev => ({ ...prev, title: '' }));
    }
    
    if (name === 'comment' && value.length < 10) {
      setErrors(prev => ({ ...prev, comment: 'التعليق يجب أن يكون 10 أحرف على الأقل' }));
    } else if (name === 'comment') {
      setErrors(prev => ({ ...prev, comment: '' }));
    }
  };
  
  const handleRatingChange = (value) => {
    setReviewForm(prev => ({ ...prev, rating: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من الإدخال
    let isValid = true;
    const newErrors = { title: '', comment: '' };
    
    if (reviewForm.title.length < 3) {
      newErrors.title = 'عنوان التقييم يجب أن يكون 3 أحرف على الأقل';
      isValid = false;
    }
    
    if (reviewForm.comment.length < 10) {
      newErrors.comment = 'التعليق يجب أن يكون 10 أحرف على الأقل';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (!isValid) return;
    
    try {
      await addReview({
        productId,
        review: reviewForm
      }).unwrap();
      
      showToast('تم إضافة تقييمك بنجاح', 'success');
      
      // إعادة تعيين النموذج
      setReviewForm({
        rating: 5,
        title: '',
        comment: ''
      });
    } catch (error) {
      showToast(error?.data?.message || 'حدث خطأ أثناء إضافة التقييم', 'error');
    }
  };
  
  return (
    <ReviewContainer>
      <ReviewHeader>
        <ReviewTitle>تقييمات المنتج</ReviewTitle>
      </ReviewHeader>
      
      <ReviewsList>
        {reviews.length === 0 ? (
          <NoReviews>
            لا توجد تقييمات لهذا المنتج بعد. كن أول من يضيف تقييمًا!
          </NoReviews>
        ) : (
          reviews.map(review => (
            <ReviewItem key={review._id}>
              <ReviewItemHeader>
                <ReviewAuthor>{review.user?.name || 'مستخدم'}</ReviewAuthor>
                <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
              </ReviewItemHeader>
              
              <Rating value={review.rating} readOnly />
              
              <ReviewItemTitle>{review.title}</ReviewItemTitle>
              <ReviewText>{review.comment}</ReviewText>
            </ReviewItem>
          ))
        )}
      </ReviewsList>
      
      {isAuthenticated ? (
        <ReviewForm>
          <FormTitle>إضافة تقييم</FormTitle>
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>تقييمك</FormLabel>
              <RatingContainer>
                <Rating value={reviewForm.rating} onChange={handleRatingChange} size="large" />
                <span>{reviewForm.rating} من 5</span>
              </RatingContainer>
            </FormGroup>
            
            <FormGroup>
              <input
                type="text"
                name="title"
                placeholder="عنوان التقييم"
                value={reviewForm.title}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: errors.title ? '4px' : '16px',
                  border: `1px solid ${errors.title ? 'var(--error)' : 'var(--border)'}`,
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
              {errors.title && <div style={{ color: 'var(--error)', fontSize: '0.8rem', marginBottom: '16px' }}>{errors.title}</div>}
            </FormGroup>
            
            <Textarea
              name="comment"
              placeholder="اكتب تقييمك هنا..."
              value={reviewForm.comment}
              onChange={handleChange}
              error={errors.comment}
              minHeight="120px"
            />
            
            <Button 
              type="submit" 
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'جاري الإرسال...' : 'إرسال التقييم'}
            </Button>
          </form>
        </ReviewForm>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'var(--grey-100)', borderRadius: '8px' }}>
          <p>يرجى <a href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>تسجيل الدخول</a> لإضافة تقييم</p>
        </div>
      )}
    </ReviewContainer>
  );
};