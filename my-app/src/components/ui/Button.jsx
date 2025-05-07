import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${(props) => {
    if (props.size === 'small') return '8px 16px';
    if (props.size === 'large') return '14px 28px';
    return '10px 20px';
  }};
  border-radius: 4px;
  font-weight: 600;
  font-size: ${(props) => {
    if (props.size === 'small') return '0.875rem';
    if (props.size === 'large') return '1.125rem';
    return '1rem';
  }};
  cursor: pointer;
  transition: all 0.2s;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
  text-decoration: none;
  text-align: center;
  
  ${(props) => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: var(--primary);
          color: var(--white);
          border: none;
          
          &:hover:not(:disabled) {
            background-color: var(--primary-dark);
          }
          
          &:active:not(:disabled) {
            transform: translateY(1px);
          }
        `;
      case 'secondary':
        return `
          background-color: var(--white);
          color: var(--primary);
          border: 1px solid var(--primary);
          
          &:hover:not(:disabled) {
            background-color: var(--red-100);
          }
          
          &:active:not(:disabled) {
            transform: translateY(1px);
          }
        `;
      case 'black':
        return `
          background-color: var(--black);
          color: var(--white);
          border: none;
          
          &:hover:not(:disabled) {
            background-color: var(--black-800);
          }
          
          &:active:not(:disabled) {
            transform: translateY(1px);
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: var(--text-primary);
          border: 1px solid var(--grey-500);
          
          &:hover:not(:disabled) {
            background-color: var(--grey-100);
          }
          
          &:active:not(:disabled) {
            transform: translateY(1px);
          }
        `;
      case 'text':
        return `
          background-color: transparent;
          color: var(--primary);
          border: none;
          padding: 0;
          
          &:hover:not(:disabled) {
            color: var(--primary-dark);
            text-decoration: underline;
          }
        `;
      default:
        return `
          background-color: var(--primary);
          color: var(--white);
          border: none;
          
          &:hover:not(:disabled) {
            background-color: var(--primary-dark);
          }
          
          &:active:not(:disabled) {
            transform: translateY(1px);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--primary);
  }
`;

const StyledButton = styled.button`
  ${buttonStyles}
`;

const StyledLink = styled(Link)`
  ${buttonStyles}
`;

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  as,
  to,
  fullWidth,
  ...rest
}) => {
  if (as === Link || to) {
    return (
      <StyledLink
        to={to}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        {...rest}
      >
        {startIcon && startIcon}
        {children}
        {endIcon && endIcon}
      </StyledLink>
    );
  }

  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...rest}
    >
      {startIcon && startIcon}
      {children}
      {endIcon && endIcon}
    </StyledButton>
  );
};