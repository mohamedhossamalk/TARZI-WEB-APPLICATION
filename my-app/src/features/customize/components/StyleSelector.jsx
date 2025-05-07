// src/features/customize/components/StyleSelector.jsx
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const StyleCard = styled.div`
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

const StyleImage = styled.div`
  width: 100%;
  height: 120px;
  background-color: var(--grey-100);
  border-radius: 4px;
  margin-bottom: 12px;
  background-image: ${props => `url('/images/suit-styles/${props.id}.jpg')`};
  background-size: cover;
  background-position: center;
`;

const StyleName = styled.h4`
  margin: 0 0 4px 0;
  font-weight: 600;
`;

const StyleDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export const StyleSelector = ({ selected, onChange, styleOptions }) => {
  return (
    <Container>
      {styleOptions.map((style) => (
        <StyleCard 
          key={style.id} 
          selected={selected?.id === style.id}
          onClick={() => onChange(style)}
        >
          <StyleImage id={style.id} />
          <StyleName>{style.name}</StyleName>
          <StyleDescription>{style.description}</StyleDescription>
        </StyleCard>
      ))}
    </Container>
  );
};