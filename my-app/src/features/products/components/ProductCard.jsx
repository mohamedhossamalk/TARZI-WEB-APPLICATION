// src/features/products/components/ProductCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/format';
import { HeartIcon, ShoppingCartIcon } from '../../../components/icons';

const Card = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 240px;
  overflow: hidden;
  
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  ${Card}:hover &::after {
    opacity: 1;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const WishlistButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: white;
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.favorite ? 'var(--primary)' : 'var(--grey-500)'};
    transition: color 0.2s, transform 0.2s;
  }
  
  &:hover svg {
    transform: scale(1.1);
  }
`;

const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  
  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s;
    
    &:hover {
      color: var(--primary);
    }
  }
`;

const Price = styled.div`
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--primary);
  margin-bottom: 16px;
`;

const ActionArea = styled.div`
  margin-top: auto;
  display: flex;
  gap: 8px;
`;

export const ProductCard = ({ product }) => {
  const [favorite, setFavorite] = useState(false);
  
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ImageContainer>
        <Link to={`/product/${product._id}`}>
          <ProductImage src={product.imageUrl} alt={product.name} />
        </Link>
        <WishlistButton 
          favorite={favorite} 
          onClick={() => setFavorite(!favorite)}
          aria-label={favorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
        >
          <HeartIcon />
        </WishlistButton>
      </ImageContainer>
      
      <Content>
        <Title>
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </Title>
        <Price>{formatCurrency(product.price)}</Price>
        
        <ActionArea>
          <Button 
            variant="primary" 
            startIcon={<ShoppingCartIcon />}
            style={{ flex: 1 }}
          >
            أضف للسلة
          </Button>
        </ActionArea>
      </Content>
    </Card>
  );
};