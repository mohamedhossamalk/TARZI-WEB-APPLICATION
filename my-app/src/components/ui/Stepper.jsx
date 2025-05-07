// src/components/ui/Stepper.jsx
import styled from 'styled-components';

const StepperContainer = styled.div`
  display: flex;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    overflow-x: auto;
    padding-bottom: 8px;
    margin-right: -24px;
    margin-left: -24px;
    padding-right: 24px;
    padding-left: 24px;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--grey-100);
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--grey-500);
      border-radius: 2px;
    }
  }
`;

const StepWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  
  &:last-child {
    flex: 0;
  }
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 16px;
    width: calc(100% - 40px);
    right: calc(50% + 20px);
    height: 2px;
    background-color: ${props => props.completed ? 'var(--primary)' : 'var(--grey-300)'};
    transition: background-color 0.3s;
  }
  
  @media (max-width: 768px) {
    flex: 0 0 auto;
    width: 120px;
    
    &:not(:last-child)::after {
      width: 100px;
    }
  }
`;

const StepButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.active || props.completed ? 'var(--primary)' : 'var(--white)'};
  color: ${props => props.active || props.completed ? 'var(--white)' : 'var(--text-secondary)'};
  border: 2px solid ${props => props.active || props.completed ? 'var(--primary)' : 'var(--grey-300)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  z-index: 1;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.3s;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.active ? 'var(--primary)' : 'var(--red-100)'};
    border-color: var(--primary);
  }
  
  &:disabled {
    cursor: default;
  }
`;

const StepLabel = styled.span`
  margin-top: 8px;
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-secondary)'};
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 0.9rem;
  white-space: nowrap;
`;

export const Stepper = ({ activeStep, children }) => {
  const steps = Array.isArray(children) ? children : [children].filter(Boolean);
  
  return (
    <StepperContainer>
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        
        return React.cloneElement(step, {
          key: index,
          index,
          active: isActive,
          completed: isCompleted,
        });
      })}
    </StepperContainer>
  );
};

export const Step = ({ index, active, completed, label, onClick, disabled = false }) => {
  return (
    <StepWrapper completed={completed}>
      <StepButton
        active={active}
        completed={completed}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        {completed ? '✓' : index + 1}
      </StepButton>
      <StepLabel active={active}>{label}</StepLabel>
    </StepWrapper>
  );
};