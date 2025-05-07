// src/features/products/components/ReviewForm.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/Button';
import { Rating } from '../../../components/ui/Rating';

const FormContainer = styled.div`
  background-color: var(--grey-100);
  padding: 24px;
  border-radius: 8px;
  margin-top: 32px;
`;

const FormTitle = styled.h3`
  margin-bottom: 16px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const FormField = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--red-100);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--red-100);
  }
`;

const ErrorText = styled.p`
  color: var(--error);
  font-size: 0.85rem;
  margin-top: 4px;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: '',
      comment: ''
    }
  });
  
  const submitReview = async (data) => {
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...data,
        rating
      });
      
      // Reset the form
      reset();
      setRating(5);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormContainer>
      <FormTitle>أضف تقييمك</FormTitle>
      
      <form onSubmit={handleSubmit(submitReview)}>
        <FormField>
          <Label>تقييمك</Label>
          <RatingContainer>
            <Rating 
              value={rating} 
              onChange={setRating} 
              size="large" 
            />
            <span>{rating} من 5</span>
          </RatingContainer>
        </FormField>
        
        <FormField>
          <Label>العنوان</Label>
          <Input 
            type="text"
            placeholder="أدخل عنوانًا لتقييمك"
            {...register('title', { 
              required: 'العنوان مطلوب',
              minLength: {
                value: 3,
                message: 'العنوان يجب أن يكون 3 أحرف على الأقل'
              }
            })}
          />
          {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
        </FormField>
        
        <FormField>
          <Label>التعليق</Label>
          <Textarea 
            placeholder="اكتب تجربتك مع هذا المنتج"
            {...register('comment', { 
              required: 'التعليق مطلوب',
              minLength: {
                value: 10,
                message: 'التعليق يجب أن يكون 10 أحرف على الأقل'
              }
            })}
          />
          {errors.comment && <ErrorText>{errors.comment.message}</ErrorText>}
        </FormField>
        
        <Button 
          type="submit" 
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'جارٍ الإرسال...' : 'إرسال التقييم'}
        </Button>
      </form>
    </FormContainer>
  );
};