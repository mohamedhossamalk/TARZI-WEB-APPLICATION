// src/features/customize/components/FabricSelector.jsx
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const FabricCard = styled.div`
  border: 1px solid ${props => props.selected ? 'var(--primary)' : 'var(--border)'};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  background-color: ${props => props.selected ? 'var(--red-100)' : 'var(--white)'};
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary);
    background-color: ${props => props.selected ? 'var(--red-100)' : 'var(--grey-100)'};
  }
`;

const FabricSwatch = styled.div`
  width: 100%;
  height: 80px;
  background-color: var(--grey-100);
  border-radius: 4px;
  margin-bottom: 12px;
  background-image: ${props => `url('/images/fabrics/${props.id}.jpg')`};
  background-size: cover;
  background-position: center;
`;

const FabricName = styled.h4`
  margin: 0 0 4px 0;
  font-weight: 600;
`;

const FabricDescription = styled.p`
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const PriceTag = styled.div`
  font-weight: 500;
  color: ${props => props.price > 0 ? 'var(--primary)' : 'inherit'};
  
  &::before {
    content: ${props => props.price > 0 ? '"+' + props.price + ' ج.م"' : 'normal'};
  }
  
  &::after {
    content: ${props => props.price < 0 ? '"' + props.price + ' ج.م"' : 'normal'};
  }
`;

export const FabricSelector = ({ selected, onChange, fabricOptions }) => {
  return (
    <Container>
      {fabricOptions.map((fabric) => (
        <FabricCard 
          key={fabric.id} 
          selected={selected?.id === fabric.id}
          onClick={() => onChange(fabric)}
        >
          <FabricSwatch id={fabric.id} />
          <FabricName>{fabric.name}</FabricName>
          <FabricDescription>{fabric.description}</FabricDescription>
          <PriceTag price={fabric.price} />
        </FabricCard>
      ))}
    </Container>
  );
};