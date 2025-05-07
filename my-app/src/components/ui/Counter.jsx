// src/components/ui/Counter.jsx
import styled from 'styled-components';
import { PlusIcon, MinusIcon } from '../icons';

const Container = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
  width: fit-content;
  height: 40px;
`;

const Button = styled.button`
  background-color: var(--grey-100);
  border: none;
  width: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: var(--grey-300);
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: var(--text-primary);
  }
`;

const Value = styled.div`
  width: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: var(--text-primary);
`;

export const Counter = ({ min = 1, max = 99, value = 1, onChange, disabled }) => {
  const handleDecrease = () => {
    if (disabled) return;
    const newValue = value - 1;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleIncrease = () => {
    if (disabled) return;
    const newValue = value + 1;
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <Container>
      <Button 
        onClick={handleDecrease} 
        disabled={disabled || value <= min}
        aria-label="تقليل"
      >
        <MinusIcon />
      </Button>
      <Value>{value}</Value>
      <Button 
        onClick={handleIncrease} 
        disabled={disabled || value >= max}
        aria-label="زيادة"
      >
        <PlusIcon />
      </Button>
    </Container>
  );
};