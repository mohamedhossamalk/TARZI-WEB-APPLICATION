// src/components/ui/Rating.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { StarIcon, StarFilledIcon } from '../icons';

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StarsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Star = styled.span`
  cursor: ${props => props.interactive ? 'pointer' : 'default'};
  position: relative;
  color: ${props => props.filled ? 'var(--primary)' : 'var(--grey-300)'};
  transition: transform 0.2s, color 0.2s;
  
  svg {
    width: ${props => props.size === 'small' ? '14px' : props.size === 'large' ? '32px' : '20px'};
    height: ${props => props.size === 'small' ? '14px' : props.size === 'large' ? '32px' : '20px'};
  }
  
  &:hover {
    transform: ${props => props.interactive ? 'scale(1.2)' : 'none'};
  }
`;

const RatingText = styled.span`
  font-size: ${props => props.size === 'small' ? '0.75rem' : props.size === 'large' ? '1rem' : '0.875rem'};
  color: var(--text-secondary);
  margin-right: 8px;
`;

export const Rating = ({
  value = 0,
  max = 5,
  precision = 1,
  size = 'medium',
  onChange,
  showText = true,
  count,
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);

  useEffect(() => {
    setRating(value);
  }, [value]);

  const handleClick = (newValue) => {
    if (!onChange) return;
    
    setRating(newValue);
    onChange(newValue);
  };

  return (
    <RatingContainer>
      <StarsContainer>
        {[...Array(max)].map((_, index) => {
          const starValue = index + 1;
          const filled = hover >= starValue || (hover === -1 && rating >= starValue);
          
          return (
            <Star
              key={index}
              filled={filled}
              interactive={!!onChange}
              size={size}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => onChange && setHover(starValue)}
              onMouseLeave={() => onChange && setHover(-1)}
            >
              {filled ? <StarFilledIcon /> : <StarIcon />}
            </Star>
          );
        })}
      </StarsContainer>
      
      {showText && (
        <RatingText size={size}>
          {rating.toFixed(precision)}
          {count !== undefined && ` (${count})`}
        </RatingText>
      )}
    </RatingContainer>
  );
};