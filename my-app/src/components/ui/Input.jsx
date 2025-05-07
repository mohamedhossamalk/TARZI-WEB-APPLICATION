import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.noMargin ? '0' : '16px'};
  width: 100%;
`;

const InputLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--text-primary);
`;

const StyledInput = styled.input`
  padding: 12px 16px;
  border: 1px solid ${props => props.error ? 'var(--error)' : 'var(--border)'};
  border-radius: 4px;
  font-size: 1rem;
  background-color: var(--background);
  color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--red-100);
  }
  
  &::placeholder {
    color: var(--grey-500);
  }
  
  &:disabled {
    background-color: var(--grey-100);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: var(--error);
  font-size: 0.8rem;
  margin-top: 4px;
`;

const HelpText = styled.span`
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-top: 4px;
`;

export const Input = ({
  label,
  error,
  helpText,
  noMargin,
  className,
  ...rest
}) => {
  return (
    <InputWrapper noMargin={noMargin} className={className}>
      {label && <InputLabel>{label}</InputLabel>}
      <StyledInput error={error} {...rest} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helpText && !error && <HelpText>{helpText}</HelpText>}
    </InputWrapper>
  );
};