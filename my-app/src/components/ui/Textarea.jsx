// src/components/ui/Textarea.jsx
import React, { forwardRef } from 'react';
import styled from 'styled-components';

const TextareaWrapper = styled.div`
  width: 100%;
  margin-bottom: ${props => props.marginBottom || '16px'};
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--text-primary);
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: ${props => props.padding || '12px'};
  border: 1px solid ${props => (props.error ? 'var(--error)' : 'var(--border)')};
  border-radius: ${props => props.borderRadius || '4px'};
  font-size: 1rem;
  font-family: 'Cairo', sans-serif;
  min-height: ${props => props.minHeight || '120px'};
  color: var(--text-primary);
  background-color: ${props => (props.disabled ? 'var(--grey-100)' : 'var(--white)')};
  resize: ${props => props.resize || 'vertical'};
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--red-100);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  &::placeholder {
    color: var(--grey-500);
  }
`;

const HelperText = styled.p`
  font-size: 0.8rem;
  margin-top: 6px;
  color: ${props => (props.error ? 'var(--error)' : 'var(--text-secondary)')};
`;

const CharCount = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 4px;
`;

const Textarea = forwardRef(({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled,
  required,
  maxLength,
  minHeight,
  resize,
  marginBottom,
  borderRadius,
  padding,
  className,
  showCharCount = false,
  ...props
}, ref) => {
  return (
    <TextareaWrapper className={className} marginBottom={marginBottom}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span style={{ color: 'var(--error)' }}> *</span>}
        </Label>
      )}
      
      <StyledTextarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        ref={ref}
        minHeight={minHeight}
        resize={resize}
        borderRadius={borderRadius}
        padding={padding}
        error={error}
        {...props}
      />
      
      {showCharCount && maxLength && (
        <CharCount>
          {value ? value.length : 0} / {maxLength}
        </CharCount>
      )}
      
      {(helperText || error) && (
        <HelperText error={error}>
          {error || helperText}
        </HelperText>
      )}
    </TextareaWrapper>
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };