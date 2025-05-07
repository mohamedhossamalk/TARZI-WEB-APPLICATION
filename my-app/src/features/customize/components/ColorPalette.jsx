// src/features/customize/components/ColorPalette.jsx
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const ColorOption = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: ${props => props.hex};
  cursor: pointer;
  border: 3px solid ${props => props.selected ? 'var(--primary)' : 'transparent'};
  box-shadow: ${props => props.selected ? '0 0 0 2px var(--white), 0 0 0 4px var(--primary)' : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: ${props => props.selected ? 'scale(1)' : 'scale(1.05)'};
    box-shadow: ${props => props.selected 
      ? '0 0 0 2px var(--white), 0 0 0 4px var(--primary)' 
      : '0 4px 8px rgba(0, 0, 0, 0.15)'};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ColorName = styled.div`
  margin-top: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-align: center;
`;

const ColorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ColorPalette = ({ selected, onChange, colorOptions }) => {
  return (
    <Container>
      {colorOptions.map((color) => (
        <ColorWrapper key={color.id}>
          <ColorOption
            hex={color.hex}
            selected={selected?.id === color.id}
            onClick={() => onChange(color)}
            aria-label={color.name}
          />
          <ColorName>{color.name}</ColorName>
        </ColorWrapper>
      ))}
    </Container>
  );
};