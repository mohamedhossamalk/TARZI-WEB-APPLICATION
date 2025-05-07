// src/features/cart/components/MiniCart.jsx
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { Loader } from '../../../components/ui/Loader';
import { formatCurrency } from '../../../utils/format';
import { TrashIcon } from '../../../components/icons';
import { useGetUserCartQuery, useRemoveFromCartMutation } from '../api/cartApi';

const MiniCartContainer = styled(motion.div)`
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 360px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const CartHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ItemCount = styled.span`
  background-color: var(--primary);
  color: var(--white);
  border-radius: 99px;
  padding: 2px 8px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const CartItemsContainer = styled.div`
  padding: 16px;
  overflow-y: auto;
  flex-grow: 1;
  max-height: 300px;
`;

const CartItem = styled.div`
  display: flex;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-left: 12px;
`;

const ItemDetails = styled.div`
  flex-grow: 1;
`;

const ItemName = styled.h4`
  margin: 0 0 4px 0;
  font-size: 0.95rem;
  font-weight: 500;
`;

const ItemMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
`;

const ItemMetaDetail = styled.span`
  color: var(--text-secondary);
  font-size: 0.8rem;
`;

const ItemPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.span`
  font-weight: 500;
  color: var(--text-primary);
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.2s;
  
  &:hover {
    color: var(--error);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const CartFooter = styled.div`
  padding: 16px;
  border-top: 1px solid var(--border);
`;

const Subtotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  
  h4 {
    margin: 0;
    font-weight: 500;
  }
  
  .total {
    font-weight: 600;
    color: var(--primary);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const EmptyCart = styled.div`
  padding: 32px 16px;
  text-align: center;
  
  p {
    color: var(--text-secondary);
    margin-bottom: 16px;
  }
`;

export const MiniCart = ({ onClose }) => {
  const { data: cart, isLoading } = useGetUserCartQuery();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  
  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId).unwrap();
    } catch (error) {
      console.error('Failed to remove item from cart', error);
    }
  };
  
  const handleCheckout = () => {
    onClose();
    // Navigate to checkout is handled by Link component
  };
  
  const itemCount = cart?.items?.length || 0;
  const subtotal = cart?.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  
  if (isLoading) {
    return (
      <MiniCartContainer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
          <Loader size="medium" center />
        </div>
      </MiniCartContainer>
    );
  }
  
  return (
    <MiniCartContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <CartHeader>
        <CartTitle>سلة التسوق</CartTitle>
        {itemCount > 0 && <ItemCount>{itemCount}</ItemCount>}
      </CartHeader>
      
      {(!cart?.items || cart.items.length === 0) ? (
        <EmptyCart>
          <p>سلة التسوق فارغة</p>
          <Button variant="primary" as={Link} to="/products" onClick={onClose}>
            تسوق الآن
          </Button>
        </EmptyCart>
      ) : (
        <>
          <CartItemsContainer>
            {cart.items.map((item) => (
              <CartItem key={item._id}>
                <ItemImage src={item.imageUrl} alt={item.name} />
                
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  <ItemMeta>
                    {item.color && (
                      <ItemMetaDetail>اللون: {item.color}</ItemMetaDetail>
                    )}
                    {item.size && (
                      <ItemMetaDetail>المقاس: {item.size}</ItemMetaDetail>
                    )}
                    <ItemMetaDetail>الكمية: {item.quantity}</ItemMetaDetail>
                  </ItemMeta>
                  <ItemPrice>
                    <Price>{formatCurrency(item.price * item.quantity)}</Price>
                    <ItemActions>
                      <RemoveButton 
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={isRemoving}
                        aria-label="إزالة من السلة"
                      >
                        <TrashIcon />
                      </RemoveButton>
                    </ItemActions>
                  </ItemPrice>
                </ItemDetails>
              </CartItem>
            ))}
          </CartItemsContainer>
          
          <CartFooter>
            <Subtotal>
              <h4>المجموع</h4>
              <span className="total">{formatCurrency(subtotal)}</span>
            </Subtotal>
            
            <ActionButtons>
              <Button 
                variant="outline" 
                as={Link} 
                to="/cart" 
                onClick={onClose}
                fullWidth
              >
                عرض السلة
              </Button>
              <Button 
                variant="primary" 
                as={Link} 
                to="/checkout" 
                onClick={onClose}
                fullWidth
              >
                إتمام الشراء
              </Button>
            </ActionButtons>
          </CartFooter>
        </>
      )}
    </MiniCartContainer>
  );
};