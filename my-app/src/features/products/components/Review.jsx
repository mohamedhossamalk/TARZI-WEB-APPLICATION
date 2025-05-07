// src/features/products/components/Review.jsx
import styled from 'styled-components';
import { Rating } from '../../../components/ui/Rating';
import { formatDate } from '../../../utils/format/date';

const ReviewCard = styled.div`
  border-bottom: 1px solid var(--border);
  padding: 24px 0;
  
  &:first-child {
    padding-top: 0;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ReviewAuthor = styled.div`
  font-weight: 600;
  color: var(--text-primary);
`;

const ReviewDate = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ReviewTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 8px 0;
`;

const ReviewContent = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

export const Review = ({ review }) => {
  return (
    <ReviewCard>
      <ReviewHeader>
        <ReviewAuthor>{review.user?.name || 'مستخدم مجهول'}</ReviewAuthor>
        <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
      </ReviewHeader>
      
      <Rating value={review.rating} size="small" />
      
      <ReviewTitle>{review.title}</ReviewTitle>
      
      <ReviewContent>{review.comment}</ReviewContent>
    </ReviewCard>
  );
};