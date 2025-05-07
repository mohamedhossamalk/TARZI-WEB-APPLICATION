// src/components/ui/Tabs.jsx
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
`;

const TabButton = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-primary)'};
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    color: var(--primary);
  }
  
  &:focus {
    outline: none;
  }
`;

export const Tabs = ({ children }) => {
  return <TabsContainer>{children}</TabsContainer>;
};

export const Tab = ({ active, onClick, children }) => {
  return (
    <TabButton active={active} onClick={onClick}>
      {children}
    </TabButton>
  );
};