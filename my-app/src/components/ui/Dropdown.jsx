// src/components/ui/Dropdown.jsx
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '../icons';
import { useOutsideClick } from '../../hooks/useOutsideClick';

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.variant === 'filled' ? 'var(--primary)' : 'transparent'};
  color: ${props => props.variant === 'filled' ? 'var(--white)' : 'var(--text-primary)'};
  border: ${props => props.variant === 'filled' ? 'none' : '1px solid var(--border)'};
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  min-width: ${props => props.fullWidth ? '100%' : props.width || 'auto'};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.variant === 'filled' ? 'var(--primary-dark)' : 'var(--grey-100)'};
  }
  
  svg {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    transition: transform 0.2s;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 4px);
  ${props => props.align === 'right' ? 'right: 0;' : 'left: 0;'}
  z-index: 100;
  min-width: ${props => props.width || '200px'};
  max-width: ${props => props.maxWidth || '300px'};
  background-color: var(--white);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 8px 0;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  width: 100%;
  text-align: right;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-primary)'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--grey-100);
  }
  
  .item-icon {
    margin-left: 12px;
    width: 18px;
    height: 18px;
    color: ${props => props.active ? 'var(--primary)' : 'var(--text-secondary)'};
  }
  
  .item-extra {
    margin-right: auto;
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: var(--border);
  margin: 8px 0;
`;

export const Dropdown = ({
  children,
  trigger,
  variant = 'outline',
  align = 'left',
  width,
  maxWidth,
  fullWidth = false,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useOutsideClick(dropdownRef, () => {
    if (isOpen) {
      setIsOpen(false);
      if (onClose) onClose();
    }
  });
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownTrigger 
        onClick={handleToggle} 
        variant={variant}
        isOpen={isOpen}
        width={width}
        fullWidth={fullWidth}
      >
        {trigger}
        <ChevronDownIcon />
      </DropdownTrigger>
      
      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            align={align}
            width={width}
            maxWidth={maxWidth}
          >
            {children}
          </DropdownMenu>
        )}
      </AnimatePresence>
    </DropdownContainer>
  );
};

export const DropdownItem = ({ icon, label, extra, active, onClick }) => {
  return (
    <DropdownItem active={active} onClick={onClick}>
      {icon && <span className="item-icon">{icon}</span>}
      {label}
      {extra && <span className="item-extra">{extra}</span>}
    </DropdownItem>
  );
};

export const DropdownDivider = () => <Divider />;